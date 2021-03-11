

var OzoneDashboard = {
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
        "StockistSale": "",
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


    getDivisions: function () {
        debugger;
        $.ajax({
         //     start: $.unblockUI(),
            type: 'POST',
            url: "/DashBoardV2/GetDivision",
         //   async: false,
            success: function (jsonData) {
                var listItems;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All' value='ALL'>-Division/All-</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "' value ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i].Division_Code + "' value ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i].Division_Code + "' value ='" + jsonData[i].Division_Code + "'>" + jsonData[i].Division_Name + "</option>";
                        }
                    }

                }
                $('#Ozone_Division').html("");
                $('#Ozone_Division').html(listItems);
                $('#Speciality_Division').html("");
                $('#Speciality_Division').html(listItems);
                $('#Stockist_Division').html(listItems);
            },
          
            error: function (e) {
                $.unblockUI();
            },
            complete: function () {
                OzoneDashboard.GetSates();
                OzoneDashboard.GetSpecialitywiseDoctorCount();
                OzoneDashboard.GetStockistSale();
              
                OzoneDashboard.IntiMethodsWithData();
                //AdmindashboardV2.IntiMethodsWithData();
                //AdmindashboardV2.getJoinerAttrition();
                //AdmindashboardV2.getCategoryCoverageDetails();
                //AdmindashboardV2.getPrimarySecondarySalesTarget();
                //AdmindashboardV2.fngetproductname();
            }
        });
    },

    GetSates: function () {
        var divcode = $('#Ozone_Division').val();
        $.ajax({
            //  start: $.unblockUI(),
            type: 'POST',
            url: "/DashBoardV2/GetStates",
            data:"DivisionCode="+divcode,
            //     async: false,
            success: function (data) {
                var listItems;
                var jsonData = data.states;
                if (1 < jsonData.length) {
                    listItems += "<option selected='selected' data-division_Code = 'All' value='ALL'>--All-</option>";
                    for (var i = 0; i < jsonData.length; i++) {
                        listItems += "<option data-division_Code ='" + jsonData[i] + "' value ='" + jsonData[i] + "'>" + jsonData[i] + "</option>";
                    }
                }
                else {

                    for (var i = 0; i < jsonData.length; i++) {
                        if (i == 0) {
                            listItems += "<option selected='selected' data-division_Code ='" + jsonData[i] + "' value ='" + jsonData[i] + "'>" + jsonData[i] + "</option>";
                        } else {
                            listItems += "<option data-division_Code ='" + jsonData[i] + "' value ='" + jsonData[i] + "'>" + jsonData[i] + "</option>";
                        }
                    }

                }
                $('#State').html("");
                $('#State').html(listItems);
                
            },

            error: function (e) {
                $.unblockUI();
            },
            complete: function () {
               OzoneDashboard.GetCRMDetails();
            },
           
        });
    },

    GetCRMDetails: function () {
        debugger;
        var Divid = $('#Ozone_Division').val();
        var state = $('#State').val().trim();
        if (state == null) { state = 0; }
        $.ajax({
           start: OzoneDashboard.blockUI("CRMDashboard"),
            type: 'POST',
            url: "/DashBoardV2/GetCRMData",
            data: "DivisionCode=" + Divid + "&state=" + state,
        //    async: false,
            success: function (data) {
                debugger;
                var lst = "";
                var CRMData_CHEMIST = "";
                var CRMData_DOCTOR = "";
                CRMData_CHEMIST = data.CRMData_CHEMIST;
                CRMData_DOCTOR = data.CRMData_DOCTOR;
                if (data.CRMData_CHEMIST.length >0 && data != null) {
               // if (data != null) {
                    lst += "<table class='table-striped table' cellspacing='0' cellpadding='0' style='overflow:scroll;' width='100%' border-collapse: collapse;>";
                    lst += "<tr><thead>";
                    lst += "  <th style='border: 0.1px solid lightgrey;height:40%; text-align: center;'>DataType </th> <th style='border: 0.1px solid lightgrey;height:40%; text-align: center;'>" + doctor_caption + " Count </th> <th style='border: 0.1px solid lightgrey;height:40%; text-align: center;'>  " + chemist_caption + " Count </th></thead></tr>";
                    if (CRMData_CHEMIST != null && CRMData_DOCTOR != null)
                        lst += "<tr><td>  Total </td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].Total_Customer + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].Total_Customer + "</td></tr>";
                    lst += "<tr><td>  No of DOB Available </td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_DOB + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_DOB + "</td></tr>";
                    lst += "<tr><td> No of MA Available</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_MA + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_MA + "</td></tr>";
                    lst += "<tr><td> No of Mobile No Available </td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_Mob_Number + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_Mob_Number + "</td></tr>";
                    lst += "<tr><td> No of Landline No Available </td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_Landline_Number + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_Landline_Number + "</td></tr>";
                    lst += "<tr><td> No of E-Mails Available</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_Email + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_Email + "</td></tr>";
                    lst += "<tr><td> No Of Registration</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_DOCTOR[0].No_Of_Registration + "</td>";
                    lst += "<td style='text-align: right;'>" + CRMData_CHEMIST[0].No_Of_Registration + "</td></tr>";

                    lst += "</table>";


                    $('#tbl_CRM').html(lst); $('#dvAjaxLoad').hide();

                }


                else {
                    $('#tbl_CRM').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                }
            },
            error: function (e) {
                $('#dvAjaxLoad').hide();
                OzoneDashboard.UnblockUI("CRMDashboard");
                //fnMsgAlert('error', 'Error', 'Bind Divisions , Get CategoryInfo');
        },
        complete: function () {
                $('#dvAjaxLoad').hide();
            OzoneDashboard.UnblockUI("CRMDashboard");
        }
            });


    },




    GetSpecialitywiseDoctorCount: function () {
       
        //var _objData = new Object();
       
        //var Division_Code = "1000";
        //var flag = "PM";
        $("#Speciality_Division option[value='ALL']").remove();
        var Division_Code = $('#Speciality_Division').val();
        var Spl_Count = new Array();
        $.ajax({
                start: OzoneDashboard.blockUI("SpecialityDashboard"),
            type: 'POST',
            url: "DashBoardV2/GetSpecialitywiseDoctorCount",
            dataType: 'json',
            data: "Division_Code=" + Division_Code,
            success: function (response) {
                debugger;
                var table = eval('(' + response + ')');
                //Call_Avg = table.Tables[0].Rows;
                //if(Call_Avg.length > 0) {
                if (table.Tables.length > 0) {

                    Spl_Count = table.Tables[0].Rows;

                    if (Spl_Count.length > 0) {

                        // Header Column Name 
                        var call_objects = Spl_Count[0];
                        var value = Object.keys(call_objects);
                        //var value = tempValue.move(0, 2);
                        var table = "";
                        var dynamic = "";
                        // table += "<table id='tblCallaverage' class='table table-striped'>";style='width:100%'; background:'#5E87B0 !important;'
                        table += "<table class='table-striped table' cellspacing='0' cellpadding='0'  width='100%' border-collapse: collapse; style='overflow:scroll;'>";
                        table += "<thead>";
                        table += "<tr>";
                        for (var j = 0; j < value.length; j++) {
                           
                            dynamic += "<th style='border: 0.1px solid lightgrey;height:40%; text-align: center;'>" + value[j]+"</th>";
                                //dynamic += "<th style='border: 0.1px solid lightgrey; text-align: center; width:100%;'>" + value[j] + "</th>";

                          
                            }
                        table += dynamic + "</tr>";
                        table += "</thead>";
                        table += "<tbody>";
                        for (var call_avg_count = 0;call_avg_count < Spl_Count.length; call_avg_count++) {
                            debugger;
                            table += "<tr>";
                            for (var i = 0; i < value.length ; i++) {
                                
                                var col_value = value[i];
                                var Actual_Value = Spl_Count[call_avg_count][value[i]];

                                table += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px; text-align: left;'>" + Actual_Value + "</td>";

                            }
                            table += "</tr>";
                        }
                        table += "</tbody>";
                            $('#tbl_Speciality').html(table + "</table>");
                        
                    }
                    else {
                        $('#tbl_Speciality').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                    }
                }

                else {
                    // $('#tblCallaverage').html("No Data found");
                    $('#tbl_Speciality').html("<div class='table' style='font-size: medium;text-align: center;color: darkorange;padding: 70px;'>No Data Found </div>");
                }

            },
            error: function (e) {
              //  $('#dvAjaxLoad').hide();
                OzoneDashboard.UnblockUI("SpecialityDashboard");
            },
            complete: function () {
                OzoneDashboard.UnblockUI("SpecialityDashboard");
            }
        });
    },

    GetStockistSale: function () {
        debugger;
        OzoneDashboard.defaults.StockistSale = $("#Stockist_Division").find(':selected').data('division_code');
        var _objData = new Object();
        _objData.DivisionCode = OzoneDashboard.defaults.StockistSale;

        $.ajax({
            start: OzoneDashboard.blockUI("StockistSaleDashboard"),
            type: 'POST',
            url: "DashBoardV2/GetStockistSale",
            dataType: 'json',
            data: _objData,
            success: function (JsonData) {
                debugger;
                var StockistSale = "";
                var sum = 0;
                var SSTotal = 0;
                var PSPM = 0;
                var SSPM = 0;
                StockistSale += "<table class='table table-striped'; cellspacing='0' cellpadding='0' id='tbl_Stockist' width='100%' border-collapse: collapse;>";
                StockistSale += "<thead>";
                StockistSale += "<tr style='text-align:center;'><th style='border: 0.1px solid lightgrey;'>Amount Range</th>";
                StockistSale += "<th style='border: 0.1px solid lightgrey; 'colspan='2';' title=CurrentMonth>FM</th>";
                StockistSale += "<th style='border: 0.1px solid lightgrey; 'colspan='2';' title=PreviousMonth>PM</th>";
                StockistSale += "</tr>";
                StockistSale += "<tr style='text-align:center;'><th style='border: 0.1px solid lightgrey;'></th>";
                StockistSale += "<th  title=PrimarySale style='border: 0.1px solid lightgrey;'>PS</th>";
                StockistSale += "<th  title=SecondarySale style='border: 0.1px solid lightgrey;'>SS</th>";
                StockistSale += "<th title=PrimarySale style='border: 0.1px solid lightgrey;'>PS</th>";
                StockistSale += "<th title=SecondarySale style='border: 0.1px solid lightgrey;'>SS</th>";
                StockistSale += "</tr>";
                StockistSale += "</thead>";
                // StockistSale += "<tbody>";
                StockistSale += "</tbody>";


                for (i = 0; i < JsonData.FM.length; i++) {
                    sum += parseInt(JsonData.FM[i].PS);
                }

                for (i = 0; i < JsonData.FM.length; i++) {
                    SSTotal += parseInt(JsonData.FM[i].SS);
                }
                for (i = 0; i < JsonData.FM.length; i++) {
                    PSPM += parseInt(JsonData.PM[i].PS);
                }
                for (i = 0; i < JsonData.FM.length; i++) {
                    SSPM += parseInt(JsonData.PM[i].SS);
                }
                for (var i = 0; i < JsonData.FM.length; i++) {
                    if (i == 0) {
                        StockistSale += "<tr>";
                        StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>  0-10,000 </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].PS + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].SS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].PS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].SS + "</td>"
                        StockistSale += "</tr>";
                    }

                    if (i == 1) {
                        StockistSale += "<tr>";
                        StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> 10,001-25,000 </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].PS + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].SS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].PS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].SS + "</td>"
                        StockistSale += "</tr>";
                    }

                    if (i == 2) {
                        StockistSale += "<tr>";
                        StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'> 25,001-50,000 </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].PS + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].SS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].PS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].SS + "</td>"
                        StockistSale += "</tr>";
                    }

                    if (i == 3) {
                        StockistSale += "<tr>";
                        StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>50,001-1,00,000 </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].PS + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].SS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].PS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].SS + "</td>"
                        StockistSale += "</tr>";
                    }

                    if (i == 4) {
                        StockistSale += "<tr>";
                        StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>Above 1,00,001 </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].PS + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.FM[i].SS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].PS + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + JsonData.PM[i].SS + "</td>"
                        StockistSale += "</tr>";
                    }

                }
                StockistSale += "<tr>";
                StockistSale += "<td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>Total " + stockist_caption + " </td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + sum + "</td><td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + SSTotal + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + PSPM + "</td> <td style='border: 0.1px solid lightgrey; padding: 10px 19px;'>" + SSPM + "</td>"
                StockistSale += "</tr>";

                $('#tbl_Stockist').html(StockistSale + "</table>");
            },

            error: function (e) {
               OzoneDashboard.UnblockUI("StockistSaleDashboard");
        },
        complete: function () {
            OzoneDashboard.UnblockUI("StockistSaleDashboard");
        }

            
        });
    },

    IntiMethodsWithData:function () {
        $('#Ozone_Division').change(function ()
        {
            OzoneDashboard.GetSates();        
        });
        $('#Speciality_Division').change(function ()
        {
            OzoneDashboard.GetSpecialitywiseDoctorCount();
        });
        $('#State').change(function () {
            OzoneDashboard.GetCRMDetails();
        });

        $('#Stockist_Division').change(function () {
            debugger;
            OzoneDashboard.GetStockistSale();
        });
            },



    Intailize: function () {
        debugger;
        OzoneDashboard.getDivisions();
       
      

    }

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