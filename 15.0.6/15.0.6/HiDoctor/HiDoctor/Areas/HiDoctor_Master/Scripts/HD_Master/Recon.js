var Recon = {
    defaults: {
        Company_Code: "",
        FormMode: "",
        type: "Not Entered / Recorded in HiDoctor",
        TableLength: 0,
        loginUserCode: "",
        selectedUserCode: "",
        LoginRegionCode: "",
        User_list: [],
        User_list_raw: [],
        IsEdit: false,
        EditHeaderId: 0,
        Product_Recon_Id: 0,
        Doctor_list: [],
        Doctor_Speciality: [],
        RIGID_ATTENDANCE_DOCTOR_ENTRY: 'NO',
        Month: 0,
        Year: 0,
        CompanyId: 0,


    },
    fnIsEditView: function () {
        debugger;
        $("#dvApprovalView,#dvActionForViewApprove").hide();
        $(".btn").show();
        if (Recon.defaults.IsEdit) {
            debugger;
            $("#dvApprovalView,#dvActionForViewApprove").show();
            $(".btn").hide();
            Recon.fnView(Recon.defaults.EditHeaderId);
        }

    },
    fnRedirectApprove: function () {
        fnLoadBody("HiDoctor_Master/Recon/ReconApprovalList", this, "1119");
    },
    initialize: function () {
        debugger;

        $("#divReconSummary").show();
        $("#divAddRecon").hide();
        Recon.fnBindReconSummary(Recon.defaults.loginUserCode);
        $('#txtMonth').monthpicker();
        Recon.fnIsEditView();
        Recon.fnGetSpecialityList();
    },
    AddReconinitialize: function () {
        $("#divReconSummary").hide();
        $("#divAddRecon").show();
        $("#btnSave").hide();
        $("#btnDraft").hide();
        $("#proTable").hide();
        $("#txtMonth").val('')
        $("#proTable tbody tr").remove();
        $("#txtUserName").prop('disabled', false);
        $("#txtUserName").val('');
        $("#txtMonth").prop('disabled', false);
        $("#txtMonth").val('');
        $("#hdnUserCode").val('');
        $("#btnSave").val('Submit');
        $("#btnGo").show();
        if (Recon.defaults.User_list.length == 1) {
            $("#txtUserName").val(Recon.defaults.User_list[0].label);
            $("#hdnUserCode").val(Recon.defaults.User_list[0].value);
        }
    },
    fnHideRecon: function () {
        $("#divReconSummary").show();
        $("#divAddRecon").hide();
    },
    fnBindReconSummary: function (user_code) {
        $.blockUI();
        debugger;
        var _this = Recon;
        context = ["Api/ReconApi/GetSummary", Recon.defaults.Company_Code, user_code];
        CoreREST.get(_this, context, null, Recon.fnBindReconSummarySuccess, Recon.fnBindReconSummaryfailure);
    },
    fnBindReconSummarySuccess: function (data) {
        $("#divSummary").html('');
        if (data.Status == "1") {
            var list = data.list
            var grid = new ej.grids.Grid({
                dataSource: list,
                showColumnChooser: true,
                allowPaging: true,
                allowGrouping: true,
                allowSorting: true,
                allowFiltering: true,
                allowResizing: true,
                allowCellMerging: true,
                allowScrolling: true,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                filterSettings: { type: 'CheckBox' },
                toolbar: ['Search', 'ColumnChooser'],
                aggregates: [],
                columns: [
                { field: "Employee_Name", headerText: "Employee name" },
                {
                    field: "For_The_Month", headerText: "For the month"
                },
                {
                    field: "Created_Date", headerText: "Created Date"
                },
                {
                    field: "Product_Recon_Status_Display_Name", headerText: "Recon Status"
                },
                {
                    field: "Is_Variation", headerText: "Is variation found"
                },
                {
                    field: "Last_Approval_By", headerText: "Last action by"
                },
                {
                    field: "Last_Approval_Remarks", headerText: "Last action remarks"
                },
                {
                    template: "<a href=#;>Edit</a>", width: 150, textAlign: 'center', headerText: "View / Edit"
                },
                {
                    template: "<a href=#;>Delete</a>", width: 150, textAlign: 'center', headerText: "Delete"
                },
                 {
                     template: "<a href=#;>History</a>", width: 150, textAlign: 'center', headerText: "View History"
                 },
                ],
                queryCellInfo: Recon.queryCellInfo,
            });
            debugger;
            grid.appendTo('#divSummary');
            $.unblockUI();
        }
        else {
            fnMsgAlert('error', 'Recon', data.Message);
            $.unblockUI();
        }
    },

    fnBindReconSummaryfailure: function (data) {
        debugger;
        $.unblockUI();
    },
    queryCellInfo: function (args) {
        debugger;
        if (args.column.headerText == "View / Edit") {

            //Unapproved
            if (args.data.Product_Recon_Status == '0') {
                args.cell.innerText = "Edit";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnEdit(" + args.data.Product_Recon_Id + ",2)'>Edit</a>"
            }
                //approved
            else if (args.data.Product_Recon_Status == '1') {
                args.cell.innerText = "View";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnView(" + args.data.Product_Recon_Id + ")'>View  </a>"
            }//applied
            else if (args.data.Product_Recon_Status == '2') {
                args.cell.innerText = "View";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnView(" + args.data.Product_Recon_Id + ")'>View</a>";
            }
                //n progress
            else if (args.data.Product_Recon_Status == '3') {
                args.cell.innerText = "View";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnView(" + args.data.Product_Recon_Id + ")'>View</a>";
            }
                //cancelled
            else if (args.data.Product_Recon_Status == '4') {
                args.cell.innerText = "View";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnView(" + args.data.Product_Recon_Id + ")'>View</a>";
            }
                //Draft
            else if (args.data.Product_Recon_Status == '5') {
                args.cell.innerText = "Edit";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnEdit(" + args.data.Product_Recon_Id + ",2)'>Edit</a>"
            }
        } else if (args.column.headerText == "Delete") {
            if (args.data.Product_Recon_Status == '0' || args.data.Product_Recon_Status == '5') {
                args.cell.innerText = "Delete";
                args.cell.style.cursor = "pointer";
                args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='Recon.fnCancel(" + args.data.Product_Recon_Id + ")'>Delete</a>";
            }
            else {
                args.cell.innerText = "";
            }
        }
        else if (args.column.headerText == "View History") {
            args.cell.innerText = "View History";
            args.cell.style.cursor = "pointer";
            args.cell.innerHTML = "<a style='textDecoration:\'underline\'' onclick='ReconApproval.fnViewHistory(" + args.data + ")'>View History</a>";
            $(args.cell).bind("click", function () {
                ReconApproval.fnViewHistory(args.data);
            });
        }
    },
    formatDate: function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    },
    fnEdit: function (args, FormMode) {
        debugger;

        Recon.defaults.FormMode = FormMode;
        debugger;
        var _this = Recon;
        context = ["Api/ReconApi/GetDetailsForEdit", Recon.defaults.Company_Code, Recon.defaults.loginUserCode, parseInt(args), FormMode];
        CoreREST.getsync(_this, context, null, Recon.fnBindReconEditSuccess, Recon.fnBindReconSummaryfailure);
    },
    //-====================-----------------------------------------
    fnBindReconEditSuccess: function (data) {
        debugger;
        Recon.AddReconinitialize();
        var ProductReconSummaryModel = data.list.ProductReconSummaryModel;
        $("#hdnUserCode").val(ProductReconSummaryModel[0].User_Code);

        var cus = $.grep(Recon.defaults.User_list, function (element, index) {
            return element.value == ProductReconSummaryModel[0].User_Code;

        });
        if (cus != null && cus.length > 0)
            $("#txtUserName").val(cus[0].label);
        Recon.defaults.Product_Recon_Id = ProductReconSummaryModel[0].Product_Recon_Id;
        $("#txtMonth").val(Recon.GetmonthName(ProductReconSummaryModel[0].Product_Recon_Month) + '-' + ProductReconSummaryModel[0].Product_Recon_Year);
        debugger;
        //2 Edit
        Recon.fnAddNewRecon(Recon.defaults.FormMode);
        debugger;

        for (var inner = 0; inner < Recon.defaults.TableLength; inner++) {
            for (var i = 0; i < data.list.PRODUCT_RECON_SAVE_DETAILS.length ; i++) {
                var productCode = data.list.PRODUCT_RECON_SAVE_DETAILS[i].Product_Code;
                var Product_Recon_Batch_Detail_Id = data.list.PRODUCT_RECON_SAVE_DETAILS[i].Product_Recon_Batch_Detail_Id;
                var batch = data.list.PRODUCT_RECON_SAVE_DETAILS[i].Batch_Code;
                if (batch == null)
                    batch = '-';
                if ($("#hdn_Product_Code_" + inner).val() == productCode && $("#hdn_Batch_number_" + inner).val() == batch) {
                    //  $("#txtqtySystem_" + inner).val(PRODUCT_RECON_SAVE_DETAILS[i].);
                    $("#txtVariationQty_" + inner).val(data.list.PRODUCT_RECON_SAVE_DETAILS[i].Variation_Qty);
                    $("#ddlReason_" + inner).val(data.list.PRODUCT_RECON_SAVE_DETAILS[i].Variation_Type);
                    $("#txtRemark_" + inner).val(data.list.PRODUCT_RECON_SAVE_DETAILS[i].User_Remarks_For_Variation);

                    $("#txtqtyHand_" + inner).val(parseInt($("#txtqtySystem_" + inner).val()) - parseInt(data.list.PRODUCT_RECON_SAVE_DETAILS[i].Variation_Qty));
                    if (data.list.PRODUCT_RECON_SAVE_DETAILS[i].Variation_Qty != '' && data.list.PRODUCT_RECON_SAVE_DETAILS[i].Variation_Qty != 0) {
                        $("#ddlReason_" + inner).prop('disabled', false);
                    }
                    var pro = $.grep(data.list.PRODUCT_RECON_SAVE_DCR_DETAILS, function (element, index) {
                        return element.Product_Code == productCode && element.Product_Recon_Batch_Detail_Id == Product_Recon_Batch_Detail_Id;

                    });
                    if (pro != null && pro.length > 0) {
                        Recon.fnVariationChange(inner);
                        for (var p = 0; p < pro.length; p++) {
                            var dcr_pr_id = productCode + '_' + batch + '_' + (p + 1);
                            var DcrDate = Recon.formatDate(pro[p].DCR_Actual_Date);
                            //var Due_Date = new Date(eval(DcrDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)")));
                            ////fnDateConvert(new Date(dateIndex), "dd-mm-yyy");
                            //var _day = Due_Date.getDate();
                            //var _month = Due_Date.getMonth();
                            //var _year = Due_Date.getFullYear();
                            //_month = _month + 1;
                            //if (_month.toString().length == 1)
                            //    _month = "0" + _month;
                            //if (_day.toString().length == 1)
                            //    _day = "0" + _day;
                            //DcrDate = (_day + '/' + (_month) + '/' + _year);

                            $("#DCRDate_" + dcr_pr_id).val(DcrDate);
                            $("#DoctorName_" + dcr_pr_id).val(pro[p].Doctor_Name);
                            $("#hdnDocCode_" + dcr_pr_id).val(pro[p].Doctor_Code);


                            $("#Speciality_" + dcr_pr_id).val(pro[p].Specialty_Name);
                            if ($("#hdnDocCode_" + dcr_pr_id).val() != '')
                                $("#Speciality_" + dcr_pr_id).prop('disabled', true);

                            // $("#hdnSpecCode_" + dcr_pr_id).val(pro[p].);
                            $("#DCRQuanity_" + dcr_pr_id).val(pro[p].Qty_Given);
                            if ((p + 1) < pro.length) {
                                Recon.fnAddDcrDate((p + 2), null, inner);
                                $("#btn" + dcr_pr_id).remove();
                            }

                        }
                    }

                }
            }
        }
        //---------------
        $("#txtUserName").prop('disabled', true);
        $("#txtMonth").prop('disabled', true);
        $("#btnSave").val('Update');
        $("#btnGo").hide();
    },
    fnView: function (args) {
        $.blockUI();
        Recon.fnEdit(args, 3);
        //Recon.defaults.FormMode = "3";
        for (var i = 0; i < Recon.defaults.TableLength ; i++) {
            $("#txtqtyHand_" + i).prop('disabled', true);
            $("#ddlReason_" + i).prop('disabled', true);
            $("#ddlReason_" + i).prop('disabled', true);
            $("#txtRemark_" + i).prop('disabled', true);
            var Product_Code = $("#hdn_Product_Code_" + i).val();
            var Batch_Code = $("#hdn_Batch_number_" + i).val();

            for (var d = 0; d < 31; d++) {
                if ($("#DCRDate_" + Product_Code + "_" + Batch_Code + "_" + d).length > 0) {
                    $("#DoctorName_" + Product_Code + "_" + Batch_Code + "_" + d).prop('disabled', true);
                    $("#Speciality_" + Product_Code + "_" + Batch_Code + "_" + d).prop('disabled', true);
                    $("#DCRQuanity_" + Product_Code + "_" + Batch_Code + "_" + d).prop('disabled', true);
                    $("#DoctorName_" + Product_Code + "_" + Batch_Code + "_" + d).prop('disabled', true);
                    $("#remove_" + Product_Code + "_" + Batch_Code + "_" + d).hide();
                    $("#btn" + Product_Code + "_" + Batch_Code + "_" + d).hide();
                }
            }
        }
        $("#txtUserName").prop('disabled', true);
        $("#txtMonth").prop('disabled', true);
        $("#btnGo").hide();
        $("#btnSave").hide();
        $("#btnDraft").hide();
        $.unblockUI();
    },
    fnCancel: function (HeaderID) {
        bootbox.prompt({
            title: "Please Enter the remark for delete this Recon",
            inputType: 'textarea',
            callback: function (result) {
                var validation = true;
                debugger;
                if (result != null)
                    if (result.length > 0) {
                        if (result.length > 500) {
                            alert('Remark Length should be less than 500 charter')
                            validation = false;
                        }
                        else
                            Recon.fnCancelConfig(HeaderID, result);
                        validation = true;
                    }
                    else {
                        alert('Please Enter Remark')
                        validation = false;
                    }
                if (!validation)
                    return false;
            }
        });
        $("div.modal-dialog>.modal-content").removeClass("modal-content");
    },
    fnCancelConfig: function (HeaderID, result) {
        $.blockUI();
        context = ["Api/ReconApi/CancelProductRecon", Recon.defaults.Company_Code, Recon.defaults.loginUserCode, HeaderID, result];
        CoreREST.post(Recon, context, null, Recon.fnCancelSuccess, Recon.fnReconProductfailure);

    },
    fnCancelSuccess: function (data) {
        //  console.log(data);
        if (data) {
            fnMsgAlert('success', 'Recon', "Your recon request is cancelled successfully!.");
            $.unblockUI();
            Recon.initialize();
        }
        else { fnMsgAlert('error', 'Recon', "Your recon request is cancelled failure?"); $.unblockUI(); }

    },
    fnCheckExists: function (data) {
        // console.log(data.list);
        var msg = $.trim(data.list);
        if (Recon.defaults.FormMode == '3')
            msg = '';
        if (msg != '') {
            fnMsgAlert('info', 'Recon', msg);
            $("#proTable").hide();
            $.unblockUI();
            $("#btnSave").hide();
            $("#btnDraft").hide();
            return false;
        } else {
            context = ["Api/ReconApi/GetReconProduct", Recon.defaults.Company_Code, Recon.defaults.loginUserCode, Recon.defaults.selectedUserCode, Recon.defaults.Month, Recon.defaults.Year, Recon.defaults.FormMode];
            CoreREST.getsync(Recon, context, null, Recon.fnBindReconProduct, Recon.fnReconProductfailure);
        }

    },
    fnAddNewRecon: function (FormMode) {
        $.blockUI();
        debugger;
        if ($.trim($("#txtUserName").val()) == '') {
            fnMsgAlert('info', 'Recon', 'Please select a User Name');
            $.unblockUI();
            return false;
        }
        else if (($.trim($("#hdnUserCode").val()) == '')) {
            fnMsgAlert('info', 'Recon', 'Invalide User Name');
            $.unblockUI();
            return false;
        }
        if ($("#txtMonth").val().trim() == '') {
            fnMsgAlert('info', 'Recon', 'Please select a month');
            $.unblockUI();
            return false;
        }

        //$("#btnSave").show();
        //$("#proTable").show();
        //$("#btnSave").val('Save');

        //Recon.AddReconinitialize();
        Recon.defaults.FormMode = FormMode;
        Recon.defaults.Month = Recon.getMonthFromString($("#txtMonth").val().split('-')[0]);
        Recon.defaults.Year = parseInt($("#txtMonth").val().split('-')[1]);
        Recon.defaults.selectedUserCode = $("#hdnUserCode").val();
        if (Recon.defaults.User_list_raw.length > 0) {
            var _SelectedUserCode = $.grep(Recon.defaults.User_list_raw, function (element, index) {
                return element.User_Code == Recon.defaults.selectedUserCode;
            });
            if (_SelectedUserCode.length > 0) {
                Recon.GetRegionDoctorList(_SelectedUserCode[0].Region_code);
            } else {
                fnMsgAlert('info', 'Recon', 'No Region mapping.');
                $.unblockUI();
                return false;
            }
        }

        //for (var doc = 0; doc < Recon.defaults.User_list_raw.length; doc++) {
        //    if (Recon.defaults.User_list_raw[doc].User_Code == Recon.defaults.selectedUserCode) {
        //        if (Recon.defaults.User_list_raw[doc].Region_Code) {
        //            Recon.GetRegionDoctorList(Recon.defaults.User_list_raw[doc].Region_Code);
        //            break;
        //        } else {
        //            fnMsgAlert('info', 'Recon', 'No Region mapping.');
        //            $.unblockUI();
        //            return false;
        //        }


        //    }
        //}




        //var user_code = "USC00000001";
        //Recon.defaults.loginUserCode = "USC00000001";
        var _this = Recon;
        //if (FormMode == 1) {
        context = ["Api/ReconApi/GetNonReconEntered", Recon.defaults.Company_Code, Recon.defaults.selectedUserCode, $("#txtMonth").val().replace('-', ' '), Recon.defaults.FormMode];
        CoreREST.getsync(_this, context, null, Recon.fnCheckExists, Recon.fnReconProductfailure);
        // }
        // else {
        //   context = ["Api/ReconApi/GetReconProduct", Recon.defaults.Company_Code, Recon.defaults.loginUserCode, Recon.defaults.selectedUserCode, Recon.defaults.Month, Recon.defaults.Year, Recon.defaults.FormMode];
        //    CoreREST.getsync(_this, context, null, Recon.fnBindReconProduct, Recon.fnReconProductfailure);
        // }

    },
    fnBindReconProduct: function (data) {
        debugger;
        var list = data.list;
        var row = "";
        Recon.defaults.TableLength = list.length;
        if (list.length > 0) {
            $("#btnSave").show();
            $("#btnDraft").show();
            $("#proTable").show();
            $("#btnSave").val('Submit');
        }
        $("#proTable tbody").html('');

        if (list.length == 0) {
            fnMsgAlert('info', 'Recon', "No Product available");
            $.unblockUI();
            $("#btnSave").hide();
            $("#btnDraft").hide();
            return false;

        }
        for (var i = 0; i < list.length; i++) {
            row = "";
            row = "<tr id='Row_" + i + "'><td><input type='hidden' id='hdn_Product_Code_" + i + "' value='" + list[i].Product_Code + "' /><span id='spn_Product_Name_" + i + "'> " + list[i].Product_Name + "</span></td>";
            row += "<td><input type='hidden' id='hdn_Batch_number_" + i + "' value='" + list[i].Batch_Number + "' />" + list[i].Batch_Number + "</td>";
            row += "<td><input type='hidden' id='hdn_DCRRowCount_" + i + "' value='0' /> <input type='number' class=\"form-control\" disabled id='txtqtySystem_" + i + "' value='" + list[i].Current_Stock + "' /> </td>";
            row += "<td> <input type='number' class=\"form-control clsvarient\" onkeypress='return Recon.fnFindVariationQty(this,event);' onblur='Recon.fnFindVariationQty(this,null);' id='txtqtyHand_" + i + "' value='" + list[i].Current_Stock + "' /> </td>";
            row += "<td><input type='number' class=\"form-control\" disabled minlength=0 value='0' id='txtVariationQty_" + i + "' /> </td>";


            var ddl = "<select id='ddlReason_" + i + "' onChange='Recon.fnVariationChange(" + i + ");''>";
            ddl += "<option value='0'>-Select-</option>";
            ddl += "<option value='Lost'>Lost</option>";
            ddl += "<option value='Missing'>Missing</option>";
            ddl += "<option value='Damaged'>Damaged</option>";
            ddl += "<option value='Breakage'>Breakage</option>";
            ddl += "<option value='Inward Acknowledgement Mistake'>Inward Acknowledgement Mistake</option>";
            ddl += "<option value='Expired'>Expired</option>";
            ddl += "<option value='Not Entered / Recorded in HiDoctor'>Not Entered / Recorded in HiDoctor</option>";
            ddl += "</select>";



            row += "<td>" + ddl + "</td>";
            row += "<td><textarea class=\"form-control\" id='txtRemark_" + i + "' > </textarea></td>";
            row += "</tr>";
            $("#proTable tbody").append(row);
            $("#ddlReason_" + i).prop('disabled', true);
        }
        $.unblockUI();
        $('.clsvarient').focus(function () {
            debugger;
            $(this).val('');
        });

        $('.clsvarient').blur(function () {
            debugger;
            if ($.trim($(this).val()) == '')
                $(this).val(0);
        });

    },
    fnReconProductfailure: function () {

    },
    //--------------------------------------------------
    fnAddProRow: function () {

    },
    fnFormAction: function (Product_Recon_Status) {
        $.blockUI();
        //add
        debugger;
        $("#btnSave").hide();
        $("#btnDraft").hide();
        var flag = false;
        if ($.trim($("#txtUserName").val()) == '') {
            fnMsgAlert('info', 'Recon', 'Please select a User Name');
            $.unblockUI();
            return false;
        }
        else if (($.trim($("#hdnUserCode").val()) == '')) {
            fnMsgAlert('info', 'Recon', 'Invalide User Name');
            $.unblockUI();
            return false;
        }
        if ($("#txtMonth").val().trim() == '') {
            fnMsgAlert('info', 'Recon', 'Please select a month');
            $.unblockUI();
            return false;
        }

        var Month = Recon.getMonthFromString($("#txtMonth").val().split('-')[0]);
        var Year = parseInt($("#txtMonth").val().split('-')[1]);
        if (Recon.defaults.FormMode == "1" || Recon.defaults.FormMode == "2") {
            // if (Recon.defaults.FormMode == '2')
            //     Product_Recon_Status = 5;
            Recon.fnGetPrivilegeValue($("#hdnUserCode").val());
            var PRODUCT_RECON_SAVE_DETAILS = new Array();
            var PRODUCT_RECON_SAVE_DCR_DETAILS = new Array();
            for (var p = 0; p < Recon.defaults.TableLength; p++) {
                var product = {};
                product.Product_Code = $("#hdn_Product_Code_" + p).val();
                product.Batch_Code = $("#hdn_Batch_number_" + p).val();
                product.Variation_Qty = $("#txtVariationQty_" + p).val();

                product.Variation_Type = $("#ddlReason_" + p).val();
                if (product.Variation_Type == '0')
                    product.Variation_Type = '';
                product.Qty_Hand = $("#txtqtySystem_" + p).val();
                if (parseInt($("#txtqtyHand_" + p).val()) < 0) {
                    fnMsgAlert('error', 'Recon', "Quantity in hand should be greater than 0 (" + $("#spn_Product_Name_" + p + "").text() + ")");
                    $("#btnSave").show();
                    $("#btnDraft").show();
                    $.unblockUI();
                    return false;
                }
                if ($("#txtVariationQty_" + p).val().trim() != "" && $("#txtVariationQty_" + p).val() != "0") {
                    if ($("#ddlReason_" + p).val() == '0') {
                        fnMsgAlert('info', 'Recon', "Select the Variation Type");
                        $("#btnSave").show();
                        $("#btnDraft").show();
                        $.unblockUI();
                        return false;
                    }

                    if ($("#txtRemark_" + p).val().trim() == '') {
                        fnMsgAlert('info', 'Recon', "Enter the remark ");
                        $("#btnSave").show();
                        $("#btnDraft").show();
                        $.unblockUI();
                        return false;
                    }
                }
                if ($("#ddlReason_" + p).val() != '0')
                    product.User_Remarks_For_Variation = $("#txtRemark_" + p).val();
                PRODUCT_RECON_SAVE_DETAILS.push(product);
                var validation = true;
                var SumofDCRQty = 0;
                for (var d = 1; d <= 31; d++) {
                    debugger;
                    var DCR = {};
                    //Check id is exist or not

                    if ($("#DoctorName_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).length > 0 && $("#ddlReason_" + p).val() == "Not Entered / Recorded in HiDoctor" && $("#Code_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).is(':visible') == true) {
                        DCR.DCR_Actual_Date = $("#DCRDate_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val();
                        DCR.Doctor_Name = $("#DoctorName_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val();
                        DCR.Doctor_Code = $("#hdnDocCode_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val();
                        DCR.Specialty_Name = $("#Speciality_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val();
                        DCR.Specialty_Code = $("#hdnSpecCode_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val();
                        if (DCR.DCR_Actual_Date != '') {
                            DCR.DCR_Actual_Date = (DCR.DCR_Actual_Date.split('/')[2] + "-" + DCR.DCR_Actual_Date.split('/')[1] + "-" + DCR.DCR_Actual_Date.split('/')[0]);
                            if (DCR.Doctor_Name == '') {
                                fnMsgAlert('info', 'Recon', 'Enter Doctor Name ');
                                $("#btnSave").show();
                                $("#btnDraft").show();
                                $.unblockUI();
                                validation = false;
                                return false;
                            } else if (DCR.Doctor_Code == '' && DCR.Doctor_Name != '') {
                                // var doc = 
                                doc = Recon.defaults.RIGID_ATTENDANCE_DOCTOR_ENTRY;
                                if (doc == 'YES') {
                                    fnMsgAlert('info', 'Recon', 'Enter Valid Doctor Name (' + DCR.Doctor_Name + ")");
                                    $("#btnSave").show();
                                    $("#btnDraft").show();
                                    $.unblockUI();
                                    validation = false;
                                    return false;
                                } else {
                                    if (DCR.Specialty_Name == '') {
                                        fnMsgAlert('info', 'Recon', 'Select Speciality Name  for Doctor(' + DCR.Doctor_Name + ")");
                                        $("#btnSave").show();
                                        $("#btnDraft").show();
                                        $.unblockUI();
                                        validation = false;
                                        return false;
                                    }
                                }
                            }
                            else {
                                if (DCR.Specialty_Name == '') {
                                    fnMsgAlert('info', 'Recon', 'Select Speciality Name  for Doctor(' + DCR.Specialty_Name + ")");
                                    $("#btnSave").show();
                                    $("#btnDraft").show();
                                    $.unblockUI();
                                    validation = false;
                                    return false;
                                }
                            }
                            var doc = $.grep(Recon.defaults.Doctor_list, function (element, index) {
                                return element.value == DCR.Doctor_Code;

                            });
                            if (doc.length > 0)
                                DCR.Doctor_Region_Code = doc[0].Region_Code;
                            else
                                DCR.Doctor_Region_Code = Recon.defaults.LoginRegionCode;
                            DCR.Product_Code = product.Product_Code;
                            DCR.Batch_Code = product.Batch_Code;
                            DCR.Qty_Given = $("#DCRQuanity_" + product.Product_Code + "_" + product.Batch_Code + "_" + d).val()
                            SumofDCRQty = parseInt(SumofDCRQty) + parseInt(DCR.Qty_Given);
                            PRODUCT_RECON_SAVE_DCR_DETAILS.push(DCR);
                            // }
                        }
                    }
                    else
                        break;
                }
                if (parseInt(product.Variation_Qty) != parseInt(SumofDCRQty) && $("#ddlReason_" + p).val() == "Not Entered / Recorded in HiDoctor") {
                    flag = true;
                    fnMsgAlert('info', 'Recon', "Variation qauntity and DCR quantity is mismatched Product Name - " + $("#spn_Product_Name_" + p).text());
                    $("#btnSave").show();
                    $("#btnDraft").show();
                    $.unblockUI();
                    return false;

                }
            }
            debugger;
            if (!validation) {
                $("#btnSave").show();
                $("#btnDraft").show();
                $.unblockUI();
                return false;
            }
            //  var RecoRequestModel = new Object();
            if (PRODUCT_RECON_SAVE_DETAILS.length == 0) {
                fnMsgAlert('info', 'Recon', "atleast select any one product");
                $("#btnSave").show();
                $("#btnDraft").show();
                $.unblockUI();
                return false;
            }
            var RecoRequestModel = {
                Product_Recon_Id: Recon.defaults.Product_Recon_Id,
                CompanyCode: Recon.defaults.Company_Code,
                LoginUserCode: Recon.defaults.loginUserCode,
                Month: parseInt(Month),
                Year: parseInt(Year),
                SelectedUserCode: Recon.defaults.selectedUserCode,
                SaveMode: Recon.defaults.FormMode,
                Product_Recon_Status: Product_Recon_Status,
                PRODUCT_RECON_SAVE_DETAILS: PRODUCT_RECON_SAVE_DETAILS,
                PRODUCT_RECON_SAVE_DCR_DETAILS: PRODUCT_RECON_SAVE_DCR_DETAILS
            }
            //Check value are equal
            if (flag) {
                fnMsgAlert('info', 'Recon', "Same Products are DCR value are not equal value ");
                $("#btnSave").show();
                $("#btnDraft").show();
                $.unblockUI();
                return false;
            } else {
                var _this = Recon;
                context = ["Api/ReconApi/saveProductRecon"];
                CoreREST.post(_this, context, RecoRequestModel, Recon.fnBindReconSaveSuccess, Recon.fnBindReconSummaryfailure);
            }

        }   //Edit
        else if (Recon.defaults.FormMode == "2") {

        }
            //View
        else if (Recon.defaults.FormMode == "3") {

        }

    },
    fnBindReconSaveSuccess: function (data) {
        fnMsgAlert('success', 'Recon', data.Message);
        $.unblockUI();
        Recon.fnHideRecon();
        Recon.initialize();
    },
    fnFindVariationQty: function (cur, e) {

        debugger;
        var id = cur.id.split('_')[1];
        var txtqtyHand = "txtqtyHand_" + id;
        var txtqtySystem = "txtqtySystem_" + id;
        var txtVariationQty = "txtVariationQty_" + id;
        $("#ddlReason_" + id).prop('disabled', false);

        var qtySystem = (isNaN(parseInt($("#" + txtqtySystem).val()))) ? 0 : parseInt($("#" + txtqtySystem).val());
        var qtyHand = (isNaN(parseInt($("#" + txtqtyHand).val()))) ? 0 : parseInt($("#" + txtqtyHand).val());
        var newQty = "";
        if (e != null)
            newQty = $("#" + txtqtyHand).val() + e.key;
        else
            newQty = qtyHand;
        if (parseInt(newQty) > qtySystem || parseInt(qtyHand) < 0) {
            $("#ddlReason_" + id).prop('disabled', true);
            $("#ddlReason_" + id).val('0');
            Recon.fnVariationChange(id);
            return false;
        }
        else {
            $("#" + txtVariationQty).val((qtySystem - parseInt(newQty)));
            if (qtySystem - parseInt(newQty) == 0) {
                $("#ddlReason_" + id).prop('disabled', true);
                $("#ddlReason_" + id).val('0');
                Recon.fnVariationChange(id);
            }
        }

    },
    fnVariationChange: function (id) {
        debugger;
        if ($("#ddlReason_" + id).val() == Recon.defaults.type) {
            var row = "";
            row += "<tr id='Code_" + $("#hdn_Product_Code_" + id).val() + "_" + $("#hdn_Batch_number_" + id).val() + "_1'>";
            row += "<td>DCR Date</td>";
            row += "<td>Doctor Name</td>";
            row += "<td>Specialty Name</td>";
            row += "<td>Quantity Given</td><td>Action</td>";
            row += "</tr>"

            $('#Row_' + id).after(row);
            Recon.fnAddDcrDate(1, null, id);
        }
        else {
            //Remove
            Recon.fnDeleteDCRRow(id);
        }
    },
    fnValidateForMissedInDCR: function (ev, ProductCode, RowId) {
        debugger;
        var MaxQty = parseInt($("#txtVariationQty_" + RowId).val());
        var EnteredQty = 0;
        ProductCode = ".cls_" + ProductCode;
        $(ProductCode).each(function () {

            var _Id = $(this).attr("id");
            var arr = _Id.split('_');
            var _lastCount = parseInt(arr[3]) - 1;
            arr.splice(-1, 1)
            arr.push(_lastCount);
            _Id = arr.join("_");
            var DCR = _Id.replace("Code", "DCRQuanity");
            if ($("#" + _Id).is(':visible') != true)
                EnteredQty = +EnteredQty + parseInt($("#" + DCR).val());
        });
        if (MaxQty < EnteredQty) {
            fnMsgAlert('info', 'Recon', "Please enter max value of " + MaxQty + " Quantity.");
            $(ev).val(0);
            return false;
        }
    },
    fnCheckSameDCRDateANDDoctor: function (ev, ProductCode) {
        debugger;
        var flag = false;
        ProductCode = ".cls_" + ProductCode;
        var _Doctor = $(ev).attr("id").replace("DoctorName", "DCRDate");
        var DoctorName = $.trim($(ev).val());
        var DoctorDCR = $.trim($("#" + _Doctor).val());

        $(ProductCode).each(function () {
            debugger;
            var _Id = $(this).attr("id");
            var arr = _Id.split('_');
            var _lastCount = parseInt(arr[3]) - 1;
            arr.splice(-1, 1)
            arr.push(_lastCount);
            _Id = arr.join("_");
            var DCRDate = _Id.replace("Code", "DCRDate");
            var DCRDoctor = _Id.replace("Code", "DoctorName");
            debugger;


            if (_Doctor != DCRDate && $.trim($("#" + DCRDate).val()) == DoctorDCR && $.trim($("#" + DCRDoctor).val()) == DoctorName) {
                flag = true;
            }


        });
        if (flag) {
            $(ev).val('');
            $("#" + _Doctor.replace("DCRDate", "Speciality")).val('');
            $("#" + _Doctor.replace("DCRDate", "hdnSpecCode")).val('');
            $("#" + _Doctor.replace("DCRDate", "hdnDocCode")).val('');

            fnMsgAlert('info', 'Recon', "Already entered Doctor name and Date");
            return false;
        }

    },
    fnCheckSameDCRDateANDDoctorDate: function (ev, CurrentDate, ProductCode, RowId) {
        debugger;
        var flag = false;
        ProductCode = ".cls_" + ProductCode;
        var _Doctor = "";
        var DoctorName = "";
        var DoctorDCR = "";
        _Doctor = $(ev).attr("id").replace("DCRDate", "DoctorName");
        DoctorName = $.trim($("#" + _Doctor).val());
        DoctorDCR = CurrentDate;


        if (DoctorDCR != "" && DoctorName != "") {
            $(ProductCode).each(function () {
                debugger;
                var _Id = $(this).attr("id");
                var arr = _Id.split('_');
                var _lastCount = parseInt(arr[3]) - 1;
                arr.splice(-1, 1)
                arr.push(_lastCount);
                _Id = arr.join("_");
                var DCRDate = _Id.replace("Code", "DCRDate");
                var DCRDoctor = _Id.replace("Code", "DoctorName");
                debugger;
                if (_Doctor != DCRDoctor && $.trim($("#" + DCRDate).val()) == DoctorDCR && $.trim($("#" + DCRDoctor).val()) == DoctorName) {
                    flag = true;
                }
            });
        }
        if (flag) {
            debugger;
            $(ev).val('');

            $("#" + _Doctor.replace("DoctorName", "Speciality")).val('');
            $("#" + _Doctor.replace("DoctorName", "hdnSpecCode")).val('');
            $("#" + _Doctor.replace("DoctorName", "hdnDocCode")).val('');

            fnMsgAlert('info', 'Recon', "Already entered Doctor name and Date");
            return false;
        }

    },
    fnAddDcrDate: function (id, cur, index) {
        debugger;
        if (cur != null) {
            //cur.style.visibility = "hidden";
            $("#" + cur.id).remove()

        }
        var batch_Number = $("#hdn_Batch_number_" + index).val();
        var product_code = $("#hdn_Product_Code_" + index).val();
        $("#remove_" + product_code + "_" + batch_Number + "_" + id).show();
        var row = "<tr id='Code_" + product_code + "_" + batch_Number + "_" + (id + 1) + "' class='cls_" + product_code + "'>";
        row += "<td><input type='text' class='datepicker dtDCR form-control' id=DCRDate_" + product_code + "_" + batch_Number + "_" + id + " /></td>";
        row += "<td><input type='text' class='form-control autoDoctor_" + product_code + "_" + batch_Number + "_" + id + "' id=DoctorName_" + product_code + "_" + batch_Number + "_" + id + " onblur='Recon.fnvalidateDoctorName(this);Recon.fnCheckSameDCRDateANDDoctor(this,\"" + product_code + "\");' />";
        row += "<input type='hidden' id='hdnDocCode_" + product_code + "_" + batch_Number + "_" + id + "' /></td>";
        row += "<td><input type='text' id=Speciality_" + product_code + "_" + batch_Number + "_" + id + "  class='form-control autoSpec_" + product_code + "_" + batch_Number + "_" + id + "' onblur='Recon.fnvalidateSpecName(this);' />";
        row += "<input type='hidden' id='hdnSpecCode_" + product_code + "_" + batch_Number + "_" + id + "' /></td>";
        row += "<td><input type='number' class='form-control' minlength=0 id=DCRQuanity_" + product_code + "_" + batch_Number + "_" + id + " value=0 onkeyup='return Recon.fnValidateForMissedInDCR(this,\"" + product_code + "\"," + index + ")' onchange='return Recon.fnValidateForMissedInDCR(this,\"" + product_code + "\"," + index + ")' /></td>";

        id++;
        row += '<td><input type="button" id=btn' + product_code + "_" + batch_Number + "_" + (id - 1) + ' onclick="Recon.fnAddDcrDate(' + id + ',this,' + index + ');"  value="Add" class="btn btn-primary" />';
        row += '<input type="button" onclick="Recon.fnRemoveDCRRow(' + id + ',' + index + ');" class="btn btn-warning" style="display:none;" id="remove_' + product_code + '_' + batch_Number + '_' + id + '" value="Remove"/> </td>';
        row += "</tr>"
        //$('#proTable > tbody > tr').after("Code_" + product_code + "_" + (id - 1)).after(row);
        $("#Code_" + product_code + "_" + batch_Number + "_" + (id - 1)).after(row);
        autoComplete(Recon.defaults.Doctor_list, "DoctorName_", "hdnDocCode_", "autoDoctor_" + product_code + "_" + batch_Number + "_" + (id - 1));
        autoComplete(Recon.defaults.Doctor_Speciality, "Speciality_", "hdnSpecCode_", "autoSpec_" + product_code + "_" + batch_Number + "_" + (id - 1));

        var date = new Date($("#txtMonth").val()), y = date.getFullYear(), m = date.getMonth();
        var endDate = new Date(y, m + 1, 0);
        $(".dtDCR").datepicker().bind("change", function () {
            var nValue = $(this).val();
            Recon.fnCheckSameDCRDateANDDoctorDate(this, nValue, product_code, 1);
        })
        $('.datepicker').datepicker('destroy');
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy',
            numberOfMonths: 1,
            minDate: new Date($("#txtMonth").val()),
            maxDate: endDate,
            autoclose: true
        });
    },
    fnDeleteDCRRow: function (index) {
        debugger;
        var batch_Number = $("#hdn_Batch_number_" + index).val();
        var product_code = $("#hdn_Product_Code_" + index).val();
        var id = "Code_" + product_code + "_" + batch_Number;
        for (var i = 1; i < 31; i++) {
            if ($("#" + id + "_" + i).length > 0) {
                $("#" + id + "_" + i).remove();
            } else
                break;
        }
    },
    fnRemoveDCRRow: function (id, index) {
        debugger;
        var batch_Number = $("#hdn_Batch_number_" + index).val();
        var product_code = $("#hdn_Product_Code_" + index).val();
        $("#Code_" + product_code + "_" + batch_Number + "_" + id).hide();
    },
    getMonthFromString: function (mon) {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
    },
    GetmonthName: function (dt) {
        dt = new Date(dt + "/11/2009")
        mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return mlist[dt.getMonth()];
    },
    ValUserName: function (obj) {
        fnValidateAutofill(obj, Recon.defaults.User_list, "txtUserName", "hdnUserCode");
    },
    fngetreportingusers: function () {
        var selregion = $("#ddlUserRegion").val();
        debugger;
        var _this = Recon;
        context = ["Api/ReconApi/GetReconChildUsers", Recon.defaults.Company_Code, Recon.defaults.loginUserCode];
        CoreREST.getsync(_this, context, null, Recon.fnBindChildUser, Recon.fnBindReconPrivilegefailure);
        //$.ajax({
        //    url: '../HiDoctor_Master/UsercreationWizard/GetChildUsers',
        //    type: "POST",
        //    async: false,
        //    data: "userCode=" + Recon.defaults.loginUserCode,
        //    success: function (JsonResult) {
        //        debugger;
        //        var jsonresult = eval('(' + JsonResult + ')');
        //        Recon.defaults.User_list_raw = jsonresult;
        //        var selectcolumn = '';
        //        // selectcolumn.append("<option value=0>-Select Region-</option>");

        //        for (var i = 0; i < jsonresult.length; i++) {
        //            Recon.defaults.User_list.push({ label: jsonresult[i].User_Name, value: jsonresult[i].User_Code });
        //        }
        //        autoComplete(Recon.defaults.User_list, "txtUserName", "hdnUserCode", "autoUser");
        //    }

        //});
        //return list;
    },
    fnBindChildUser: function (data) {

        var itmUser = data.list;
        debugger;
        Recon.defaults.User_list_raw = itmUser;
        if (data.Count > 0) {
            for (var i = 0; i < itmUser.length; i++) {
                Recon.defaults.User_list.push({ label: itmUser[i].User_Name, value: itmUser[i].User_Code });
            }

        }
        autoComplete(Recon.defaults.User_list, "txtUserName", "hdnUserCode", "autoUser");
    },
    GetRegionDoctorList: function (region_code) {
        debugger;
        $.ajax({
            type: 'get',
            url: 'HiDoctor_Master/PatientTracking/GetAllDoctorsByRegion',
            data: 'regionCode=' + region_code,
            async: false,
            success: function (result) {
                ////var doc = new Array();
                ////for (var i = 0; i < result.length; i++) {
                ////    var single_doc = {
                ////        label:result[i].docr
                ////    };
                ////}
                Recon.defaults.Doctor_list = result;
            }
        });

    },
    fnvalidateDoctorName: function (cur) {
        debugger;
        var id = cur.id.split('_')[1] + "_" + cur.id.split('_')[2] + "_" + cur.id.split('_')[3];
        var qty = $("#txtProdQty_" + id).val();
        //  fnValidateAutofill(cur, AttendanceDoctor.defaults.productAutoFill_g, "txtProd_", "hdnProductCode_");
        //  for (var i = 0; i < AttendanceDoctor.defaults.productAutoFill_g.length; i++) {
        //      if (AttendanceDoctor.defaults.productAutoFill_g[i].value == $("#hdnProductCode_" + 1).val()) {
        //          var proCode = AttendanceDoctor.defaults.productAutoFill_g[i].label.split('(')[1];
        //         var qty = parseInt(proCode.split(')')[0]);
        //
        //     }
        //  }
        fnValidateAutofill(cur, Recon.defaults.Doctor_list, "DoctorName_", "hdnDocCode_");
        if ($("#hdnDocCode_" + id).val() != '') {
            var doc = $.grep(Recon.defaults.Doctor_list, function (element, index) {
                return element.value == $("#hdnDocCode_" + id).val();

            });

            if (doc.length > 0) {
                var spc = $.grep(Recon.defaults.Doctor_Speciality, function (element, index) {
                    return element.value == doc[0].Speciality_Code;
                });
                $("#Speciality_" + id).val(spc[0].label);
                $("#hdnSpecCode_" + id).val(spc[0].value);
                $("#Speciality_" + id).prop('disabled', true);
            }
        }
        else {
            $("#Speciality_" + id).prop('disabled', false);
            $("#Speciality_" + id).val('');
            $("#hdnSpecCode_" + id).val('');
        }


    },
    fnvalidateSpecName: function (cur) {
        debugger;
        var id = cur.id.split('_')[1] + "_" + cur.id.split('_')[2] + "_" + cur.id.split('_')[3];
        var qty = $("#txtProdQty_" + id).val();
        //  fnValidateAutofill(cur, AttendanceDoctor.defaults.productAutoFill_g, "txtProd_", "hdnProductCode_");
        //  for (var i = 0; i < AttendanceDoctor.defaults.productAutoFill_g.length; i++) {
        //      if (AttendanceDoctor.defaults.productAutoFill_g[i].value == $("#hdnProductCode_" + 1).val()) {
        //          var proCode = AttendanceDoctor.defaults.productAutoFill_g[i].label.split('(')[1];
        //         var qty = parseInt(proCode.split(')')[0]);
        //
        //     }
        //  }
        fnValidateAutofill(cur, Recon.defaults.Doctor_Speciality, "Speciality_", "hdnSpecCode_");

    },

    fnGetSpecialityList: function () {
        var dcrDate = "";
        var dcrCode = "";
        $.ajax({
            type: 'post',
            url: '../DCRV4DoctorVisit/GetSpecialityList',
            data: 'dcr_date=' + dcrDate + '&dcr_code=' + dcrCode,
            async: false,
            success: function (result) {
                Recon.defaults.Doctor_Speciality = result;
            }
        });
    },
    fnGetPrivilegeValue: function (user_code) {
        var _this = Recon;
        context = ["Api/ReconApi/GetPrivilegeValue", Recon.defaults.Company_Code, user_code, 'RIGID_ATTENDANCE_DOCTOR_ENTRY', 'YES'];
        CoreREST.getsync(_this, context, null, Recon.fnBindReconPrivilegeSuccess, Recon.fnBindReconPrivilegefailure);
    },
    fnBindReconPrivilegeSuccess: function (data) {
        debugger;
        Recon.defaults.RIGID_ATTENDANCE_DOCTOR_ENTRY = data;
    },
    fnBindReconPrivilegefailure: function (err) {
    },
    fnViewApprove: function (Status) {
        debugger;
        $(':input[type="button"]').prop('disabled', true);
        var lstApproveReject = new Object();
        var ObjApproveList = new Array();
        var Remarks = $.trim($("#txtUnapproveRemarks").val());
        lstApproveReject = {
            Row_Id: 1,
            User_Code: $.trim($("#hdnUserCode").val()),
            Product_Recon_Id: Recon.defaults.EditHeaderId,
            Remarks: Remarks,
        }
        ObjApproveList.push(lstApproveReject);
        debugger;
        if (Status == 0 && Remarks == '') {
            fnMsgAlert('info', 'Recon', 'Please enter the remarks field.');
            $(':input[type="button"]').prop('disabled', false);
            $.unblockUI();
            $("#txtUnapproveRemarks").focus();
            return false;

        }
        else {
            var ObjApprove = new Object();
            ObjApprove = {
                lstApproveRejectModel: ObjApproveList
            }

            Recon.fnUpdateStatus(Status, ObjApprove);
            $(':input[type="button"]').prop('disabled', false);

            $.unblockUI();
        }

    },
    fnUpdateStatus: function (ApproveStatus, data) {
        var objParam = ["Api/ReconApi/InsertedApproveReject", Recon.defaults.Company_Code, Recon.defaults.CompanyId, Recon.defaults.loginUserCode, ApproveStatus];

        CoreREST.post(Recon, objParam, data, Recon.fuUpdateSuccess, Recon.fnFailure);

    },
    fuUpdateSuccess: function (data) {
        $(':input[type="button"]').prop('disabled', false);
        var Message = data.list;
        if (Message) {
            if (Message.indexOf(":") > 0) {
                var Msg = Message.split(':')[0];
                Msg = Msg.toLowerCase();
                if (Msg == "success") {
                    fnMsgAlert('success', 'Recon', Message.split(':')[1]);
                    $.unblockUI();
                    Recon.fnRedirectApprove();
                }
                else {
                    fnMsgAlert('error', 'Recon', Message.split(':')[1]);
                    $.unblockUI();
                }
            }
        } else {
            fnMsgAlert('error', 'Recon', data.Message);
            $.unblockUI();
        }

    },
};