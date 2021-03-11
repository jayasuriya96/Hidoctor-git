//Global variables
var targetDetails_g = "";
var targetbyRegion_g = "";
var noOfmonths_g = "";
var products_g = "";
var productAutoFill_g = "";
var self_g = "";

//Insert the target header
function fnSubmit() {
    if (fnValidate()) {
        var fromDate = "";
        var toDate = "";
        //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        if ($("#txtFrom").val().split('-')[0] == "Jan") {
            fromDate = "01/01/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Feb") {
            fromDate = "01/02/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Mar") {
            fromDate = "01/03/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Apr") {
            fromDate = "01/04/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "May") {
            fromDate = "01/05/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Jun") {
            fromDate = "01/06/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Jul") {
            fromDate = "01/07/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Aug") {
            fromDate = "01/08/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Sep") {
            fromDate = "01/09/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Oct") {
            fromDate = "01/10/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Nov") {
            fromDate = "01/11/" + $("#txtFrom").val().split('-')[1];
        }
        else if ($("#txtFrom").val().split('-')[0] == "Dec") {
            fromDate = "01/12/" + $("#txtFrom").val().split('-')[1];
        }
        //To date
        if ($("#txtTo").val().split('-')[0] == "Jan") {
            toDate = "01/01/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Feb") {
            toDate = "01/02/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Mar") {
            toDate = "01/03/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Apr") {
            toDate = "01/04/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "May") {
            toDate = "01/05/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Jun") {
            toDate = "01/06/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Jul") {
            toDate = "01/07/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Aug") {
            toDate = "01/08/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Sep") {
            toDate = "01/09/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Oct") {
            toDate = "01/10/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Nov") {
            toDate = "01/11/" + $("#txtTo").val().split('-')[1];
        }
        else if ($("#txtTo").val().split('-')[0] == "Dec") {
            toDate = "01/12/" + $("#txtTo").val().split('-')[1];
        }


        if ($.trim($("#txtFrom").val()) != "") {
            fromDate = "01/" + $("#txtFrom").val();
        }
        if ($.trim($("#txtTo").val()) != "") {
            toDate = "01/" + $("#txtTo").val();
        }



        var from = new Date(fromDate);
        var to = new Date(toDate);

        if (from > to) {
            fnPopUp("error", 'From Month&Year should be less than To Month&Year');
            return false;
        }

        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();

        $.ajax({
            type: "POST",
            url: '/Target/InsertTargetHeader',
            data: "TargetName=" + $("#txtTargetName").val() + "&From=" + fromDate + "&To=" + toDate + "&RegionCode=" + regionCode + "&Mode=" + $("#hdnMode").val() + "&TargetCode=" + $("#hdnTargetCode").val() + "",
            success: function (jsData) {
                if (jsData.split(':')[0] == "SAVESUCCESS") {
                    var text = "Target <b>" + $("#txtTargetName").val() + "</b> is created successfully <br /> <a href='#' onclick='fnNavigate(\"" + jsData.split(':')[1] + "\",\"" + regionCode + "\") '>Click here</a> to define the target";
                    //fnPopUp("Success", text);
                    $("#imgSuccess").css('display', '')
                    $("#imgError").css('display', 'none');
                    $("#dvMessage").html(text);
                    Popup.showModal('popupmodal');
                }
                else if (jsData.split(':')[0] == "SUCCESS") {
                    fnPopUp("Success", jsData.split(':')[1]);
                }
                else if (jsData.split(':')[0] == "FAILURE") {
                    fnPopUp("error", jsData.split(':')[1]);
                }
                fnClearAll();
                fnGetTargetHeader();
            }
        });
    }
}

function fnNavigate(targetCode, regionCode) {
    Popup.hide('popupmodal')
    var url = "HiDoctor_Activity/Target/Index/" + targetCode + "_" + regionCode;
    $('#main').load(url);
}
//To Retrive the target header
function fnGetTargetHeader() {
    $("#dvTargetDetails").html('');
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    $.ajax({
        type: "POST",
        url: '/Target/GetTargetHeader',
        data: "RegionCode=" + regionCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')')
            targetDetails_g = jsData;
            var content = "";
            content += "<table class='data display datatable'>";
            content += "<thead><tr><td>Target Name</td><td>From</td><td>To</td><td>Status</td><td>View</td><td>Action</td></tr></thead>";
            content += "<tbody>";

            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                content += "<tr>";
                content += "<td id='tdTarget_" + i + "'>" + jsData.Tables[0].Rows[i].Target_Name + "</td>";
                content += "<td id='tdFrom_" + i + "'>" + jsData.Tables[0].Rows[i].From_Date + "</td>";
                content += "<td id='tdTo_" + i + "'>" + jsData.Tables[0].Rows[i].To_Date + "</td>";
                content += "<td>" + jsData.Tables[0].Rows[i].Status + "</td>";
                content += "<td><span style='cursor:pointer;text-decoration:underline' onclick='fnNavigate(\"" + jsData.Tables[0].Rows[i].Target_Code + "\",\"" + regionCode + "\") '>View</span><input type='hidden' id='hdnTargetCode_" + i + "' value='" + jsData.Tables[0].Rows[i].Target_Code + "' /> </td>";
                content += "<td><span style='cursor:pointer;text-decoration:underline' onclick='fnEdit(" + i + ")'>Edit</span> | <span style='cursor:pointer;text-decoration:underline' onclick='fnChangeStatus(" + i + ")'>Change Status</span></td>";
                content += "</tr>";
            }

            content += "</tbody>";
            content += "</table>";

            $("#dvTargetDetails").html(content);
            if ($.fn.dataTable) { $('.datatable').dataTable({ "sPaginationType": "full_numbers" }); };
        }
    });
}

//Tree Node Click Event
function fnTargetHeaderTreeNodeClick() {
    $("#dvMain").show();
    fnGetTargetHeader();
}

//Clear All
function fnClearAll() {
    $("#txtTargetName").val('');
    $("#txtFrom").val('');
    $("#txtTo").val('');
    $("#hdnMode").val("S")
}
//Edit Bind Details
function fnEdit(rowIndex) {
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    var targetCode = $("#hdnTargetCode_" + rowIndex).val();
    $.ajax({
        type: "POST",
        url: '/Target/GetTargetDetails',
        data: "TargetCode=" + targetCode + "&RegionCode=" + regionCode + "",
        success: function (jsDetailData) {
            jsDetailData = eval('(' + jsDetailData + ')');
            if (jsDetailData.Tables[0].Rows.length == 0) {
                var targetName = $("#tdTarget_" + rowIndex).html();
                var from = $("#tdFrom_" + rowIndex).html();
                var to = $("#tdTo_" + rowIndex).html();
                var targetCode = $("#hdnTargetCode_" + rowIndex).val();

                $("#hdnMode").val("E")
                $("#hdnTargetCode").val(targetCode);
                $("#txtTargetName").val(targetName);
                $("#txtFrom").val(from);
                $("#txtTo").val(to);
            }
            else {
                fnMsgAlert('info', 'Edit', 'You can not edit this target, because this target is already defined');
            }
        }
    });

    //    var targetName = $("#tdTarget_" + rowIndex).html();
    //    var from = $("#tdFrom_" + rowIndex).html();
    //    var to = $("#tdTo_" + rowIndex).html();
    //    var targetCode = $("#hdnTargetCode_" + rowIndex).val();

    //    $("#hdnMode").val("E")
    //    $("#hdnTargetCode").val(targetCode);
    //    $("#txtTargetName").val(targetName);
    //    $("#txtFrom").val(from);
    //    $("#txtTo").val(to);
}
//Change Status
function fnChangeStatus(rowIndex) {
    $("#hdnMode").val("C")
    var targetCode = $("#hdnTargetCode_" + rowIndex).val();
    $("#hdnTargetCode").val(targetCode);
    fnSubmit();
}

//Validate
function fnValidate() {
    if ($("#hdnMode").val() != "C") {
        //Special Char Validation
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._]+$");
        if (!specialCharregex.test($("#txtTargetName").val())) {
            fnPopUp("error", 'Please do not enter special character in target name');
            return false;
        }

        if ($.trim($("#txtTargetName").val()) == '') {
            fnPopUp("error", 'Please enter target name');
            return false;
        }
        if ($.trim($("#txtFrom").val()) == '') {
            fnPopUp("error", 'Please enter from');
            return false;
        }
        if ($.trim($("#txtTo").val()) == '') {
            fnPopUp("error", 'Please enter to');
            return false;
        }
        if ($("#hdnMode").val() != "E") {
            var target = jsonPath(targetDetails_g, "$.Tables[0].Rows[?(@.Target_Name=='" + $("#txtTargetName").val() + "')]");
            if (target.length > 0) {
                fnPopUp("error", 'Target name already exist');
                return false;
            }
        }
        return true;
    }
    else {
        return true;
    }
}

function fnPopUp(type, text) {
    if (type == "Success") {
        //        $("#imgSuccess").css('display', '')
        //        $("#imgError").css('display', 'none');
        //        $("#dvMessage").html(text);
        //        Popup.showModal('popupmodal');
        fnMsgAlert('success', 'Success', text)

    }
    else {
        //        $("#imgSuccess").css('display', 'none');
        //        $("#imgError").css('display', '');
        //        $("#dvMessage").html(text);
        //        Popup.showModal('popupmodal');
        fnMsgAlert('error', 'Error', text)
    }
}

//Details tree node click
function fnDetailTreeNodeClick() {
    $("#spnRegionName").html($("#hdnTreeNode").val().split('_')[1].toString());
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    $.ajax({
        type: "POST",
        url: '/Target/GetTargetByRegion',
        data: "RegionCode=" + regionCode + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')')
            targetbyRegion_g = jsData;
            //To remove all the options
            var select = $('#drpTarget');
            $('option', select).remove();

            $('#drpTarget').append("<option value='0'>-Select Target-</option>");
            for (var j = 0; j < jsData.Tables[0].Rows.length; j++) {
                $('#drpTarget').append("<option value='" + jsData.Tables[0].Rows[j].Target_Code + "'>" + jsData.Tables[0].Rows[j].Target_Name + "</option>");
            }

            //Bind Under Regions
            var select = $('#drpRegion');
            $('option', select).remove();

            $('#drpRegion').append("<option value='0'>-Select Region-</option>");
            for (var j = 0; j < jsData.Tables[2].Rows.length; j++) {
                $('#drpRegion').append("<option value='" + jsData.Tables[2].Rows[j].Region_Code + "'>" + jsData.Tables[2].Rows[j].Region_Name + "</option>");
            }
            //Function to select target from header
            fnSelectTarget();
        }
    });
}
function fnBindTable() {

    var tblContent = "";
    var productTblContent = "";
    var selectedTarget = jsonPath(targetbyRegion_g, "$.Tables[0].Rows[?(@.Target_Code=='" + $('#drpTarget').val() + "')]");

    if (selectedTarget != false) {
        //to bind region name in self place
        var regionNam = $("#hdnTreeNode").val().split('_')[1].split('(')[0].toString();

        var noOfmonths = selectedTarget[0].Month;
        noOfmonths_g = noOfmonths;

        //Check If region has child region
        var haschild = false;
        var childCount = targetbyRegion_g.Tables[1].Rows[0].Count.toString();

        if (childCount > 0) {
            haschild = true;
        }

        var from = selectedTarget[0].From_Date;
        var to = selectedTarget[0].To_Date;
        var totalColumns = 1 + parseInt(noOfmonths) + 2;
        // product Table started 
        productTblContent += "<div>";
        productTblContent += "<table width='100%' class='tblTarget' id='tblTargetColumn'>";
        productTblContent += "<thead class='tableth'>";
        productTblContent += "<tr class='tableth'>"
        productTblContent += "<th class='tableth'>Product Name</th>"
        productTblContent += "</tr>"
        productTblContent += "<tr class='tableth'>";
        productTblContent += "<th class='tableth'>&nbsp</th>";
        productTblContent += "</tr>";
        productTblContent += "</thead>";
        productTblContent += "<tbody>";
        for (var i = 0; i < 10; i++) {
            productTblContent += "<tr id='trProduct_" + i + "'>";
            productTblContent += "<td><div><input id='txtProductName_" + i + "'  onblur='fnCreateNewRow(this)' style='width:96%' class='productauto' /><input id='hdnProductCode_" + i + "' type='hidden' /><input id='hdnPrice_" + i + "' type='hidden' /></div></td>";
            productTblContent += "</tr>";
        }
        productTblContent += "</tbody>";
        productTblContent += "</table>";

        productTblContent += "<table style='border:none;width:98%;text-align:right;font-weight:bold'>";
        productTblContent += "<tr>";
        productTblContent += "<td>Total Target Amount (" + regionNam + ")</td>";
        productTblContent += "</tr>";
        productTblContent += "</table>";

        productTblContent += "</div>";
        $("#dvProduct").html(productTblContent);
        //Product table finished
        tblContent += "<div id='tableDiv_Arrays' width='500px !important'>";

        //Added for label
        tblContent += "<table id='tblTarget' class='tblTarget' width='100%'>";
        tblContent += "<thead class='tableth'>";
        tblContent += "<tr class='tableth'>"
        //Month Name
        from = from.replace(/-/g, '/');
        var d = new Date(from);
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var current_month = d.getMonth();
        for (var k = 0; k < parseInt(noOfmonths); k++) {
            tblContent += "<th><div class='tableth'> <div id='dvMonth_" + k + "'>" + monthNames[current_month] + " - " + d.getFullYear() + "</div><input type='hidden' value='" + d.getFullYear() + "-" + (d.getMonth() + 1) + "' id='hdnMonth_" + k + "' /></div></th>"
            d.setMonth(d.getMonth() + 1);
            current_month = d.getMonth();
        }
        tblContent += "<th><div class='tableth'>Target Total</div></th>"
        tblContent += "<th></th>"//For Delete
        tblContent += "</tr>"
        tblContent += "<tr class='tableth'>";
        for (var k = 0; k < parseInt(noOfmonths); k++) {
            if (haschild) {
                tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
            }
            else {
                tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></th>";
            }
        }
        //Target Total
        if (haschild) {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
        }
        else {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></div></th>";
        }

        tblContent += "<th></th>"//For Delete
        tblContent += "</tr>";
        tblContent += "</thead>";
        tblContent += "<tbody>";
        for (var i = 0; i < 10; i++) {
            tblContent += "<tr id='tr_" + i + "'>";
            for (var j = 0; j < parseInt(noOfmonths); j++) {
                if (haschild) {
                    tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /></div></div></td>";
                }
                else {
                    tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + i + "' style='width:96%;' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /></div></div></td>";
                }
            }
            //Target Total
            if (haschild) {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div></div></td>";
            }
            else {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + i + "' style='width:96%;' class='inputdisabled' value='0' disabled /></div></div></td>";
            }
            tblContent += "<td><div style='width:20px'><span class='delete' id='delete_" + (j + 1) + "_" + i + "' onclick='fnDelete(this)'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /></span></div></td>" //For Delete
            tblContent += "</tr>";
        }
        tblContent += "</tr>";
        tblContent += "</tbody>";
        tblContent += "</table>";

        tblContent += "<table id='tblfreeze' width='100%' class='tblTarget' >";
        tblContent += "<tr>";
        for (var j = 0; j < parseInt(noOfmonths) + 1; j++) {
            tblContent += "<td><div style='width:125px;' class='amtdiv'><span id='amtspn_" + j + "'>0.00</span></div></td>";
        }
        tblContent += "<td><div style='width:20px'></div></td>" //For Delete
        tblContent += "</tr>";
        if (haschild) {
            tblContent += "<tr>";
            for (var j = 0; j < parseInt(noOfmonths); j++) {
                tblContent += "<td><div style='width:125px;'><input type='button' id='btnFreeze_" + j + "' value='Freeze' style='width:96%' class='freezebg'></div></td>";
            }
            tblContent += "<td><div style='width:125px;'>&nbsp</div></td>";
            tblContent += "</tr>";
        }
        tblContent += "</table>";

        tblContent += "</div>";
        $("#dvTargetDtl").html(tblContent);

        $(".pricecalculate").blur(function () { fnCalculatePrice(this); });
        $(".pricecalculate").click(function () { self_g = $(this).val(); });
        $(".productauto").focus(function () { fnHighlightRow(this); });

        fnGetTargetProductDetails();

        //        $('input:text:first').focus();
        //        var $inp = $('input:text');
        //        $inp.bind('keydown', function (e) {
        //            //var key = (e.keyCode ? e.keyCode : e.charCode);
        //            var key = e.which;
        //            if (key == 13) {
        //                e.preventDefault();
        //                var nxtIdx = $inp.index(this) + 1;
        //                $(":input:text:eq(" + nxtIdx + ")").focus();
        //            }
        //        });
    }
}

function fnCreateNewRow(obj) {
    //For Clear the hidden product code for validation
    fnValidateAutofill(obj, productAutoFill_g, 'txtProductName_', 'hdnProductCode_');
    //For Bind the selected product price in hidden
    fnBindPrice(obj);

    //Function to clear the month details when product name is changed
    fnClearMonthDetails(obj);

    //For Bind Team Sum
    fnBindTeamSum(obj)

    

    //Check If region has child region
    var haschild = false;
    var childCount = products_g.Tables[4].Rows[0].Count.toString();

    if (childCount > 0) {
        haschild = true;
    }

    var productId = obj.id.split('_')[1].toString();
    var rCnt = $("#tblTargetColumn tr").length;
    if (parseInt(productId) + 3 == rCnt) {
        var newRow = document.getElementById("tblTargetColumn").insertRow(parseInt(rCnt));
        var row = (parseInt(productId) + 3);
        var tdProductName = newRow.insertCell(0);
        newRow.id = "trProduct_" + (parseFloat(productId) + 1) + "";
        $(tdProductName).html("<input id='txtProductName_" + (parseFloat(productId) + 1) + "' style='width:96%' onblur='fnCreateNewRow(this)' class='productauto' /><input id='hdnProductCode_" + (parseFloat(productId) + 1) + "' type='hidden' /><input id='hdnPrice_" + (parseFloat(productId) + 1) + "' type='hidden' />");

        var rCnt1 = $("#tblTarget tr").length;
        var newRow1 = document.getElementById("tblTarget").insertRow(parseInt(rCnt1));
        newRow1.id = "tr_" + (parseFloat(productId) + 1);

        if (row == rCnt1) {
            for (var j = 0; j < parseInt(noOfmonths_g); j++) {
                var td = newRow1.insertCell(j);
                if ($("#txtSelf_" + j + "_" + parseFloat(productId) + "").is(":visible")) {
                    if (haschild) {
                        $(td).html("<div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                    else {
                        $(td).html("<div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                }
                else {
                    if (haschild) {
                        $(td).html("<div style='width:125px;display:none'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                    else {
                        $(td).html("<div style='width:125px;display:none'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                }
            }
            var td = newRow1.insertCell(j);
            if ($("#txtSelf_" + j + "_" + parseFloat(productId) + "").is(":visible")) {
                if (haschild) {
                    $(td).html("<div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
                else {
                    $(td).html("<div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
            }
            else {
                if (haschild) {
                    $(td).html("<div style='width:125px;display:none'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
                else {
                    $(td).html("<div style='width:125px;display:none'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
            }

            var tdDelete = newRow1.insertCell(j + 1);
            $(tdDelete).html("<div style='width:20px'><span class='delete' id='delete_" + (j + 1) + "_" + (parseFloat(productId) + 1) + "' onclick='fnDelete(this)'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /></span></div>");  //For Delete
        }
    }
    $(".pricecalculate").blur(function () { fnCalculatePrice(this); });
    $(".pricecalculate").click(function () { self_g = $(this).val(); });
    $(".productauto").focus(function () { fnHighlightRow(this); });
    fnGetTargetProductDetails();
}
//Function to clear the month details & Target unit/Amount Reassign when product name is changed
function fnClearMonthDetails(obj) {
    var productId = obj.id;
    var rowIndex = productId.split('_')[1].toString();
    if (self_g != $("#hdnProductCode_" + rowIndex).val()) {
        for (var z = 0; z < noOfmonths_g; z++) {
            $("#txtSelf_" + z + "_" + rowIndex).val('');
            $("#hdnSelf_" + z + "_" + rowIndex).val('');
            $("#txtTeam_" + z + "_" + rowIndex).val('');
        }
        fnReAssignUnits();
    }
}

function fnBindTeamSum(obj) {
    var productId = obj.id;
    var rowIndex = productId.split('_')[1].toString();
    var hdnproductCode = productId.replace('txtProductName', 'hdnProductCode');
    var productCode = $("#" + hdnproductCode).val();
    var targetTotal = 0;
    for (var z = 0; z < noOfmonths_g; z++) {
        var hdnmonth = $("#hdnMonth_" + z).val();

        var year = hdnmonth.split('-')[0].toString();
        var month = hdnmonth.split('-')[1].toString();

        //To get team sum
        var sum = jsonPath(products_g, "$.Tables[3].Rows[?(@.Product_Code=='" + productCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");

        if (sum != false && sum.length > 0) {
            if ($("#radInUnit").attr('checked')) {
                $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Qty);
                targetTotal += parseFloat(sum[0].Qty);
            }
            else if ($("#radInAmt").attr('checked')) {
                $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Amount);
                targetTotal += parseFloat(sum[0].Amount)
            }
        }

    }

    //To bind target total
    $("#txtTeam_" + noOfmonths_g + "_" + rowIndex).val(parseFloat(targetTotal).toFixed(2));
}
function fnBindPrice(obj) {
    var productId = obj.id;
    var hdnproductCode = productId.replace('txtProductName', 'hdnProductCode');
    var hdnprice = productId.replace('txtProductName', 'hdnPrice');
    var productCode = $("#" + hdnproductCode).val();
    //var parentRegion = products_g.Tables[2].Rows[0].Parent_Regions.toString();

    //var regionArr = new Array();
    //regionArr = parentRegion.split(',');

    var price = 0;
    //    for (var k = 0; k < regionArr.length; k++) {
    //        var target = jsonPath(products_g, "$.Tables[1].Rows[?(@.Product_Code=='" + productCode + "' & @.Region_Code=='" + regionArr[k].toString() + "')]");
    //        if (target != false && target.length > 0) {
    //            price = target[0].Price;
    //            break;
    //        }
    //    }
    for (var k = (products_g.Tables[2].Rows.length - 1); k >= 0; k--) {
        var target = jsonPath(products_g, "$.Tables[1].Rows[?(@.Product_Code=='" + productCode + "' & @.Region_Code=='" + products_g.Tables[2].Rows[k].Region_Code + "')]");
        if (target != false && target.length > 0) {
            price = target[0].Price;
            break;
        }
    }
    $("#" + hdnprice).val(price);
}

function fnGetTargetProductDetails() {
    if (productAutoFill_g == "") {
        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
        $.ajax({
            type: "POST",
            url: '/Target/GetTargetProductDetails',
            data: "RegionCode=" + regionCode + "&TargetCode=" + $('#drpTarget').val() + "",
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                if (jsData.Tables[0].Rows.length > 0) {
                    var product = "[";
                    for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                        product += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].Product_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].Product_Code + "" + '"' + "}";
                        if (i < jsData.Tables[0].Rows.length - 1) {
                            product += ",";
                        }
                    }
                    product += "];";
                    var productJson = eval(product);
                    productAutoFill_g = productJson;
                    products_g = jsData;
                    autoComplete(productJson, "txtProductName", "hdnProductCode", "productauto");
                }
                else {
                    var regionTree = $("#tree").dynatree("getTree");
                    var regionName = regionTree.getActiveNode().data.title.split('(')[0];
                    fnMsgAlert('info', 'info', 'This region (' + regionName + ') does not have product price list. Please contact your administrator to configure price list.');                 
                    return;
                }
            }
        });
    }
    else {
        autoComplete(productAutoFill_g, "txtProductName", "hdnProductCode", "productauto");
    }
}

function fnCalculatePrice(obj) {
    if (self_g != $("#" + obj.id).val()) {
        $("#" + obj.id.replace('txtSelf', 'hdnHistory')).val("Y");
    }

    //Unit/Amount Validation
    if (isNaN($("#" + obj.id).val())) {
        $("#" + obj.id).addClass('error');
        return false;
    }
    else {
        if ($("#" + obj.id).hasClass('error')) {
            $("#" + obj.id).removeClass('error')
        }
    }
    //Negative Validation
    if ($("#" + obj.id).val() < 0) {
        $("#" + obj.id).addClass('error');
        return false;
    }
    else {
        if ($("#" + obj.id).hasClass('error')) {
            $("#" + obj.id).removeClass('error')
        }
    }

    if ($("#radInUnit").attr('checked')) {
        var selfId = obj.id; //txtSelf_1_0
        var rowId = selfId.split('_')[1].toString();
        var rowIdforProduct = selfId.split('_')[2].toString();

        var hdnPrice = $("#hdnPrice_" + rowIdforProduct).val();
        var amtspnId = $("#amtspn_" + rowId).html();
        var selfUnit = $("#" + selfId).val();
        if (selfUnit != "" && hdnPrice != "") {
            var hdnSelfId = selfId.replace('txtSelf', 'hdnSelf');
            var selfAmt = selfUnit * hdnPrice;
            $("#" + hdnSelfId).val(parseFloat(selfAmt).toFixed(2));
        }
        var targetTbllen = $("#tblTarget tr").length - 2;
        var unit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + rowId + "_" + i).val()) != "" && $("#hdnPrice_" + i).val() != "") {
                var selval = $("#txtSelf_" + rowId + "_" + i).val();
                var price = $("#hdnPrice_" + i).val()
                unit += parseFloat(selval) * parseFloat(price);
            }
        }

        //var amount = parseFloat(parseFloat(unit) * parseFloat(hdnPrice)).toFixed(2);
        $("#amtspn_" + rowId).html(parseFloat(unit).toFixed(2));

        //Target Total
        var targetunit = 0;
        for (var i = 0; i < parseInt(noOfmonths_g); i++) {
            if ($.trim($("#txtSelf_" + i + "_" + rowIdforProduct).val()) != "") {
                var selfval = $("#txtSelf_" + i + "_" + rowIdforProduct).val();
                targetunit += parseFloat(selfval);
            }
        }

        $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + rowIdforProduct).val(targetunit);

        //Final Target  Total
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                var price = $("#hdnPrice_" + i).val();
                if ($.trim(price) != "") {
                    targetFinalunit += parseFloat(finalTargetselfval) * parseFloat(price);
                }
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));
    }
    else if ($("#radInAmt").attr('checked')) {
        var selfId = obj.id;
        var rowId = selfId.split('_')[1].toString();
        var rowIdforProduct = selfId.split('_')[2].toString();
        var hdnPrice = $("#hdnPrice_" + rowIdforProduct).val();

        var amtspnId = $("#amtspn_" + rowId).html();
        var selfUnit = $("#" + selfId).val();

        //For Calculate Unit
        if (selfUnit != "" && hdnPrice != "") {
            if (hdnPrice != 0) {
                var hdnSelfId = selfId.replace('txtSelf', 'hdnSelf');
                var slfunit = parseFloat(parseFloat(selfUnit) / parseFloat(hdnPrice)).toFixed(2);
                $("#" + hdnSelfId).val(slfunit);
            }
            else {
                var hdnSelfId = selfId.replace('txtSelf', 'hdnSelf');
                $("#" + hdnSelfId).val(0);
            }
        }


        var targetTbllen = $("#tblTarget tr").length - 2;
        var amount = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + rowId + "_" + i).val()) != "") {
                var selval = $("#txtSelf_" + rowId + "_" + i).val();
                amount += parseFloat(selval);
            }
        }

        $("#amtspn_" + rowId).html(parseFloat(amount).toFixed(2));

        //Target Total
        var targetTotalamt = 0;
        for (var i = 0; i < parseInt(noOfmonths_g); i++) {
            if ($.trim($("#txtSelf_" + i + "_" + rowIdforProduct).val()) != "") {
                var selfval = $("#txtSelf_" + i + "_" + rowIdforProduct).val();
                targetTotalamt += parseFloat(selfval);
            }
        }

        $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + rowIdforProduct).val(targetTotalamt);

        //Final Target  Total
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                targetFinalunit += parseFloat(finalTargetselfval);
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));

    }
}
function fnShowTree() {
    if ($("#aShowTree").html() == "Show Tree") {
        $("#divTree1").show();
        $("#divMain").css('width', '80%')
        $("#aShowTree").html("Hide Tree");
    }
    else {
        $("#divTree1").hide();
        $("#divMain").css('width', '100%')
        $("#aShowTree").html("Show Tree");
    }
}
//For read the table for insert
function fnReadTable() {
    var productCount = 0;
    var targetMode = "";
    var result = fnValidateTargetDetailsTable();
    if (result) {
        var content = "";
        var productlength = $("#tblTargetColumn tr").length;
        for (var j = 0; j < productlength - 2; j++) {
            //Check if product is delete
            if ($("#txtProductName_" + j + "").is(":visible")) {
                var productCode = $("#hdnProductCode_" + j).val();
                if (productCode != "") {
                    productCount++;
                    content += "pdc_" + j + "=" + productCode + "&";

                    for (var z = 0; z < noOfmonths_g; z++) {
                        var month = $("#hdnMonth_" + z).val();
                        var self = $("#txtSelf_" + z + "_" + j).val();
                        var hdnself = $("#hdnSelf_" + z + "_" + j).val();
                        var hdndetailCode = $("#hdnDetailCode_" + z + "_" + j).val();
                        var history = $("#hdnHistory_" + z + "_" + j).val();

                        if (self == "") {
                            self = 0;
                        }
                        if (hdnself == "") {
                            hdnself = 0;
                        }

                        if ($("#radInUnit").attr('checked')) {
                            content += "mnt_" + j + "_" + z + "=" + month + "&self_" + j + "_" + z + "=" + self + "_" + hdnself + "&detailCode_" + j + "_" + z + "=" + hdndetailCode + "&history_" + j + "_" + z + "=" + history + "&";
                            targetMode = "UNIT";
                        }
                        else if ($("#radInAmt").attr('checked')) {
                            content += "mnt_" + j + "_" + z + "=" + month + "&self_" + j + "_" + z + "=" + hdnself + "_" + self + "&detailCode_" + j + "_" + z + "=" + hdndetailCode + "&history_" + j + "_" + z + "=" + history + "&";
                            targetMode = "AMOUNT";
                        }
                    }
                }
            }
            else {
                productCount++;
            }
        }
        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
        content += "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "&MonthCount=" + noOfmonths_g + "&Mode=I&NoOfProduct=" + productCount + "&TargetMode=" + targetMode + "";

        if (productCount == 0) {
            content = "";
        }
        return content;
    }
    else {
        return false;
    }
}
//
function fnValidateTargetDetailsTable() {
    var productlength = $("#tblTargetColumn tr").length;
    var proArr = new Array();
    for (var j = 0; j < productlength - 2; j++) {
        var productid = "txtProductName_" + j;
        if ($("#" + productid).is(":visible")) {
            if ($("#" + productid).hasClass('error')) {
                //fnPopUp('error', 'Please validate product name');
                $("#" + productid).focus();
                return false;
            }

            var productCode = $("#hdnProductCode_" + j).val();
            if (productCode != "") {
                for (var z = 0; z < noOfmonths_g; z++) {
                    if ($("#txtSelf_" + z + "_" + j).hasClass('error')) {
                        fnPopUp('error', 'Please validate unit/amount');
                        $("#txtSelf_" + z + "_" + j).focus();
                        return false;
                    }
                }
            }
            //Invalid product Check 
            var productName = $("#txtProductName_" + j).val();
            if (productName != "") {
                if (productCode == "") {
                    fnPopUp('error', 'Invalid Product - ' + productName + '');
                    return false;
                }
            }
            //Product Repeat check

            if (productCode != "") {
                var result = include(proArr, productCode);

                if (result === undefined) {
                    proArr.push(productCode);
                }
                else {
                    fnPopUp('error', 'Product name already exist - ' + productName + '');
                    return false;
                }
            }
        }
    }
    return true;
}

function fnInsertTargetDetails() {
    var data = fnReadTable();
    if (data == false) {
        return false;
    }
    else if (data == "") {
        fnMsgAlert('info', 'Info', 'Please enter atleast one product');
        return false;
    }
    //Ajax Post
    $.ajax({
        type: "POST",
        url: '/Target/InsertTargetDetails',
        data: data,
        success: function (jsData) {
            if (jsData == "SUCCESS") {
                var text = "Target Details Saved Successfully";
                fnPopUp("Success", text);
                products_g = "";
                productAutoFill_g = "";
                fnBindTable();
            }
            else {
                fnPopUp("error", jsData);
            }
        }
    });

    //    if (data != "") {
    //        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    //        var mode = "";
    //        if ($("#radInUnit").attr('checked')) {
    //            mode = "UNIT";
    //        }
    //        else if ($("#radInAmt").attr('checked')) {
    //            mode = "AMOUNT";
    //        }
    //        //Ajax Post
    //        $.ajax({
    //            type: "POST",
    //            url: 'Target/InsertTarget',
    //            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "&TargetDetails=" + data + "&MonthCount=" + noOfmonths_g + "&Mode=" + mode + "",
    //            success: function (jsData) {
    //                if (jsData == "") {
    //                    var text = "Target Details Saved Successfully";
    //                    fnPopUp("Success", text);
    //                    fnBindTable();
    //                }
    //            }
    //        });
    //    }
}

function fnGo() {
    if ($('#drpTarget').val() == 0) {
        fnMsgAlert('error', 'Error', 'Please select Target name then proceed');
        return false;
    }
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    $.ajax({
        type: "POST",
        url: '/Target/GetTargetDetails',
        data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "",
        success: function (jsDetailData) {
            jsDetailData = eval('(' + jsDetailData + ')');
            products_g = "";
            productAutoFill_g = "";
            if (jsDetailData.Tables[0].Rows.length == 0) {
                fnBindTable();
            }
            else {
                fnPrefillTargetDetails(jsDetailData);
            }
            $("#dvButton").css('display', '');
        }
    });
}


function fnPrefillTargetDetails(jsDetailData) {
    //to bind region name in self place
    var regionNam = $("#hdnTreeNode").val().split('_')[1].split('(')[0].toString();

    var tblContent = "";
    var productTblContent = "";
    var noOfmonths = jsDetailData.Tables[1].Rows[0].Month;
    noOfmonths_g = noOfmonths;
    var from = jsDetailData.Tables[1].Rows[0].From_Date;
    var to = jsDetailData.Tables[1].Rows[0].To_Date;


    //Distinct Product
    var productArr = new Array();
    for (var z = 0; z < jsDetailData.Tables[0].Rows.length; z++) {
        var result = include(productArr, jsDetailData.Tables[0].Rows[z].Product_Code);
        if (result === undefined) {
            productArr.push(jsDetailData.Tables[0].Rows[z].Product_Code);
        }
    }
    //Check If region has child region
    var haschild = false;
    var childCount = jsDetailData.Tables[6].Rows[0].Count.toString();

    if (childCount > 0) {
        haschild = true;
    }

    //Generate Table content
    // product Table started
    productTblContent += "<div>";
    productTblContent += "<table width='100%' class='tblTarget' id='tblTargetColumn'>";
    productTblContent += "<thead class='tableth'>";
    productTblContent += "<tr class='tableth'>"
    productTblContent += "<th class='tableth'>Product Name</th>"
    productTblContent += "</tr>"
    productTblContent += "<tr class='tableth'>";
    productTblContent += "<th class='tableth'>&nbsp</th>";
    productTblContent += "</tr>";
    productTblContent += "</thead>";
    productTblContent += "<tbody>";
    for (var i = 0; i < productArr.length; i++) {
        productTblContent += "<tr id='trProduct_" + i + "'>";
        productTblContent += "<td><div><input id='txtProductName_" + i + "'  onblur='fnCreateNewRow(this)' style='width:96%' class='productauto' /><input id='hdnProductCode_" + i + "' type='hidden' /><input id='hdnPrice_" + i + "' type='hidden' /></div></td>";
        productTblContent += "</tr>";
    }
    productTblContent += "</tbody>";
    productTblContent += "</table>";

    productTblContent += "<table style='border:none;width:98%;text-align:right;font-weight:bold'>";
    productTblContent += "<tr>";
    productTblContent += "<td>Total Target Amount (" + regionNam + ")</td>";
    productTblContent += "</tr>";
    productTblContent += "</table>";

    productTblContent += "</div>";
    $("#dvProduct").html(productTblContent);
    //Product table finished

    //Details Start Here

    tblContent += "<div id='tableDiv_Arrays' width='500px !important'>";

    tblContent += "<table id='tblTarget' class='tblTarget' width='100%'>";
    tblContent += "<thead class='tableth'>";
    tblContent += "<tr class='tableth'>"
    //Month Name

    from = from.replace(/-/g, '/');
    var d = new Date(from);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var current_month = d.getMonth();
    for (var k = 0; k < parseInt(noOfmonths); k++) {
        tblContent += "<th><div class='tableth'><div id='dvMonth_" + k + "'> " + monthNames[current_month] + " - " + d.getFullYear() + " </div><input type='hidden' value='" + d.getFullYear() + "-" + (d.getMonth() + 1) + "' id='hdnMonth_" + k + "' /></div></th>"
        d.setMonth(d.getMonth() + 1);
        current_month = d.getMonth();
    }
    tblContent += "<th><div class='tableth'>Target Total</div></th>"
    tblContent += "<th></th>"; //For Delete
    tblContent += "</tr>"
    tblContent += "<tr class='tableth'>";
    for (var k = 0; k < parseInt(noOfmonths); k++) {
        if (haschild) {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
        }
        else {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></div></th>";
        }
    }
    //Target Total
    if (haschild) {
        tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
    }
    else {
        tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></div></th>";
    }
    tblContent += "<th></th>"; //For Delete

    tblContent += "</tr>";
    tblContent += "</thead>";
    tblContent += "<tbody>";
    for (var i = 0; i < productArr.length; i++) {
        tblContent += "<tr id='tr_" + i + "'>";
        for (var j = 0; j < parseInt(noOfmonths); j++) {
            if (haschild) {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + i + "' value=N /></div></div></td>";
            }
            else {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + i + "' value=N /></div></div></td>";
            }
        }
        //Target Total
        if (haschild) {
            tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div></div></td>";
        }
        else {
            tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px;display:none' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div></div></td>";
        }
        tblContent += "<td><div style='width:20px'><span class='delete' id='delete_" + (j + 1) + "_" + i + "' onclick='fnDelete(this)'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /></span></div></td>" //For Delete
        tblContent += "</tr>";
    }


    tblContent += "</tr>";
    tblContent += "</tbody>";
    tblContent += "</table>";

    tblContent += "<table width='100%' class='tblTarget'>";
    tblContent += "<tr>";
    for (var j = 0; j < parseInt(noOfmonths) + 1; j++) {
        tblContent += "<td><div style='width:125px;' class='amtdiv'><span id='amtspn_" + j + "'>0.00</span></div></td>";
    }
    tblContent += "<td><div style='width:20px'></div></td>" //For Delete
    tblContent += "</tr>";
    if (haschild) {
        tblContent += "<tr>";
        for (var j = 0; j < parseInt(noOfmonths); j++) {

            tblContent += "<td><div style='width:125px;'><input type='button' id='btnFreeze_" + j + "' value='Freeze' style='width:96%' onclick='fnFreeze(this)' class='freezebg'></div></td>";
        }
        tblContent += "</tr>";
    }
    tblContent += "</table>";

    tblContent += "</div>";
    $("#dvTargetDtl").html(tblContent);
    //Details Ends Here

    //Bind Values
    //Product Name
    for (var i = 0; i < productArr.length; i++) {
        var product = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "')]");
        $("#txtProductName_" + i).val(product[0].Product_Name);
        $("#hdnProductCode_" + i).val(product[0].Product_Code);

        //For bind the unit/target sum
        productId = "txtProductName_" + i;
        var rowIndex = productId.split('_')[1].toString();
        var hdnproductCode = productId.replace('txtProductName', 'hdnProductCode');
        var productCode = $("#" + hdnproductCode).val();
        var targetTotal = 0;
        for (var z = 0; z < noOfmonths_g; z++) {
            var hdnmonth = $("#hdnMonth_" + z).val();

            var year = hdnmonth.split('-')[0].toString();
            var month = hdnmonth.split('-')[1].toString();

            //To get team sum
            var sum = jsonPath(jsDetailData, "$.Tables[5].Rows[?(@.Product_Code=='" + productCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");



            if (sum != false && sum.length > 0) {
                if ($("#radInUnit").attr('checked')) {
                    $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Qty);
                    targetTotal += parseFloat(sum[0].Qty);
                }
                else if ($("#radInAmt").attr('checked')) {
                    $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Amount);
                    targetTotal += parseFloat(sum[0].Amount)
                }
            }
            else {
                $("#txtTeam_" + z + "_" + rowIndex).val(0);
            }

        }
        //To bind target total
        $("#txtTeam_" + noOfmonths_g + "_" + rowIndex).val(parseFloat(targetTotal).toFixed(2));

    }
    //Details - Unit / Amount
    for (var i = 0; i < productArr.length; i++) {
        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
        var product = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "' & @.Region_Code=='" + regionCode + "')]");
        for (var x = 0; x < product.length; x++) {
            var targetMonth = product[x].Target_Month;
            var targetUnit = product[x].Target_Qty;
            var targetAmount = product[x].Target_Amount;

            for (var z = 0; z < noOfmonths; z++) {
                var hdnmonth = $("#hdnMonth_" + z).val();

                var year = hdnmonth.split('-')[0].toString();
                var month = hdnmonth.split('-')[1].toString();

                targetMonth = targetMonth.replace(/-/g, '/');

                var target = new Date(targetMonth);
                var targetYear = target.getFullYear();
                var target_Month = target.getMonth() + 1;
                var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();

                //To get the details code
                var details = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "' & @.Region_Code=='" + regionCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Target_Code=='" + $('#drpTarget').val() + "')]");

                //To Get History 
                var history = jsonPath(jsDetailData, "$.Tables[7].Rows[?(@.Product_Code=='" + productArr[i].toString() + "' & @.Region_Code=='" + regionCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Target_Code=='" + $('#drpTarget').val() + "')]");

                if (year == targetYear && month == target_Month) {
                    if (details != false && details != undefined) {
                        $("#hdnDetailCode_" + z + "_" + i).val(details[0].Target_Detail_Code);
                        if ($("#radInUnit").attr('checked')) {
                            $("#txtSelf_" + z + "_" + i).val(targetUnit);
                            $("#hdnSelf_" + z + "_" + i).val(targetAmount);

                            if (details[0].Flag == "F") {
                                $("#txtSelf_" + z + "_" + i).css('display', 'none');
                                $("#dvSelf_" + z + "_" + i).html("<span id='spn_" + z + "_" + i + "'>" + targetUnit + "</span>");
                                $("#txtProductName_" + i).addClass('inputdisabled');
                                $("#txtProductName_" + i).attr('disabled', true)
                                $("#btnFreeze_" + z).val("Unfreeze");
                            }
                            //For Color Change
                            if (history != false && history.length > 0) {
                                var historyqty = history[0].Target_Qty;
                                if (targetUnit > historyqty) {
                                    $("#txtSelf_" + z + "_" + i).addClass('bgGreen');
                                }
                                else if (targetUnit < historyqty) {
                                    $("#txtSelf_" + z + "_" + i).addClass('bgRed');
                                }
                            }
                        }
                        else if ($("#radInAmt").attr('checked')) {
                            $("#txtSelf_" + z + "_" + i).val(targetAmount);
                            $("#hdnSelf_" + z + "_" + i).val(targetUnit);

                            if (details[0].Flag == "F") {
                                $("#txtSelf_" + z + "_" + i).css('display', 'none');
                                $("#dvSelf_" + z + "_" + i).html("<span id='spn_" + z + "_" + i + "'>" + targetAmount + "</span>");
                                $("#txtProductName_" + i).addClass('inputdisabled');
                                $("#txtProductName_" + i).attr('disabled', true)
                                $("#btnFreeze_" + z).val("Unfreeze");
                            }

                            //For Color Change
                            if (history != false && history.length > 0) {
                                var historyAmount = history[0].Target_Amount;
                                if (targetAmount > historyAmount) {
                                    $("#txtSelf_" + z + "_" + i).addClass('bgGreen');
                                }
                                else if (targetAmount < historyAmount) {
                                    $("#txtSelf_" + z + "_" + i).addClass('bgRed');
                                }
                            }
                        }
                    }
                }
            }
        }
        //Function to bind price while prefill
        fnPrefillBindPrice(("txtProductName_" + i), jsDetailData);
    }


    //Function to bind unit/amount while prefill target sum...
    fnPrefillBindUnit();


    //to change text box to label
    for (var z = 0; z < noOfmonths; z++) {
        for (var i = 0; i < productArr.length; i++) {
            if (!$("#txtSelf_" + z + "_" + i).is(":visible")) {
                for (var j = 0; j < productArr.length; j++) {
                    $("#txtSelf_" + z + "_" + j).css('display', 'none');
                }
            }
        }
    }

    $(".pricecalculate").blur(function () { fnCalculatePrice(this); });
    $(".pricecalculate").click(function () { self_g = $(this).val(); });
    $(".productauto").focus(function () { fnHighlightRow(this); });
    fnGetTargetProductDetails();

    //Create one default Row
    fnCreateDefault("txtProductName_" + (productArr.length - 1));



    //    $('input:text:first').focus();
    //    var $inp = $('input:text');
    //    $inp.bind('keydown', function (e) {
    //        //var key = (e.keyCode ? e.keyCode : e.charCode);
    //        var key = e.which;
    //        if (key == 13) {
    //            e.preventDefault();
    //            var nxtIdx = $inp.index(this) + 1;
    //            $(":input:text:eq(" + nxtIdx + ")").focus();
    //        }
    //    });
}

//this is the method to check the array existance:
function include(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) return true;
    }
}

//Function to bind the price while prefill 
function fnPrefillBindPrice(productId, jsDetailData) {
    var hdnproductCode = productId.replace('txtProductName', 'hdnProductCode');
    var hdnprice = productId.replace('txtProductName', 'hdnPrice');
    var productCode = $("#" + hdnproductCode).val();
    //var parentRegion = jsDetailData.Tables[4].Rows[0].Parent_Regions.toString();
    //var regionArr = new Array();
    //regionArr = parentRegion.split(',');

    var price = 0;

    //    for (var k = 0; k < regionArr.length; k++) {
    //        var target = jsonPath(jsDetailData, "$.Tables[3].Rows[?(@.Product_Code=='" + productCode + "' & @.Region_Code=='" + regionArr[k].toString() + "')]");
    //        if (target != false && target.length > 0) {
    //            price = target[0].Price;
    //            break;
    //        }
    //    }
    for (var k = (jsDetailData.Tables[4].Rows.length - 1); k >= 0; k--) {
        var target = jsonPath(jsDetailData, "$.Tables[3].Rows[?(@.Product_Code=='" + productCode + "' & @.Region_Code=='" + jsDetailData.Tables[4].Rows[k].Region_Code + "')]");
        if (target != false && target.length > 0) {
            price = target[0].Price;
            break;
        }
    }

    $("#" + hdnprice).val(price);
}

//Function to Bind Unit/Amount values while prefill
function fnPrefillBindUnit() {
    //Bind Unit/Amount values while prefill
    if ($("#radInUnit").attr('checked')) {
        var targetTbllen = $("#tblTarget tr").length - 2;
        var unit = 0;

        for (var m = 0; m < noOfmonths_g; m++) {
            unit = 0;
            for (var i = 0; i < targetTbllen; i++) {
                if ($("#txtSelf_" + m + "_" + i).is(":visible")) {
                    if ($.trim($("#txtSelf_" + m + "_" + i).val()) != "" && $("#hdnPrice_" + i).val() != "") {
                        var selval = $("#txtSelf_" + m + "_" + i).val();
                        var price = $("#hdnPrice_" + i).val()
                        unit += parseFloat(selval) * parseFloat(price);
                    }
                }
                else {
                    if ($.trim($("#spn_" + m + "_" + i).html()) != "" && $("#hdnPrice_" + i).val() != "") {
                        var spnval = $("#spn_" + m + "_" + i).html();
                        var price = $("#hdnPrice_" + i).val()
                        unit += parseFloat(spnval) * parseFloat(price);
                    }
                }
                $("#amtspn_" + m).html(parseFloat(unit).toFixed(2));
            }
        }

        //Target Total
        var targetunit = 0;
        for (var l = 0; l < targetTbllen; l++) {
            targetunit = 0;
            for (var i = 0; i < parseInt(noOfmonths_g) ; i++) {
                if ($("#txtSelf_" + i + "_" + l).is(":visible")) {
                    if ($.trim($("#txtSelf_" + i + "_" + l).val()) != "") {
                        var selfval = $("#txtSelf_" + i + "_" + l).val();
                        targetunit += parseFloat(selfval);
                    }
                }
                else {
                    if ($.trim($("#spn_" + i + "_" + l).html()) != "") {
                        var selfval = $("#spn_" + i + "_" + l).html();
                        targetunit += parseFloat(selfval);
                    }
                }
            }
            $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + l).val(targetunit);
        }

        //Final Target Total
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                var price = $("#hdnPrice_" + i).val();
                if ($.trim(price) != "") {
                    targetFinalunit += parseFloat(finalTargetselfval) * parseFloat(price);
                }
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));
    }
    else if ($("#radInAmt").attr('checked')) {
        var targetTbllen = $("#tblTarget tr").length - 2;
        var amount = 0;

        for (var m = 0; m < noOfmonths_g; m++) {
            amount = 0;
            for (var i = 0; i < targetTbllen; i++) {
                if ($("#txtSelf_" + m + "_" + i).is(":visible")) {
                    if ($.trim($("#txtSelf_" + m + "_" + i).val()) != "") {
                        var selval = $("#txtSelf_" + m + "_" + i).val();
                        amount += parseFloat(selval);
                    }
                }
                else {
                    if ($.trim($("#spn_" + m + "_" + i).html()) != "" ) {
                        var spnval = $("#spn_" + m + "_" + i).html();
                        amount += parseFloat(spnval);
                    }
                }
                $("#amtspn_" + m).html(parseFloat(amount).toFixed(2));
            }
        }

        //Target Total
        var targetTotalamt = 0;
        for (var l = 0; l < targetTbllen; l++) {
            targetTotalamt = 0;
            for (var i = 0; i < parseInt(noOfmonths_g) ; i++) {
                if ($("#txtSelf_" + i + "_" + l).is(":visible")) {
                    if ($.trim($("#txtSelf_" + i + "_" + l).val()) != "") {
                        var selfval = $("#txtSelf_" + i + "_" + l).val();
                        targetTotalamt += parseFloat(selfval);
                    }
                }
                else {
                    if ($.trim($("#spn_" + i + "_" + l).html()) != "") {
                        var selfval = $("#spn_" + i + "_" + l).html();
                        targetTotalamt += parseFloat(selfval);
                    }
                }
            }
            $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + l).val(targetTotalamt);
        }

        //Final total target       
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                targetFinalunit += parseFloat(finalTargetselfval);
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));
    }
}




//Function to freeze the month
function fnFreeze(obj) {
    var monthId = obj.id.replace('btnFreeze', 'hdnMonth');
    var month = $("#" + monthId).val();
    month = month + "-01";
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    if ($("#" + obj.id).val() == "Freeze") {
        $.ajax({
            type: "POST",
            url: '/Target/FreezeTarget',
            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "&TargetMonth=" + month + "",
            success: function (result) {
                fnPopUp('Success', 'Target details freezed successfully');
                fnGo();
            }
        });
    }
    else if ($("#" + obj.id).val() == "Unfreeze") {
        $.ajax({
            type: "POST",
            url: '/Target/UnFreezeTarget',
            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "&TargetMonth=" + month + "",
            success: function (result) {
                fnPopUp('Success', 'Target details Unfreezed successfully');
                fnGo();
            }
        });
    }
}

//Function to create one default row
function fnCreateDefault(prodId) {
    //Check If region has child region
    var haschild = false;
    var childCount = targetbyRegion_g.Tables[1].Rows[0].Count.toString();

    if (childCount > 0) {
        haschild = true;
    }

    var productId = prodId.split('_')[1].toString();
    var rCnt = $("#tblTargetColumn tr").length;
    if (parseInt(productId) + 3 == rCnt) {
        var newRow = document.getElementById("tblTargetColumn").insertRow(parseInt(rCnt));
        newRow.id = "trProduct_" + (parseFloat(productId) + 1);

        var row = (parseInt(productId) + 3);
        var tdProductName = newRow.insertCell(0);
        $(tdProductName).html("<input id='txtProductName_" + (parseFloat(productId) + 1) + "' style='width:96%' onblur='fnCreateNewRow(this)' class='productauto' /><input id='hdnProductCode_" + (parseFloat(productId) + 1) + "' type='hidden' /><input id='hdnPrice_" + (parseFloat(productId) + 1) + "' type='hidden' />");

        var rCnt1 = $("#tblTarget tr").length;
        var newRow1 = document.getElementById("tblTarget").insertRow(parseInt(rCnt1));
        newRow1.id = "tr_" + (parseFloat(productId) + 1);

        if (row == rCnt1) {
            for (var j = 0; j < parseInt(noOfmonths_g); j++) {
                var td = newRow1.insertCell(j);

                if ($("#txtSelf_" + j + "_" + parseFloat(productId) + "").is(":visible")) {
                    if (haschild) {
                        $(td).html("<div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                    else {
                        $(td).html("<div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                }
                else {
                    if (haschild) {
                        $(td).html("<div style='width:125px;display:none'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                    else {
                        $(td).html("<div style='width:125px;display:none'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + (parseFloat(productId) + 1) + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + (parseFloat(productId) + 1) + "' value=N /></div></div>");
                    }
                }
            }
            var td = newRow1.insertCell(j);
            if ($("#txtSelf_" + j + "_" + parseFloat(productId) + "").is(":visible")) {
                if (haschild) {
                    $(td).html("<div style='width:125px;'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
                else {
                    $(td).html("<div style='width:125px;'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
            }
            else {
                if (haschild) {
                    $(td).html("<div style='width:125px;display:none'><div style='float:left; width:60px;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
                else {
                    $(td).html("<div style='width:125px;display:none'><div style='float:left; width:98%;'><input id='txtSelf_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div><div style='float:right; width:60px;margin-left:4px;display:none'><input id='txtTeam_" + j + "_" + (parseFloat(productId) + 1) + "' style='width:96%' class='inputdisabled' disabled value='0'/></div></div>");
                }
            }
            var tdDelete = newRow1.insertCell(j + 1);
            $(tdDelete).html("<div style='width:20px'><span class='delete' id='delete_" + (j + 1) + "_" + (parseFloat(productId) + 1) + "' onclick='fnDelete(this)'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /></span></div>");  //For Delete

        }
    }
    $(".pricecalculate").blur(function () { fnCalculatePrice(this); });
    $(".pricecalculate").click(function () { self_g = $(this).val(); });
    $(".productauto").focus(function () { fnHighlightRow(this); });

    fnGetTargetProductDetails();
}


var jsUseData_g = "";
function fnUseDataOf() {
    if ($("#drpRegion").val() != 0) {
        var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
        $.ajax({
            type: "POST",
            url: '/Target/GetTargetDetails',
            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "",
            success: function (jsUseData) {
                jsUseData = eval('(' + jsUseData + ')');
                if (jsUseData.Tables[0].Rows.length > 0) {
                    fnPopUp('error', 'This region have target , so you can not inherit');
                }
                else {
                    $.msgAlert({
                        type: 'warning'
	                , title: 'Data Inherit'
	                , text: 'Do you want to copy target data of ' + $('#drpRegion :selected').text() + '? Do you want to continue'
                    , callback: function () {
                        $.ajax({
                            type: "POST",
                            url: '/Target/GetTargetDetails',
                            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + $("#drpRegion").val() + "",
                            success: function (jsUseData) {
                                jsUseData = eval('(' + jsUseData + ')');
                                jsUseData_g = jsUseData;

                                //To Get the distinct region codes
                                var regionArray = new Array();
                                for (var z = 0; z < jsUseData.Tables[0].Rows.length; z++) {
                                    if ($.inArray(jsUseData.Tables[0].Rows[z].Region_Code, regionArray)) {
                                        regionArray.push(jsUseData.Tables[0].Rows[z].Region_Code);
                                    }
                                }
                                //Remove other region data from the array
                                for (var r = 0; r < regionArray.length; r++) {
                                    if ($("#drpRegion").val() != regionArray[r].toString()) {
                                        jsUseData_g.Tables[0].Rows.remove("Region_Code", regionArray[r].toString())
                                    }
                                }

                                products_g = "";
                                productAutoFill_g = "";
                                if (jsUseData.Tables[0].Rows.length == 0) {
                                    fnBindTable();
                                }
                                else {
                                    fnPrefillUseOfData(jsUseData);
                                }
                                $("#dvButton").css('display', '');
                            }
                        });
                    }
                    });
                }
            }
        });
    }
}

function fnPrefillUseOfData(jsDetailData) {
    //to bind region name in self place
    var regionNam = $("#hdnTreeNode").val().split('_')[1].split('(')[0].toString();

    var tblContent = "";
    var productTblContent = "";
    var noOfmonths = jsDetailData.Tables[1].Rows[0].Month;
    noOfmonths_g = noOfmonths;
    var from = jsDetailData.Tables[1].Rows[0].From_Date;
    var to = jsDetailData.Tables[1].Rows[0].To_Date;


    //Distinct Product
    var productArr = new Array();
    for (var z = 0; z < jsDetailData.Tables[0].Rows.length; z++) {
        var result = include(productArr, jsDetailData.Tables[0].Rows[z].Product_Code);
        if (result === undefined) {
            productArr.push(jsDetailData.Tables[0].Rows[z].Product_Code);
        }
    }
    //Check If region has child region
    var haschild = false;
    var childCount = jsDetailData.Tables[6].Rows[0].Count.toString();

    if (childCount > 0) {
        haschild = true;
    }

    //Generate Table content
    // product Table started
    productTblContent += "<div>";
    productTblContent += "<table width='100%' class='tblTarget' id='tblTargetColumn'>";
    productTblContent += "<thead class='tableth'>";
    productTblContent += "<tr class='tableth'>"
    productTblContent += "<th class='tableth'>Product Name</th>"
    productTblContent += "</tr>"
    productTblContent += "<tr class='tableth'>";
    productTblContent += "<th class='tableth'>&nbsp</th>";
    productTblContent += "</tr>";
    productTblContent += "</thead>";
    productTblContent += "<tbody>";
    for (var i = 0; i < productArr.length; i++) {
        productTblContent += "<tr id='trProduct_" + i + "'>";
        productTblContent += "<td><div><input id='txtProductName_" + i + "'  onblur='fnCreateNewRow(this)' style='width:96%' class='productauto' /><input id='hdnProductCode_" + i + "' type='hidden' /><input id='hdnPrice_" + i + "' type='hidden' /></div></td>";
        productTblContent += "</tr>";
    }
    productTblContent += "</tbody>";
    productTblContent += "</table>";


    productTblContent += "<table style='border:none;width:98%;text-align:right;font-weight:bold'>";
    productTblContent += "<tr>";
    productTblContent += "<td>Total Target Amount (" + regionNam + ")</td>";
    productTblContent += "</tr>";
    productTblContent += "</table>";


    productTblContent += "</div>";
    $("#dvProduct").html(productTblContent);
    //Product table finished

    //Details Start Here

    tblContent += "<div id='tableDiv_Arrays' width='500px !important'>";

    tblContent += "<table id='tblTarget' class='tblTarget' width='100%'>";
    tblContent += "<thead class='tableth'>";
    tblContent += "<tr class='tableth'>"
    //Month Name
    var d = new Date(from);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var current_month = d.getMonth();
    for (var k = 0; k < parseInt(noOfmonths); k++) {
        tblContent += "<th><div class='tableth'><div id='dvMonth_" + k + "'> " + monthNames[current_month] + " - " + d.getFullYear() + " </div><input type='hidden' value='" + d.getFullYear() + "-" + (d.getMonth() + 1) + "' id='hdnMonth_" + k + "' /></div></th>"
        d.setMonth(d.getMonth() + 1);
        current_month = d.getMonth();
    }
    tblContent += "<th><div class='tableth'>Target Total</div></th>"
    tblContent += "<th></th>"//For Delete
    tblContent += "</tr>"
    tblContent += "<tr class='tableth'>";
    for (var k = 0; k < parseInt(noOfmonths); k++) {
        if (haschild) {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
        }
        else {
            tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></div></th>";
        }
    }
    //Target Total
    if (haschild) {
        tblContent += "<th><div style='width:125px;'><div style='float:left;width:60px;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div><div style='float:right;width:60px;' class='tableth'>Team</div></div></th>";
    }
    else {
        tblContent += "<th><div style='width:125px;'><div style='float:left;width:98%;text-align:center;white-space: nowrap' class='tableth'>" + regionNam + "</div></div></th>";
    }
    tblContent += "<th></th>"//For Delete
    tblContent += "</tr>";
    tblContent += "</thead>";
    tblContent += "<tbody>";
    for (var i = 0; i < productArr.length; i++) {
        tblContent += "<tr id='tr_" + i + "'>";
        for (var j = 0; j < parseInt(noOfmonths); j++) {
            if (haschild) {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + i + "' value=N /></div></div></td>";
            }
            else {
                tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='pricecalculate'/><input type='hidden' id='hdnSelf_" + j + "_" + i + "' style='width:96%' /></div><div style='float:right; width:60px;margin-left:4px;display:none' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' disabled/><input type='hidden' id='hdnDetailCode_" + j + "_" + i + "' value=0 /><input type='hidden' id='hdnHistory_" + j + "_" + i + "' value=N /></div></div></td>";
            }
        }
        //Target Total
        if (haschild) {
            tblContent += "<td><div style='width:125px;'><div style='float:left; width:60px;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div></div></td>";
        }
        else {
            tblContent += "<td><div style='width:125px;'><div style='float:left; width:98%;text-align: center;' id='dvSelf_" + j + "_" + i + "'><input id='txtSelf_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div><div style='float:right; width:60px;margin-left:4px;display:none' id='dvTeam_" + j + "_" + i + "'><input id='txtTeam_" + j + "_" + i + "' style='width:96%' class='inputdisabled' value='0' disabled /></div></div></td>";
        }
        tblContent += "<td><div style='width:20px'><span class='delete' id='delete_" + (j + 1) + "_" + i + "' onclick='fnDelete(this)'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/delete_cross.gif' /></span></div></td>" //For Delete
        tblContent += "</tr>";
    }


    tblContent += "</tr>";
    tblContent += "</tbody>";
    tblContent += "</table>";

    tblContent += "<table width='100%' class='tblTarget'>";
    tblContent += "<tr>";
    for (var j = 0; j < parseInt(noOfmonths) + 1; j++) {
        tblContent += "<td><div style='width:125px;' class='amtdiv'><span id='amtspn_" + j + "'>0.00</span></div></td>";
    }
    tblContent += "</tr>";
    if (haschild) {
        tblContent += "<tr>";
        for (var j = 0; j < parseInt(noOfmonths); j++) {

            tblContent += "<td><div style='width:125px;'><input type='button' id='btnFreeze_" + j + "' value='Freeze' style='width:96%' onclick='fnFreeze(this)' class='freezebg'></div></td>";
        }
        tblContent += "</tr>";
    }
    tblContent += "</table>";

    tblContent += "</div>";
    $("#dvTargetDtl").html(tblContent);
    //Details Ends Here

    //Bind Values
    //Product Name
    for (var i = 0; i < productArr.length; i++) {
        var product = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "')]");
        $("#txtProductName_" + i).val(product[0].Product_Name);
        $("#hdnProductCode_" + i).val(product[0].Product_Code);

        //For bind the unit/target sum
        productId = "txtProductName_" + i;
        var rowIndex = productId.split('_')[1].toString();
        var hdnproductCode = productId.replace('txtProductName', 'hdnProductCode');
        var productCode = $("#" + hdnproductCode).val();
        var targetTotal = 0;
        for (var z = 0; z < noOfmonths_g; z++) {
            var hdnmonth = $("#hdnMonth_" + z).val();

            var year = hdnmonth.split('-')[0].toString();
            var month = hdnmonth.split('-')[1].toString();

            //To get team sum
            var sum = jsonPath(jsDetailData, "$.Tables[5].Rows[?(@.Product_Code=='" + productCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "')]");



            if (sum != false && sum.length > 0) {
                if ($("#radInUnit").attr('checked')) {
                    $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Qty);
                    targetTotal += parseFloat(sum[0].Qty);
                }
                else if ($("#radInAmt").attr('checked')) {
                    $("#txtTeam_" + z + "_" + rowIndex).val(sum[0].Amount);
                    targetTotal += parseFloat(sum[0].Amount)
                }
            }
            else {
                $("#txtTeam_" + z + "_" + rowIndex).val(0);
            }

        }
        //To bind target total
        $("#txtTeam_" + noOfmonths_g + "_" + rowIndex).val(parseFloat(targetTotal).toFixed(2));

    }

    //Details - Unit / Amount
    for (var i = 0; i < productArr.length; i++) {
        var product = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "')]");
        for (var x = 0; x < product.length; x++) {
            var targetMonth = product[x].Target_Month;
            var targetUnit = product[x].Target_Qty;
            var targetAmount = product[x].Target_Amount;

            for (var z = 0; z < noOfmonths; z++) {
                var hdnmonth = $("#hdnMonth_" + z).val();

                var year = hdnmonth.split('-')[0].toString();
                var month = hdnmonth.split('-')[1].toString();

                targetMonth = targetMonth.replace(/-/g, '/');

                var target = new Date(targetMonth);
                var targetYear = target.getFullYear();
                var target_Month = target.getMonth() + 1;
                var regionCode = $("#drpRegion").val();

                //To get the details code
                var details = jsonPath(jsDetailData, "$.Tables[0].Rows[?(@.Product_Code=='" + productArr[i].toString() + "' & @.Region_Code=='" + regionCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Target_Code=='" + $('#drpTarget').val() + "')]");

                //To Get History 
                var history = jsonPath(jsDetailData, "$.Tables[7].Rows[?(@.Product_Code=='" + productArr[i].toString() + "' & @.Region_Code=='" + regionCode + "' & @.Month=='" + month + "' & @.Year=='" + year + "' & @.Target_Code=='" + $('#drpTarget').val() + "')]");

                if (year == targetYear && month == target_Month) {
                    //$("#hdnDetailCode_" + z + "_" + i).val(details[0].Target_Detail_Code);
                    if ($("#radInUnit").attr('checked')) {
                        $("#txtSelf_" + z + "_" + i).val(targetUnit);
                        $("#hdnSelf_" + z + "_" + i).val(targetAmount);
                    }
                    else if ($("#radInAmt").attr('checked')) {
                        $("#txtSelf_" + z + "_" + i).val(targetAmount);
                        $("#hdnSelf_" + z + "_" + i).val(targetUnit);
                    }
                }
            }
        }
        //Function to bind price while prefill
        fnPrefillBindPrice(("txtProductName_" + i), jsDetailData);
    }


    //Function to bind unit/amount while prefill target sum...
    fnPrefillBindUnit();

    $(".pricecalculate").blur(function () { fnCalculatePrice(this); });
    $(".pricecalculate").click(function () { self_g = $(this).val(); });
    fnGetTargetProductDetails();

    //Create one default Row
    fnCreateDefault("txtProductName_" + (productArr.length - 1));

}

function fnDelete(obj) {
    var rowIndex = obj.id.split('_')[2].toString();
    var productCode = $("#hdnProductCode_" + rowIndex).val();
    var regionCode = $("#hdnTreeNode").val().split('_')[0].toString();
    var targetCode = $("#drpTarget").val();
    var isUpdate = false;

    //Freezed Month Check For Delete
    var months = "";
    for (var i = 0; i < noOfmonths_g; i++) {
        var detailCode = $("#hdnDetailCode_" + i + "_" + rowIndex + "").val();
        if (detailCode != 0) {
            isUpdate = true;
        }
        if (!$("#txtSelf_" + i + "_" + rowIndex + "").is(":visible")) {
            if ($("#txtTeam_" + i + "_" + rowIndex + "").is(":visible")) {
                var monthName = $("#dvMonth_" + i).html();
                months += monthName + ",";
            }
        }
    }

    if (months != "") {
        fnMsgAlert('error', 'Error', 'You can not delete this product , Target limit(s) for this product is already frozen in ' + months + ' ,If you dont\'t want to allocate target for this month,put 0 (zero) to ignore the product');
        return false;
    }

    if (isUpdate) {
        if (productCode != "") {
            $.msgAlert({
                type: 'warning'
	                , title: 'Delete'
	                , text: 'Do you want to delete this product?'
                    , callback: function () {
                        $.ajax({
                            type: "POST",
                            url: '/Target/DeleteTargetDetails',
                            data: "TargetCode=" + $('#drpTarget').val() + "&RegionCode=" + regionCode + "&ProductCode=" + productCode + "",
                            success: function (result) {
                                fnMsgAlert('success', 'Success', 'Target Detail Deleted Successfully');
                                fnGo();
                            }
                        });
                    }
            });
        }
    }
    else {
        $("#tr_" + rowIndex).fadeOut('slow', function () { });
        $("#trProduct_" + rowIndex).fadeOut('slow', function () { fnReAssignUnits(); });
    }
}


//Function to Bind Unit/Amount values while Delete - Re Assign All the values
function fnReAssignUnits() {
    //Bind Unit/Amount values while prefill
    if ($("#radInUnit").attr('checked')) {
        var targetTbllen = $("#tblTarget tr").length - 2;
        var unit = 0;
        for (var m = 0; m < noOfmonths_g; m++) {
            unit = 0;
            for (var i = 0; i < targetTbllen; i++) {
                if ($("#txtSelf_" + m + "_" + i).is(":visible")) {
                    if ($.trim($("#txtSelf_" + m + "_" + i).val()) != "" && $("#hdnPrice_" + i).val() != "") {
                        var selval = $("#txtSelf_" + m + "_" + i).val();
                        var price = $("#hdnPrice_" + i).val()
                        unit += parseFloat(selval) * parseFloat(price);
                    }
                    $("#amtspn_" + m).html(parseFloat(unit).toFixed(2));
                }
            }
        }

        //Target Total
        var targetunit = 0;
        for (var l = 0; l < targetTbllen; l++) {
            targetunit = 0;
            for (var i = 0; i < parseInt(noOfmonths_g); i++) {
                if ($("#txtSelf_" + i + "_" + l).is(":visible")) {
                    if ($.trim($("#txtSelf_" + i + "_" + l).val()) != "") {
                        var selfval = $("#txtSelf_" + i + "_" + l).val();
                        targetunit += parseFloat(selfval);
                    }
                }
            }
            $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + l).val(targetunit);
        }

        //Final Target Total
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($("#txtSelf_" + noOfmonths_g + "_" + i).is(":visible")) {
                if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                    var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                    var price = $("#hdnPrice_" + i).val();
                    if ($.trim(price) != "") {
                        targetFinalunit += parseFloat(finalTargetselfval) * parseFloat(price);
                    }
                }
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));
    }
    else if ($("#radInAmt").attr('checked')) {
        var targetTbllen = $("#tblTarget tr").length - 2;
        var amount = 0;

        for (var m = 0; m < noOfmonths_g; m++) {
            amount = 0;
            for (var i = 0; i < targetTbllen; i++) {
                if ($("#txtSelf_" + m + "_" + i).is(":visible")) {
                    if ($.trim($("#txtSelf_" + m + "_" + i).val()) != "") {
                        var selval = $("#txtSelf_" + m + "_" + i).val();
                        amount += parseFloat(selval);
                    }
                    $("#amtspn_" + m).html(parseFloat(amount).toFixed(2));
                }
            }
        }

        //Target Total
        var targetTotalamt = 0;
        for (var l = 0; l < targetTbllen; l++) {
            targetTotalamt = 0;
            for (var i = 0; i < parseInt(noOfmonths_g); i++) {
                if ($("#txtSelf_" + i + "_" + l).is(":visible")) {
                    if ($.trim($("#txtSelf_" + i + "_" + l).val()) != "") {
                        var selfval = $("#txtSelf_" + i + "_" + l).val();
                        targetTotalamt += parseFloat(selfval);
                    }
                }
            }
            $("#txtSelf_" + (parseInt(noOfmonths_g)) + "_" + l).val(targetTotalamt);
        }

        //Final total target       
        var targetFinalunit = 0;
        for (var i = 0; i < targetTbllen; i++) {
            if ($("#txtSelf_" + noOfmonths_g + "_" + i).is(":visible")) {
                if ($.trim($("#txtSelf_" + noOfmonths_g + "_" + i).val()) != "") {
                    var finalTargetselfval = $("#txtSelf_" + noOfmonths_g + "_" + i).val();
                    targetFinalunit += parseFloat(finalTargetselfval);
                }
            }
        }
        var targetAmtspnId = $("#amtspn_" + noOfmonths_g).html(parseFloat(targetFinalunit).toFixed(2));
    }
}

function fnHighlightRow(obj) {
    var productlength = $("#tblTargetColumn tr").length - 2;
    for (var i = 0; i < productlength; i++) {
        $("#trProduct_" + i).css('background', 'White');
    }
    var targetTbllen = $("#tblTarget tr").length - 2;
    for (var j = 0; j < targetTbllen; j++) {
        $("#tr_" + j).css('background', 'White');
    }

    $("#" + obj.id.replace('txtProductName', 'trProduct')).css('background', '#EFEFEF');
    $("#" + obj.id.replace('txtProductName', 'tr')).css('background', '#EFEFEF');
    self_g = $("#" + obj.id.replace('txtProductName', 'hdnProductCode')).val();
}

function fnTargetChange() {
    $("#drpRegion").attr('selectedIndex', 0);
    $("#dvProduct").html('');
    $("#dvTargetDtl").html('');
    $("#dvButton").css('display', 'none');
}
function fnSelectTarget() {
    if ($("#hdnTargetCode").val() != "") {
        $("#drpTarget").val($("#hdnTargetCode").val());
        fnGo();
    }
}
//Remove an item from JSON Array
Array.prototype.remove = function (name, value) {
    array = this;
    var rest = $.grep(this, function (item) {
        return (item[name] != value);
    });

    array.length = rest.length;
    $.each(rest, function (n, obj) {
        array[n] = obj;
    });
};