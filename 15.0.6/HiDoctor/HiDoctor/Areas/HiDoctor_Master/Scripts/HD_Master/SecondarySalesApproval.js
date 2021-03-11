

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var Selected_Region_Code = "";
var valid = false;
var product_List;
var product_Name_List = [];
var price_Group = "";
var privilege_List = "";
var Selected_Product_List;
var grid2;
var privilege = "";
var Generated_Date = "";
var rowCount = 1;
var Input_Columns = "";
var Edited_SS_Code = "";
var stockCode = "";
var Compute_Field_Editable = false;
var Purchase_Editable = false;
var Opening_Editable = false;
var arr = [];
var Year = "";
var Month = "";
var final_Insert_Data = [];
var Insert_Mode = "";
var check_ps = "";
var global_variable = "";
var check_Mandatory_Privilege = true;
var lstEnteredProducts = [];
var lstUnMappedProducts = [];
var lstCheckMappedProd = [];
var can_Enter_SS = true;
var double_Entry_Check = true;
var No_decimal = "";
var selectedregionStockiestDet_g = "";
var totalssdetailsformonth_g = "";
var seletedregionCode = "";
var selectionOrLoad_g = "";
var ssEnabledVersion = "V0";
var G_Lock_Status = "";
var perodicLock = "Yes";
var g_perodiclock = "";
var secondarySalesApproval = {
    defaults: {

    },
    Init: function () {
        debugger;
        perodicLock = fnGetPrivilegeValue("SS_PERIODIC_LOCK", "NO");
        ssEnabledVersion = fnGetPrivilegeValue("SS_ENABLED_VERSION", "");

    },
    fnGetRegionsBasedOnInputs: function () {
        debugger;
        $.blockUI();
        seletedregionCode = "";
        var result = secondarySalesApproval._fnValdiateInputs();
        if (result) {
            $('#dvRightPanel').hide();
            $('#dvSecondarySalesEntry').hide();
            $('#btnSSApprove').prop('disabled', false);
            $('#btnSSUnApprove').prop('disabled', false);
            //var regionCode = $('')
            var InputYearMonth = $("#txtMonth").val();
            var month = secondarySalesApproval._fnGetMonth(InputYearMonth.split('-')[0]);
            var year = InputYearMonth.split('-')[1];
            var status = $('#ddlStatus :selected').val();
            status_g = $('#ddlStatus :selected').val();
            var regionSelection = $('#ddlReportingRegions :selected').val();
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/Approval/GetRegionsWithUserDetails",
                data: "regionCode=" + currentRegionCode_g + "&month=" + month + "&year=" + year + "&status=" + status + "&regionSelection=" + regionSelection,
                success: function (data) {
                    secondarySalesApproval.fnTotalSSGrid(currentRegionCode_g, "0");
                    //selectedregionStockiestDet_g = resp;
                    secondarySalesApproval.fnBindRegionTree(data);
                    $('#dvGrid').html("");
                    $.unblockUI();
                },
                complete: function (e) {
                    $.unblockUI();
                }
            });
        }
    },
    //regionlsttype
    fnBindRegionTree: function (data) {
        debugger;
        var content = "";
        regionList_g = data;
        var regionCodeArr = [];
        var Status = $('#ddlStatus :selected').val();
        for (var l = 0; l < data.length; l++) {
            if (regionCodeArr.indexOf(data[l].Region_Code) == -1) {
                regionCodeArr.push(data[l].Region_Code);
            }
        }
        if (regionCodeArr.length > 0) {
            for (var i = 0; i < regionCodeArr.length; i++) {
                var disjson = $.grep(regionList_g, function (ele, index) {
                    return ele.Region_Code == regionCodeArr[i];
                });
                var username = "";
                if (disjson.length > 0) {
                    for (var k = 0; k < disjson.length; k++) {
                        username += disjson[k].User_Name + '(' + disjson[k].User_Type_Name + ')';
                        if (k < disjson.length - 1) {
                            username += ',';
                        }
                    }
                }
                if (username != "" && username != undefined && username != null) {
                    content += '<a href="#" id="regionlnk_' + i + '" class="regionlinks" onclick="secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(\'' + regionCodeArr[i] + '\',\'' + Status + '\')">' + disjson[0].Region_Name + '(' + disjson[0].Region_Type_Name + ')' + '-' + username + '</a></br>';
                }
            }
            $('#divUserInfo').html(content);
            $('#tree').show();
            if (Status == "2" || Status == "0") {

                $("#dv-buttons").hide();
                $("#CustomerConflictedBody").hide();
            }
        } else {
            content = 'No Record(s) Found.';
            $('#divUserInfo').html(content);
            $('#tree').show();
            $("#dv-buttons").hide();
            $("#CustomerConflictedBody").hide();
        }
    },
    fnOpenTree: function () {
        // debugger;
        $("#dvTPMonth").slideUp();
        $("#imggr").hide();
        $("#imgless").show();
        $('#rightNav').removeClass('col-lg-12');
        $('#rightNav').addClass('col-lg-8');
        $('#rightNav').removeClass('col-xs-12');
        $('#rightNav').addClass('col-xs-8');
        $('#leftNav').show();
        $('#spnTreeToggleOpen').hide();
        $('#spnTreeToggleClose').show();
        CustomerApproval.fnFixedcolum(2);
        //$('#dataDiv').removeClass('col-lg-9');
        //$('.dvsalebox').removeClass('col-lg-12');
        //$('.dvsalebox').addClass('col-lg-12');
        //$('#dataDiv').removeClass('adjustsalebox');
    },

    fnCloseTree: function () {
        // debugger;
        $("#dvTPMonth").slideUp();
        $("#imggr").show();
        $("#imgless").hide();
        $('#rightNav').removeClass('col-lg-8');
        $('#rightNav').addClass('col-lg-12');
        $('#rightNav').removeClass('col-xs-8');
        $('#rightNav').addClass('col-xs-12');
        $('#leftNav').hide();
        $('#spnTreeToggleOpen').show();
        $('#spnTreeToggleClose').hide();
        secondarySalesApproval.fnFixedcolum(2);
        //$('#dataDiv').removeClass('col-lg-9');
        //$('.dvsalebox').removeClass('col-lg-12');
        //$('.dvsalebox').addClass('col-lg-12');
        //$('#dataDiv').removeClass('adjustsalebox');
    },
    fnFixedcolum: function (ColumnCount) {
        $('.maintable thead').css("width", $(".table-body").width());
        $('.maintable tbody').css("width", $(".table-body").width());
        $('.tblcollapse tbody').css("width", "fit-content");
        $('#reportRegion').css("width", $(".maintable thead").width());
        var fixcol = 0;
        while (ColumnCount > fixcol) {
            fixcol++;
            //header coumn.
            $('.maintable thead th:nth-child(' + fixcol + ')').css("position", "relative");
            $('.maintable thead th:nth-child(' + fixcol + ')').css("background-color", "#337ab7");
            $('.maintable tbody th:nth-child(' + fixcol + ')').css("border", "none");

            //row column.
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("position", "relative");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("height", "40px");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("background-color", "#ebf2fa");
            $('.maintable tbody tr.dynaSSPop td:nth-child(' + fixcol + ')').css("background-color", "#f1f1f1");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("overflow-wrap", "break-word");
            $('#bodytable tbody').on('scroll', function (e) {
                $('#headertable thead').css("left", -$("#bodytable tbody").scrollLeft());
                for (var i = 1; i <= fixcol; i++) {
                    $('#headertable thead th:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                    $('#bodytable tbody td:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                    $('thead .second_header_row th:nth-child(' + i + ')').css("position", "initial");
                }
            });
        }
        $(window).resize(function () {
            if ($(".table-body").width() < 1336) {
                $('.maintable thead').css("width", $(".table-body").width());
                $('.maintable tbody').css("width", $(".table-body").width());
                $('.tblcollapse tbody').css("width", "fit-content");
            }
            else {
                $('.maintable thead').css("width", $(".table-body").width());
                $('.maintable tbody').css("width", $(".table-body").width());
                $('.tblcollapse tbody').css("width", "fit-content");
            }
        });
        $(".table-body").on('scroll', function () {
            debugger;
            $(".table-header").offset({ left: -1 * this.scrollLeft });
        });
    },

    fnTotalSSGrid: function (value, flag) {
        debugger;
        $.blockUI();
        var InputYearMonth = $("#txtMonth").val();
        var month = secondarySalesApproval._fnGetMonth(InputYearMonth.split('-')[0]);
        var year = InputYearMonth.split('-')[1];
        var status = $('#ddlStatus :selected').val();
        status_g = $('#ddlStatus :selected').val();
        var Mode = $('#ddlReportingRegions :selected').val();
        selectionOrLoad_g = flag;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/Approval/GetTotalSSDetailsForMonth",
            data: "regionCode=" + value + "&month=" + month + "&year=" + year + "&status=" + status + "&Mode=" + Mode + "&selectionOrLoad=" + flag,
            success: function (resp) {
                totalssdetailsformonth_g = resp;
                secondarySalesApproval._fnTotalSSDetailsHTML(resp);
            },
            complete: function (e) {
                $.unblockUI();
            }
        });
    },
    _fnTotalSSDetailsHTML: function (resp) {
        debugger;
        var content = "";

        content += "<table class='table table-striped'>";
        content += "<thead>";
        content += "<tr>";
        //content += "<th><input type='checkbox' id='bulkSScheckDetails' name='chkSSSelectS' onclick='secondarySalesApproval._fnSSDetailsSelectAll()'/></th>";
        //content += "<th class='apprv' id='apprvid'>Approve</th>";
        //content += "<th class='unapprv' id='unapprvid'>Unapprove</th>";
        content += "<th>Applied</th>";
        content += "<th>Approved</th>";
        content += "<th>Draft</th>";
        content += "<th>UnApproved</th>";
        content += "<th>Total</th>";
        content += "<th>Month</th>";
        content += "<th>Year</th>";
        content += "</tr></thead><tbody>";

        if (resp.length > 0 && resp != "NO") {
            for (var i = 0; i < resp.length; i++) {
                content += "<tr>";
                content += "<td>" + resp[i].Total_Applied_Count + "</td>";
                content += "<td>" + resp[i].Total_Approved_Count + "</td>";
                content += "<td>" + resp[i].Total_Draft_Count + "</td>";
                content += "<td>" + resp[i].Total_Unapproved_Count + "</td>";
                content += "<td>" + resp[i].Total_Count + "</td>";
                var month = secondarySalesApproval._fnGetMonthName(resp[i].Month)
                content += "<td>" + month + "</td>";
                content += "<td>" + resp[i].Year + "</td>";
                content += "</tr>";
            }

        } //}
        //else {
        //    content += "<tr style='text-align:center;font-weight:bold;'><td colspan='7'>No Record(s) Found.</td></tr>";
        //}
        $('#dvssGrid').html(content);
        $('#ssdetails').show();
        $('#ddToggle').show();
    },
    fnResetDetails: function () {
        $("#CustomerConflictedBody").hide();
        $("#dv-buttons").hide();
        secondarySalesApproval.fnTotalSSGrid(currentRegionCode_g, "0");
    },
    ShowDetails: function (statusVal) {
        debugger;
        var selectdMonth_lcl = $('#txtMonth').val();
        var month = secondarySalesApproval._fnGetMonth(selectdMonth_lcl.split('-')[0]);
        var year = selectdMonth_lcl.split('-')[1];
        status_g = $('#ddlStatus :selected').val();
        var Mode = $('#ddlReportingRegions :selected').val();
        // $('#SSSDate').html(disjson[0].SS_Statement_Date);
        $.ajax({
            type: 'GET',
            url: "../HiDoctor_Master/Approval/GetSSDetailsView",
            data: "regionCode=" + (seletedregionCode == "" ? currentRegionCode_g : seletedregionCode) + "&month=" + month + "&year=" + year + "&status=" + statusVal + "&Mode=" + Mode + "&selectionOrLoad=" + selectionOrLoad_g,
            success: function (resp) {
                secondarySalesApproval.fnDetailedView(resp);
            },
            complete: function (e) {
                $.unblockUI();
            }
        });
    },
    fnDetailedView: function (resp) {
        debugger;
        var content = "";
        content += "<table class='table table-striped'>";
        content += "<thead>";
        content += "<tr>";
        content += "<th>Stockist Name</th>";
        content += "<th>Month</th>";
        content += "<th>Year</th>";
        content += "<th>Statement Date</th>";
        content += "<th>Entered By</th>";
        content += "<th>Action By</th>";
        content += "<th>Approved Date</th>"
        content += "<th>Status</th>"
        content += "</tr></thead><tbody style='text-align:center;'>";
        if (resp.length > 0 && resp != "NO") {
            for (var i = 0; i < resp.length; i++) {
                content += "<tr>";
                content += "<td>" + resp[i].Stockist_Name + "</td>";
                content += "<td>" + resp[i].Month + "</td>";
                content += "<td>" + resp[i].Year + "</td>";
                content += "<td>" + resp[i].SS_Statement_Date + "</td>";
                content += "<td>" + resp[i].Entered_By + "</td>";
                content += "<td>" + resp[i].Approved_By + "</td>";
                content += "<td>" + resp[i].Approved_Date + "</td>";
                content += "<td>" + resp[i].Status_Name + "</td>";
                content += "</tr>";
            }
        }
        else {
            content += "<tr style='text-align:center;font-weight:bold;'><td colspan='8'>No Record(s) Found.</td></tr>";
        }
        $("#salesStatusData").html(content);
        $('#myModalView').modal('show');

    },

    //fnGetUsersinaRegion: function (data) {
    //    debugger;
    //    var regionCode = "";
    //    $.ajax({
    //        type: "GET",
    //        url: "../HiDoctor_Master/Approval/GetUserinaRegion",
    //        data: "regionCode=" + regionCode,
    //        success: function (data) {
    //            //selectedregionStockiestDet_g = resp;
    //            //secondarySalesApproval.fnBindRegionTree(data);
    //            if (data.list.length > 1) {
    //                for (var i = 0; i < data.list.length; i++) {
    //                    content += '<input  type="radio" name="selsingluser" id="radiouser' + i + '" (\'' + data.list[i].Region_Code + '\',\'' + data.list[i].User_Code + '\',\'' + data.list[i].User_Type_Code + '\');">' + data.list[i].Region_Name + '(' + data.list[i].Region_Type_Name + ')' + '-' + data.list[i].User_Name + '(' + data.list[i].User_Type_Name + ')<br>';
    //                } 
    //                if (content != "") {
    //                    $('#UserListBody').html(content)
    //                    $('#UserList').show('modal');
    //                }
    //            }
    //            else {
    //                content = 'No Record(s) Found.'
    //            }
    //        },
    //        complete: function (e) {
    //            $.unblockUI();
    //        }
    //    })
    //},



    _getSecondarySalesDetailsForSelectedMonth: function (regionCode, status) {
        debugger;
        seletedregionCode = regionCode;
        var result = secondarySalesApproval._fnValdiateInputs();
        if (result) {
            $('#dvSecondarySalesEntry').hide();
            $('#btnSSApprove').prop('disabled', false);
            $('#btnSSUnApprove').prop('disabled', false);
            $.blockUI();
            secondarySalesApproval.fnTotalSSGrid(regionCode, "-1");
            var InputYearMonth = $("#txtMonth").val();
            var month = secondarySalesApproval._fnGetMonth(InputYearMonth.split('-')[0]);
            var year = InputYearMonth.split('-')[1];
            var status = $("#ddlStatus option:selected").val();
            // var ReportingRegions = $("#ddlReportingRegions").val();
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/Approval/GetSSDetailsForAMonth",
                data: "regionCode=" + regionCode + "&month=" + month + "&year=" + year + "&status=" + status + "&Currentregcode=" + currentRegionCode_g,
                success: function (resp) {
                    selectedregionStockiestDet_g = resp;
                    secondarySalesApproval._fnBindSSDetailsHTML(resp);
                },
                complete: function (e) {
                    $.unblockUI();
                }
            });
        }
    },

    _fnBindSSDetailsHTML: function (resp) {
        debugger;
        var content = "";

        content += "<table class='table table-striped'>";
        content += "<thead>";
        content += "<tr>";
        content += "<th><input type='checkbox' id='bulkSScheckDetails' name='chkSSSelectS' onclick='secondarySalesApproval._fnSSDetailsSelectAll()'/></th>";
        //content += "<th class='apprv' id='apprvid'>Approve</th>";
        //content += "<th class='unapprv' id='unapprvid'>Unapprove</th>";
        if (ssEnabledVersion.toUpperCase() == "V1") {
            content += "<th>Edit</th>";
        }
        content += "<th>Remarks</th>";
        content += "<th>Region Name</th>";
        content += "<th>User Name</th>";
        content += "<th>Stockiest Name</th>";
        content += "<th>Month</th>";
        content += "<th>Year</th>";
        content += "<th>Statement Date</th>";
        content += "<th>View</th>";
        content += "<th>History</th>";
        content += "<th>Status</th>";
        content += "<th>Attachment</th>"

        content += "</tr></thead><tbody>";

        if (resp.length > 0 && resp != "NO") {

            for (var i = 0; i < resp.length; i++) {


                content += "<tr>";
                //if (resp[i].Lock_Status == 1) {
                if (resp[i].SS_Status == "APPLIED") {


                    var approveStatus = 2;
                    var unapproveStatus = 0;
                    g_perodiclock = resp[0].Privilege_Value;
                    G_Lock_Status = resp[0].Lock_Status;
                    content += "<td><input type='checkbox' id='bulkSScheckDetails_" + i + "' name='chkSSSelect' /></td>";
                    //content += "<td class='td-a apprv'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_approve.png' onclick='secondarySalesApproval.fnSSsingleApproveStatus(\"" + resp[i].Region_Code + "\",\"" + resp[i].SS_Code + "\",\"" + resp[i].Base_Code + "\",\"" + approveStatus + "\",\"" + i + "\");'></td>";
                    //content += "<td class='td-a unapprv'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/tpapp_unapprove.png' onclick='secondarySalesApproval.fnSSsingleApproveStatus(\"" + resp[i].Region_Code + "\",\"" + resp[i].SS_Code + "\",\"" + resp[i].Base_Code + "\",\"" + unapproveStatus + "\",\"" + i + "\");'></td>";
                } else {
                    //swal('Info', 'Secondary sales details locked', 'info');
                    //return false;
                    content += "<td></td>";
                    //content += "<td></td>";
                    //content += "<td></td>";
                }

                if (ssEnabledVersion.toUpperCase() == "V1") {
                    if (resp[i].SS_Status == "APPLIED" && G_Lock_Status == 1 && g_perodiclock == 1 || g_perodiclock == 0) {



                        content += "<td><span onclick='secondarysalesApprovalEdit.init(\"" + resp[i].SS_Code + "\",\"" + resp[i].Base_Code + "\",\"" + resp[i].SS_Statement_Date + "\",\"" + resp[i].Year + "\",\"" + resp[i].Month + "\")' style='text-decoration:underline;cursor:pointer'>Edit</span></td>";
                    }


                    else {
                        content += "<td>Edit</td>";
                    }

                }

                // content += "<td><span onclick='secondarySalesApproval.fnEdit(\"" + resp[i].Region_Code + "|" + resp[i].SS_Code + "\")' style='text-decoration:underline;cursor:pointer'>Edit</span></td>";
                content += "<input type='hidden' id='hdnApprovlDetails_" + i + "' value='" + resp[i].Region_Code + "|" + resp[i].SS_Code + "|" + resp[i].SS_Status + "|" + resp[i].Month + "|" + resp[i].Year + "|" + resp[i].User_Code + "|" + resp[i].Base_Code + "|" + resp[i].Customer_Name + "'/><input type='hidden' id='hdnIsonlyApprovable_" + i + "' value='" + resp[i].IsOnlyApprovable + "'/></td>";
                content += "<td><textarea rows='2' cols='15' maxlength='500' style='width:100%;resize:none;' id='txtRemarks_" + i + "'/></td>";
                content += "<td>" + resp[i].Region_Name + "</td>";
                content += "<td>" + resp[i].User_Name + "</td>";
                content += "<td>" + resp[i].Customer_Name + "</td>";
                var month = secondarySalesApproval._fnGetMonthName(resp[i].Month)
                content += "<td>" + month + "</td>";
                content += "<td>" + resp[i].Year + "</td>";
                content += "<td>" + resp[i].SS_Statement_Date + "</td>";
                content += "<td><span onclick='secondarySalesApproval._fnReportSSTwo(\"" + resp[i].Region_Code + "|" + resp[i].SS_Code + "|" + resp[i].SS_Status + "|" + resp[i].Month + "|" + resp[i].Year + "|" + resp[i].User_Code + "|" + resp[i].Base_Code + "|" + resp[i].Customer_Name + "|" + resp[i].SS_Statement_Date + "\")' style='text-decoration:underline;cursor:pointer'>View</span></td>";
                content += "<td><span onclick='secondarySalesApproval._fnViewRemarksHistory(\"" + resp[i].Region_Code + "|" + resp[i].SS_Code + "\")' style='text-decoration:underline;cursor:pointer'>View History</span></td>";
                var result = secondarySalesApproval._fnGetColorCode(resp[i].SS_Status);
                content += "<td " + result + ">" + resp[i].SS_Status + "</td>";
                if (resp[i].Attachments != null && resp[i].Attachments != "") {
                    //var uri = resp[i].Attachments;
                    //var extension = uri.split(".").pop();
                    content += "<td>";
                    // if (extension == "pdf" || extension == "PDF" || extension == "xlsx" || extension == "xls" || extension == "docx" ||  extension == "zip" || extension == "jpg" || extension == "png") {
                    content += '<a href="' + resp[i].Attachments + '" download="">download</a>';
                    // }
                    //else {
                    //    content += " <span onclick='secondarySalesApproval._fnAttachment(\"" + resp[i].Attachments + "\")' style='text-decoration:underline;cursor:pointer'>View Attachment</span>";
                    //}
                    content += "</td>";
                }
                else {
                    content += "<td></td>";
                }

                //}
                //else {
                //    swal('Info', 'Secondary sales details locked', 'info');
                //}
                content += "</tr>";
            }




        }

        else {
            content += "<tr style='text-align:center;font-weight:bold;'><td colspan='13'>No Record(s) Found.</td></tr>";
        }
        //}

        content += "</tbody></table>";
        var title = "List of user(s) who have submitted the Secondary sales details for the month of <b>< " + $("#txtMonth").val() + " ></b> which is in <b>< " + $("#ddlStatus option:selected").text() + " ></b> Mode <br>";
        $('#dvGrid').html(title + content);
        $("#CustomerConflictedBody").show();
        $('#dvGridlegent').html("Approved and Unapproved button show only for applied secondary sales records");
        $('#dvSSDetails').html("");
        var status = $("#ddlStatus option:selected").val();
        var Lock_Status = "";

        //var resp;

        if (g_perodiclock == 1 && G_Lock_Status == 0) {

            $("#dv-buttons").hide();

            swal('Info', 'You cannot Approve or Unapprove the secondary sales data,since it has been locked.Kindly contact Salesadmin to Release the lock.', 'info')
            return false;

        }
            //}
        else {
            $("#dv-buttons").show();

        }

        //else {
        //     if (status == 1) {
        //         $("#dv-buttons").show();
        //     }



        //if (SS_Periodic_Lock = true) {
        //if (G_Lock_Status == "0" && status == 1) {

        //    swal('Info', 'Secondary sales details locked', 'info');
        //    $("#dv-buttons").hide();

        //} else {
        //    $("#dv-buttons").show();
        //    //$("#dv-buttons").hide();
        //}
        //    }
    },

    fnSSsingleApproveStatus: function (regionCode, ssCode, baseCode, status, rowId) {
        debugger;

        //var regioncode = '';
        var Status = status;
        var remarks = "";
        //var baseCode = '';
        //var ssCode = '';
        //var updatedBy = '';
        var Lock_Status = "";
        var remarks = $('#txtRemarks_' + rowId).val();
        //remarks = $('#txtReason').val();
        remarks = $.trim(remarks);

        //if (Lock_Status == "0" ) {
        //    //fnMsgAlert('info', 'Secondary sales Details locked.', 'please enter the remarks.');
        //    return false;
        //}

        if (status == "0" && remarks == "") {
            fnMsgAlert('info', 'Secondary sales approval.', 'please enter the remarks.');
            return false;
        }

        if ($.trim(remarks) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
            if (!specialCharregex.test(remarks)) {
                fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');
                return false;
            }
        }
        $.blockUI();
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/Approval/SingleApproveorUnapprove",
            data: "regionCode=" + regionCode + "&status=" + Status + "&baseCode=" + baseCode + "&ssCode=" + ssCode + "&remarks=" + remarks,
            success: function (resp) {
                if (resp == "True") {
                    if (Status == 0) {
                        fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales record is  Un-Approved Successfully.');
                        var status = $("#ddlStatus option:selected").val();
                        secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode);
                        secondarySalesApproval._fnBindSSDetailsHTML(resp);
                        return false;
                    } else {
                        fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales record is Approved Successfully.');
                        secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode);
                        secondarySalesApproval._fnBindSSDetailsHTML(resp);
                        return false;
                    }

                }
            },
            complete: function (e) {
                $.unblockUI();
            }
        });


    },
    //fnSSsingleUnApproveStatus: function (regionCode) {
    //    debugger;
    //    var regioncode = '';
    //},
    _fnGetColorCode: function (status) {
        var style = '';
        switch (status.toUpperCase()) {
            case "APPROVED":
                style = "style=color:white;background-color:darkgreen";
                break;
            case "APPLIED":
                style = "style=color:white;background-color:DodgerBlue";
                break;
            case "UNAPPROVED":
                style = "style=color:white;background-color:crimson";
                break;
            case "DRAFT":
                style = "style=color:white;background-color:pink";
                break;
            default:
                style = "";
                break;
        }
        return style;
    },

    _fnGetMonth: function (month) {
        var MonthNum = '';
        if (month.toUpperCase() == "JAN") {
            MonthNum = 1;
        } else if (month.toUpperCase() == "FEB") {
            MonthNum = 2;
        } else if (month.toUpperCase() == "MAR") {
            MonthNum = 3;
        } else if (month.toUpperCase() == "APR") {
            MonthNum = 4;
        } else if (month.toUpperCase() == "MAY") {
            MonthNum = 5;
        } else if (month.toUpperCase() == "JUN") {
            MonthNum = 6;
        } else if (month.toUpperCase() == "JUL") {
            MonthNum = 7;
        } else if (month.toUpperCase() == "AUG") {
            MonthNum = 8;
        } else if (month.toUpperCase() == "SEP") {
            MonthNum = 9;
        } else if (month.toUpperCase() == "OCT") {
            MonthNum = 10;
        } else if (month.toUpperCase() == "NOV") {
            MonthNum = 11;
        } else if (month.toUpperCase() == "DEC") {
            MonthNum = 12;
        }
        return MonthNum;
    },

    _fnGetMonthName: function (month) {
        var MonthNum = '';
        if (month == "1") {
            MonthNum = "JANUARY";
        } else if (month == "2") {
            MonthNum = "FEBRUARY";
        } else if (month == "3") {
            MonthNum = "MARCH";
        } else if (month == "4") {
            MonthNum = "APRIL";
        } else if (month == "5") {
            MonthNum = "MAY";
        } else if (month == "6") {
            MonthNum = "JUNE";
        } else if (month == "7") {
            MonthNum = "JULY";
        } else if (month == "8") {
            MonthNum = "AUGUST";
        } else if (month == "9") {
            MonthNum = "SEPTEMBER";
        } else if (month == "10") {
            MonthNum = "OCTOBER";
        } else if (month == "11") {
            MonthNum = "NOVEMBER";
        } else if (month == "12") {
            MonthNum = "DECEMBER";
        }
        return MonthNum;
    },

    _fnValdiateInputs: function () {
        debugger;
        var flag = true;
        if ($("#txtMonth").val() == "") {
            fnMsgAlert('info', 'Secondary Sales Approval', 'Select month and year');
            flag = false;
            $.unblockUI();
            return;
        }
        var status = $("#ddlStatus option:selected").val();
        if (status.toUpperCase() == "MODE") {
            fnMsgAlert('info', 'Secondary Sales Approval', 'Select secondary sales status');
            flag = false;
            $.unblockUI();
            return;
        }
        //return flag;
        var ReportingRegions = $("#ddlReportingRegions option:selected").val();
        if (ReportingRegions.toUpperCase() == "REPORTING REGIONS") {
            fnMsgAlert('info', 'Secondary Sales Approval', 'Select the Reporting Region');
            flag = false;
            $.unblockUI();
            return;
        }
        return flag;
    },

    _fnSSDetailsSelectAll: function () {
        debugger;
        if ($('#bulkSScheckDetails').is(":checked")) {
            $("input:checkbox[name=chkSSSelect]").attr('checked', 'checked');
        }
        else {
            $("input:checkbox[name=chkSSSelect]").removeAttr('checked');
        }
    },
    fnEdit: function (regionCode, ssCode) {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/Approval/GetSSDetailsForEdit",
            data: "regionCode=" + regionCode + "&ssCode=" + ssCode,
            success: function (resp) {
                secondarySalesApproval._fnBindEditSSDetailsHTML(resp);
            }
        })


    },
    _fnBindEditSSDetailsHTML: function (resp) {
        debugger;
        secondarySalesApproval.fnCloseTree();
        if (resp != null) {

            $('#dvEditGrid').show();
            $('#StkstName').html(resp.listheader[0].Customer_Name);
            $('#MnthYr').html(resp.listheader[0].Customer_Name);
            $('#stDate').html(resp.listheader[0].SS_Statement_Date);
            $('#status').html(resp.listheader[0].SS_Status);
        }
        else {
            $('#dvEditGrid').show();


        }
    },
    fnSecondarySalesBulkApproval: function (status) {
        debugger;
        var details = "";
        var remarks = "";
        var ApprvlArr = [];
        var selectedMonth = secondarySalesApproval._fnGetMonth($("#txtMonth").val().split('-')[0]);
        var selectedYear = $("#txtMonth").val().split('-')[1];
        var currentStatus = $('#hdnStatus').val();
        if (secondarySalesApproval.fnValidateSecondarySales(status)) {

            $("input:checkbox[name=chkSSSelect]").each(function () {
                debugger;
                if (this.checked) {
                    debugger;
                    var id = this.id;
                    var idval = id.split('_')[1];
                    var det = $("#hdnApprovlDetails_" + idval).val();
                    var ObjApprvl = {
                        Region_Code: det.split('|')[0],
                        SS_Code: det.split('|')[1],
                        SS_Status: det.split('|')[2],
                        Month: det.split('|')[3],
                        Year: det.split('|')[4],
                        User_Code: det.split('|')[5],
                        Base_Code: det.split('|')[6],
                        Base_Name: det.split('|')[7],
                        Remarks: $("#txtRemarks_" + idval).val()
                    };
                    ApprvlArr.push(ObjApprvl);
                }
            });

            debugger;

            try {
                $.ajax({
                    type: "POST",
                    url: '/HiDoctor_Master/Approval/UpdateSecondarySalesStatus',
                    data: JSON.stringify({ "lstApprvDet": ApprvlArr, "status": status }),
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        debugger;
                        if (response == "True") {
                            if (status == 0) {
                                fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales records are Un-Approved Successfully.');
                                secondarySalesApproval.fnGetRegionsBasedOnInputs();
                                secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode);
                                //secondarySalesApproval._fnBindSSDetailsHTML(resp);
                                return false;
                            } else {
                                fnMsgAlert('success', 'Secondary Sales Approval', 'The selected Secondary Sales records are Approved Successfully.');
                                secondarySalesApproval.fnGetRegionsBasedOnInputs();
                                secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode);
                                //secondarySalesApproval._fnBindSSDetailsHTML(resp);
                                return false;
                            }

                        }

                    },
                    error: function (e) {
                        if (status == 0) {
                            fnMsgAlert('error', 'Secondary Sales Approval', 'Failed to Un-Approve the selected Secondary Sales records.Please try after sometime.');
                            return false;
                        } else {
                            fnMsgAlert('error', 'Secondary Sales Approval', 'Failed to Approve the selected Secondary Sales records.Please try after sometime.');
                            return false;
                        }

                    }
                });
            }
            catch (e) {
                fnMsgAlert('error', 'Error', e.message);
                $("#divDates").hide();
                return false;
            }
        }
    },



    fnValidateSecondarySales: function (status) {
        var flag = false;
        var remarks = "";
        var currentStatus = "";
        var isResult = true;

        $("input:checkbox[name=chkSSSelect]").each(function () {
            if (this.checked) {
                debugger;
                var id = this.id;
                var idval = id.split('_')[1];
                flag = true;
                remarks = $("#txtRemarks_" + idval).val();
                if (status == "0") {
                    if ($.trim(remarks).length == 0 || remarks == null) {
                        fnMsgAlert('info', 'Info', 'Please enter remarks');
                        isResult = false;
                        return false;
                    }
                }

                if ($.trim(remarks) != "") {
                    var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
                    if (!specialCharregex.test(remarks)) {
                        fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');
                        isResult = false;
                        return false;
                    }
                }
                if (status == "0") {
                    if ($("#txtRemarks_" + idval).val() == "" && $("#txtRemarks_" + idval).val() == null && $("#txtRemarks_" + idval).val() == undefined) {
                        fnMsgAlert('info', 'Secondary Sales Approval', 'Remarks is Mandatory for UnApproval.');
                        isResult = false;
                        return false;
                    }
                    if ($('#hdnIsonlyApprovable_' + idval).val() == 1) {
                        fnMsgAlert('info', 'Secondary Sales Approval', 'Secondary Sales Edited at Approval Level cannot be UnApproved.');
                        isResult = false;
                        return false;
                    }
                }


                if (status == "2") {
                    currentStatus = $("#hdnApprovlDetails_" + idval).val().split('|')[2];
                    if (currentStatus.toUpperCase() == "APPROVED") {
                        fnMsgAlert('info', 'Info', 'You cannot Approve the Approved Secondary Sales.');
                        isResult = false
                        return false;
                    }
                }
            }
            if (!isResult) {
                return isResult;
            }
        });
        if (!flag) {
            fnMsgAlert('info', 'Info', 'Please select atleast one Secondary Sales.');
            isResult = false;
            return false;
        }

        return isResult;
    },

    _fnReportSSTwo: function (details) {
        debugger;
        $("#hdnApprovalTwo").val(' ')
        $("#dvReportTwo").html('');
        $("#dvReportTwo").hide();
        $("#divHeader").show();
        $('#txtReason').val('');
        $("#hdnApprovalTwo").val(details);
        var status = $('#hdnStatus').val();
        var title = "";
        var testdetails = details.split('|');
        var newdet = testdetails[0] + '_' + testdetails[3] + '_' + testdetails[4] + '_' + testdetails[1] + '_' + testdetails[8];

        var disjson = $.grep(selectedregionStockiestDet_g, function (ele, index) {
            return ele.SS_Code == testdetails[1];
        });
        var StockName = disjson[0].Customer_Name;
        if (StockName != "" && StockName != undefined) {
            $('#SckstName').html(StockName);
        }
        var selectdMonth_lcl = $('#txtMonth').val();
        var month = selectdMonth_lcl.split('-')[0];
        var year = selectdMonth_lcl.split('-')[1];
        $('#monthSS').html(month);
        $('#yearSS').html(year);
        $('#SSSDate').html(disjson[0].SS_Statement_Date);
        $.ajax({
            type: 'POST',
            url: '../HiDoctor_Activity/SecondarySales/GetSSDetailsForSelectedRecord',
            data: 'userCodeDetails=' + newdet,
            success: function (response) {
                secondarySalesApproval.fnBindSSDetailedView(response);
                $("#dvLoading").hide();
            },
            complete: function () {
                $('#mymodal').modal('show');
                secondarySalesApproval.fnFixedcolum(2);
            }

        });
    },

    fnBindSSDetailedView: function (resp) {
        debugger;

        var tableContent = "";
        tableContent += '<div id="parent" class="parentDiv">';
        tableContent += ' <div class="divHead table-header ">';
        tableContent += '<table class="table table-bordered maintable" id="headertable" style="width: 0%; margin-bottom: 0px;border: 0px solid #ddd;">';
        tableContent += '<thead>';
        tableContent += "<tr>";
        tableContent += "<th class='col1'>Action</th>";
        tableContent += "<th class='col2'>Product Name</th>";
        tableContent += "<th class='col1'>Price per Unit</th>";
        tableContent += "<th class='col1'>Opening Balance</th>";
        tableContent += " <th class='col1'>Purchase</th>";
        tableContent += " <th class='col1'>Purchase Return</th>";
        tableContent += " <th class='col1'>Sales</th>";
        tableContent += " <th class='col1'>Sales Amount</th>";
        tableContent += " <th class='col1'>Sales Return</th>";
        tableContent += " <th class='col1'>Closing Balance</th>";
        tableContent += " <th class='col1'>Closing Amount</th>";
        tableContent += " <th class='col1'>Transit</th>";
        tableContent += " <th class='col1'> Free Goods</th>";
        tableContent += " <th class='col1'>Damaged Goods</th>";
        tableContent += " <th class='col1'>Expired Goods</th>";
        tableContent += " <th class='col1'> Remarks</th>";
        tableContent += "</tr></thead></table>";
        tableContent += "</div>";

        tableContent += '<div class="table-body" style="font-size:12px;">';
        tableContent += '<table class="table table-bordered maintable" id="bodytable" style="width: 0%; margin-bottom: 0px;border: 0px solid #ddd;">';
        tableContent += ' <tbody style="height: 200px;">';

        var totalSale = 0.0;
        var ClosingBalance = 0.0;
        var saleamount = 0.0;
        var totalsaleamount = 0.0;
        var closingAmount = 0.0;
        var totalclosingstock = 0.0;
        if (resp.length > 0) {
            for (var i = 0; i < resp.length; i++) {
                tableContent += "<tr id='rowDataPop_" + i + "' style='text-align: center;'>";
                if (resp[i].Input_DynamicCount > 0) {
                    tableContent += "<td align='right'  class='col1'><i class='fa fa-minus' id='gridminuspop_" + i + "' style='font-size: 15px !important;display:none;' onclick='secondarySalesApproval.fnPopHideGridDynamic(" + i + ");' aria-hidden='true'></i><i class='fa fa-plus' style='font-size: 15px !important;' id='gridpluspop_" + i + "' onclick='secondarySalesApproval.fnPopShowGridDynamic(\"" + i + "\",\"" + resp[i].SS_Details_Code + "\");' aria-hidden='true'></i></td>";
                } else {
                    tableContent += "<td  class='col1'></td>";
                }
                if (resp[i].Ref_Key1 == "0") {
                    tableContent += "<td align='right'  class='col2'>" + resp[i].Product_Name + ' (-)' + "</td>";

                } else {
                    tableContent += "<td align='right'  class='col2'>" + resp[i].Product_Name + ' (' + resp[i].Ref_Key1 + ')' + "</td>";
                }
                tableContent += "<td class='col1'>" + resp[i].Price_per_Unit + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Opening_Stock + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Purchase + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Purchase_Return + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Sales + "</td>";
                saleamount = (parseFloat(resp[i].Price_per_Unit) * parseFloat(resp[i].Sales));
                tableContent += "<td class='col1'>" + saleamount.toFixed(2) + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Sales_Return + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Closing_Stock + "</td>";
                closingAmount = (parseFloat(resp[i].Price_per_Unit) * parseFloat(resp[i].Closing_Stock));
                tableContent += "<td class='col1'>" + closingAmount.toFixed(2) + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Transit + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Free_Goods + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Damaged_Goods + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Expired_Goods + "</td>";
                tableContent += "<td class='col1'>" + resp[i].Remarks + "</td>";
                tableContent += "</tr>";
                tableContent += "<tr id='rowDataDynaPop_" + i + "' class='dynaSSPop' style='display:none;background:#f1f1f1;'><td style='background-color:#f1f1f1 !important;' colspan='16' id='rowtdDyna_" + i + "'></td></tr>";
                totalSale += parseFloat(resp[i].Sales);
                ClosingBalance += parseFloat(resp[i].Closing_Stock);
                totalsaleamount += saleamount
                totalclosingstock += closingAmount
            }
            tableContent += "<tr style='text-align:center;'>";
            tableContent += "<td></td>";
            tableContent += "<td align='right' width='15%' style='font-weight:bold;text-align:center;'>Total</td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td style='font-weight:bold'>" + totalsaleamount.toFixed(2) + "</td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td style='font-weight:bold'>" + totalclosingstock.toFixed(2) + "</td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "<td></td>";
            tableContent += "</tr>";
            tableContent += "</tbody></table></div></div>";

        } else {
            tableContent += "<tr><td colspan='16'>No Record(s) Found.</td></tr>";
        }
        totalsaleamount = totalsaleamount.toFixed(2);
        $('#SSAmount').html(totalsaleamount);
        $("#divModel").html(tableContent);
        $('#mymodal').modal('show');
        secondarySalesApproval.fnFixedcolum(2);
    },

    fnFixedcolum: function (ColumnCount) {
        $('.maintable thead').css("width", $(".table-body").width());
        $('.maintable tbody').css("width", $(".table-body").width());
        $('.tblcollapse tbody').css("width", "fit-content");
        $('#reportRegion').css("width", $(".maintable thead").width());
        var fixcol = 0;
        while (ColumnCount > fixcol) {
            fixcol++;
            //header coumn.
            $('.maintable thead th:nth-child(' + fixcol + ')').css("position", "relative");
            $('.maintable thead th:nth-child(' + fixcol + ')').css("background-color", "#337ab7");
            $('.maintable tbody th:nth-child(' + fixcol + ')').css("border", "none");

            //row column.
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("position", "relative");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("height", "40px");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("background-color", "#ebf2fa");
            $('.maintable tbody tr td:nth-child(' + fixcol + ')').css("overflow-wrap", "break-word");
            $('#bodytable tbody').on('scroll', function (e) {
                $('#headertable thead').css("left", -$("#bodytable tbody").scrollLeft());
                for (var i = 1; i <= fixcol; i++) {
                    $('#headertable thead th:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                    $('#bodytable tbody td:nth-child(' + i + ')').css("left", $("#bodytable tbody").scrollLeft());
                    $('thead .second_header_row th:nth-child(' + i + ')').css("position", "initial");
                }
            });
        }
        $(window).resize(function () {
            if ($(".table-body").width() < 1336) {
                $('.maintable thead').css("width", $(".table-body").width());
                $('.maintable tbody').css("width", $(".table-body").width());
                $('.tblcollapse tbody').css("width", "fit-content");
            }
            else {
                $('.maintable thead').css("width", $(".table-body").width());
                $('.maintable tbody').css("width", $(".table-body").width());
                $('.tblcollapse tbody').css("width", "fit-content");
            }
        });
        $(".table-body").on('scroll', function () {
            debugger;
            $(".table-header").offset({ left: -1 * this.scrollLeft });
        });
    },

    fnSSApprove: function (status) {
        var details = "";
        var remarks = "";
        var selectedMonth = fngetMonthNumber($('#hdnMonth').val().split('-')[0]);
        var selectedYear = $('#hdnMonth').val().split('-')[1];
        var currentStatus = $('#hdnStatus').val();
        remarks = $('#txtReason').val();
        remarks = $.trim(remarks); s

        if (status == "0" && remarks == "") {
            fnMsgAlert('info', 'Secondary sales approval.', 'please enter the remarks.');
            return false;
        }

        if ($.trim(remarks) != "") {
            var specialCharregex = new RegExp("^[a-zA-Z0-9() |._%#@!;{}:*\\-,`=+?]+$");
            if (!specialCharregex.test(remarks)) {
                fnMsgAlert('info', 'Information', 'The following characters not allowed in this system. "&~^$<>[]\\/\'.please remove the special characters.');
                return false;
            }
        }
        details = $("#hdnApprovalTwo").val() + "|";
        details += remarks.replace('|', ' ') + "$";
        try {
            $.ajax({
                type: "POST",
                url: '/HiDoctor_Master/Approval/UpdateSecondarySalesStatus',
                data: 'details=' + escape(details) + '&status=' + status + '&month=' + selectedMonth + '&year=' + selectedYear + '&currentStatus=' + currentStatus,
                success: function (response) {
                    if (response != "") {
                        if (response != "") {
                            fnMsgAlert('success', 'Success', response);
                            $('#dvSSDetails').html();
                            HideModalPopup('dvReportSSTwo');
                            secondarySalesApproval.fnGetRegionsBasedOnInputs();
                            secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth();
                        }
                    }

                },
                error: function (e) {
                    fnMsgAlert('error', 'Error', 'Error.');
                }
            });
        }
        catch (e) {
            fnMsgAlert('error', 'Error', e.message);
            return false;
        }

    },
    //_fnAttachment: function (bloburl) {
    //    debugger;

    //    var attachment = "";


    //    if (bloburl != "") {
    //        var extension = bloburl.split('.');
    //        extension = extension.reverse();
    //        if (extension[0] == "jpg" || extension[0] == "png") {
    //            attachment += '<img src="' + bloburl + '" />';
    //        }

    //        $('#AttachmentBody').html(attachment);
    //        $('#Attachment').modal('toggle');
    //    }
    //    else {
    //        $('#AttachmentBody').html('empty');

    //    }
    //},

    _fnViewRemarksHistory: function (value) {
        debugger;
        if (value != "") {
            $.ajax({
                type: "GET",
                url: "../HiDoctor_Master/Approval/GetSSRemarksHistory",
                data: "regionCode=" + value.split('|')[0] + "&ssCode=" + value.split('|')[1],
                success: function (resp) {
                    secondarySalesApproval._fnBindRemraksHistoryHTML(resp);
                }
            })
        }
    },
    _fnBindRemraksHistoryHTML: function (resp) {
        debugger;
        var content = "";
        content += "<table class='table table-striped'>";
        content += "<thead>";
        content += "<tr>";
        content += "<th>Action By</th>";
        content += "<th>Action Date</th>";
        content += "<th>Status</th>";
        content += "<th>Remarks</th>";
        content += "</tr></thead><tbody style='text-align:center;'>";
        if (resp.length > 0 && resp != "NO") {
            for (var i = 0; i < resp.length; i++) {
                content += "<tr>";
                if (resp[i].SS_Status == "DRAFT" || resp[i].SS_Status == "APPLIED") {
                    content += "<td>" + resp[i].Entered_By + "</td>";
                } else {
                    content += "<td>" + resp[i].Approved_By + "</td>";
                }
                if (resp[i].SS_Status == "DRAFT" || resp[i].SS_Status == "APPLIED") {
                    content += "<td>" + resp[i].Entered_Date + "</td>";
                } else {
                    content += "<td>" + resp[i].Approved_Date + "</td>";
                }
                content += "<td>" + resp[i].SS_Status + "</td>";
                content += "<td>" + resp[i].Remarks + "</td>";
                content += "</tr>";
            }
        }
        else {
            content += "<tr style='text-align:center;font-weight:bold;'><td colspan='4'>No Record(s) Found.</td></tr>";
        }
        content += "</tbody></table>";
        $('#SckstNamermrks').html(resp[0].Customer_Name);
        var month = secondarySalesApproval._fnGetMonthName(resp[0].Month);
        $('#monthSSrmrks').html(month);
        $('#yearSSrmrks').html(resp[0].Year);
        $('#divModelrmrks').html(content);
        $('#mymodalRemarks').modal('show');
    },

    //    fnPopHideGridDynamic:function(rowid) {
    //        debugger;
    //        $('#gridminuspop_' + rowid).hide();
    //        $('#gridpluspop_' + rowid).show();
    //        $('#rowDataDynaPop_' + rowid).hide();
    //    },

    fnPopShowGridDynamic: function (rowid, ssDetCode) {
        debugger;
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Activity/SecondarySales/GetDynamicColumnsInfo",
            data: "ssdetailCode=" + ssDetCode,
            success: function (resp) {
                var contentBind = secondarySalesApproval.fnBindDynamicGridForView(rowid, resp);
                if (contentBind != "" && contentBind != undefined) {
                    $('#rowtdDyna_' + rowid).html(contentBind);
                    $('#gridpluspop_' + rowid).hide();
                    $('#gridminuspop_' + rowid).show();
                    $('#rowDataDynaPop_' + rowid).show();
                }
            }
        });
    },

    fnBindDynamicGridForView: function (rowid, resp) {
        debugger;
        var content = '';
        if (resp.length > 0) {
            content += '<div class="col-lg-12  form-group">';
            for (var i = 0; i < resp.length; i++) {
                if (resp[i].Input_DataType.toUpperCase() == "TEXT") {
                    content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
                }
                if (resp[i].Input_DataType.toUpperCase() == "NUMBER") {
                    content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
                }
                if (resp[i].Input_DataType.toUpperCase() == "TEXTAREA") {
                    content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
                }
                if (resp[i].Input_DataType.toUpperCase() == "DATE") {
                    content += '<div id="rowdyn_' + rowid + '_' + i + '" class="row pddng">';
                    content += '<div class="col-lg-12 form-group remove-left-padding">';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<label style="font-size:12px;">' + resp[i].Input_Label + '</label></div>';
                    content += '<div class="col-lg-3 form-group">';
                    content += '<span style="font-size:12px;">' + resp[i].Input_Value + '</span></div></div></div>';
                }
            }
            content += '</div>';
        }
        return content;
    },
}
var lstEnteredProducts = [];
var Edited_SS_Code = "";
var Generated_Date = "";
var Year = "";
var Month = "";
var secondarysalesApprovalEdit = {
    defaults: {
        Company_Code: "",
        LogUserCode: "",
        LogRegionCode: "",
    },
    init: function (SS_Code, Stockist_Code, SS_Statement_Date, year, month) {
        debugger;
        secondarySalesApproval.fnCloseTree();
        secondarysalesApprovalEdit.fnLoadSSEntryScreen();
        $('#btnSSApprove').prop('disabled', true);
        $('#btnSSUnApprove').prop('disabled', true);
        $('#dvSecondarySalesEntry').show();
        atcObj2 = new ej.dropdowns.DropDownList({
            dataSource: [],
            fields: { text: 'label', value: 'value' },
            popupHeight: '300px',
        });
        atcObj2.appendTo('#txtStockist');
        secondarysalesApprovalEdit.fnEditStockist(SS_Code, Stockist_Code, SS_Statement_Date, year, month);
        $('#dvDraftAndSave').show();
    },
    fnLoadSSEntryScreen: function () {
        $('#txtYear').html('');
        $('#txtMonth').html('');
        $('#txtStockist').html('');
        $('#tblSecondarySalesEntered').html('');
        $('#tblSSStockistEntryHeader').html('');
        $('#dvSSEntry').show();
        $('#dvStockistList').hide();
        $('#dvShowProducts').hide();
        $('#tblSSProductEntry').html('');
        lstEnteredProducts = [];
        Edited_SS_Code = "";
        secondarysalesApprovalEdit.fnBindMonthAndYear();
        //SecondarySales.fnGetSSEnteredDetails();
    },
    fnBindMonthAndYear: function () {
        secondarysalesApprovalEdit.fnBindYear();
    },
    fnBindYear: function () {
        $('#dvYear').html('');
        $('#dvYear').html('<input id="txtYear" style="width:100%;text-align:left;" />');
        var lstYear = [];

        for (var i = 0; i < 2; i++) {
            _objYearData = {};
            _objYearData.value = new Date().getFullYear() - i;
            _objYearData.label = new Date().getFullYear() - i;
            lstYear.push(_objYearData);
        }

        atcObj = new ej.dropdowns.DropDownList({
            dataSource: lstYear,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
            change: function () { secondarysalesApprovalEdit.fnBindMonth(); }
        });
        atcObj.appendTo('#txtYear');
        atcObj.index = 0;
        secondarysalesApprovalEdit.fnBindMonth();
    },
    //for current year months are bounded upto the current month.
    //for previous year all the months are bounded
    //drop down code is written using syncfusion controls
    fnBindMonth: function () {
        $('#dvMonthEdit').html('');
        $('#dvMonthEdit').html('<input id="txtMonthEdit" style="width:100%;text-align:left;" />');
        var lstMonth = [];
        var year = $('#txtYear').val();
        if (year == new Date().getFullYear()) {
            for (var i = 0; i <= new Date().getMonth() ; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }
        else {
            for (var i = 0; i <= 11; i++) {
                _objMonthData = {};
                _objMonthData.value = i + 1;
                _objMonthData.label = monthNames[i];
                lstMonth.push(_objMonthData);
            }
        }

        atcObj1 = new ej.dropdowns.DropDownList({
            dataSource: lstMonth,
            fields: { text: 'label', value: 'value' },
            popupHeight: '200px',
        });
        atcObj1.appendTo('#txtMonthEdit');
        atcObj1.value = parseInt(Month);

        if (Month != '') {
            document.querySelector("#txtMonthEdit").ej2_instances[0].enabled = false;
        }
    },
    fnEditStockist: function (SS_Code, Stockist_Code, SS_Statement_Date, year, month) {
        debugger;
        lstEnteredProducts = [];
        Edited_SS_Code = SS_Code;

        //if (month == "January") {
        //    Month = 01;
        //}
        //else if (month == "February") {
        //    Month = 02;
        //}
        //else if (month == "March") {
        //    Month = 03;
        //}
        //else if (month == "April") {
        //    Month = 04;
        //}
        //else if (month == "May") {
        //    Month = 05;
        //}
        //else if (month == "June") {
        //    Month = 06;
        //}
        //else if (month == "July") {
        //    Month = 07;
        //}
        //else if (month == "August") {
        //    Month = 08;
        //}
        //else if (month == "September") {
        //    Month = 09;
        //}
        //else if (month == "October") {
        //    Month = 10;
        //}
        //else if (month == "November") {
        //    Month = 11;
        //}
        //else if (month == "December") {
        //    Month = 12;
        //}

        Year = year;
        Month = month;
        debugger;
        can_Enter_SS = true;
        var d = secondarysalesApprovalEdit.defaults.Company_Code + '/' + seletedregionCode + '/' + Stockist_Code + '/' + Year + '/' + Month;
        SSCoreREST.requestInvoke('api/CanEnterSS', d, null, "GET", secondarysalesApprovalEdit.fnCanEnterSS_SuccessCallback, secondarysalesApprovalEdit.fnCanEnterSS_FailureCallback);
        if (can_Enter_SS) {
            Generated_Date = Year + '-' + Month + '-' + '01';
            var details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + seletedregionCode + '/' + Generated_Date + '/' + secondarysalesApprovalEdit.defaults.LogRegionCode;;
            SSCoreREST.requestInvoke('api/GetStockistList', details, null, "GET", secondarysalesApprovalEdit.fnGetStockistListSuccessCallback, secondarysalesApprovalEdit.fnGetStockistListFailureCallback);

            var StockistObj = document.querySelector("#txtStockist").ej2_instances[0];
            StockistObj.value = Stockist_Code;

            stockCode = Stockist_Code;
            $('#dvStockistList').show();
            var details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + Stockist_Code + '/' + seletedregionCode + '/' + secondarysalesApprovalEdit.defaults.LogRegionCode + '/' + secondarysalesApprovalEdit.defaults.LogUserCode + '/' + Generated_Date;
            SSCoreREST.requestInvoke('api/GetSSPrivileges', details, null, "GET", secondarysalesApprovalEdit.fnValidateSecondarySalesEntrySuccessCallback, secondarysalesApprovalEdit.fnValidateSecondarySalesEntryFailureCallback);
            if (check_Mandatory_Privilege) {
                // secondarysalesApprovalEdit.fnGetStockistSSEntryHeader(Stockist_Code);

                //details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + Selected_Region_Code + '/' + Stockist_Code + '/' + price_Group + '/' + Year + '/' + Month;
                details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + seletedregionCode + '/' + secondarysalesApprovalEdit.defaults.LogRegionCode + '/' + Stockist_Code + '/' + price_Group + '/' + Year + '/' + Month;
                SSCoreREST.requestInvoke('api/GetProductList', details, null, "GET", secondarysalesApprovalEdit.fnGetProductListSuccessCallback, secondarysalesApprovalEdit.fnGetProductListFailureCallback);

                $('#dvShowProducts').show();

                // Stockist Details Prefilling.
                $("#datepicker").val(SS_Statement_Date);
                // Get Stockist Product List.
                details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + SS_Code;
                SSCoreREST.requestInvoke('api/GetSSStockistDetails', details, null, "GET", secondarysalesApprovalEdit.fnEidtSS_SuccessCallback, secondarysalesApprovalEdit.fnEditSS_FailureCallback);
                //$('#nav-home-tab').tab('show');
                var yearObj = document.querySelector("#txtYear").ej2_instances[0]
                yearObj.value = parseInt(Year);
                var monthObj = document.querySelector("#txtMonthEdit").ej2_instances[0]
                monthObj.value = parseInt(Month);
                // $('#dvReCal').show();
                $('#dvDraftAndSave').show();

                document.querySelector("#txtYear").ej2_instances[0].enabled = false;
                document.querySelector("#txtMonthEdit").ej2_instances[0].enabled = false;
                document.querySelector("#txtStockist").ej2_instances[0].enabled = false;
            }
        }
    },


    fnCanEnterSS_SuccessCallback: function (response) {
        debugger;
        if (response.Response != 'NO ISSUE') {
            can_Enter_SS = false;
            swal('Info', response.Response, 'info');
            return false;
        }
    },

    fnCanEnterSS_FailureCallback: function (response) {
        debugger;
    },
    fnGetStockistListSuccessCallback: function (response) {
        debugger;

        var lstStockist = [];
        $('#dvStockist').html('');
        $('#dvStockist').html('<input id="txtStockist" style="width:100%;text-align:left;" />');
        atcObj2 = new ej.dropdowns.DropDownList({
            fields: { text: 'label', value: 'value' },
            popupHeight: '300px',
        });
        if (response.Response.lststockiestdetails.length > 0) {
            for (var i = 0; i < response.Response.lststockiestdetails.length; i++) {
                _objStockistData = {};
                _objStockistData.value = response.Response.lststockiestdetails[i].Customer_Code;
                _objStockistData.label = response.Response.lststockiestdetails[i].Customer_Name;
                lstStockist.push(_objStockistData);
            }
            atcObj2.dataSource = lstStockist;
        } else {
            atcObj2.dataSource = [];
        }
        atcObj2.appendTo('#txtStockist');
        if (response.Response.length == 0) {
            document.querySelector("#txtYear").ej2_instances[0].enabled = true;
            document.querySelector("#txtMonth").ej2_instances[0].enabled = true;
            swal('Info', 'No Stockist mapped to the selected region. Please contact Swaas Support.', 'info');
            return false;
        }
        else {
            $('#dvStockistList').show();
        }

    },
    fnGetStockistListFailureCallback: function (response) {
    },
    fnValidateSecondarySalesEntrySuccessCallback: function (response) {
        var privilege = "";
        check_Mandatory_Privilege = true;
        privilege_List = response.Response;
        privilege = $.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "PRICE_GROUP";
            console.log(privilege);
        });
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Compute_Field_Editable = true;
            }
        }
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Purchase_Editable = true;
            }
        }
        if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
        }).length > 0) {
            if ($.grep(response.Response, function (ele, index) {
            return ele.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
            })[0].Privilege_Value == "YES") {
                Opening_Editable = true;
            }
        }
        if (privilege.length == 0) {
            swal('Info', 'Price Group is not mapped. Please contact SwaaS Support.', 'info');
            check_Mandatory_Privilege = false;
            valid = false;
            return false;
        }
        else {
            price_Group = privilege[0].Privilege_Value;
            privilege = $.grep(response.Response, function (ele, index) {
                return ele.Privilege_Name == "SS_FORMULA_V1";
                console.log(privilege);
            });
            if (privilege.length == 0) {
                swal('Info', 'SS_FORMULA_V1 Privilege is not mapped. Please contact SwaaS Support.', 'info');
                check_Mandatory_Privilege = false;
                valid = false;
                return false;
            }
            else {
                privilege = $.grep(response.Response, function (ele, index) {
                    return ele.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                    console.log(privilege);
                });
                if (privilege.length == 0) {
                    swal('Info', 'SS_WHAT_TO_COMPUTE Privilege is not mapped. Please contact SwaaS Support.', 'info');
                    check_Mandatory_Privilege = false;
                    valid = false;
                    return false;
                }
                else {
                    secondarysalesApprovalEdit.fnCheckForSSEntry();
                }
            }
        }
    },

    fnValidateSecondarySalesEntryFailureCallback: function (response) {
    },
    fnCheckForSSEntry: function () {
        var details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + $("select[name='txtStockist']").val() + '/' + $("select[name='txtYear']").val() + '/' + $("select[name='txtMonth']").val();
        SSCoreREST.requestInvoke('api/CheckForSSEntry', details, null, "GET", secondarysalesApprovalEdit.fnCheckForSSEntrySuccessCallback, secondarysalesApprovalEdit.fnCheckForSSEntryFailureCallback);
    },
    fnCheckForSSEntrySuccessCallback: function (response) {
        if (response.Response != "NO ISSUE") {
            swal('Info', response.Response, 'info');
            valid = false;
            return false;
        }
        else {
            if (Edited_SS_Code == '') {
                secondarysalesApprovalEdit.fnCheckForMonthsToBeSkipped();
            }
            else {
                valid = true;
                return valid;
            }
        }
    },
    fnCheckForMonthsToBeSkipped: function () {
        var details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + $("select[name='txtStockist']").val() + '/' + $("select[name='txtYear']").val() + '/' + $("select[name='txtMonth']").val();
        SSCoreREST.requestInvoke('api/CheckForMonthsToBeSkipped', details, null, "GET", secondarysalesApprovalEdit.fnCheckForMonthsToBeSkippedSuccessCallback, secondarysalesApprovalEdit.fnCheckForMonthsToBeSkippedFailureCallback);
    },
    fnCheckForMonthsToBeSkippedSuccessCallback: function (response) {
        var next_month = "";
        var next_year = "";
        if (response.Response.length > 0) {
            if (response.Response[0].Month == 12) {
                next_year = response.Response[0].Year + 1;
                next_month = "1";
            }
            else {
                next_year = response.Response[0].Year;
                next_month = response.Response[0].Month + 1;
            }
            if (next_year == $("select[name='txtYear']").val()) {
                if (next_month != $("select[name='txtMonthEdit']").val()) {
                    if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + $("select[name='txtYear']").val() + '-' + monthNames[$("select[name='txtMonthEdit']").val() - 2] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {
                        valid = false;
                        return valid;
                    }
                    else {
                        valid = true;
                        return valid;
                    }
                }
                else {
                    valid = true;
                    return valid;
                }
            }
            else {
                if ($("select[name='txtMonthEdit']").val() == "1") {
                    if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + next_year + '-' + monthNames[11] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {
                        valid = false;
                        return valid;
                    }
                    else {
                        valid = true;
                        return valid;
                    }
                } else {
                    if (!confirm('You have not entered Secondary Sales from ' + next_year + '-' + monthNames[next_month - 1] + ' to ' + $("select[name='txtYear']").val() + '-' + monthNames[$("select[name='txtMonthEdit']").val() - 2] + ' for ' + $('#txtStockist').val() + '.If you wish to continue click OK. Otherwise click Cancel')) {
                        valid = false;
                        return valid;
                    }
                    else {
                        valid = true;
                        return valid;
                    }
                }
            }
        }
        else {
            valid = true;
            return valid;
        }
    },
    fnCheckForMonthsToBeSkippedFailureCallback: function (response) {
    },
    fnCheckForSSEntryFailureCallback: function (response) {
    },
    fnGetProductListSuccessCallback: function (response) {
        $("select[name='txtStockist']").attr('readonly', 'readonly');
        product_Name_List = [];
        product_List = response.Response;
        for (var i = 0; i < product_List.length; i++) {
            var op = product_List[i].Purchase.replace(/\d+/g, '');
            if (op.indexOf('+') >= 0) {
                product_List[i].Purchase = eval(product_List[i].Purchase);
            }
            else {
                product_List[i].Purchase = -(eval(product_List[i].Purchase));
            }
            op = "";
            op = product_List[i].Purchase_Return.replace(/\d+/g, '');
            if (op.indexOf('+') >= 0) {
                product_List[i].Purchase_Return = eval(product_List[i].Purchase_Return);
            }
            else {
                product_List[i].Purchase_Return = -(eval(product_List[i].Purchase_Return));
            }

        }
        var content = [];
        if (product_List.length > 0) {
            for (var i = 0; i < product_List.length; i++) {
                var _ObjTemp = {
                    label: product_List[i].Product_Name,
                    Id: product_List[i].Product_Code
                };
                product_Name_List.push(_ObjTemp);
            }
        }
        $('#dvShowProducts').show();
        //$('#datepicker').datepicker({
        //    minDate: new Date(Generated_Date),
        //    maxDate: '0',
        //    dateFormat: 'dd-mm-yy'
        //});
    },
    fnGetProductListFailureCallback: function (response) {
    },
    fnEidtSS_SuccessCallback: function (response) {
        // Product binding.
        secondarysalesApprovalEdit.fnGetandBindSelectedProducts("Edit", response.Response);
        $('#Draft').prop('disabled', false);
        $('#Submit').prop('disabled', false);
        $('.actionButtons').show();
    },
    fnEditSS_FailureCallback: function (response) {
    },
    fnGetandBindSelectedProducts: function (mode, binddata) {
        debugger;
        var selectedData = "";
        var bindProduct = false;
        Insert_Mode = mode;
        if (mode == 'ShowAllProduct') {
            var lst = [];
            $('.productShowGrid :checked').map(function () {
                var productCode = this.value;
                var disjson = $.grep(product_List, function (ele, index) {
                    return ele.Product_Code == productCode;
                });
                lst.push(disjson[0]);
            });
            //Product_Code: "PDC00000006"
            //Product_Name: "Adaferin Gel  (A03010)"
            //Opening_Balance: 17
            //Product_Exists: 1
            //Division_Code: "DIV00000001"
            //Product_Price: 103
            //Purchase: -0
            //Purchase_Return: -0
            selectedData = lst;
            if (lstEnteredProducts.length == 0 && selectedData.length == 0) {
                swal('Info', 'Please Select Atleast One Product.', 'info');
                return false;
            }
            else {
                bindProduct = true;
            }
        }
        else if (mode == 'Edit') {
            selectedData = binddata;
            bindProduct = true;
        }

        privilege = $.grep(privilege_List, function (ele, index) {
            return ele.Privilege_Name == "SS_INPUT_COLUMNS";
        });
        if (bindProduct) {
            if (privilege.length != 0) {
                var content = "";
                Input_Columns = privilege[0].Privilege_Value.split(',');
                var wid = Input_Columns.length;
                if (wid > 3 && wid <= 3) {
                    var C_width = '120%';
                }
                else if (wid > 5) {
                    var C_width = '130%';
                }
                else {
                    var C_width = '100%';
                }
                content += '<table class="table table-bordered" style="font-size:13px;width:' + C_width + '; ">';
                content += '<thead class="thead bg-info text-white text-center">';
                content += '<tr>';
                content += '<th scope = "col" style="width:300px;"> PRODUCT NAME</th>';
                content += '<th scope = "col"> PRODUCT PRICE</th>';
                for (var i = 0; i < Input_Columns.length; i++) {
                    content += '<th scope = "col">' + Input_Columns[i].replace('_', ' ') + '</th>';
                }
                content += '<th scope = "col" style="width:100px;">SALES AMOUNT</th>';
                content += '<th scope = "col" style="width:100px;">CLOSING BALANCE AMOUNT</th>';
                content += '<th scope = "col" style="width:150px;"> REMARKS</th>';
                content += '<th scope = "col">DELETE</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                content += '</tbody>';
                content += '<tfoot>';
                content += '<tr>';
                content += '<td colspan="' + (2 + Input_Columns.length) + '" style="text-align: right;"><label style="font-size: 18px;font-weight: 600;">Total</label> </td>';
                content += '<td><input type="number" id ="TOTAL_SALE_AMOUNT"  class="form-control form-control-sm" readonly step=".01"> </td>';
                content += '<td><input type="number"  id="TOTAL_CLOSING_AMOUNT" class="form-control form-control-sm" readonly step=".01"></td>';
                content += '<td colspan="2"></td>';
                content += '</tr>';
                content += '</tfoot>';
                content += '</table>';
                $('#tblSSProductEntry').html(content);
                for (var i = 0; i < selectedData.length; i++) {
                    content = '';
                    content += '<tr>';
                    content += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + (i + 1) + '" class="form-control-sm"></td>';
                    content += '<td><div style="display: flex;">';
                    var price_Edit = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                    });
                    if (price_Edit.length > 0) {
                        if (price_Edit[0].Privilege_Value == "YES") {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '"></div>';
                        }
                        else {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '" readonly></div>';
                        }
                    }
                    else {
                        content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '" readonly></div>';
                    }
                    var prd_Price = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if ($.inArray(prd_Price[0].Product_Code, lstEnteredProducts) == -1) {
                        lstEnteredProducts.push(prd_Price[0].Product_Code)
                    }
                    if (prd_Price.length > 0) {
                        if (prd_Price[0].Product_Price != selectedData[i].Product_Price) {
                            content += "<div><i class='fa fa-refresh' style='padding-top: 5px; padding-left: 3px; cursor: pointer;' id='refresh'></i></div>";
                        }
                    }
                    content += '</div></td>';
                    var decimalColumn = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
                    });
                    var dec = []
                    if (decimalColumn.length > 0) {
                        dec = decimalColumn[0].Privilege_Value.split(',');
                    }
                    for (var j = 0; j < Input_Columns.length; j++) {
                        var tileCase = secondarysalesApprovalEdit.toTitleCase(Input_Columns[j].toLowerCase().replace('_', ' ')).replace(' ', '_');
                        var value = selectedData[i][tileCase] == undefined ? 0 : selectedData[i][tileCase];
                        if (Input_Columns[j] == "OPENING_BALANCE") {
                            var OBE = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                            })
                            if (OBE.length > 0) {
                                if (OBE[0].Privilege_Value == "YES") {
                                    if (dec.indexOf(Input_Columns[j]) != -1) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                }
                                else {
                                    var Open_Edit = $.grep(product_List, function (v) {
                                        return v.Product_Name == selectedData[i].Product_Name;
                                    })
                                    if (Open_Edit.length > 0) {
                                        if (Open_Edit[0].Product_Exists == 0) {
                                            if (dec.indexOf(Input_Columns[j]) != -1) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                            }
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                        }
                                    }
                                }
                            }
                            else {
                                var Open_Edit = $.grep(product_List, function (v) {
                                    return v.Product_Name == selectedData[i].Product_Name;
                                })
                                if (Open_Edit.length > 0) {
                                    if (Open_Edit[0].Product_Exists == 0) {
                                        if (dec.indexOf(Input_Columns[j]) != -1) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                    }
                                }
                            }
                        }
                        else {
                            if (Input_Columns[j] == "PURCHASE" || Input_Columns[j] == "PURCHASE_RETURN") {
                                var P_PR_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                                })
                                if (P_PR_Editable.length > 0) {
                                    if (P_PR_Editable[0].Privilege_Value == "YES") {
                                        if (dec.indexOf(Input_Columns[j]) != -1) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                        }
                                        else {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01"></td>';
                                    }
                                }
                                else {
                                    if (dec.indexOf(Input_Columns[j]) != -1) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                }
                            }
                            else {
                                var CF_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                                })
                                if (CF_Editable.length > 0) {
                                    var WTC = $.grep(privilege_List, function (v) {
                                        return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                    })
                                    if (CF_Editable[0].Privilege_Value == "YES") {
                                        if (WTC.length > 0) {
                                            if (dec.indexOf(Input_Columns[j]) != -1) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                            }
                                        }
                                    }
                                    else {
                                        if (WTC.length > 0) {
                                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01"></td>';
                                            }
                                            else {
                                                if (dec.indexOf(Input_Columns[j]) != -1) {
                                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" onkeypress="return fnValidateDecimal(this,event)"></td>';
                                                }
                                                else {
                                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    content += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" readonly step=".01"></td>';
                    content += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" readonly step=".01"></td>';
                    if (selectedData[i].Remarks.length > 0) {
                        content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark" value="' + selectedData[i].Remarks + '"></td>';
                    }
                    else {
                        content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                    }
                    var Is_Mandatory = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if (Is_Mandatory.length > 0) {
                        if (Is_Mandatory[0].Is_Mandatory == 1) {
                            content += '<td></td>';
                        }
                        else {
                            content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "secondarysalesApprovalEdit.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                        }
                    }
                    else {
                        content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "secondarysalesApprovalEdit.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                    }

                    content += '</tr>';

                    $('#tblSSProductEntry tbody').append(content);

                    if (Is_Mandatory[0].Is_Mandatory == 1) {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            enabled: false,
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                secondarysalesApprovalEdit.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + (i + 1) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                    else {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                secondarysalesApprovalEdit.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + (i + 1) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                }
            }
            $('#productModal').hide();
        }
        secondarysalesApprovalEdit.fnReCalculate();
    },
    toTitleCase: function (str) {
        return str.replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    },
    fnEditChangeProductList: function (e) {
        $('#dvDraftAndSave').show();
        //  $('#dvReCal').show();
        var currentRow = $(e.element).parent().parent().parent();
        var currentProductCode = e.itemData.Id;
        var lstProduct = $.grep(product_List, function (v) {
            return v.Product_Code == currentProductCode;
        });
    },
    fnReCalculate: function () {
        if (g_perodiclock == 1 && G_Lock_Status == "0") {
            //if (resp[0].regionCode == Selected_Region_Code && resp[0].Lock_Status==1) {

            fnMsgAlert('info', 'Secondary sales Details locked.', 'The Selected Region was locked,Kindly contact Salesadmin to release the lock.');
            return false;
        }
        else {
            //  $('#dvReCal').hide();
            $("#tblSSProductEntry table tbody tr").map(function (i, e) {
                var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];
                var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
                var inputFields = $(this).find('input[type=number]');

                var product_Name = $(this).find("select").val();
                var computeColumn = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE" }).map(a=>a.Privilege_Value)[0];

                if (computeColumn == "CLOSING_BALANCE") {
                    $(this).find("#SALES_AMOUNT").val($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val());
                }
                else {
                    $(this).find("#CLOSING_BALANCE_AMOUNT").val($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val());
                }

                inputFields.map(function (i, e) {
                    if (formula.indexOf($(this).attr('id')) > -1) {
                        formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                    }
                });
                if (computeColumn != $(this).attr('id')) {
                    $(this).find('#' + computeColumn).val(eval(formula));
                }

                if (computeColumn == "CLOSING_BALANCE") {
                    $(this).find("#CLOSING_BALANCE_AMOUNT").val($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val());
                }
                else if (computeColumn == "SALES") {

                    $(this).find("#SALES_AMOUNT").val($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val());

                }
                else if (computeColumn == "PURCHASE") {
                    $(this).find("#CLOSING_BALANCE_AMOUNT").val($(this).find("#CLOSING_BALANCE").val() * $(this).find("#PRODUCT_PRICE").val());
                    $(this).find("#SALES_AMOUNT").val($(this).find("#SALES").val() * $(this).find("#PRODUCT_PRICE").val());
                }
                var total_sale_Amount = 0;
                $("#tblSSProductEntry table tbody #SALES_AMOUNT").map(function (i, e) {
                    total_sale_Amount = total_sale_Amount + parseFloat($(this).val());
                });
                $("#TOTAL_SALE_AMOUNT").val(total_sale_Amount);

                // Total Closing Amount Calculation.
                var total_closing_Amount = 0;
                $("#tblSSProductEntry table tbody #CLOSING_BALANCE_AMOUNT").map(function (i, e) {
                    total_closing_Amount = total_closing_Amount + parseFloat($(this).val());
                });
                $("#TOTAL_CLOSING_AMOUNT").val(total_closing_Amount);
            });
            if (Edited_SS_Code == '') {
                Edited_SS_Code = 0;
            }
            $('#dvDraftAndSave').show();
        }
    },
    fnAddnewRow: function () {
        debugger;
        if (g_perodiclock == 1 && G_Lock_Status == "0") {

            fnMsgAlert('info', 'Secondary sales Details locked.', 'The Selected Region was locked ,Kindly contact Salesadmin to release the lock.');
            return false;
        }
        else {
            secondarysalesApprovalEdit.fnReCalculate();
            secondarysalesApprovalEdit.fnSubmit(1, 'plus', '0');
            secondarysalesApprovalEdit.fnUpdateSSHeader();
            rowCount = rowCount + 1;
            var SSEntryhtml = "";
            SSEntryhtml += '<tr>';
            SSEntryhtml += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + rowCount + '" class="form-control-sm"></td>';
            var price_Edit = $.grep(privilege_List, function (v) {
                return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
            });
            if (price_Edit.length > 0) {
                if (price_Edit[0].Privilege_Value == "YES") {
                    SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm"></td>';
                }
                else {
                    SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
                }
            }
            else {
                SSEntryhtml += '<td><input type="text"  id="PRODUCT_PRICE" class="form-control form-control-sm" readonly></td>';
            }
            for (var i = 0; i < Input_Columns.length; i++) {
                if (Input_Columns[i] == "OPENING_BALANCE") {
                    var OBE = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                    })
                    if (OBE.length > 0) {
                        if (OBE[0].Privilege_Value == "YES") {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly></td>';
                        }
                    }
                    else {
                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01" readonly></td>';
                    }
                }
                else {
                    if (Input_Columns[i] == "PURCHASE" || Input_Columns[i] == "PURCHASE_RETURN") {
                        var P_PR_Editable = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                        })
                        if (P_PR_Editable.length > 0) {
                            if (P_PR_Editable[0].Privilege_Value == "YES") {
                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                            }
                            else {
                                SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" readonly step=".01"></td>';
                            }
                        }
                        else {
                            SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                        }
                    }
                    else {
                        var CF_Editable = $.grep(privilege_List, function (v) {
                            return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                        })
                        if (CF_Editable.length > 0) {
                            if (CF_Editable[0].Privilege_Value == "YES") {
                                var WTC = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                })
                                if (WTC.length > 0) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                                }
                            }
                            else {
                                var WTC = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                })
                                if (WTC.length > 0) {
                                    if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" readonly step=".01"></td>';
                                    }
                                    else {
                                        SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                                    }
                                }
                            }
                        }
                        else {
                            var WTC = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                            })
                            if (WTC.length > 0) {
                                if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[i])) {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" readonly step=".01"></td>';
                                }
                                else {
                                    SSEntryhtml += '<td><input type="number" id ="' + Input_Columns[i] + '" class="form-control form-control-sm" step=".01"></td>';
                                }
                            }
                        }
                    }
                }
            }
            SSEntryhtml += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" step=".01" readonly></td>';
            SSEntryhtml += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" step=".01" readonly></td>';
            SSEntryhtml += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
            SSEntryhtml += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "secondarysalesApprovalEdit.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
            SSEntryhtml += '</tr>';

            $("#tblSSProductEntry tbody").append(SSEntryhtml);

            var atcObj = new ej.dropdowns.AutoComplete({
                //set the data to dataSource property
                dataSource: product_Name_List,
                fields: { value: 'label' },
                // set the placeholder to AutoComplete input element
                placeholder: 'Search Product',
                change: function (e) {
                    secondarysalesApprovalEdit.fnChangeProductList(e);
                }

            });
            atcObj.appendTo('input[name=Product_Name' + rowCount + ']');


        }
    },
    fnSubmit: function (status, mode, isUnApprovable) {
        debugger;
        if (g_perodiclock == 1 && G_Lock_Status == "0") {

            fnMsgAlert('info', 'Secondary sales Details locked.', 'The Selected Region was locked,Kindly contact Salesadmin to release the lock.');
            return false;

        }
        else {
            global_variable = mode;
            $('#Draft').prop('disabled', true);
            $('#Submit').prop('disabled', true);

            var ss_Flag = true;
            if ($('#datepicker').val() == '') {
                $('#Draft').prop('disabled', false);
                $('#Submit').prop('disabled', false);
                swal('Info', 'Please enter Statement Date.', 'info');
                return false;
            }
            else {
                var statementDate = $('#datepicker').val();
                statementDate = statementDate.split('/')[2] + '-' + statementDate.split('/')[1] + '-' + statementDate.split('/')[0];
                arr = [];
                No_decimal = $.grep(privilege_List, function (ele, index) {
                    return ele.Privilege_Name == "DISALLOW_DECIMAL_IN_SS";
                });
                if (status == 1) {
                    $("#tblSSProductEntry table tbody tr").map(function (i, e) {
                        var obj = {};
                        var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
                        var product_Name = $(this).find("select").val();
                        var Restrict_Decimal = No_decimal[0].Privilege_Value;
                        if (product_Name != null && product_Name != undefined) {
                            var PC = $.grep(product_List, function (v) { return v.Product_Name == product_Name }).map(a=>a.Product_Code)[0];
                            if ($.grep(arr, function (e) { return e.Product_Code === PC; }).length > 0) {
                                $('#Draft').prop('disabled', false);
                                $('#Submit').prop('disabled', false);
                                swal('info', ' You cannot enter the same Product more than once.', 'info');
                                ss_Flag = false;
                                return false;
                            }
                            obj.Product_Code = PC;
                            obj.Division_Code = $.grep(product_List, function (v) { return v.Product_Code == PC }).map(a=>a.Division_Code)[0];
                            if ($(this).find("#PRODUCT_PRICE").val() >= 0) {
                                obj.Unit_Rate = $(this).find("#PRODUCT_PRICE").val();
                            }
                            else {
                                $('#Draft').prop('disabled', false);
                                $('#Submit').prop('disabled', false);
                                swal('Info', 'Product Price cannot be less than 0.', 'info');
                                ss_Flag = false;
                                return false;
                            }
                            for (var i = 0; i < Input_Columns.length; i++) {
                                if (Restrict_Decimal.includes(Input_Columns[i])) {
                                    var disallow_Decimal = true;
                                }
                                else {
                                    var disallow_Decimal = false;
                                }
                                if (Input_Columns[i] == "OPENING_BALANCE") {
                                    if ($(this).find("#OPENING_BALANCE").val() >= 0) {
                                        obj.Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                        var OB = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Opening_Balance;
                                        if (obj.Opening_Balance != OB) {
                                            obj.Is_Manually_Edited = 1;
                                            obj.hdn_Opening_Balance = OB;
                                        }
                                        else {
                                            obj.Is_Manually_Edited = 0;
                                            obj.hdn_Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                        }
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Opening Balance cannot be less than 0.', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Opening_Balance.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Opening Balance', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "PURCHASE") {
                                    if ($(this).find("#PURCHASE").val() == '') {
                                        $(this).find("#PURCHASE").val(0);
                                    }
                                    obj.Purchase = $(this).find("#PURCHASE").val();
                                    var P = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase;
                                    var PWT = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    if (PWT != "PURCHASE") {
                                        if (P >= 0) {
                                            if (obj.Purchase < 0) {
                                                $('#Draft').prop('disabled', false);
                                                $('#Submit').prop('disabled', false);
                                                swal('Info', 'Purchase cannot be less than 0', 'info');
                                                ss_Flag = false;
                                                return false;
                                            }
                                        }
                                    }
                                    if (obj.Purchase != P) {
                                        obj.Purchase_Edited = 1;
                                        obj.hdnPurchase = P;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Purchase.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Purchase', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "PURCHASE_RETURN") {
                                    if ($(this).find("#PURCHASE_RETURN").val() == '') {
                                        $(this).find("#PURCHASE_RETURN").val(0);
                                    }
                                    if ($(this).find("#PURCHASE_RETURN").val() >= 0) {
                                        obj.Purchase_Return = $(this).find("#PURCHASE_RETURN").val();
                                        var PR = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase_Return;
                                        if (obj.Purchase_Return != PR) {
                                            if (obj.Purchase_Edited != 1) {
                                                obj.Purchase_Edited = 1;
                                            }
                                        }
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Purchase Return cannot be less than 0.', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Purchase_Return.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Purchase Return', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "SALES") {
                                    if ($(this).find("#SALES").val() >= 0) {
                                        if ($(this).find("#SALES").val() == '') {
                                            $(this).find("#SALES").val(0);
                                        }
                                        obj.Sales = $(this).find("#SALES").val();
                                        var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                        var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                        if (WTC == "SALES") {
                                            if (CF == "YES") {
                                                var inputFields = $(this).find('input[type=number]');
                                                inputFields.map(function (i, e) {
                                                    if (formula.indexOf($(this).attr('id')) > -1) {
                                                        formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                    }
                                                });
                                                if ($(this).find("#SALES").val() == '') {
                                                    $(this).find("#SALES").val(0);
                                                }
                                                if (eval(formula) != $(this).find("#SALES").val()) {
                                                    if (obj.Is_Manually_Edited == 0) {
                                                        obj.Is_Manually_Edited = 1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Sales cannot be less than 0.', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Sales.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Sales', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "SALES_RETURN") {
                                    if ($(this).find("#SALES_RETURN").val() == '') {
                                        $(this).find("#SALES_RETURN").val(0);
                                    }
                                    if ($(this).find("#SALES_RETURN").val() >= 0) {
                                        obj.Sales_Return = $(this).find("#SALES_RETURN").val();
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Sales Return cannot be less than 0.', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Sales_Return.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Sales Return', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "TRANSIT") {
                                    if ($(this).find("#TRANSIT").val() == '') {
                                        $(this).find("#TRANSIT").val(0);
                                    }
                                    obj.Transit = $(this).find("#TRANSIT").val();
                                    if (disallow_Decimal) {
                                        if (obj.Transit.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Transit', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "FREE_GOODS") {
                                    if ($(this).find("#FREE_GOODS").val() == '') {
                                        $(this).find("#FREE_GOODS").val(0);
                                    }
                                    obj.Free_Goods = $(this).find("#FREE_GOODS").val();
                                    if (disallow_Decimal) {
                                        if (obj.Free_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Free Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "EXPIRED_GOODS") {
                                    if ($(this).find("#EXPIRED_GOODS").val() == '') {
                                        $(this).find("#EXPIRED_GOODS").val(0);
                                    }
                                    if ($(this).find("#EXPIRED_GOODS").val() >= 0) {
                                        obj.Expired_Goods = $(this).find("#EXPIRED_GOODS").val();
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Expired Goods cannot be less than 0.');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Expired_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Expired Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "DAMAGED_GOODS") {
                                    if ($(this).find("DAMAGED_GOODS").val() == '') {
                                        $(this).find("DAMAGED_GOODS").val(0);
                                    }
                                    if ($(this).find("DAMAGED_GOODS").val() >= 0) {
                                        obj.Damaged_Goods = $(this).find("#DAMAGED_GOODS").val();
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Damaged Goods cannot be less than 0', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Damaged_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Damaged Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "CLOSING_BALANCE") {
                                    if ($(this).find("#CLOSING_BALANCE").val() >= 0) {
                                        if ($(this).find("#CLOSING_BALANCE").val() == '') {
                                            $(this).find("#CLOSING_BALANCE").val(0);
                                        }
                                        obj.Closing_Balance = $(this).find("#CLOSING_BALANCE").val();
                                        var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                        var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                        if (WTC == "CLOSING_BALANCE") {
                                            if (CF == "YES") {
                                                var inputFields = $(this).find('input[type=number]');
                                                inputFields.map(function (i, e) {
                                                    if (formula.indexOf($(this).attr('id')) > -1) {
                                                        formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                    }
                                                });
                                                if (eval(formula) != $(this).find("#CLOSING_BALANCE").val()) {
                                                    if (obj.Is_Manually_Edited == 0) {
                                                        obj.Is_Manually_Edited = 1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        $('#Draft').prop('disabled', false);
                                        $('#Submit').prop('disabled', false);
                                        swal('Info', 'Closing Balance cannot be less than 0.', 'info');
                                        ss_Flag = false;
                                        return false;
                                    }

                                    if (disallow_Decimal) {
                                        if (obj.Closing_Balance.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Closing Balance', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                            }
                            obj.Product_Remarks = $(this).find("#REMARKS").val();
                            arr.push(obj);
                        }
                    });
                }
                else {
                    $("#tblSSProductEntry table tbody tr").map(function (i, e) {
                        var obj = {};
                        var formula = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_FORMULA_V1" }).map(a=>a.Privilege_Value)[0];
                        var Restrict_Decimal = No_decimal[0].Privilege_Value;
                        var product_Name = $(this).find("select").val();
                        if (product_Name != null && product_Name != undefined) {
                            var PC = $.grep(product_List, function (v) { return v.Product_Name == product_Name }).map(a=>a.Product_Code)[0];
                            if ($.grep(arr, function (e) { return e.Product_Code === PC; }).length > 0) {
                                $('#Draft').prop('disabled', false);
                                $('#Submit').prop('disabled', false);
                                swal('info', ' You cannot enter the same Product more than once.', 'info');
                                ss_Flag = false;
                                return false;
                            }
                            obj.Product_Code = PC;
                            obj.Division_Code = $.grep(product_List, function (v) { return v.Product_Code == PC }).map(a=>a.Division_Code)[0];
                            obj.Unit_Rate = $(this).find("#PRODUCT_PRICE").val();
                            for (var i = 0; i < Input_Columns.length; i++) {
                                if (Restrict_Decimal.includes(Input_Columns[i])) {
                                    var disallow_Decimal = true;
                                }
                                else {
                                    var disallow_Decimal = false;
                                }
                                if (Input_Columns[i] == "OPENING_BALANCE") {
                                    obj.Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                    var OB = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Opening_Balance;
                                    if (obj.Opening_Balance != OB) {
                                        obj.Is_Manually_Edited = 1;
                                        obj.hdn_Opening_Balance = OB;
                                    }
                                    else {
                                        obj.Is_Manually_Edited = 0;
                                        obj.hdn_Opening_Balance = $(this).find("#OPENING_BALANCE").val();
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Opening_Balance.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Opening Balance', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "PURCHASE") {
                                    if ($(this).find("#PURCHASE").val() == '') {
                                        $(this).find("#PURCHASE").val(0);
                                    }
                                    obj.Purchase = $(this).find("#PURCHASE").val();
                                    var P = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase;
                                    if (obj.Purchase != P) {
                                        obj.Purchase_Edited = 1;
                                        obj.hdnPurchase = P;
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Purchase.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Purchase', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "PURCHASE_RETURN") {
                                    if ($(this).find("#PURCHASE_RETURN").val() == '') {
                                        $(this).find("#PURCHASE_RETURN").val(0);
                                    }
                                    obj.Purchase_Return = $(this).find("#PURCHASE_RETURN").val();
                                    var PR = $.grep(product_List, function (v) { return v.Product_Code == PC; })[0].Purchase_Return;
                                    if (obj.Purchase_Return != PR) {
                                        if (obj.Purchase_Edited != 1) {
                                            obj.Purchase_Edited = 1;
                                        }
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Purchase_Return.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Purchase Return', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "SALES") {
                                    if ($(this).find("#SALES").val() == '') {
                                        $(this).find("#SALES").val(0);
                                    }
                                    obj.Sales = $(this).find("#SALES").val();
                                    var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                    if (WTC == "SALES") {
                                        if (CF == "YES") {
                                            var inputFields = $(this).find('input[type=number]');
                                            inputFields.map(function (i, e) {
                                                if (formula.indexOf($(this).attr('id')) > -1) {
                                                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                }
                                            });
                                            if ($(this).find("#SALES").val() == '') {
                                                $(this).find("#SALES").val(0);
                                            }
                                            if (eval(formula) != $(this).find("#SALES").val()) {
                                                if (obj.Is_Manually_Edited == 0) {
                                                    obj.Is_Manually_Edited = 1;
                                                }
                                            }
                                        }
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Sales.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Sales', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "SALES_RETURN") {
                                    if ($(this).find("#SALES_RETURN").val() == '') {
                                        $(this).find("#SALES_RETURN").val(0);
                                    }
                                    obj.Sales_Return = $(this).find("#SALES_RETURN").val();
                                    if (disallow_Decimal) {
                                        if (obj.Sales_Return.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Sales Return', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "TRANSIT") {
                                    if ($(this).find("#TRANSIT").val() == '') {
                                        $(this).find("#TRANSIT").val(0);
                                    }
                                    obj.Transit = $(this).find("#TRANSIT").val();
                                    if (disallow_Decimal) {
                                        if (obj.Transit.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Transit', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "FREE_GOODS") {
                                    if ($(this).find("#FREE_GOODS").val() == '') {
                                        $(this).find("#FREE_GOODS").val(0);
                                    }
                                    obj.Free_Goods = $(this).find("#FREE_GOODS").val();
                                    if (disallow_Decimal) {
                                        if (obj.Free_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Free Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "EXPIRED_GOODS") {
                                    if ($(this).find("#EXPIRED_GOODS").val() == '') {
                                        $(this).find("#EXPIRED_GOODS").val(0);
                                    }
                                    obj.Expired_Goods = $(this).find("#EXPIRED_GOODS").val();
                                    if (disallow_Decimal) {
                                        if (obj.Expired_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Expired Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "DAMAGED_GOODS") {
                                    if ($(this).find("DAMAGED_GOODS").val() == '') {
                                        $(this).find("DAMAGED_GOODS").val(0);
                                    }
                                    obj.Damaged_Goods = $(this).find("#DAMAGED_GOODS").val();
                                    if (disallow_Decimal) {
                                        if (obj.Damaged_Goods.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Damaged Goods', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                                if (Input_Columns[i] == "CLOSING_BALANCE") {
                                    if ($(this).find("#CLOSING_BALANCE").val() == '') {
                                        $(this).find("#CLOSING_BALANCE").val(0);
                                    }
                                    obj.Closing_Balance = $(this).find("#CLOSING_BALANCE").val();
                                    var WTC = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_WHAT_TO_COMPUTE"; })[0].Privilege_Value;
                                    var CF = $.grep(privilege_List, function (v) { return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE"; })[0].Privilege_Value;
                                    if (WTC == "CLOSING_BALANCE") {
                                        if (CF == "YES") {
                                            var inputFields = $(this).find('input[type=number]');
                                            inputFields.map(function (i, e) {
                                                if (formula.indexOf($(this).attr('id')) > -1) {
                                                    formula = formula.replace($(this).attr('id'), ($(this).val() == "" ? 0 : $(this).val()))
                                                }
                                            });
                                            if (eval(formula) != $(this).find("#CLOSING_BALANCE").val()) {
                                                if (obj.Is_Manually_Edited == 0) {
                                                    obj.Is_Manually_Edited = 1;
                                                }
                                            }
                                        }
                                    }
                                    if (disallow_Decimal) {
                                        if (obj.Closing_Balance.split('.').length > 1) {
                                            $('#Draft').prop('disabled', false);
                                            $('#Submit').prop('disabled', false);
                                            swal('Info', 'Please do not enter decimal values in Closing Balance', 'info');
                                            ss_Flag = false;
                                            return false;
                                        }
                                    }
                                }
                            }
                            obj.Product_Remarks = $(this).find("#REMARKS").val();
                            arr.push(obj);
                        }
                    });
                }
                var obj1 = {
                    Company_Code: secondarysalesApprovalEdit.defaults.Company_Code,
                    Month: Month,
                    Year: Year,
                    Region_Code: Selected_Region_Code,
                    Base_Code: stockCode,
                    Entered_By: secondarysalesApprovalEdit.defaults.LogUserCode,
                    StatementDate: statementDate,
                    BaseTypeCode: 'STOCKIEST',
                    Existing_SS_Code: Edited_SS_Code,
                    SS_Status: status,
                    isUnApprovable: isUnApprovable
                }
                objDetails = {
                    lstSecondaryDetails: arr,
                    obj: obj1
                }
                debugger;
                if (ss_Flag) {
                    var det = secondarysalesApprovalEdit.defaults.Company_Code + '/' + seletedregionCode + '/' + stockCode + '/' + Year + '/' + Month;
                    final_Insert_Data = objDetails;
                    SSCoreREST.requestInvoke('api/CheckForDoubleEntry', det, null, "GET", secondarysalesApprovalEdit.ChkForDoubleEntry_SucessCallback, secondarysalesApprovalEdit.ChkForDoubleEntry_FailureCallback);
                    if (double_Entry_Check) {
                        if (final_Insert_Data.lstSecondaryDetails.length > 0) {
                            SSCoreREST.requestInvoke('api/InsertSecondarySales', "", final_Insert_Data, "POST", secondarysalesApprovalEdit.fnEntry_SuccessCallback, secondarysalesApprovalEdit.fnEntry_FailureCallback, null, "JSON");
                        }
                        else {
                            $('#Draft').prop('disabled', false);
                            $('#Submit').prop('disabled', false);
                            swal('Info', ' Please enter atleast one product to Draft/Submit Secondary Sales', 'info');
                            return false;
                        }
                    }
                    else {
                        $('#Draft').prop('disabled', false);
                        $('#Submit').prop('disabled', false);
                    }
                }
            }
        }
    },
    fnChangeProductList: function (e) {
        $('#dvDraftAndSave').show();
        // $('#dvReCal').show();

        var currentRow = $(e.element).parent().parent().parent();
        var currentProductCode = e.itemData.Id;
        var lstProduct = $.grep(product_List, function (v) {
            return v.Product_Code == currentProductCode;
        });
        if (lstProduct.length > 0) {
            if ($.inArray(currentProductCode, lstEnteredProducts) == -1) {
                lstEnteredProducts.push(currentProductCode);
            }

            if (lstProduct[0].Product_Exists == 1) {
                currentRow.find('#OPENING_BALANCE').val(lstProduct[0].Opening_Balance);
            }
            else {
                currentRow.find('#OPENING_BALANCE').val(lstProduct[0].Opening_Balance);
                currentRow.find('#OPENING_BALANCE').attr('readonly', false);
            }
            currentRow.find('#PURCHASE').val(lstProduct[0].Purchase);
            currentRow.find('#PURCHASE_RETURN').val(lstProduct[0].Purchase_Return);
            currentRow.find('#PRODUCT_PRICE').val(lstProduct[0].Product_Price);
            currentRow.find('#SALES').val(0);
            currentRow.find('#FREE_GOODS').val(0);
            currentRow.find('#SALES_RETURN').val(0);
            currentRow.find('#TRANSIT').val(0);
            secondarysalesApprovalEdit.fnReCalculate();
        }
    },
    fnShowProductList: function () {
        debugger;
        $('#Product_Details').html('');
        var content = "";
        if (product_List.length > 0) {

            content += '<table class="table table-responsive" style="overflow:none !important;">';
            content += '<thead>';
            content += '<tr class="bg-info text-white" style="font-size: 16px;">';
            var p_Exists = $.grep(privilege_List, function (v) {
                return v.Privilege_Name == "SS_ENTRY_PRODUCT_CHECK_V1";
            })
            //if (p_Exists.length == 0) {
            content += '<th><div class="custom-control custom-checkbox align-top"><input type="checkbox" class="custom-control-input align-top" value="41011" id="selectAllProducts" onclick="secondarysalesApprovalEdit.fnSelectAll();"><label class="custom-control-label" for="selectAllProducts"></label></div></th>';
            //}
            //else {
            //    content += '<th></th>';
            //}
            content += '<th>Product Name</th>';
            content += '<th>Opening Balance</th>';
            content += '<th>Product Price</th>';
            content += '</tr>';
            content += '</thead>';
            content += "<tbody>";
            for (var i = 0; i < product_List.length; i++) {
                content += "<tr class='font_class'>";
                if ($.inArray(product_List[i].Product_Code, lstEnteredProducts) == -1) {
                    content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='secondarysalesApprovalEdit.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "'><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                }
                else {
                    if (product_List[i].Is_Mandatory == 1) {
                        content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='secondarysalesApprovalEdit.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' checked class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "' disabled><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                    }
                    else {
                        content += "<td><div class='custom-control custom-checkbox align-top productShowGrid' onclick='secondarysalesApprovalEdit.fnRemoveValueFromArr(this,\"" + i + "\",\"" + product_List[i].Product_Code + "\")'><input type='checkbox' checked class='custom-control-input align-top' value='" + product_List[i].Product_Code + "' id='Produt_" + i + "'><label class='custom-control-label' for='Produt_" + i + "'></label></div></td>";
                    }
                }
                content += "<td>" + product_List[i].Product_Name + "</td>";
                content += "<td>" + product_List[i].Opening_Balance + "</td>";
                content += "<td>" + product_List[i].Product_Price + "</td>";
                content += "</tr>";
            }
            content += "</tbody>";
            content += "</table>";
        }
        $('#Product_Details').html(content);
        $('#productModal').show();
    },
    fnSelectAll: function () {
        debugger;
        if ($("#selectAllProducts").prop('checked') == true) {
            for (var i = 0; i < product_List.length; i++) {
                var productCode = product_List[i].Product_Code;
                lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                    return item !== productCode;
                });
                if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                    lstEnteredProducts.push(productCode);
                }
                lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                    return item !== productCode;
                });
                $("#Produt_" + i).attr('checked', true);
            }
        }
        else {
            for (var i = 0; i < product_List.length; i++) {
                var productCode = product_List[i].Product_Code;
                if (product_List[i].Is_Mandatory != 1) {
                    if ($("#Produt_" + i).prop('checked') == true) {
                        if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                            lstCheckMappedProd.push(productCode);
                            lstUnMappedProducts.push(productCode);
                        }
                        lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                            return item !== productCode;
                        });
                        $("#Produt_" + i).attr('checked', false);
                    }
                    else {
                        lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                            return item !== productCode;
                        });

                        if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                            lstEnteredProducts.push(productCode);
                        }
                        lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                            return item !== productCode;
                        });
                        $("#Produt_" + i).attr('checked', true);
                    }
                }
            }
        }
    },
    fnRemoveValueFromArr: function (Id, rowId, productCode) {
        debugger;
        if ($('#Produt_' + rowId).prop("checked") == false) {
            if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                lstCheckMappedProd.push(productCode);
                lstUnMappedProducts.push(productCode);
            }
            lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                return item !== productCode;
            });

        }
        else {
            lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                return item !== productCode;
            });

            if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                lstEnteredProducts.push(productCode);
            }
            lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                return item !== productCode;
            });
        }
    },
    fnHideModalPopup: function () {
        $('#productModal').hide();
    },
    fnPrefillSelectedProducts: function (mode, binddata) {
        debugger;
        var selectedData = "";
        var bindProduct = false;
        Insert_Mode = mode;
        if (mode == 'ShowAllProduct') {
            var lst = [];
            for (var i = 0; i < product_List.length; i++) {
                if ($("#Produt_" + i).prop('checked') == false) {
                    var productCode = product_List[i].Product_Code;
                    if (!($.inArray(productCode, lstEnteredProducts) == -1)) {
                        lstCheckMappedProd.push(productCode);
                    }
                    lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                        return item !== productCode;
                    });
                    lstUnMappedProducts.push(productCode);
                }
                else {
                    var productCode = product_List[i].Product_Code;
                    lstUnMappedProducts = lstUnMappedProducts.filter(function (item) {
                        return item !== productCode;
                    });
                    if (!($.inArray(productCode, lstCheckMappedProd) == -1)) {
                        lstEnteredProducts.push(productCode);
                    }
                    lstCheckMappedProd = lstCheckMappedProd.filter(function (item) {
                        return item !== productCode;
                    });
                }
            }
            $('.productShowGrid :checked').map(function () {
                var productCode = this.value;
                var disjson = $.grep(product_List, function (ele, index) {
                    return ele.Product_Code == productCode;
                });
                if ($.inArray(productCode, lstEnteredProducts) == -1) {
                    lst.push(disjson[0]);
                }
            });
            selectedData = lst;// grid2.getSelectedRecords();
            if (lstEnteredProducts.length == 0 && selectedData.length == 0) {
                swal('Info', 'Please Select Atleast One Product.', 'info');
                return false;
            }
            else {
                bindProduct = true;
            }
            if (lstEnteredProducts.length == 0) {
                $('#tblSSProductEntry tbody').html('');
            }
        }
        privilege = $.grep(privilege_List, function (ele, index) {
            return ele.Privilege_Name == "SS_INPUT_COLUMNS";
        });
        if (bindProduct) {
            var num = $("#tblSSProductEntry table tbody tr").length

            if ($('#tblSSProductEntry table tr').eq(num).find("#PRODUCT_NAME").val() == '') {
                $('#tblSSProductEntry table tr').eq(num).remove();
            }
            if (privilege.length != 0) {
                var content = "";
                Input_Columns = privilege[0].Privilege_Value.split(',');
                for (var i = 0; i < selectedData.length; i++) {
                    content = '';
                    content += '<tr>';
                    $("#tblSSProductEntry table tbody tr").length
                    content += '<td><input type="text" id="PRODUCT_NAME" name="Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i + 1) + '" class="form-control-sm"></td>';
                    content += '<td><div style="display: flex;">';
                    var price_Edit = $.grep(privilege_List, function (v) {
                        return v.Privilege_Name == "ALLOW_SS_PRICE_EDIT";
                    });
                    if (price_Edit.length > 0) {
                        if (price_Edit[0].Privilege_Value == "YES") {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '" step=".01"></div>';
                        }
                        else {
                            content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '" readonly></div>';
                        }
                    }
                    else {
                        content += '<div><input type="number"  id="PRODUCT_PRICE" class="form-control form-control-sm" value="' + selectedData[i].Product_Price + '" readonly></div>';
                    }
                    var prd_Price = $.grep(product_List, function (v) {
                        return v.Product_Name == selectedData[i].Product_Name;
                    });
                    if (prd_Price.length > 0) {
                        if ($.inArray(prd_Price[0].Product_Code, lstEnteredProducts) == -1) {
                            lstEnteredProducts.push(prd_Price[0].Product_Code)
                        }
                        if (prd_Price[0].Product_Price != selectedData[i].Product_Price) {
                            content += "<div><i class='fa fa-refresh' style='padding-top: 5px; padding-left: 3px; cursor: pointer;' id='refresh'></i></div>";
                        }
                    }
                    content += '</div></td>';
                    for (var j = 0; j < Input_Columns.length; j++) {
                        var tileCase = secondarysalesApprovalEdit.toTitleCase(Input_Columns[j].toLowerCase().replace('_', ' ')).replace(' ', '_');
                        var value = selectedData[i][tileCase] == undefined ? 0 : selectedData[i][tileCase];
                        if (Input_Columns[j] == "OPENING_BALANCE") {
                            var OBE = $.grep(privilege_List, function (v) {
                                return v.Privilege_Name == "SS_OPENING_BALANCE_EDITABLE";
                            })
                            if (OBE.length > 0) {
                                if (OBE[0].Privilege_Value == "YES") {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                                else {
                                    if (prd_Price[0].Product_Exists == 0) {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                    }
                                }
                            }
                            else {
                                if (prd_Price[0].Product_Exists == 0) {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                                else {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01" readonly></td>';
                                }
                            }
                        }
                        else {
                            if (Input_Columns[j] == "PURCHASE" || Input_Columns[j] == "PURCHASE_RETURN") {
                                var P_PR_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_PRIMARYSALES_PREFILL_COLUMN_EDITABLE";
                                })
                                if (P_PR_Editable.length > 0) {
                                    if (P_PR_Editable[0].Privilege_Value == "YES") {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                    }
                                    else {
                                        content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01"></td>';
                                    }
                                }
                                else {
                                    content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                }
                            }
                            else {
                                var CF_Editable = $.grep(privilege_List, function (v) {
                                    return v.Privilege_Name == "SS_COMPUTED_FIELD_EDITABLE";
                                })
                                if (CF_Editable.length > 0) {
                                    if (CF_Editable[0].Privilege_Value == "YES") {
                                        var WTC = $.grep(privilege_List, function (v) {
                                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                        })
                                        if (WTC.length > 0) {
                                            content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                        }
                                    }
                                    else {
                                        var WTC = $.grep(privilege_List, function (v) {
                                            return v.Privilege_Name == "SS_WHAT_TO_COMPUTE";
                                        })
                                        if (WTC.length > 0) {
                                            if (((WTC[0].Privilege_Value == "SALES") || (WTC[0].Privilege_Value == "CLOSING_BALANCE")) && (WTC[0].Privilege_Value == Input_Columns[j])) {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" readonly step=".01"></td>';
                                            }
                                            else {
                                                content += '<td><input type="number" id ="' + Input_Columns[j] + '" class="form-control form-control-sm" value = "' + value + '" step=".01"></td>';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    content += '<td><input type="number" id="SALES_AMOUNT" class="form-control form-control-sm Sales_Amount" readonly step=".01"></td>';
                    content += '<td><input type="number" id="CLOSING_BALANCE_AMOUNT" class="form-control form-control-sm Closing_Amount" readonly step=".01"></td>';
                    content += '<td><input type="text" id="REMARKS" class="form-control form-control-sm Remark"></td>';
                    if (selectedData[i].Is_Mandatory == 0) {
                        content += '<td><button type="button" id="DELETE" class="btn btn-primary btn-sm form-control form-control-sm" onclick = "SecondarySales.fnRemove(this);"><i class="fa fa-trash"></i></button></td>';
                    }
                    else {
                        content += '<td></td>';
                    }
                    content += '</tr>';

                    $('#tblSSProductEntry tbody').append(content);
                    if (mode == 'ShowAllProduct') {
                        var Is_Mand = $.grep(product_List, function (v) {
                            return v.Product_Code == selectedData[i].Product_Code;
                        });
                    }
                    else {
                        var Is_Mand = $.grep(product_List, function (v) {
                            return v.Product_Code == currentProductCode;
                        });
                    }

                    if (Is_Mand[0].Is_Mandatory == 1) {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            enabled: false,
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                secondarysalesApprovalEdit.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                    else {
                        var atcObj = new ej.dropdowns.AutoComplete({
                            //set the data to dataSource property
                            dataSource: product_Name_List,
                            fields: { value: 'label' },
                            // set the placeholder to AutoComplete input element
                            placeholder: 'Search Product',
                            change: function (e) {
                                secondarysalesApprovalEdit.fnEditChangeProductList(e);
                            }
                        });
                        atcObj.appendTo('input[name=Product_Name' + ($("#tblSSProductEntry table tbody tr").length + i) + ']');
                        atcObj.value = selectedData[i].Product_Name;
                    }
                }
            }
            if (lstUnMappedProducts.length > 0) {
                for (var i = 0; i < lstUnMappedProducts.length; i++) {
                    var disjson = $.grep(product_Name_List, function (ele, index) {
                        return ele.Id == lstUnMappedProducts[i]
                    })
                    $('[value="' + disjson[0].label + '"]').parent().parent().parent().parent().remove();
                }
            }

            lstUnMappedProducts = [];
            lstCheckMappedProd = [];
        }
        $('#productModal').hide();
        secondarysalesApprovalEdit.fnReCalculate();
    },

    fnRemove: function (id) {
        debugger;
        $('#TOTAL_SALE_AMOUNT').val('');
        $('#TOTAL_CLOSING_AMOUNT').val('');
        $('#dvDraftAndSave').show();
        // $('#dvReCal').show();
        if ($(id).parent().parent().children().children().children().children().length > 0) {
            var productName = $(id).parent().parent().children().children().children().children()[0].value;
            var disjson = $.grep(product_Name_List, function (ele, index) {
                return ele.label == productName;
            });
            lstEnteredProducts = lstEnteredProducts.filter(function (item) {
                return item !== disjson[0].Id;
            });
        }
        $(id).parent().parent().remove();
        secondarysalesApprovalEdit.fnReCalculate();
        secondarysalesApprovalEdit.fnSubmit(1, 'plus', '0');
        secondarysalesApprovalEdit.fnUpdateSSHeader();

    },

    ChkForDoubleEntry_SucessCallback: function (response) {
        debugger;
        if (response.Response.split('-')[0] == "2") {
            final_Insert_Data.obj.Existing_SS_Code = response.Response.split('-')[1];
            double_Entry_Check = true;
        }
        else if (response.Response.split('-')[0] == "1") {
            $('#Draft').prop('disabled', false);
            $('#Submit').prop('disabled', false);
            swal('Info', ' Secondary Sales has already been entered for the selected Year and Month combination', 'info');
            double_Entry_Check = false;
            return false;
        }
        else if (response.Response.split('-')[0] == "0") {
            double_Entry_Check = true;
        }
    },

    ChkForDoubleEntry_FailureCallback: function (response) {

    },

    fnEntry_SuccessCallback: function (response) {
        debugger;
        if (response.Response == 'SUCCESS') {
            if (final_Insert_Data.obj.SS_Status == "3") {
                if (global_variable != "plus") {
                    secondarysalesApprovalEdit.fnReset();
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);
                    swal('Success', 'Secondary Sales Entry Saved successfully', 'success');
                    return false;
                    //$('#dvStockistList').show();
                    //$('#dvShowProducts').show();
                    //$('#Draft').prop('visible', true);
                    //$('#Submit').prop('visible', true);
                }
                else {
                    $('#dvStockistList').show();
                    $('#dvShowProducts').show();
                    $('#Draft').prop('visible', true);
                    $('#Submit').prop('visible', true);
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);


                }

            }
            if (final_Insert_Data.obj.SS_Status == "1") {
                var auto_Approval = $.grep(privilege_List, function (v) {
                    return v.Privilege_Name == "ALLOW_SS_AUTO_APPROVAL";
                });
                if (auto_Approval.length > 0) {
                    if (auto_Approval[0].Privilege_Value == "YES") {
                        var details = secondarysalesApprovalEdit.defaults.Company_Code + '/' + stockCode + '/' + Year + '/' + Month;
                        SSCoreREST.requestInvoke('api/AutoApproveSS', details, "", "GET", secondarysalesApprovalEdit.fnAutoApproveSS_SuccessCallback, secondarysalesApprovalEdit.fnAutoApproveSS_FailureCallback);
                    }
                    else {
                        //if()
                        //{
                        //    secondarysalesApprovalEdit.fnReset();
                        //}

                        if (final_Insert_Data.obj.isUnApprovable == "1") {
                            secondarysalesApprovalEdit.fnReset();
                            secondarysalesApprovalEdit.fnUpdateSSHeader();
                            secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode, status);
                            swal('Success', 'Secondary Sales Applied successfully', 'success');
                            $('#dvSecondarySalesEntry').hide();
                            return false;
                        }
                        $('#Draft').prop('disabled', false);
                        $('#Submit').prop('disabled', false);
                        $('#btnSSApprove').prop('disabled', false);
                        $('#btnSSUnApprove').prop('disabled', false);
                    }
                }
                else {
                    if (final_Insert_Data.obj.isUnApprovable == "1") {
                        secondarysalesApprovalEdit.fnReset();
                        secondarysalesApprovalEdit.fnUpdateSSHeader();
                        secondarySalesApproval._getSecondarySalesDetailsForSelectedMonth(seletedregionCode, status);
                        swal('Success', 'Secondary Sales Applied successfully', 'success');
                        $('#dvSecondarySalesEntry').hide();
                        return false;
                    }
                    $('#Draft').prop('disabled', false);
                    $('#Submit').prop('disabled', false);
                    $('#btnSSApprove').prop('disabled', false);
                    $('#btnSSUnApprove').prop('disabled', false);
                }
            }
        }
    },
    fnUpdateSSHeader: function () {
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/Approval/UpdateSSStatusFromUnApproval",
            async: false,
            data: "regionCode=" + seletedregionCode + "&ssCode=" + final_Insert_Data.obj.Existing_SS_Code,
            success: function (resp) {
                secondarysalesApprovalEdit.fnUpdateSSHeaderSucess(resp);
            },
            error: function (e) {

            }
        })
    },
    fnUpdateSSHeaderSucess: function (Resp) {

    },
    fnEntry_FailureCallback: function (response) {
        $('#Draft').prop('disabled', false);
        $('#Submit').prop('disabled', false);
        swal('Info', 'Failed to enter Secondary Sales Data', 'info');
        return false;
    },
    fnReset: function () {
        document.querySelector("#txtYear").ej2_instances[0].enabled = true;
        document.querySelector("#txtMonthEdit").ej2_instances[0].enabled = true;
        document.querySelector("#txtStockist").ej2_instances[0].enabled = true;
        Year = "";
        Month = "";
        lstEnteredProducts = [];
        Edited_SS_Code = "";
        $('#tblSecondarySalesEntered').html('');
        $('#tblSSStockistEntryHeader').html('');
        $('#dvSSEntry').show();
        $('#dvStockistList').hide();
        $('#dvShowProducts').hide();
        $('.actionButtons').hide();
        $('#tblSSProductEntry').html('');
        secondarysalesApprovalEdit.fnBindMonthAndYear();
        //SecondarySales.fnGetSSEnteredDetails();
    },
}
function fnValidateDecimal(Id, event) {
    if (event.keyCode == 46) {
        return false;
    }
}