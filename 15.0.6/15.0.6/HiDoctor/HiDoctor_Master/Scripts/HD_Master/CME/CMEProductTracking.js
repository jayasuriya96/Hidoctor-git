//////////Created By: Manju////////////
//////////Date : 22-08-2019//////////
var CME = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        UserTypeCode: "",
        CME_id: "",
        Doctor_Code: "",
        CME_Value:"",
    },
    Init: function () {
        $('#go').click(function () {
            CME.GetCMEDoctorName();
        })
    },
    GetCMEDoctorName: function () {
        if ($('#CME_hidden').val() == '')
        {
            swal("", "Select CME Name", "");
            return false;
        }
        CME.defaults.CME_id = $('#CME_hidden').val();
        var region = $('#Region_hidden').val()
        Method_params = ["CMEApi/GetCMEDoctorNameDetails", CME.defaults.CompanyCode, CME.defaults.CME_id, region];
        CoreREST.get(null, Method_params, null, CME.getAllCMEDoctorSuccess, CME.getAllCMEDoctorSuccessFailure);
    },
    getAllCMEDoctorSuccess: function (json) {
        debugger;
        var response = json.list;
        var content = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                content += "<div class='col-sm-12' style='background: #1976d2;padding: 10px 10px;background: #1976d2;color: #fff;margin-top: 5px;' onclick=\"CME.fnToggle('tr" + response[i].Code + "','icon" + response[i].Code + "','" + response[i].Code + "');\">";
                content += "<div style='float:left'>";
                content += "<span>Doctor Name : " + response[i].Name + " </span>";
                content += "</div>";
                content += "<div style='text-align:right;'>";
                content += "<span style='margin-right: 12px;'>Last Entered Date: " + response[i].DCR_Date + " </span>";
                content += "<span id='icon" + response[i].Code + "' style='font-size:14px;margin-right: 10px;'><i class='fa fa-plus' aria-hidden='true'></i></span>";
                content += "</div>";
                content += "</div>";
                content += ("<div class='padding-10' id='tr" + response[i].Code + "' style='overflow:auto;border: 1px solid #1976d2;margin-bottom:1%;display:none;'> ");
                content += ("<div id='divMonth_" + response[i].Code + "' style='padding: 5px 10px 0px 10px;'>");

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
            CME.fngetProductMonthDetails(Doctor_Code);
            $("#" + divId).slideDown();
            $("#" + divId).css("display", "block");
            $("#" + iconId).html('<i class="fa fa-minus" aria-hidden="true"></i>');

        }
    },
    fngetProductMonthDetails: function (Doctor_Code) {
        CME.defaults.Doctor_Code = Doctor_Code;
        Method_params = ["CMEApi/GetProductMonthDetails", CME.defaults.CompanyCode, CME.defaults.CME_id, Doctor_Code];
        CoreREST.get(null, Method_params, null, CME.getProductMonthDetailsSuccess, CME.getProductMonthDetailsSuccessFailure);
    },
    getProductMonthDetailsSuccess: function (json) {
        debugger;
        var response = json.list.lst;
        var Months = json.list.lst1;
        var ReleaseData = json.list.Release;
        if (response.length > 0) {
            var content = '';
            content += '<div class="text-right"> No Of Months:' + response[0].No_Of_Months + '</div>';
            content += ' <div class="table-responsive">';
            content += '<table class="table table-bordered" id="table_' + CME.defaults.Doctor_Code + '" style="width:136%"><thead>';
            content += '<tr><th>Product Name</th><th>CME Date</th><th>Current Sales</th><th>Expected Sales</th><th>M1</th><th>M2</th><th>M3</th><th>M4</th><th>M5</th><th>M6</th><th>M7</th><th>M8</th><th>M9</th><th>M10</th><th>M11</th><th>M12</th></tr>';
            content += ' </thead>';
            content += '<tbody>';
            for (var i = 0; i < response.length; i++) {
                content += '<tr>';
                content += '<td style="display:none">' + response[i].CPT_ID + '</td><td>' + response[i].Product_Name + '</td><td>' + response[i].CME_Date + '</td><td>' + response[i].Current_Sales + '</td><td>' + response[i].Expected_Sales + '</td>';
                var lst = $.grep(Months, function (v) {
                    return v.CPT_ID == response[i].CPT_ID;
                });
                if (lst.length > 0)
                {
                    for (var j = 1; j <= 12; j++) {
                        var month = response[i].No_Of_Months;
                        var heading = CME.fngetMonthdata(response[i].CME_Date.split('/')[1], month, response[i].CME_Date.split('/')[2])
                        if (j <= month) {
                            var CurrentMonth = "M" + j;
                            var Date = "M" + j+"_Date";
                            if (lst[0][CurrentMonth] == 0)
                            {
                                content += '<td><input type="number" class="form-control" id="' + CME.defaults.Doctor_Code + '_M' + j + '" onkeypress="return fnValidateBudget(this,event);"/><br>';
                          
                                content += '<input type="text" class="form-control  monthpicker" id="' + CME.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly value="' + heading[j - 1] + '"></td>';
                            }
                            else {
                                var ID = (lst[0].CPT_ID).toString()
                                var Release = $.grep(ReleaseData, function (v) {
                                    return v.CPT_Id == ID && v.Months == 'M' + j;
                                });
                                if (Release.length > 0) {
                                    content += '<td><input type="number" class="form-control" id="' + CME.defaults.Doctor_Code + '_M' + j + '" value="' + lst[0][CurrentMonth] + '"><br>';
                                }
                                else {
                                    content += '<td><input type="number" class="form-control" id="' + CME.defaults.Doctor_Code + '_M' + j + '" value="' + lst[0][CurrentMonth] + '" readonly><br>';
                                }
                              
                                var value = lst[0][Date].split('/');
                                var monthname = fnGetMonth(value[1]);
                                value = monthname + '-' + value[2]
                                content += '<input type="text" class="form-control  monthpicker" id="' + CME.defaults.Doctor_Code + '_M' + j + '_datepicker" value="' + value + '" readonly></td>';
                            }
                           
                        }
                        else {
                            content += '<td><input type="number" class="form-control typenumeric" id="' + CME.defaults.Doctor_Code + '_M' + j + '" readonly><br><input type="text" class="form-control typenumeric" id="' + CME.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly></td>';
                        }


                    }
                }
                else {
                    for (var j = 1; j <= 12; j++) {
                        var month = response[i].No_Of_Months;
                        var heading = CME.fngetMonthdata(response[i].CME_Date.split('/')[1], month, response[i].CME_Date.split('/')[2])
                        if (j <= month) {

                            content += '<td><input type="number" class="form-control typenumeric" id="' + CME.defaults.Doctor_Code + '_M' + j + '" onkeypress="return fnValidateBudget(this,event);"><br><input type="text" class="form-control monthpicker" id="' + CME.defaults.Doctor_Code + '_M' + j + '_datepicker" value="' + heading[j - 1] + '" readonly></td>';
                        }
                        else {
                            content += '<td><input type="number" class="form-control typenumeric" id="' + CME.defaults.Doctor_Code + '_M' + j + '" readonly><br><input type="text" class="form-control" id="' + CME.defaults.Doctor_Code + '_M' + j + '_datepicker" readonly ></td>';
                        }


                    }
                }
            
                content += '</tr>';
            }
            content += '</tbody>';
            content += '</table></div>';
            content += "<div style='text-align: right;' class='mt-2 mb-2'>";
            if (Months.length == 0)
            {
                content += "<button type='button' class='btn btn-primary mr-2' onclick=fnSubmitCME1('" + CME.defaults.Doctor_Code + "','Submit')>Submit</button>";
            }
            else {
                content += "<button type='button' class='btn btn-primary mr-2' onclick=fnSubmitCME1('" + CME.defaults.Doctor_Code + "','Update')>Update</button>";
            }
            content += '<button type="button" class="btn btn-primary" onclick=CME.fnCancel("' + CME.defaults.Doctor_Code + '")>Cancel</button></div>';
            $('#divMonth_' + CME.defaults.Doctor_Code).html(content);
          
            
               
            
            //fnMonthPickerDisableFutureMonths('monthpicker')
        }
        else {
            $('#divMonth_' + CME.defaults.Doctor_Code).html('<span>No Record Found</span>')
        }
    },

    getProductMonthDetailsSuccessFailure: function (response) {

    },
    fnSubmitCME: function (Doctor_Code,value) {
        debugger;
        var product = [];
        var Dates = [];
        var log = [];
        var trn = $("#table_" + Doctor_Code + " tbody tr").length;
        var Error = true;
        $("#table_" + Doctor_Code + " tbody tr").each(function () {
            if ($(this).find('#' + Doctor_Code + '_M1').val().length > 10 || $(this).find('#' + Doctor_Code + '_M1').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M1').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M1').val() !='')
            {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M1').val());
                if(character == false)
                {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M1').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M2').val().length > 10 || $(this).find('#' + Doctor_Code + '_M2').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M2').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M2').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M2').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M2').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M3').val().length > 10 || $(this).find('#' + Doctor_Code + '_M3').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M3').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M3').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M3').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M3').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M4').val().length > 10 || $(this).find('#' + Doctor_Code + '_M4').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M4').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M4').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M4').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M4').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M5').val().length > 10 || $(this).find('#' + Doctor_Code + '_M5').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M5').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M5').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M5').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M5').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M6').val().length > 10 || $(this).find('#' + Doctor_Code + '_M6').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M6').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M6').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M6').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M6').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M7').val().length > 10 || $(this).find('#' + Doctor_Code + '_M7').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M7').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M7').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M7').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M7').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M8').val().length > 10 || $(this).find('#' + Doctor_Code + '_M8').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M8').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M8').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M8').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M8').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M9').val().length > 10 || $(this).find('#' + Doctor_Code + '_M9').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M9').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M9').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M9').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M9').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M10').val().length > 10 || $(this).find('#' + Doctor_Code + '_M10').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M10').css("border-color", "red");
                Error = false;
                return false
            }
            if ($(this).find('#' + Doctor_Code + '_M10').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M10').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M10').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M11').val().length > 10 || $(this).find('#' + Doctor_Code + '_M11').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M11').css("border-color", "red");
                Error = false;
                return false

            }
            if ($(this).find('#' + Doctor_Code + '_M11').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M11').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M11').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            if ($(this).find('#' + Doctor_Code + '_M12').val().length > 10 || $(this).find('#' + Doctor_Code + '_M12').val() < 0) {
                swal("", "Enter Valid Sales Amount", "");
                $(this).find('#' + Doctor_Code + '_M12').css("border-color", "red");
                Error = false;
                return false

            }
            if ($(this).find('#' + Doctor_Code + '_M12').val() != '') {
                var character = CME.fnSpecialCharacter($(this).find('#' + Doctor_Code + '_M12').val());
                if (character == false) {
                    swal("", "Special character not allowed", "");
                    $(this).find('#' + Doctor_Code + '_M12').css("border-color", "red");
                    Error = false;
                    return false
                }
            }
            var object = {
                "Doctor_Code": Doctor_Code,
                "CME_id": parseInt(CME.defaults.CME_id),
                "CPT_ID": $(this).find("td:first").text(),
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
            }
            product.push(object);
            var object = {
                "CME_id": parseInt(CME.defaults.CME_id),
                "CPT_ID": $(this).find("td:first").text(),
                "M1_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M1_datepicker').val()),
                "M2_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M2_datepicker').val()),
                "M3_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M3_datepicker').val()),
                "M4_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M4_datepicker').val()),
                "M5_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M5_datepicker').val()),
                "M6_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M6_datepicker').val()),
                "M7_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M7_datepicker').val()),
                "M8_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M8_datepicker').val()),
                "M9_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M9_datepicker').val()),
                "M10_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M10_datepicker').val()),
                "M11_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M11_datepicker').val()),
                "M12_Date": CME.fngetvalue($(this).find('#' + Doctor_Code + '_M12_datepicker').val()),
            }
            Dates.push(object);

            var M1value = $(this).find('#' + Doctor_Code + '_M1').is('[readonly]')
            if (M1value == false && $(this).find('#' + Doctor_Code + '_M1').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M1",
                    "Value": $(this).find('#' + Doctor_Code + '_M1').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M1_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M1_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M2value = $(this).find('#' + Doctor_Code + '_M2').is('[readonly]')
            if (M2value == false && $(this).find('#' + Doctor_Code + '_M2').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M2",
                    "Value": $(this).find('#' + Doctor_Code + '_M2').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M2_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M2_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M3value = $(this).find('#' + Doctor_Code + '_M3').is('[readonly]')
            if (M3value == false && $(this).find('#' + Doctor_Code + '_M3').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M3",
                    "Value": $(this).find('#' + Doctor_Code + '_M3').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M3_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M3_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M4value = $(this).find('#' + Doctor_Code + '_M4').is('[readonly]')
            if (M4value == false && $(this).find('#' + Doctor_Code + '_M4').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M4",
                    "Value": $(this).find('#' + Doctor_Code + '_M4').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M4_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M4_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M5value = $(this).find('#' + Doctor_Code + '_M5').is('[readonly]')
            if (M5value == false && $(this).find('#' + Doctor_Code + '_M5').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M5",
                    "Value": $(this).find('#' + Doctor_Code + '_M5').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M5_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M5_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M6value = $(this).find('#' + Doctor_Code + '_M6').is('[readonly]')
            if (M6value == false && $(this).find('#' + Doctor_Code + '_M6').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M6",
                    "Value": $(this).find('#' + Doctor_Code + '_M6').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M6_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M6_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M7value = $(this).find('#' + Doctor_Code + '_M7').is('[readonly]')
            if (M7value == false && $(this).find('#' + Doctor_Code + '_M7').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M7",
                    "Value": $(this).find('#' + Doctor_Code + '_M7').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M7_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M7_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M8value = $(this).find('#' + Doctor_Code + '_M8').is('[readonly]')
            if (M8value == false && $(this).find('#' + Doctor_Code + '_M8').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M8",
                    "Value": $(this).find('#' + Doctor_Code + '_M8').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M8_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M8_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M9value = $(this).find('#' + Doctor_Code + '_M9').is('[readonly]')
            if (M9value == false && $(this).find('#' + Doctor_Code + '_M9').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M9",
                    "Value": $(this).find('#' + Doctor_Code + '_M9').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M9_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M9_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M10value = $(this).find('#' + Doctor_Code + '_M10').is('[readonly]')
            if (M10value == false && $(this).find('#' + Doctor_Code + '_M10').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M10",
                    "Value": $(this).find('#' + Doctor_Code + '_M10').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M10_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M10_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M11value = $(this).find('#' + Doctor_Code + '_M11').is('[readonly]')
            if (M11value == false && $(this).find('#' + Doctor_Code + '_M11').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M11",
                    "Value": $(this).find('#' + Doctor_Code + '_M11').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M11_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M11_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }
            var M12value = $(this).find('#' + Doctor_Code + '_M12').is('[readonly]')
            if (M12value == false && $(this).find('#' + Doctor_Code + '_M12').val() != '') {
                var logobj = {
                    "CME_id": parseInt(CME.defaults.CME_id),
                    "CPT_ID": $(this).find("td:first").text(),
                    "Months": "M12",
                    "Value": $(this).find('#' + Doctor_Code + '_M12').val(),
                    "Month": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M12_datepicker').val(), 'Month'),
                    "Year": CME.fnGetSalesMonth($(this).find('#' + Doctor_Code + '_M12_datepicker').val(), 'Year'),
                }
                log.push(logobj)

            }

        });
        if (Error == false) {
            return false;
        }
        else {
            var obj = {
                "product": JSON.stringify(product),
                "Dates": JSON.stringify(Dates),
                 "log": JSON.stringify(log)
            }
            CME.defaults.CME_Value = value;
            CME.defaults.Doctor_Code = Doctor_Code;
            Method_params = ["CMEApi/InsertCMETracking", CME.defaults.CompanyCode, CME.defaults.UserCode, value];
            CoreREST.post(null, Method_params, obj, CME.SuccessData, CME.Failure);
        }
    },
    SuccessData: function (response) {
        if (response == 1) {
            if (CME.defaults.CME_Value == 'Update') {

                swal({
                    icon: "success",
                    title: "Success",
                    text: 'CME Sales Update successfully.',
                    button: "Ok",
                });
                $('.form-control').css("border", "1px solid #ced4da");
            }
            else {
                swal({
                    icon: "success",
                    title: "Success",
                    text: 'CME Sales Saved successfully.',
                    button: "Ok",
                });
                $('.form-control').css("border", "1px solid #ced4da");
            }

            CME.fngetProductMonthDetails(CME.defaults.Doctor_Code);
        }

    },
    Failure: function (response) {

    },
    fnCancel: function (Doctor_Code) {
        alert('hai');
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
    fngetMonthdata:function(month,limit,Year)
    {
        var arrays = [];
        var M = 1;
        var i = month;
        //for(var i=month;i<=limit;i++)
        while(M<=limit)
        {
            if(i==13)
            {
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
    fnTotalAdd:function(id,value)
    {
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
    },
    fnSpecialCharacter: function (value) {
       
        if (/[^a-zA-Z0-9.]/.test(value)) {
            return false;

        }
        return true;
    },
    fnGetSalesMonth: function (value, Type) {
        var data = value.split('-');
        if (Type == 'Month') {
            return fnGetMonthName(data[0]);
        }
        else {
            return data[1];
        }
    },
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
function fnSubmitCME1(var1,v1r2)
{
    debugger;
    CME.fnSubmitCME(var1, v1r2)
}
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
    else if ( evt.keyCode == 45 || evt.keyCode == 43 || evt.shiftKey == true || evt.keyCode == 187 || evt.keyCode == 189) {
        return false;
    } else {
        if ($('#' + Id.id + '').val().length >= 10) {
            return false;

        }
    }
}