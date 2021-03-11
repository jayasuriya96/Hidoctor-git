

///////////////////////////////////////////////////////// Admindashboard Version 2//////////////////////////////////////////////////////////


var AdmindashboardV2 = {
    defaults: {
        "CategoryCoverageDetails": "",
        "ProductWisePerformanceDetails": "",
        "ProductWisePerformanceDetailslist": "",
        "PrimarySSDetails": "",
        "JoinerAttritionDetails": "",
        "CoverageInput": "",
        "isCurrent": "",
        "PM": "",
        "TM": "",
        "FM": "FM",
        "FirstProductName": "",
        "FirstProductCode": "",
        "ExcludeStockiest": "",
        "PrimarySecondaryDetails": "",
        "POBDetails": "",
        "CallAverages": "",
        "CallFlag": "",
        "ProductiveCallAverages": "",
        "TimeInvestment": "",
        "TimeInvestmentMonth": "",
        "DCRMonth": "",
        "DCRTimeLag": "",
        "TPTimeLag": "",
        //"CURRENT": "Current",
        "Current": "CURRENT",
        "DCRTPVale": "",
        "TPDeviate": "",
        "TPFilter": "",
        "CallAvg": "",
    },

    initialize: function () {

        // assign dropdown values for DCR & TP Deviation
        AdmindashboardV2.defaults.DeviationLag = $("#ddlDcrDeviation").val();
        AdmindashboardV2.defaults.DCRMonth = $("#ddlMonth").val();
        //

        AdmindashboardV2.getDivisions();
        AdmindashboardV2.getDivisionList();
        AdmindashboardV2.getDivisionListAll();
        // AdmindashboardV2.fngetproductname(); 




    },
    blockUI: function (dvId) {
        $(".dropdown-content").hide();
        $('#' + dvId).block({
            message: '<img src="../../Content/images/loader1.gif" width="40px" height="40px"  />',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                //border: '3px solid #aaa',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                //opacity: 0.6,
                cursor: 'wait'
            },

            // minimal style set used when themes are used 
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay 
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            cursorReset: 'default',
        })
    },

    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
        $(".dropdown-content").hide();
    },


    IntiMethodsWithData: function () {
        $("#currentMonth").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#previousMonth").removeClass("btn-active").addClass("btn-inactive");
            $("#tillMonth").removeClass("btn-active").addClass("btn-inactive");
            AdmindashboardV2.defaults.isCurrent = "FM";
            AdmindashboardV2.getCategoryCoverageDetails();
        });

        $("#previousMonth").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#currentMonth").removeClass("btn-active").addClass("btn-inactive");
            $("#tillMonth").removeClass("btn-active").addClass("btn-inactive");
            AdmindashboardV2.defaults.isCurrent = "PM";
            AdmindashboardV2.getCategoryCoverageDetails();
        });

        $("#tillMonth").click(function () {
            $(this).removeClass("btn-inactive").addClass("btn-active");
            $("#previousMonth").removeClass("btn-active").addClass("btn-inactive");
            $("#currentMonth").removeClass("btn-active").addClass("btn-inactive");
            //AdmindashboardV2.defaults.isCurrent = false;
            AdmindashboardV2.defaults.isCurrent = "TM";
            AdmindashboardV2.getCategoryCoverageDetails();
        });

        $("#ddlJoinerAttrition").change(function () {
            AdmindashboardV2.getJoinerAttrition();
        });

        $("#ddlCategoryCoverageDivision").change(function () {
            AdmindashboardV2.getCategoryCoverageDetails();
        });

        $("#ddlProductWisePerformance").change(function () {
            AdmindashboardV2.getProductWisePerformance();
        });

        $("#ddlPrimarySSTarget").change(function () {
            AdmindashboardV2.getPrimarySecondarySalesTarget();
        });

        $("#dvProductPerformance").change(function () {
            AdmindashboardV2.getProductWisePerformance();
        });

        $("#btnRefreshPST").click(function () {
            AdmindashboardV2.getPrimarySecondarySalesTarget();
        });

        $("#excludeSSS").click(function () {
            AdmindashboardV2.getPrimarySecondarySalesTarget();
        });

        $("#ddlPrimarySecondary").change(function () {
            AdmindashboardV2.getPrimarySecondarySalesTarget();
        });

        //  $("#txtProductPerformance").on("change", function () {

        $("#txtProductPerformance").keydown(function (e) {
            if (e.keyCode == 13) { // enter
                //Search();
                return false; //you can also say e.preventDefault();
            }
        });
        $('#txtProductPerformance').change(function () {
            AdmindashboardV2.getProductWisePerformance();
        });

        $('#ddlDivisionPOB').change(function () {

            AdmindashboardV2.getPOBDetails();
        });

        $("#ddlDivisionTime").change(function () {
            AdmindashboardV2.getTimeInvestmentDetails();
        });

        $("#ddlMonthofInvestment").change(function () {

            AdmindashboardV2.getTimeInvestmentDetails();
        });

        $("#ddlDcrDeviation").change(function () {

            AdmindashboardV2.defaults.DeviationLag = $("#ddlDcrDeviation").val();
            if (AdmindashboardV2.defaults.DeviationLag == "DCR Time Lag") {
                AdmindashboardV2.getDCRTimeLag();
            }
            else {
                AdmindashboardV2.getTPTimeLag();
            }
        });

        $("#ddlDivisioncallAverage").change(function () {

            AdmindashboardV2.defaults.CallAvg = $("#CallAverageddlName").val();
            if (AdmindashboardV2.defaults.CallAvg == "Call Average") {
                AdmindashboardV2.getCallAverage();
            }
            else {
                AdmindashboardV2.getProductiveCall();
            }
        });

        $("#CallAverageddlName").change(function () {

            AdmindashboardV2.defaults.CallAvg = $("#CallAverageddlName").val();
            if (AdmindashboardV2.defaults.CallAvg == "Call Average") {
                AdmindashboardV2.getCallAverage();
            }
            else {
                AdmindashboardV2.getProductiveCall();
            }
        });

        $("#ddldivisionDeviation").change(function () {
            AdmindashboardV2.defaults.DCRTPVale = $("#ddldivisionDeviation").find(':selected').data('division_code');
            if (AdmindashboardV2.defaults.DeviationLag == "DCR Time Lag") {
                AdmindashboardV2.getDCRTimeLag();
            }
            else {
                AdmindashboardV2.getTPTimeLag();
            }
        });

        $("#ddlMonth").change(function () {

            AdmindashboardV2.defaults.DCRMonth = $("#ddlMonth").val();
            if (AdmindashboardV2.defaults.DeviationLag == "DCR Time Lag") {
                AdmindashboardV2.getDCRTimeLag();
            }
            else {
                AdmindashboardV2.getTPTimeLag();
            }
        });

        $("#TPactivityfilter").change(function () {

            AdmindashboardV2.defaults.TPDeviate = $("#TPactivityfilter").val();
            AdmindashboardV2.getTPTimeLag();
        });

        $("#CallMonthddl").change(function () {

            AdmindashboardV2.defaults.CallAvg = $("#CallAverageddlName").val();
            if (AdmindashboardV2.defaults.CallAvg == "Call Average") {
                AdmindashboardV2.getCallAverage();
            }
            else {
                AdmindashboardV2.getProductiveCall();
            }
        });


    },
    /////////////////////////////////////////// Division Name Filters/////////////////////////////////////////////////
    getDivisions: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoardV2/GetDivision",
            //     async: false,
            success: function (jsonData) {
                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All'>-- All --</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }

                $("#ddlJoinerAttrition").html(listItems);
                $("#ddlCategoryCoverageDivision").html(listItems);
                $("#ddlPrimarySecondary").html(listItems);
                $("#ddlProductWisePerformance").html(listItems);
                $("#ddlPrimarySSTarget").html(listItems);
            },
            error: function (e) {
                $.unblockUI();
            },
            complete: function () {
                AdmindashboardV2.IntiMethodsWithData();
                AdmindashboardV2.getJoinerAttrition();
                AdmindashboardV2.getCategoryCoverageDetails();
                AdmindashboardV2.getPrimarySecondarySalesTarget();
                AdmindashboardV2.fngetproductname();
            }
        });
    },

    // Product wise filter

    fngetproductname: function () {
        $.ajax({
            type: 'POST',
            url: '../DashBoardV2/GetProductName',
            async: false,
            success: function (response) {
                var product = response;
                if (product.length > 0) {
                    AdmindashboardV2.defaults.FirstProductCode = product[0].Product_Code;
                    AdmindashboardV2.defaults.FirstProductName = product[0].Product_Name;
                }


                var st = "[";
                for (var i = 0; i < product.length; i++) {
                    st += "{label:" + '"' + "" + product[i].Product_Name + "" + '",' + "value:" + '"' + "" + product[i].Product_Code + "" + '"' + "}";
                    if (i < product.length - 1) {
                        st += ",";
                    }
                }
                st += "];";
                var cpJson = eval(st);
                autoComplete(cpJson, "txtProductPerformance", "hdnProductPerformance", 'clsProductPerformance');

            },
            error: function (e) {
            },
            complete: function () {
                // Asign Product Name and Code
                $('#txtProductPerformance').val(AdmindashboardV2.defaults.FirstProductName);
                $('#hdnProductPerformance').val(AdmindashboardV2.defaults.FirstProductCode);
                AdmindashboardV2.getProductWisePerformance();
            },
        });

    },


    // Joiner and Attrition 

    getJoinerAttrition: function () {
        AdmindashboardV2.defaults.JoinerAttritionDetails = $("#ddlJoinerAttrition").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.JoinerAttritionDetails;

        $.ajax({
            start: AdmindashboardV2.blockUI("dvJoinAttrion"),
            type: 'POST',
            url: "DashBoardV2/GetJoinerAttrition",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {
                var JoinAttri = "";

                JoinAttri += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='dvJoinerAttrition' width='100%' border-collapse: collapse;>";
                JoinAttri += "<thead>";
                //JoinAttri += "<tr><td>" + JsonData.month1[0].Month + "</td></tr>";
                JoinAttri += "<tr style='background-color:darkslategray;color:white;'><td style='border: 0.1px solid lightgrey;padding: 10px 28px;'colspan='1';>Month</td><td style='border: 0.1px solid lightgrey; padding: 10px 28px;'colspan='2';>" + JsonData.month1[0].Month + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 28px;'colspan='2';>" + JsonData.month2[0].Month + "</td> <td style='border:0.1px solid lightgrey; padding: 10px 28px;'colspan='2';>" + JsonData.month3[0].Month + "</td></tr>";
                JoinAttri += "<tr><th style='border: 0.1px solid lightgrey;' id='ddlJoinerAttrition';>Division Name</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Joiner</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Attrition</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Joiner</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Attrition</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Joiner</th>";
                JoinAttri += "<th style='border: 0.1px solid lightgrey;'>Attrition</th>";
                JoinAttri += "</tr>";
                JoinAttri += "</thead>";
                JoinAttri += "<tbody>";
                for (var i = 0; i < JsonData.month1.length; i++) {
                    JoinAttri += "<tr>";
                    JoinAttri += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month1[i].DivisionName + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month1[i].Joiners + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month1[i].Attrition + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month2[i].Joiners + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month2[i].Attrition + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month3[i].Joiners + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.month3[i].Attrition + "</td>"
                    JoinAttri += "</tr>";
                }

                JoinAttri += "</tbody>";
                $('#dvJoinerAttrition').html(JoinAttri + "</table>");
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("dvJoinAttrion");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("dvJoinAttrion");
            }
        });
    },

    //////////////////////////////////////////////////////////////////// Primary Secondary with Target/////////////////////////////////////////////////

    getPrimarySecondarySalesTarget: function () {
        AdmindashboardV2.defaults.PrimarySecondaryDetails = $("#ddlPrimarySecondary").find(':selected').data('division_code');

        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.PrimarySecondaryDetails;
        var check = $("#excludeSSS").is(":checked");
        if (check) {
            //  if ($("#excludeSSS").length == 1) {
            _objData.Flag = "E";

        }
        else {
            _objData.Flag = AdmindashboardV2.defaults.ExcludeStockiest;
        }
        $.ajax({
            start: AdmindashboardV2.blockUI("dvPSwithTarget"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoardV2/GetPrimarySecondaryWithTarget",
            success: function (JsonData) {
                var PST = JsonData;
                var PSdata = new google.visualization.DataTable();

                PSdata.addColumn('string', 'Month')
                PSdata.addColumn('number', 'Target');
                PSdata.addColumn('number', 'Primary');
                PSdata.addColumn('number', 'Secondary');



                for (var i = 0; i < PST.length; i++) {
                    PSdata.addRow([PST[i].Month, PST[i].TargetSale, PST[i].PrimarySale, PST[i].SecondarySale]);
                }

                var options = {
                    chartArea: { left: 90, top: 20, width: '90%', height: '80%' },
                    //vAxis: {
                    //    gridlines: {
                    //        color: 'none',
                    //     title: "Sales", 
                    //    },
                    //    isStacked: false,

                    //},
                    //  vAxis: {  gridlines: { color: 'none' }, title: 'Sales',viewWindow: { min: 0 }, isStacked: true,},
                    vAxis: {
                        gridlines: { color: 'none' }, title: 'Sales', viewWindow: { min: 0 }, isStacked: true,
                    },
                    // ticks: [0, 1000, 250000, 500000, 2000000],

                    //vAxis: { viewWindow: { min: 0 }  },ticks: [0, 1000, 2000, 4000, 6000]
                    // hAxis: { gridlines: { color: 'none' }, title: "Month", isStacked: true, },
                    hAxis: { gridlines: { color: 'none' }, slantedText: true, title: 'Month', },
                    legend: "top",
                    seriesType: 'bars',
                    width: 480, height: 335,
                };
                var table = new google.visualization.ComboChart(document.getElementById("dvPandSwithTargetBarChat"));
                table.draw(PSdata, options, { showRowNumber: true });
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("dvPSwithTarget");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("dvPSwithTarget");
            }


        });
    },

    ///////////////////////////////////////////////////////////////////Product wise Performance /////////////////////////////////////////////////

    getProductWisePerformance: function () {
        AdmindashboardV2.defaults.ProductWisePerformanceDetails = $("#ddlProductWisePerformance").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.ProductWisePerformanceDetails;
        _objData.ProductCode = $('#hdnProductPerformance').val();
        // _objData.ProductCode = "PDC00000009";


        $.ajax({
            start: AdmindashboardV2.blockUI("dvProduct"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoardV2/GetProductWisePerformance",
            success: function (JsonData) {
                var ProductWise = JsonData;
                var data = new google.visualization.DataTable();

                data.addColumn('string', 'Month');
                data.addColumn('number', 'Primary');
                data.addColumn('number', 'Secondary');

                for (var i = 0; i < ProductWise.length; i++) {
                    data.addRow([ProductWise[i].Month, ProductWise[i].PrimarySale, ProductWise[i].SecondarySale]);
                }


                var options = {
                    chartArea: { left: 80, top: 20, width: '90%', height: '80%' },
                    //  chartArea: { left: 45, top: 20, width: '90%', height: '85%' },
                    vAxis: {
                        gridlines: { color: 'none' }, title: 'Quantity', viewWindow: { min: 0 }
                    },
                    hAxis:
                        { gridlines: { color: 'none' }, slantedText: true, title: 'Month', },
                    //  hAxis: { gridlines: { color: 'none' } },
                    legend: "top",
                    seriesType: 'bars',
                    width: 480, height: 370,
                };
                var table = new google.visualization.ComboChart(document.getElementById("dvProductWiseBarChat"));
                table.draw(data, options, { showRowNumber: false });
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("dvProduct");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("dvProduct");
            }


        });
    },

    ////////////////////////////////////////////////////////////////// end Product wise Performance ///////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////// Category Coverage //////////////////////////////////////////////////////////////////////////

    getCategoryCoverageDetails: function () {
        AdmindashboardV2.defaults.CategoryCoverageDetails = $("#ddlCategoryCoverageDivision").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.CategoryCoverageDetails;
        if (AdmindashboardV2.defaults.isCurrent == "") {
            _objData.CoverageInput = AdmindashboardV2.defaults.FM;
        }
        else {
            _objData.CoverageInput = AdmindashboardV2.defaults.isCurrent;
        }
        $.ajax({
            start: AdmindashboardV2.blockUI("dvCategoryCoverage"),
            type: 'POST',
            dataType: 'json',
            data: _objData,
            url: "DashBoardV2/GetDrCoverage",
            success: function (JsonResult) {
                var CategoryData = JsonResult;
                var sum = 0;

                //style='border: 1px solid black; cellspacing='0' cellpadding='0' id='dvJoinerAttrition' width='100%' border-collapse: collapse;

                for (i = 0; i < CategoryData.length; i++) {
                    sum += parseInt(CategoryData[i].Total);
                }

                var str = '<table class="table table-striped"; cellspacing="0" cellpadding="0" id="dvCategoryCoverage" width="100%;" style="border: 0.1px solid lightgrey;text-align: center; border-collapse: collapse;"><thead><tr cellspacing="0" style="background-color:darkslategray;color:white"><th style = "border: 0.1px solid lightgrey;text-align: center;"> No of Time Met</th><th style = "border: 0.1px solid lightgrey;text-align: center;">No of ' + doctor_caption + ' Met</th><th style = "border: 0.1px solid lightgrey;text-align: center;">' + doctor_caption + 'S Total</th></tr></thead><tbody>';
                for (var i = 0; i < CategoryData.length; i++) {
                    if (i == 5) {
                        str += '<tr><td style = "border: 0.1px solid lightgrey;text-align: center;">' + CategoryData[i].count + '</td><td style = "border: 0.1px solid lightgrey;text-align: center">' + CategoryData[i].Total + '</td><td style="text-align: center;font-weight: bold; ">' + sum + '</td></tr>';
                    }
                    else if (i == 11) {
                        str += '<tr><td style = "border: 0.1px solid lightgrey;text-align: center;"> More than 10 </td><td style = "border: 0.1px solid lightgrey;text-align: center">' + CategoryData[i].Total + '</td></tr>';

                    }
                    else {
                        str += '<tr><td style = "border: 0.1px solid lightgrey;text-align: center;">' + CategoryData[i].count + '</td><td style = "border: 0.1px solid lightgrey;text-align: center">' + CategoryData[i].Total + '</td></tr>';
                    }
                }
                str += '</tbody></table>';
                $('#dvCategoryCoverage').html(str);

                //style="tr:nth-child(even){background-color: #f2f2f2}

            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("dvCategoryCoverage");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("dvCategoryCoverage");
            }
        });
    },

    /////////////////////////////////////////////////////////////// Start DashboardV2-PhaseII /////////////////////////////////////////////////////

    getDivisionList: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoardV2/GetDivisionList",
            //     async: false,
            success: function (jsonData) {
                var listItems;
                for (var i = 0; i < jsonData.length; i++) {
                    if (i == 0) {
                        listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    } else {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }


                $("#ddlDivisioncallAverage").html(listItems);

            },
            error: function (e) {
                $.unblockUI();
            },
            complete: function () {

                AdmindashboardV2.defaults.CallFlag = "FM";
                AdmindashboardV2.getCallAverage();
            }
        });
    },

    /////////////////////////////// All Division for User Based////////////////////////////////////////////
    getDivisionListAll: function () {
        $.ajax({
            start: $.unblockUI(),
            type: 'POST',
            url: "DashBoardV2/GetDivisionList",
            //     async: false,
            success: function (jsonData) {

                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All'>- Division/All -</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }

                $("#ddlDivisionTime").html(listItems);
                $("#ddldivisionDeviation").html(listItems);
                $("#ddlDivisionPOB").html(listItems);

            },
            error: function (e) {
                $.unblockUI();
            },
            complete: function () {
                AdmindashboardV2.getPOBDetails();
                AdmindashboardV2.defaults.TimeInvestmentMonth = "CURRENT";
                AdmindashboardV2.getTimeInvestmentDetails();
                AdmindashboardV2.defaults.DCRMonth = "CURRENT";
                AdmindashboardV2.defaults.DCRTPVale = $("#ddldivisionDeviation").find(':selected').data('division_code');
                if (AdmindashboardV2.defaults.DeviationLag = "DCR Time Lag") {
                    AdmindashboardV2.getDCRTimeLag();
                }
                else {
                    AdmindashboardV2.getTPTimeLag();
                }

                //AdmindashboardV2.getTPTimeLag();
                //AdmindashboardV2.defaults.CallFlag = "FM";
                //AdmindashboardV2.getCallAverage();

            }
        });
    },


    ////////////////////////////////////////// Call average and Productive call Average ///////////////////////////////////////

    /////////////////////////////////////////POB ///////////////////////////////////////////////////
    getPOBDetails: function () {

        AdmindashboardV2.defaults.POBDetails = $("#ddlDivisionPOB").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.POBDetails;

        $.ajax({
            start: AdmindashboardV2.blockUI("pobloading"),
            type: 'POST',
            url: "DashBoardV2/GetPOBDetails",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {

                var pobheader = "";

                pobheader += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tblPOB' width='100%' border-collapse: collapse;>";
                pobheader += "<thead>";
                pobheader += "<tr style='text-align:center;'><th style='border: 0.1px solid lightgrey;'>MONTH</th>";
                pobheader += "<th style='border: 0.1px solid lightgrey;'>FM</th>";
                pobheader += "<th style='border: 0.1px solid lightgrey;'>PM</th>";
                pobheader += "<th style='border: 0.1px solid lightgrey;'>TM</th>";
                pobheader += "</tr>";
                pobheader += "</thead>";
                pobheader += "<tbody>";

                for (var i = 0; i < JsonData.FM.length; i++) {
                    pobheader += "<tr>";
                    pobheader += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> POB " + doctor_caption + " Count (Distinct Dr Count) </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].Doctor_Count + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].Doctor_Count + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.TM[i].Doctor_Count + "</td>"
                    pobheader += "</tr>";
                }

                for (var i = 0; i < JsonData.FM.length; i++) {
                    pobheader += "<tr>";
                    pobheader += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> POB Order Count (No of Orders)</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].Order_Count + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].Order_Count + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.TM[i].Order_Count + "</td>"
                    pobheader += "</tr>";
                }

                for (var i = 0; i < JsonData.FM.length; i++) {
                    pobheader += "<tr>";
                    pobheader += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> POB Value in Rs. (Sum of Order Values)</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].POB_Value + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].POB_Value + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.TM[i].POB_Value + "</td>"
                    pobheader += "</tr>";
                }

                for (var i = 0; i < JsonData.FM.length; i++) {
                    pobheader += "<tr>";
                    pobheader += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> EPOB Value</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].EPOB_Value + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].EPOB_Value + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.TM[i].EPOB_Value + "</td>"
                    pobheader += "</tr>";
                }
                pobheader += "</tbody>";
                $('#tblPOB').html(pobheader + "</table>");
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("pobloading");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("pobloading");
            }

        });
    },

    /////////////////////////////////////////////////////////Time Investment///////////////////////////////////////////////////////


    getTimeInvestmentDetails: function () {

        AdmindashboardV2.defaults.TimeInvestment = $("#ddlDivisionTime").find(':selected').data('division_code');
        AdmindashboardV2.defaults.TimeInvestmentMonth = $("#ddlMonthofInvestment").val();
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.TimeInvestment;
        _objData.Flag = AdmindashboardV2.defaults.TimeInvestmentMonth;


        $.ajax({
            start: AdmindashboardV2.blockUI("timeInvestment"),
            type: 'POST',
            url: "DashBoardV2/GetTimeInvestment",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {

                var timeInvest = "";

                timeInvest += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tblTimeInvestment' width='100%' border-collapse: collapse;>";
                timeInvest += "<thead>";
                timeInvest += "<tr><th style='border: 0.1px solid lightgrey; text-align: center;'>DCR Complaince</th>";
                timeInvest += "<th style='border: 0.1px solid lightgrey; text-align: center;'>%</th>";
                timeInvest += "<th style='border: 0.1px solid lightgrey; text-align: center;'>In No.</th>";
                timeInvest += "</tr>";
                timeInvest += "</thead>";
                timeInvest += "<tbody>";

                if (JsonData != null && JsonData != undefined) {

                    for (var i = 0; i < JsonData.length; i++) {
                        timeInvest += "<tr>";
                        timeInvest += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> Field Working </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].PceFieldWork + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].FieldWork + '/' + JsonData[i].TotalDays + "</td>";
                        timeInvest += "</tr>";
                    }

                    for (var i = 0; i < JsonData.length; i++) {
                        timeInvest += "<tr>";
                        timeInvest += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> Attendance </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].PceAttendance + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Attendance + '/' + JsonData[i].TotalDays + "</td>";
                        timeInvest += "</tr>";
                    }
                    for (var i = 0; i < JsonData.length; i++) {
                        timeInvest += "<tr>";
                        timeInvest += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> Leave </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].PceLeave + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Leave + '/' + JsonData[i].TotalDays + "</td>";
                        timeInvest += "</tr>";
                    }

                    for (var i = 0; i < JsonData.length; i++) {
                        timeInvest += "<tr>";
                        timeInvest += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> LWP </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].PceLOP + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].LOP + '/' + JsonData[i].TotalDays + "</td>";
                        timeInvest += "</tr>";
                    }

                    for (var i = 0; i < JsonData.length; i++) {
                        timeInvest += "<tr>";
                        timeInvest += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> DCR Non Complaince </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].PceNON_Compliance + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].NON_Compliance + "/" + JsonData[i].TotalDays + "</td>";
                        timeInvest += "</tr>";
                    }
                    timeInvest += "</tbody>";
                    $('#tblTimeInvestment').html(timeInvest + "</table>");
                }
                else {
                    $('#tblTimeInvestment').html("No Data Found");
                }
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("timeInvestment");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("timeInvestment");
            }

        });
    },

    ////////////////////////////////////////////////////////////////Call Average and Productive Call Average ////////////////////////
    getCallAverage: function () {

        AdmindashboardV2.defaults.CallAverages = $("#ddlDivisioncallAverage").find(':selected').data('division_code');
        AdmindashboardV2.defaults.CallFlag = $("#CallMonthddl").val();
        //var _objData = new Object();
        var Division_Code = AdmindashboardV2.defaults.CallAverages;
        var flag = AdmindashboardV2.defaults.CallFlag;
        //var Division_Code = "1000";
        //var flag = "PM";
        var Call_Avg = new Array();
        $.ajax({
            start: AdmindashboardV2.blockUI("callAverage"),
            type: 'POST',
            url: "DashBoardV2/GetCallAVerage",
            dataType: 'json',
            data: "Division_Code=" + Division_Code + "&flag=" + flag,
            success: function (response) {

                var table = eval('(' + response + ')');
                //Call_Avg = table.Tables[0].Rows;
                //if(Call_Avg.length > 0) {
                if (table.Tables.length > 0) {

                    Call_Avg = table.Tables[0].Rows;

                    if (Call_Avg.length > 0) {

                        // Header Column Name 
                        var call_objects = Call_Avg[0];
                        var tempValue = Object.keys(call_objects);
                        var value = tempValue.move(0, 2);
                        var table = "";
                        var dynamic = "";
                        // table += "<table id='tblCallaverage' class='table table-striped'>";style='width:100%'; background:'#5E87B0 !important;'
                        table += "<table class='table-striped table' cellspacing='0' cellpadding='0' id='tblCallaverage' width='100%' border-collapse: collapse;>";
                        table += "<thead>";
                        table += "<tr>";
                        for (var j = 0; j < value.length; j++) {
                            if (value[j] != "Average_Number") {
                                dynamic += "<th style='border: 0.1px solid lightgrey;height:40%; text-align: center;'>" + (value[j] == "User_Type_Name" ? "Call Average" : value[j]) + "</th>";
                                //dynamic += "<th style='border: 0.1px solid lightgrey; text-align: center; width:100%;'>" + value[j] + "</th>";

                            }
                        }
                        table += dynamic + "</tr>";
                        table += "</thead>";
                        table += "<tbody>";
                        for (var call_avg_count = 0; call_avg_count < Call_Avg.length; call_avg_count++) {

                            table += "<tr>";
                            for (var i = 0; i < value.length ; i++) {
                                if (value[i] == "User_Type_Name") {

                                    table += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: left;'>" + (Call_Avg[call_avg_count][value[i]] == null ? "0" : Call_Avg[call_avg_count][value[i]]) + "(" + (Call_Avg[call_avg_count]["Average_Number"] == "null" ? "0" : Call_Avg[call_avg_count]["Average_Number"]) + ")" + "</td>";
                                } else {
                                    if (value[i] != "Average_Number")
                                        table += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: left;'>" + (Call_Avg[call_avg_count][value[i]] == null ? "0" : Call_Avg[call_avg_count][value[i]]) + "</td>";
                                }
                            }
                            table += "</tr>";
                        }
                        table += "</tbody>";
                        $('#tblCallaverage').html(table + "</table>");
                    }
                    else {
                        $('#tblCallaverage').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                    }
                }
                else {
                    // $('#tblCallaverage').html("No Data found");
                    $('#tblCallaverage').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");

                }
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("callAverage");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("callAverage");
            }
        });
    },


    ///////////////////////////////////////////////////Productive Call average //////////////////////////////////////////////////////////

    getProductiveCall: function () {

        AdmindashboardV2.defaults.ProductiveCallAverages = $("#ddlDivisioncallAverage").find(':selected').data('division_code');
        AdmindashboardV2.defaults.CallFlag = $("#CallMonthddl").val();
        //var _objData = new Object();
        var Division_Code = AdmindashboardV2.defaults.ProductiveCallAverages;
        var flag = AdmindashboardV2.defaults.CallFlag;
        ////var _objData = new Object();
        //var Division_Code = "1000";
        //var flag = "PM";
        var Call_Avg = new Array();
        $.ajax({
            start: AdmindashboardV2.blockUI("callAverage"),
            type: 'POST',
            url: "DashBoardV2/GetProductiveCallAverage",
            dataType: 'json',
            data: "Division_Code=" + Division_Code + "&flag=" + flag,
            success: function (response) {

                var table = eval('(' + response + ')');

                if (table.Tables.length > 0) {

                    Call_Avg = table.Tables[0].Rows;

                    //Call_Avg = table.Tables[0].Rows;
                    if (Call_Avg.length > 0) {

                        // Header Column Name 
                        var call_objects = Call_Avg[0];
                        var tempValue = Object.keys(call_objects);
                        var value = tempValue.move(0, 2);
                        var table = "";
                        var dynamic = "";
                        table += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tblCallaverage' width='100%' border-collapse: collapse;>";
                        table += "<thead>";
                        table += "<tr>";
                        for (var j = 0; j < value.length; j++) {
                            if (value[j] != "Average_Number") {
                                dynamic += "<th style='border: 0.1px solid lightgrey; text-align: center;'>" + (value[j] == "User_Type_Name" ? "Call Average" : value[j]) + "</th>";
                            }
                        }
                        table += dynamic + "</tr>";
                        table += "</thead>";
                        table += "<tbody>";
                        for (var call_avg_count = 0; call_avg_count < Call_Avg.length; call_avg_count++) {

                            table += "<tr>";
                            for (var i = 0; i < value.length ; i++) {
                                if (value[i] == "User_Type_Name") {
                                    table += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + (Call_Avg[call_avg_count][value[i]] == null ? "0" : Call_Avg[call_avg_count][value[i]]) + "(" + (Call_Avg[call_avg_count]["Average_Number"] == "null" ? "0" : Call_Avg[call_avg_count]["Average_Number"]) + ")" + "</td>";
                                } else {
                                    if (value[i] != "Average_Number")
                                        table += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + (Call_Avg[call_avg_count][value[i]] == null ? "0" : Call_Avg[call_avg_count][value[i]]) + "</td>";
                                }
                            }
                            table += "</tr>";
                        }
                        table += "</tbody>";
                        $('#tblCallaverage').html(table + "</table>");
                    }
                    else {
                        $('#tblCallaverage').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                    }

                }
                else {
                    //$('#tblCallaverage').html("");
                    $('#tblCallaverage').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                }
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("callAverage");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("callAverage");
            }
        });
    },

    ////////////////////////////////////////////////////////////DCR Time Lag///////////////////////////////////////////////////////////////
    getDCRTimeLag: function () {
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.DCRTPVale;
        _objData.Flag = AdmindashboardV2.defaults.DCRMonth;
        $(".TPFilters").hide();
        $.ajax({
            start: AdmindashboardV2.blockUI("timeLag"),
            type: 'POST',
            url: "DashBoardV2/GetDCRTimeLag",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {
                var DCRLagDetails = "";

                DCRLagDetails += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tblDCRTPDeviation' width='100%' border-collapse: collapse;>";
                DCRLagDetails += "<thead>";
                DCRLagDetails += "<tr><th style='border: 0.1px solid lightgrey; text-align: center;width:45%;'>Difference b/w work date and report entered date</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>Total DCR Report</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>0</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>1</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>2</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>3</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>4</th>";
                DCRLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'> >4 </th>";
                DCRLagDetails += "</tr>";
                DCRLagDetails += "</thead>";
                DCRLagDetails += "<tbody>";

                for (var i = 0; i < JsonData.length; i++) {
                    DCRLagDetails += "<tr>";
                    DCRLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'> No. of DCR</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].DCR_Count + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Zero + "</td>"
                    DCRLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].One + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Two + "</td>"
                    DCRLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Three + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Four + "</td>"
                    DCRLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].GreaterthanFour + "</td>";
                    DCRLagDetails += "</tr>";
                }

                DCRLagDetails += "</tbody>";
                $('#tblDCRTPDeviation').html(DCRLagDetails + "</table>");
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("timeLag");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("timeLag");
            }
        });
    },


    /////////////////////////////////////////////////////////DashboardHome//////////////////////////
    getDashboardHome: function () {
        var rValue = "";
        $.ajax({
            type: 'POST',
            url: "DashBoardV2/DashboardHome",
            async: false,
            dataType: 'text',
            // data: _objData,
            success: function (JsonData) {
                if (JsonData == "FIELD_USER") {
                    g_user_type = "FIELD_USER";
                    rValue = g_user_type;

                }
                else {
                    g_user_type = "";


                }
            }
        });
        return rValue;
    },
    getNotificationPage: function () {
        //if (g_user_type == "FIELD_USER") {
        //   $('#dashNotification').load('Dashboard/NotificationFieldUser');
        //}
        // else {
        $('#dashNotification').load('Dashboard/NotificationIcons');
        // }
    },
    loadDashboardPage: function () {
        if (g_user_type == "FIELD_USER") {
            $("#dashboard1").load('Dashboard/UserDashboard');
        }
        else {
            $("#dashboard1").load('Dashboard/AdminDashboard');
        }
    },

    ////////////////////////////////////////////////////////////TP Time Lag ////////////////////////////////////////////////////////////////

    getTPTimeLag: function () {
        AdmindashboardV2.defaults.TPFilter = $("#TPactivityfilter").val();
        var _objData = new Object();
        _objData.DivisionCode = AdmindashboardV2.defaults.DCRTPVale;
        _objData.Flag = AdmindashboardV2.defaults.DCRMonth;
        var test = AdmindashboardV2.defaults.DeviationLag;
        if (test == "TP Deviation") {
            //  _objData.Deviation = AdmindashboardV2.defaults.DeviationLag;

            _objData.Deviation = AdmindashboardV2.defaults.TPFilter
        }
        else
            _objData.Deviation = AdmindashboardV2.defaults.DeviationLag;
        $(".TPFilters").show();
        $.ajax({
            start: AdmindashboardV2.blockUI("timeLag"),
            type: 'POST',
            url: "DashBoardV2/GetTPTimeLag",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {
                var TPLagDetails = "";

                TPLagDetails += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tblDCRTPDeviation' width='100%' border-collapse: collapse;>";
                TPLagDetails += "<thead>";
                TPLagDetails += "<tr><th style='border: 0.1px solid lightgrey; text-align: center;'>No. of Deviation Per Person</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>0</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>1</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>2</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>3</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'>4</th>";
                TPLagDetails += "<th style='border: 0.1px solid lightgrey; text-align: center;'> >4 </th>";
                TPLagDetails += "</tr>";
                TPLagDetails += "</thead>";
                TPLagDetails += "<tbody>";

                for (var i = 0; i < JsonData.length; i++) {
                    TPLagDetails += "<tr>";
                    TPLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].User_Type_Name + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Zero + "</td>"
                    TPLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].One + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Two + "</td>"
                    TPLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Three + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].Four + "</td>"
                    TPLagDetails += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: center;'>" + JsonData[i].GreaterthanFour + "</td>";
                    TPLagDetails += "</tr>";
                }

                TPLagDetails += "</tbody>";
                $('#tblDCRTPDeviation').html(TPLagDetails + "</table>");
            },
            error: function (e) {
                AdmindashboardV2.UnblockUI("timeLag");
            },
            complete: function () {
                AdmindashboardV2.UnblockUI("timeLag");
            }
        });
    }



    /////////////////////////////////////////////////////////////// End DashboardV2-PhaseII /////////////////////////////////////////////////////
}



Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};