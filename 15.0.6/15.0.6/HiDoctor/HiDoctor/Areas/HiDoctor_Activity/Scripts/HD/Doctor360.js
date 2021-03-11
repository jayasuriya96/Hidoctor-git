/* doctor360_g.Tables[0] = Customer Details
doctor360_g.Tables[1] = Campaign List
doctor360_g.Tables[2] = Last 3 visit
doctor360_g.Tables[3] = samples given
doctor360_g.Tables[4] = Non samples given
doctor360_g.Tables[5] = Chemist Details
doctor360_g.Tables[6] = RCPA Details
doctor360_g.Tables[7] = Products Mapped
doctor360_g.Tables[8] = Doctor Remarks*/

function fnBuildDoctorDetails() {
    fnBuildDoctorDetails1();
    fnBuildCampaignList();
    fnBuildLast3Visit();
    fnBuildSampleDetails();
    fnBuildNonSampleDetails();
    fnBuildChemistDetails();
    fnBuildRCPADetails();
    fnBuildProductMappingDetails();
    fnBuildDoctorRemarks();
}
function fnBuildDoctorDetails1() {
    var doctorName = doctor360_g.Tables[0].Rows[0].Customer_Name;
    var doc_mdl = doctor360_g.Tables[0].Rows[0].MDL_Number;
    var doc_category = doctor360_g.Tables[0].Rows[0].Category_Name;
    var doc_speciality = doctor360_g.Tables[0].Rows[0].Speciality_Name;
    var doc_dob = doctor360_g.Tables[0].Rows[0].DOB;
    var htmlString = "<span>" + doctorName + "</span> <span style='color:#333'> | <span> <span>" + doc_mdl + "</span><span style='color:#333'> | <span><span >" + doc_category + "</span><span style='color:#333'> | <span> <span>" + doc_speciality + "</span> <span style='color:#333'> | <span> <span>" + doc_dob + "</span>";
    $("#divdoctorDetails").html(htmlString);
}

// Campaign List
function fnBuildCampaignList() {

    var html = $("#divcampaign_list").html();
    if (doctor360_g.Tables[1].Rows.length > 0) {
        var length = doctor360_g.Tables[1].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var campaignName = doctor360_g.Tables[1].Rows[i].Campaign_Name;
            htmlString += "<span class='campaignName'>" + campaignName + "</span>";
        }

        $("#divcampaign_list").html(html + htmlString);
    }
    else {
        $("#divcampaign_list").html(html + "<span>No campaigns mapped for this doctor.</span>");
    }
}

// Last 3 Visit Dates
function fnBuildLast3Visit() {
    var html = $("#divlast3visit").html()
    if (doctor360_g.Tables[2].Rows.length > 0) {
        var length = doctor360_g.Tables[2].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var dcrDate = doctor360_g.Tables[2].Rows[i].DCR_Actual_Date;
            htmlString += "<span class='dcrdate'>" + dcrDate + "</span>,";
        }
        $("#divlast3visit").html(html + htmlString);
    }
    else {
        $("#divlast3visit").html(html + "<span>No last visit details found.</span>");
    }
}

function fnBuildSampleDetails() {
    var html = $("#divproduct_details").html();
    if (doctor360_g.Tables[3].Rows.length > 0) {
        var length = doctor360_g.Tables[3].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var sampleName = doctor360_g.Tables[3].Rows[i].Product_Name;
            var qty = doctor360_g.Tables[3].Rows[i].Quantity_Provided;
            var date = doctor360_g.Tables[3].Rows[i].DCR_Date;
            htmlString += "<span>" + (i + 1) + ". </span><span>" + sampleName + "</span><span> - " + qty + " Nos.</span><span> (" + date + ")</span><br />";
        }
        $("#divproduct_details").html(html + htmlString);
    }
    else {
        $("#divproduct_details").html(html + "<span>No samples given to this doctor.</span>");
    }
}

function fnBuildNonSampleDetails() {
    var html = $("#divnonsample_details").html();
    if (doctor360_g.Tables[4].Rows.length > 0) {
        var length = doctor360_g.Tables[4].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var sampleName = doctor360_g.Tables[4].Rows[i].Product_Name;
            var qty = doctor360_g.Tables[4].Rows[i].Quantity_Provided;
            var date = doctor360_g.Tables[4].Rows[i].DCR_Date;
            htmlString += "<span>" + (i + 1) + ". </span><span>" + sampleName + "</span><span> - " + qty + " Nos.</span><span> (" + date + ")</span><br />";
        }
        $("#divnonsample_details").html(html + htmlString);
    }
    else {
        $("#divnonsample_details").html(html + "<span>No samples given to this doctor.</span>");
    }
}

function fnBuildChemistDetails() {
    var html = $("#divchemist_details").html();
    if (doctor360_g.Tables[5].Rows.length > 0) {
        var length = doctor360_g.Tables[5].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var chemistName = doctor360_g.Tables[5].Rows[i].Chemists_Name;
            var date = doctor360_g.Tables[5].Rows[i].DCR_Date;
            var POB = doctor360_g.Tables[5].Rows[i].PO_Amount;
            htmlString += "<span>" + (i + 1) + ". </span><span>" + chemistName + "</span><span> - (" + date + ")</span><span> POB " + POB + "</span><br />";
        }
        $("#divchemist_details").html(html + htmlString);
    }
    else {
        $("#divchemist_details").html(html + "<span>No chemist visit to this doctor.</span>");
    }
}

function fnBuildRCPADetails() {

    if (doctor360_g.Tables[6].Rows.length > 0) {
        var proArr = new Array();
        var comArr = new Array();
        var rcpaDetails = "";
        var totalProCount = 0;
        var myProdCount = 0;
        for (var c = 0; c < doctor360_g.Tables[6].Rows.length; c++) {
            if ($.inArray(doctor360_g.Tables[6].Rows[c].Product_Name, proArr) == -1) {
                proArr.push(doctor360_g.Tables[6].Rows[c].Product_Name);
            }
            if ($.inArray(doctor360_g.Tables[6].Rows[c].Competitor_Product_Name, comArr) == -1) {
                comArr.push(doctor360_g.Tables[6].Rows[c].Competitor_Product_Name);
            }
        }
        var rcpaContent = "";
        rcpaContent += "<table>"
        rcpaContent += "<tr>";
        rcpaContent += "<td class='tdrcpa'>Product</td>"
        rcpaContent += "<td class='tdrcpa'>My Prescription</td>"
        for (var a = 0; a < comArr.length; a++) {
            rcpaContent += "<td class='tdrcpa'>" + comArr[a].toString() + "</td>";
        }
        rcpaContent += "</tr>"

        for (var b = 0; b < proArr.length; b++) {
            totalProCount = 0;
            myProdCount = 0;
            rcpaContent += "<tr>";
            rcpaContent += "<td class='tdrcpa'>" + proArr[b].toString() + "</td>";
            
            //MyPrescription bind
            var produt = jsonPath(doctor360_g, "$.Tables[6].Rows[?(@.Product_Name=='" + proArr[b].toString() + "')]");
            if (produt != false && produt != undefined) {
                rcpaContent += "<td class='tdrcpa'>" + produt[0].MyQty + "</td>";
                totalProCount += parseInt(produt[0].MyQty);
                myProdCount = parseInt(produt[0].MyQty);
            }
            else {
                rcpaContent += "<td class='tdrcpa'>0</td>";
            }
            //competetior product qty bind
            for (var d = 0; d < comArr.length; d++) {
                var comProdut = jsonPath(doctor360_g, "$.Tables[6].Rows[?(@.Product_Name=='" + proArr[b].toString() + "' & @.Competitor_Product_Name=='" + comArr[d].toString() + "')]");
                if (comProdut != false && comProdut != undefined) {
                    rcpaContent += "<td class='tdrcpa'>" + comProdut[0].Comp_Qty + "</td>";
                    totalProCount += parseInt(comProdut[0].Comp_Qty);
                }
                else {
                    rcpaContent += "<td>0</td>";
                }
            }

            rcpaContent += "</tr>";
            rcpaDetails += proArr[b].toString() + " = " + "<span class='spntotPres'> Total Prescription " + totalProCount + " ,</span><span class='spnYield'>My Yield/Prescription " + myProdCount + "</span><br />";
        }
        rcpaContent += "</table>"

        $("#divrcpa").html(rcpaContent + "<br />" + rcpaDetails);
    }
    else {
        $("#divrcpa").html("<span>No RCPA details.</span>");
    }
}

function fnBuildProductMappingDetails() {
    var html = $("#divmapped_details").html();
    if (doctor360_g.Tables[7].Rows.length > 0) {
        var length = doctor360_g.Tables[7].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var productName = doctor360_g.Tables[7].Rows[i].Product_Name;
            var yield = doctor360_g.Tables[7].Rows[i].Support_Quantity;
            var potentail = doctor360_g.Tables[7].Rows[i].Potential_Quantity;
            htmlString += "<span>" + (i + 1) + ". </span><span>" + productName + "</span><span> - " + yield + ',' + potentail + "</span><br />";
        }
        $("#divmapped_details").html(html + htmlString);
    }
    else {
        $("#divmapped_details").html(html + "<span>No product mapping details to this doctor.</span>");
    }
}

function fnBuildDoctorRemarks() {
    var html = $("#divmapped_details").html()
    if (doctor360_g.Tables[8].Rows.length > 0) {
        var length = doctor360_g.Tables[8].Rows.length;
        var htmlString = "";
        for (var i = 0; i < length; i++) {
            var date = doctor360_g.Tables[8].Rows[i].Date;
            var remarks = doctor360_g.Tables[8].Rows[i].Remarks_By_User;
            htmlString += "<span>" + (i + 1) + ". </span><span>" + remarks + "</span><span> - ( " + date + ")</span><br />";
        }
        $("#divmapped_details").html(html + htmlString);
    }
    else {
        $("#divmapped_details").html(html + "<span>No product mapping details to this doctor.</span>");
    }
}