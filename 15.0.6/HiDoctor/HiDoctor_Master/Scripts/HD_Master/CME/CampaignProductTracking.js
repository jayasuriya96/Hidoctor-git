//////////Created By: Manju////////////
//////////Date : 22-08-2019//////////
var Campaign = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        UserTypeCode: "",
        CME_id: "",
        Doctor_Code: "",
        CME_Value: "",
    },
    Init: function () {
        $('#go').click(function () {
            Campaign.GetCMEDoctorName();
        })
    },
    GetCMEDoctorName: function () {
        if ($('#Region_hidden').val() == '' || $('#Region_hidden').val() == null) {
            swal("", "Select Region Name", "");
            return false;
        }
        if ($('#CME_hidden').val() == '' || $('#CME_hidden').val() == null) {
            swal("", "Select Marketing Campaign  Name", "");
            return false;
        }
        Campaign.defaults.CME_id = $('#CME_hidden').val();
        Region_Code = $('#Region_hidden').val()
        Method_params = ["CMEApi/GetCampaignDoctorNameDetails", Campaign.defaults.CompanyCode, Campaign.defaults.CME_id,Region_Code, Campaign.defaults.RegionCode];
        CoreREST.get(null, Method_params, null, Campaign.getAllCMEDoctorSuccess, Campaign.getAllCMEDoctorSuccessFailure);
    },
    getAllCMEDoctorSuccess: function (json) {
        debugger;
        var response = json.list;
        var content = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                content += "<div class='col-sm-12' style='background: #1976d2;padding: 10px 10px;background: #1976d2;color: #fff;margin-top: 5px;' onclick=\"Campaign.fnToggle('tr" + response[i].Code + "','icon" + response[i].Code + "','" + response[i].Code + "');\">";
                content += "<div style='float:left'>";
                content += "<span>Doctor Name : " + response[i].Name + " </span>";
                content += "</div>";
                content += "<div style='text-align:right;'>";
                content += "<span id='icon" + response[i].Code + "' style='font-size:14px;margin-right: 10px;'><i class='fa fa-plus' aria-hidden='true'></i></span>";
                content += "</div>";
                content += "</div>";
                content += ("<div class='padding-10' id='tr" + response[i].Code + "' style='overflow:auto;border: 1px solid #1976d2;margin-bottom:1%;display:none;'> ");
                content += ("<div id='divMonth_" + response[i].Code + "' style='padding: 5px 10px 0px 10px;text-align: center;'>");

                content += "</div>";
                content += "</div>";
            }
            $('#DocName').html(content);
        }
        else {
            $('#DocName').html('<span>No Record Found</span>');
        }
    },
    getAllCMEDoctorSuccessFailure: function () {

    },

    fnToggle: function (divId, iconId, Doctor_Code) {
        debugger
        var currentState = $("#" + divId).css("display");
        if (currentState == "block") {
            $("#" + divId).slideUp();
            $("#" + iconId).html("<i class='fa fa-plus' aria-hidden='true'></i>");
        }
        else {
            Campaign.fngetProductMonthDetails(Doctor_Code);
            $("#" + divId).slideDown();
            $("#" + divId).css("display", "block");
            $("#" + iconId).html('<i class="fa fa-minus" aria-hidden="true"></i>');

        }
    },
    fngetProductMonthDetails: function (Doctor_Code) {
        $('#divMonth_' + Doctor_Code).html('<img src="../../Content/images/loader1.gif" style="width:50px;margin-top: 10%;"/>')
        Campaign.defaults.Doctor_Code = Doctor_Code;
        Method_params = ["CMEApi/GetCampaignProductMonthDetails", Campaign.defaults.CompanyCode, Campaign.defaults.CME_id, Doctor_Code];
        CoreREST.get(null, Method_params, null, Campaign.getProductMonthDetailsSuccess, Campaign.getProductMonthDetailsSuccessFailure);
    },
    getProductMonthDetailsSuccess: function (json) {
        debugger;
        var response = json.list.lst;
        var Months = json.list.lst1;
        var ReleaseData = json.list.Release;
        if (response.length > 0) {
            var content = '';
            var Dates = $.grep(response, function (v) {
                return v.Campaign_Date != null;
            });
            var month = Dates[0].No_Of_Months;
            var heading = Campaign.fngetMonthdata(Dates[0].Campaign_Date.split('/')[1], month, Dates[0].Campaign_Date.split('/')[2])
            content += '<div class="text-right"> Campaign Date: <span id="Campdate">' + Dates[0].Campaign_Date + '</span>  No Of Months: <span id="NOMonths">' + response[0].No_Of_Months + '</span></div>';
            content += ' <div class="table-responsive">';
            content += '<table class="table table-bordered" id="table_' + Campaign.defaults.Doctor_Code + '" style="width:136%"><thead>';
            content += '<tr><th>Product Name</th><th>Current Sales</th><th>Expected Sales</th><th>M1</th><th>M2</th><th>M3</th><th>M4</th><th>M5</th><th>M6</th><th>M7</th><th>M8</th><th>M9</th><th>M10</th><th>M11</th><th>M12</th></tr>';
            content += ' </thead>';
            content += '<tbody>';
                //var lst = $.grep(Months, function (v) {
                //    return v.CPT_ID == response[i].CPT_ID;
                //});
            
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    if (Months.length > 0)
                    {
                        var Data = $.grep(Months, function (v) {
                            return v.Product_Code == response[i].Product_Code;
                        });
                    }
                    else
                    {
                        var Data = [];
                    }
                 
                    if (Data.length > 0)
                    {
                        content += '<tr>';
                        content += '<td style="display:none">' + Data[0].Campaign_Id + '</td><td id="Product_Code" style="display:none">' + Data[0].Product_Code + '</td><td>' + Data[0].Product_Name + '</td><td id="CSales">' + Data[0].Current_Sales + '</td><td id="ESales">' + Data[0].Expected_Sales + '</td>';
                        for (var j = 1; j <= 12; j++) {

                            if (j <= month) {
                                var CurrentMonth = "M" + j;
                                var Date = "M" + j + "_Date";
                                if (Data[0][CurrentMonth] == 0) {
                                    content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '" onkeypress="return fnValidateBudget(this,event);"><br>';

                                    content += '<input type="text" class="form-control monthpicker" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly value="' + heading[j - 1] + '"></td>';
                                }
                                else {
                                    var Release = $.grep(ReleaseData, function (v) {
                                        return v.Campaign_Id == Data[0].Campaign_Id && v.Months == 'M' + j;
                                    });
                                    if (Release.length > 0)
                                    {
                                        content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '" value="' + Data[0][CurrentMonth] + '" onkeypress="return fnValidateBudget(this,event);"><br>';
                                    }
                                    else {
                                        content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '" value="' + Data[0][CurrentMonth] + '" readonly><br>';
                                    }
                                   
                                    var value = Data[0][Date].split('/');
                                    var monthname = fnGetMonth(value[1]);
                                    value = monthname + '-' + value[2]
                                    content += '<input type="text" class="form-control monthpicker" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '_datepicker" value="' + value + '" readonly></td>';
                                }

                            }
                            else {
                                content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '" readonly><br><input type="text" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly></td>';
                            }


                        }
                    }
                    else {
                        content += '<tr>';
                        content += '<td style="display:none">0</td><td id="Product_Code" style="display:none">' + response[i].Product_Code + '</td><td>' + response[i].Product_Name + '</td><td id="CSales">' + response[i].Current_Sales + '</td><td id="ESales">' + response[i].Expected_Sales + '</td>';
                        for (var j = 1; j <= 12; j++) {

                            // var heading = Campaign.fngetMonthdata(response[i].Campaign_Date.split('/')[1], month, response[i].Campaign_Date.split('/')[2])
                            if (j <= month) {

                                content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '"><br><input type="text" class="form-control monthpicker" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '_datepicker" value="' + heading[j - 1] + '" readonly></td>';
                            }
                            else {
                                content += '<td><input type="number" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '" readonly><br><input type="text" class="form-control" id="' + Campaign.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly ></td>';
                            }


                        }
                    }
                   
                }
               
            }
        
                content += '</tr>';
            
                content += '</tbody>';
                content += '</table></div>';
                content += "<div style='text-align: right;'>";
                if (Months.length == 0) {
                    content += "<button type='button' class='btn btn-primary mr-2' onclick=Campaign.fnSubmitCampaign('" + Campaign.defaults.Doctor_Code + "','Submit')>Submit</button>";
                }
                else {
                    content += "<button type='button' class='btn btn-primary mr-2' onclick=Campaign.fnSubmitCampaign('" + Campaign.defaults.Doctor_Code + "','Update')>Update</button>";
                }
                content += '<button type="button" class="btn btn-primary" onclick=Campaign.fnCancel("' + Campaign.defaults.Doctor_Code + '")>Cancel</button></div>';
                $('#divMonth_' + Campaign.defaults.Doctor_Code).html('');
                $('#divMonth_' + Campaign.defaults.Doctor_Code).html(content);
                //fnMonthPickerDisableFutureMonths('monthpicker')
            }
        else {
            $('#divMonth_' + Campaign.defaults.Doctor_Code).html('');
            $('#divMonth_' + Campaign.defaults.Doctor_Code).html('<span>No Record Found</span>')
        }
    },
    getProductMonthDetailsSuccessFailure: function (response) {

    },
    fnSubmitCampaign: function (Doctor_Code, value) {
        debugger;
        var product = [];
        var Dates = [];
        var log = [];
        var trn = $("#table_" + Doctor_Code + " tbody tr").length;
        var Error = true;
        $("#table_" + Doctor_Code + " tbody tr").each(function () {
            if ($(this).find('#' + Doctor_Code + '_M1').val().length > 10 || $(this).find('#' + Doctor_Code + '_M1').val() < 0)
            {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M1').css("border-color", "red");
                Error=false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M2').val().length > 10 || $(this).find('#' + Doctor_Code + '_M2').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M2').css("border-color", "red");
                Error= false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M3').val().length > 10 || $(this).find('#' + Doctor_Code + '_M3').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M3').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M4').val().length > 10 || $(this).find('#' + Doctor_Code + '_M4').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M4').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M5').val().length > 10 || $(this).find('#' + Doctor_Code + '_M5').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M5').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M6').val().length > 10 || $(this).find('#' + Doctor_Code + '_M6').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M6').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M7').val().length > 10 || $(this).find('#' + Doctor_Code + '_M7').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M7').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M8').val().length > 10 || $(this).find('#' + Doctor_Code + '_M8').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M8').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M9').val().length > 10 || $(this).find('#' + Doctor_Code + '_M9').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M9').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M10').val().length > 10 || $(this).find('#' + Doctor_Code + '_M10').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M10').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M11').val().length > 10 || $(this).find('#' + Doctor_Code + '_M11').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M11').css("border-color", "red");
                Error = false;
                return false

            }
            if ($(this).find('#' + Doctor_Code + '_M12').val().length > 10 || $(this).find('#' + Doctor_Code + '_M12').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M12').css("border-color", "red");
                Error = false;
                return false

            }
            var object = {
                "Campaign_Id": $(this).find("td:first").text(),
                "Doctor_Code": Doctor_Code,
                "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                "Campaign_Date": $('#Campdate').html(),
                "Region_Code": $('#Region_hidden').val(),
                "Product_Code": $(this).find('#Product_Code').html(),
                "Current_Sales": $(this).find('#CSales').html(),
                "Expected_Sales": $(this).find('#ESales').html(),
                "No_Of_Months": $('#NOMonths').html(),
                "M1": $(this).find('#' + Doctor_Code + '_M1').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M1').val(),
                "M2": $(this).find('#' + Doctor_Code + '_M2').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M2').val(),
                "M3": $(this).find('#' + Doctor_Code + '_M3').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M3').val(),
                "M4": $(this).find('#' + Doctor_Code + '_M4').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M4').val(),
                "M5": $(this).find('#' + Doctor_Code + '_M5').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M5').val(),
                "M6": $(this).find('#' + Doctor_Code + '_M6').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M6').val(),
                "M7": $(this).find('#' + Doctor_Code + '_M7').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M7').val(),
                "M8": $(this).find('#' + Doctor_Code + '_M8').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M8').val(),
                "M9": $(this).find('#' + Doctor_Code + '_M9').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M9').val(),
                "M10": $(this).find('#' + Doctor_Code + '_M10').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M10').val(),
                "M11": $(this).find('#' + Doctor_Code + '_M11').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M11').val(),
                "M12": $(this).find('#' + Doctor_Code + '_M12').val() == '' ? -1 : $(this).find('#' + Doctor_Code + '_M12').val(),
                "M1_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M1_datepicker').val()),
                "M2_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M2_datepicker').val()),
                "M3_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M3_datepicker').val()),
                "M4_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M4_datepicker').val()),
                "M5_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M5_datepicker').val()),
                "M6_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M6_datepicker').val()),
                "M7_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M7_datepicker').val()),
                "M8_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M8_datepicker').val()),
                "M9_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M9_datepicker').val()),
                "M10_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M10_datepicker').val()),
                "M11_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M11_datepicker').val()),
                "M12_Date": Campaign.fngetvalue($(this).find('#' + Doctor_Code + '_M12_datepicker').val()),
            }
            product.push(object);
            
            var M1value = $(this).find('#' + Doctor_Code + '_M1').is('[readonly]')
            if (M1value == false && $(this).find('#' + Doctor_Code + '_M1').val() != '')
            {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M1",
                    "Value": $(this).find('#' + Doctor_Code + '_M1').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M1_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M1_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M2value = $(this).find('#' + Doctor_Code + '_M2').is('[readonly]') 
            if (M2value == false && $(this).find('#' + Doctor_Code + '_M2').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M2",
                    "Value": $(this).find('#' + Doctor_Code + '_M2').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M2_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M2_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M3value = $(this).find('#' + Doctor_Code + '_M3').is('[readonly]')
            if (M3value == false && $(this).find('#' + Doctor_Code + '_M3').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M3",
                    "Value": $(this).find('#' + Doctor_Code + '_M3').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M3_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M3_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M4value = $(this).find('#' + Doctor_Code + '_M4').is('[readonly]')
            if (M4value == false && $(this).find('#' + Doctor_Code + '_M4').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M4",
                    "Value": $(this).find('#' + Doctor_Code + '_M4').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M4_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M4_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M5value = $(this).find('#' + Doctor_Code + '_M5').is('[readonly]')
            if (M5value == false && $(this).find('#' + Doctor_Code + '_M5').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M5",
                    "Value": $(this).find('#' + Doctor_Code + '_M5').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M5_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M5_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M6value = $(this).find('#' + Doctor_Code + '_M6').is('[readonly]')
            if (M6value == false && $(this).find('#' + Doctor_Code + '_M6').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M6",
                    "Value": $(this).find('#' + Doctor_Code + '_M6').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M6_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M6_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M7value = $(this).find('#' + Doctor_Code + '_M7').is('[readonly]')
            if (M7value == false && $(this).find('#' + Doctor_Code + '_M7').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M7",
                    "Value": $(this).find('#' + Doctor_Code + '_M7').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M7_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M7_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M8value = $(this).find('#' + Doctor_Code + '_M8').is('[readonly]')
            if (M8value == false && $(this).find('#' + Doctor_Code + '_M8').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M8",
                    "Value": $(this).find('#' + Doctor_Code + '_M8').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M8_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M8_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M9value = $(this).find('#' + Doctor_Code + '_M9').is('[readonly]')
            if (M9value == false && $(this).find('#' + Doctor_Code + '_M9').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M9",
                    "Value": $(this).find('#' + Doctor_Code + '_M9').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M9_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M9_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M10value = $(this).find('#' + Doctor_Code + '_M10').is('[readonly]') 
            if (M10value == false && $(this).find('#' + Doctor_Code + '_M10').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M10",
                    "Value": $(this).find('#' + Doctor_Code + '_M10').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M10_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M10_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M11value = $(this).find('#' + Doctor_Code + '_M11').is('[readonly]')
            if (M11value == false && $(this).find('#' + Doctor_Code + '_M11').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M11",
                    "Value": $(this).find('#' + Doctor_Code + '_M11').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M11_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M11_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
            var M12value = $(this).find('#' + Doctor_Code + '_M12').is('[readonly]') 
            if (M12value == false && $(this).find('#' + Doctor_Code + '_M12').val() != '') {
                var logobj = {
                    "Campaign_Id": $(this).find("td:first").text(),
                    "Campaign_Code": parseInt(Campaign.defaults.CME_id),
                    "Months": "M12",
                    "Value": $(this).find('#' + Doctor_Code + '_M12').val(),
                    "Product_Code": $(this).find('#Product_Code').html(),
                    "Month": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M12_datepicker').val(), 'Month'),
                    "Year": Campaign.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M12_datepicker').val(), 'Year'),
                    "Doctor_Code": Doctor_Code,
                }
                log.push(logobj)

            }
        

            
           
        });
        if (Error==false) {
            return false;
        }
        else {
            var obj = {
                "CampaignDetails": JSON.stringify(product),
                "log": JSON.stringify(log),
            }
        
            Campaign.defaults.CME_Value = value;
            Campaign.defaults.Doctor_Code = Doctor_Code;
            Method_params = ["CMEApi/InsertCampaignTracking", Campaign.defaults.CompanyCode, Campaign.defaults.UserCode, value];
            CoreREST.post(null, Method_params, obj, Campaign.SuccessData, Campaign.Failure);
        }
    },
    SuccessData: function (response) {
        if (response == 1) {
            if (Campaign.defaults.CME_Value == 'Update') {

                swal({
                    icon: "success",
                    title: "Success",
                    text: 'Marketing Campaign Sales Update successfully.',
                    button: "Ok",
                });
                $('.form-control').css("border", "1px solid #ced4da");
            }
            else {
                swal({
                    icon: "success",
                    title: "Success",
                    text: 'Marketing Campaign Sales Saved successfully.',
                    button: "Ok",
                });
                $('.form-control').css("border", "1px solid #ced4da");
            }
         
            Campaign.fngetProductMonthDetails(Campaign.defaults.Doctor_Code);
        }

    },
    Failure: function (response) {

    },
    fnCancel: function (Doctor_Code) {
        Campaign.fngetProductMonthDetails(Doctor_Code);
    },
    fngetvalue: function (value) {
        if (value == '') {
            return null;
        }
        else {
            var data = value.split('-');
            var Month = fnGetMonthName(data[0]);
            var Year = data[1]
            return Year + '-' + Month + '-01'
        }
    },
    fnGetSalesMonth:function(value,Type)
    {
        var data = value.split('-');
        if(Type=='Month')
        {
            return fnGetMonthName(data[0]);
        }
        else {
            return data[1];
        }
    },
    fngetMonthdata: function (month, limit, Year) {
        var arrays = [];
        var M = 1;
        var i = month;
        //for(var i=month;i<=limit;i++)
        while (M <= limit) {
            if (i == 13) {
                i = 1;
                Year = parseInt(Year) + 1
            }

            var result = fnGetMonth(("0" + i).slice(-2));
            arrays.push(result + '-' + Year);
            i++;
            M++;
        }
        return arrays;
    },
    fnTotalAdd: function (id, value) {
        var items = []
        debugger;
        $('#' + id + ' tbody tr td:nth-child(' + value + ')').each(function () {
            items.push($(this).text());
        });
        var items = items;
        var Total = 0;
        $.each(items, function (i, item) {
            Total = (Total + parseInt(item == '' ? 0 : item));
        })
        $('#demo').empty().html(Total);
    }
}
function fnMonthPickerDisableFutureMonths(id) {
    var months = new Array();
    var CurrentMonth = (new Date().getMonth() + 1) + 1;
    for (var i = CurrentMonth; i <= 12; i++) {
        months.push(i);
    }
    $('.' + id).monthpicker({ startYear: new Date().getFullYear() - 8, finalYear: new Date().getFullYear(), pattern: 'mmm-yyyy' });
    for (var i = 0; i < $('.' + id).length; i++) {
        $($('.' + id)[i]).monthpicker("disableMonths", months);
        $($('.' + id)[i]).monthpicker().bind('monthpicker-change-year', function (e, year) {
            var item = $(e.currentTarget);
            if (parseInt(year) === new Date().getFullYear()) {
                $(item).monthpicker('disableMonths', months);
            } else {
                $(item).monthpicker('disableMonths', []);
            }
        });
    }
}
//function fnSubmitCampaign1(var1, v1r2) {
//    debugger;
//    Campaign.fnSubmitCampaign(var1, v1r2)
//}
function fnGetMonthName(Month) {
    var str;
    switch (Month) {
        case "Jan":
            str = '01';
            break;
        case "Feb":
            str = '02';
            break;
        case "Mar":
            str = '03';
            break;
        case "Apr":
            str = '04';
            break;
        case "May":
            str = '05';
            break;
        case "Jun":
            str = '06';
            break;
        case "Jul":
            str = '07';
            break;
        case "Aug":
            str = '08';
            break;
        case "Sep":
            str = '09';
            break;
        case "Oct":
            str = '10';
            break;
        case "Nov":
            str = '11';
            break;
        case "Dec":
            str = '12';
            break;
    }
    return str;
}
function fnGetMonth(Month) {
    var str;
    switch (Month) {
        case "01":
            str = "Jan";
            break;
        case "02":
            str = "Feb";
            break;
        case "03":
            str = "Mar";
            break;
        case "04":
            str = "Apr";
            break;
        case "05":
            str = "May";
            break;
        case "06":
            str = "Jun";
            break;
        case "07":
            str = "Jul";
            break;
        case "08":
            str = "Aug";
            break;
        case "09":
            str = "Sep";
            break;
        case "10":
            str = "Oct";
            break;
        case "11":
            str = "Nov";
            break;
        case "12":
            str = "Dec";
            break;
    }
    return str;
}
function fnValidateBudget(Id, evt) {
    debugger;
    if (evt.keyCode == 69 || evt.keyCode == 16 || evt.keyCode == 101) {
        return false;
    }
    else if (evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 10) {
            return false;

        }
    }
}