var DiseaseFlag_G = "";
var Detailedfeedbackscreen = {
    defaults: {
    },
    Init: function () {
        debugger;
        Detailedfeedbackscreen.fngetusers();
    },
    fngetusers: function () {
        debugger;
        Method_params = ["Detailedfeedbackapi/Getusers", Detailedfeedbackscreen.defaults.companyCode, Detailedfeedbackscreen.defaults.regionCode, Detailedfeedbackscreen.defaults.userCode];
        CoreREST.get(null, Method_params, null, Detailedfeedbackscreen.fnGetusersSucesscallback, Detailedfeedbackscreen.fnGetusersFailurecallback);
    },
    fnGetusersSucesscallback: function (response) {
        debugger;
        var data2 = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    _obj = {
                        id: $.trim(response.list[i].User_Code),
                        name: $.trim(response.list[i].User_Name + '-' + response.list[i].Employee_Name + '-' + response.list[i].User_Type_Name)
                    };
                    data2.push(_obj);
                }
            }
            $('#user').empty();
            $('#user').html('<input type="text" id="ddluser" tabindex="1" />');
            var Users = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select User',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: Detailedfeedbackscreen.fngetdcrdates
            });
            Users.appendTo('#ddluser');
        } else {
            $('#user').empty();
            $('#user').html('<input type="text" id="ddluser" tabindex="1" />');
            var Users = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data2,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select User',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                change: Detailedfeedbackscreen.fngetdcrdates
            });
            Users.appendTo('#ddluser');
        }

    },
    fnGetusersFailurecallback: function () {

    },
    fngetdcrdates: function () {
        debugger;
        Method_params = ["Detailedfeedbackapi/Getdcrdates", Detailedfeedbackscreen.defaults.companyCode, $("select[name='ddluser']").val()];
        CoreREST.get(null, Method_params, null, Detailedfeedbackscreen.fnGetdcrdatesSucesscallback, Detailedfeedbackscreen.fnGetdcrdatesFailurecallback);
    },
    fnGetdcrdatesSucesscallback: function (response) {
        debugger;
        var data = new Array();
        if (response != null && response.list.length > 0) {

            if (response.list.length == 0) {
                content = "[]";
            } else {
                content = "[";
                for (var i = 0; i < response.list.length; i++) {
                    var date = response.list[i].DCR_Actual_Date.split('T');
                    //var dcrdate = date[0].split('/');
                    //var dcractualdate = dcrdate[2] + '-' + dcrdate[0] + '-' + dcrdate[1]
                    _obj = {
                        id: $.trim(response.list[i].DCR_Code),
                        name: $.trim(date[0])
                    };
                    data.push(_obj);
                }
            }
            $('#dcrdate').empty();
            $('#dcrdate').html('<input type="text" id="ddldcrdate" tabindex="1" />');
            var date = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Date',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                //change: Detailedfeedbackscreen.fngetdcrdoctors
            });
            date.appendTo('#ddldcrdate');
        } else {
            $('#dcrdate').empty();
            $('#dcrdate').html('<input type="text" id="ddldcrdate" tabindex="1" />');
            var date = new ej.dropdowns.ComboBox({
                // set the countries data to dataSource property
                dataSource: data,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Date',
                // set true to enable the custom value support.
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box',

                // change: Detailedfeedbackscreen.fngetdcrdoctors
            });
            date.appendTo('#ddldcrdate');
        }

    },
    fnGetdcrdatesFailurecallback: function () {

    },
    fngetdcrdoctors: function () {
        debugger;
        if ($("select[name='ddluser']").val() == null) {
            debugger;
            swal({
                icon: "info",
                title: "Info",
                text: 'Please Select User',
                button: "Ok",
            });
            return false;
        }
        if ($("select[name='ddldcrdate']").val() == null) {
            debugger;
            swal({
                icon: "info",
                title: "Info",
                text: 'Please Select DCR Date',
                button: "Ok",
            });
            return false;
        }
        Method_params = ["Detailedfeedbackapi/GetDCRDoctors", Detailedfeedbackscreen.defaults.companyCode, $("select[name='ddluser']").val(), $("#ddldcrdate").val(), $("select[name='ddldcrdate']").val()];
        CoreREST.get(null, Method_params, null, Detailedfeedbackscreen.fnGetdcrdoctorsSucesscallback, Detailedfeedbackscreen.fnGetdcrdoctorsFailurecallback);
    },
    fnGetdcrdoctorsSucesscallback: function (response) {
        debugger;
        var content = "";
        var DF = "";
        if (response.list.length > 0) {

            $('#Doctormislist').show();
            $("#tbl").html("");
            content += '<div class="row mt-3">';
            for (var i = 0; i < response.list.length; i++) {
                content += '<div class="col-sm-3 mt-2 dvcard">';
                content += '<div class="card border border-info" id="Card_' + i + '" style="width:104%">';
                content += '<div class="card-header p-0 text-white" style="background:#0092b8;height:46px;">';
                content += '<div style="display: flex;justify-content: space-between;">';
                if (response.list[i].Remarks == null) {
                    content += '<div class="custom-control custom-checkbox align-top" style="margin-left: 14px;margin-top: 10px;">';
                    content += '<input type="checkbox" name="multiselect" class="custom-control-input align-top applied"  id="AppliedControlAutosizing' + i + '" value=' + response.list[i].Doctor_Code + '>';
                    content += '<label class="custom-control-label" for="AppliedControlAutosizing' + i + '" style="cursor:pointer;color:white;" id="Customername' + i + '" value=' + response.list[i].Customer_Name + '><a href="#"  onclick="Detailedfeedbackscreen.fndoctordetails(' + response.list[i].Doctor_Code + ');" style="color:white;">' + response.list[i].Customer_Name + '</a>';
                    content += '</label>';
                    content += '</div>';
                }
                else {
                    content += '<div class="" style="margin-left: 14px;margin-top: 10px;">';
                    // content += '<input type="checkbox" name="multiselect" class="custom-control-input align-top applied"  id="AppliedControlAutosizing' + i + '" value=' + response.list[i].Doctor_Code + '>';
                    content += '<label for="AppliedControlAutosizing' + i + '" style="cursor:pointer;color:white;" id="Customername' + i + '" value=' + response.list[i].Customer_Name + '><a href="#"  onclick="Detailedfeedbackscreen.fndoctordetails(' + response.list[i].Doctor_Code + ');" style="color:white;">' + response.list[i].Customer_Name + '</a>';
                    content += '</label>';
                    content += '</div>';

                }
                content += '</div>';
                content += '</div>';

                content += '<div class="card-body"style="overflow:auto;">';


                /// New Development  UI changed to Responsive Label Changes and New column Speciality Name //


                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Site Name:</label>';
                if (response.list[i].Hospital_Name != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SN"> ' + response.list[i].Hospital_Name + '</label>';
                }
                else {
                    var SN = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SN">' + SN + '</span>';
                }
                content += '</div>';

                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Site Category :</label>';
                if (response.list[i].Hospital_Classification != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SC"> ' + response.list[i].Hospital_Classification + '</label>';
                }
                else {
                    var SC = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SC">' + SC + '</span>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Speciality Name:</label>';
                if (response.list[i].Speciality_Name != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SN"> ' + response.list[i].Speciality_Name + '</label>';
                }
                else {
                    var SN = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="SN">' + SN + '</span>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Disease Flag:</label>';
                if (response.list[i].Disease_Flag != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="DF"> ' + response.list[i].Disease_Flag + '</label>';
                }
                else {
                    var DF = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="DF">' + DF + '</span>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Disease Detail:</label>';
                if (response.list[i].Detailing_Disease != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="DD"> ' + response.list[i].Detailing_Disease + '</label>';
                }
                else {
                    var DD = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="DD">' + DD + '</span>';
                }
                content += '</div>';


                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Product Name:</label>';
                if (response.list[i].Product_Name != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PN"> ' + response.list[i].Product_Name + '</label>';
                    content += '<input type="hidden" id="hdnsaleProductcode' + i + '" value=' + response.list[i].Sales_Product_Code + '></input>';
                    content += '<input type="hidden" id="hdnProductcode' + i + '" value=' + response.list[i].DCR_Product_Detail_Code + '></input>';
                }
                else {
                    var PN = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PN">' + PN + '</span>';
                }
                content += '</div>';

                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Promotion Status:</label>';
                if (response.list[i].Business_Status_Remarks != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PS"> ' + response.list[i].Business_Status_Remarks + '</label>';
                }
                else {
                    var PS = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PS">' + PS + '</span>';
                }
                content += '</div>';

                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Type Name:</label>';
                if (response.list[i].Practice_Mode != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PM"> ' + response.list[i].Practice_Mode + '</label>';
                }
                else {
                    var PM = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="PM">' + PM + '</span>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Report Comment:</label>';
                if (response.list[i].Report_Comments != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="RC"> ' + response.list[i].Report_Comments + '</label>';
                }
                else {
                    var RC = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="RC">' + RC + '</span>';
                }
                
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Next Action:</label>';
                if (response.list[i].Next_Action_Comments != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="NA"> ' + response.list[i].Next_Action_Comments + '</label>';
                }
                else {
                    var NA = '-';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label" id="NA">' + NA + '</span>';
                }
                content += '</div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Remarks:</label>';
                if (response.list[i].Remarks != null) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label"> ' + response.list[i].Remarks + '</label>';

                }
                else {
                    content += '<textarea class="form-control col-sm-12" style="resize:none;" id="remarks' + i + '" onkeypress="return Detailedfeedbackscreen.isNumber(event)"></textarea> ';
                }
                content += '</div>';

                content += '</div>';
                content += '</div>';
                content += '</div>';
                if (response.list[i].Remarks == null) {
                    $("#btn").show();
                }
            }
            content += '</div>';
            content += '</div>';
            content += '</div>';


        }
        else {
            content += '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
            $("#btn").hide();
        }
        $("#tbl").html(content);

    },

                //content += '<div class="form-inline mt-2">';
                //content += '<div class="col-sm-6">';
                //content += '<span">Speciality :</span>';
                //content += '</div>';
                //content += '<div class="col-sm-6">';
                //if (response.list[i].Speciality_Name != null) {
                //    content += '<span class="localArea_label refkey" id="specialityname' + i + '" title="' + response.list[i].Speciality_Name + '">' + response.list[i].Speciality_Name + '</span> ';
                //}
                //else {
                //    content += '<span class="localArea_label refkey" id="specialityname' + i + '">' - '</span> ';
                //}
                //content += '</div>';
                //content += '</div>';

                //content += '<div class="form-inline mt-2">';
                //content += '<div class="col-sm-6">';
                //content += '<span">Category :</span>';
                //content += '</div>';
                //content += '<div class="col-sm-6">';
                //if (response.list[i].Category_Name != null) {
                //    content += '<span class="localArea_label localareaname" id="category' + i + '" title="' + response.list[i].Category_Name + '">' + response.list[i].Category_Name + '</span> ';
                //}
                //else {
                //    content += '<span class="localArea_label localareaname" id="category' + i + '">' - '</span> ';
                //}
                //content += '</div>';
                //content += '</div>';

                //content += '<div class="form-inline mt-2">';
                //content += '<div class="col-sm-6">';
                //content += '<span">MDL Number :</span>';
                //content += '</div>';
                //content += '<div class="col-sm-6">';
                //if (response.list[i].MDL_Number != null) {
                //    content += '<span class="localArea_label refkey" id="mdl' + i + '" title="' + response.list[i].MDL_Number + '">' + response.list[i].MDL_Number + '</span> ';
                //}
                //else {
                //    content += '<span class="localArea_label refkey" id="mdl' + i + '">' - '</span> ';
                //}
                //content += '</div>';
                //content += '</div>';

                //content += '<div class="form-inline mt-2">';
                //content += '<div class="col-sm-6">';
                //content += '<span">Product Name :</span>';
                //content += '</div>';
                //content += '<div class="col-sm-6">';
                //content += '<span class="localArea_label refkey" id="productname' + i + '">' + response.list[i].Product_Name + '</span> ';
                //content += '<input type="hidden" id="hdnsaleProductcode' + i + '" value=' + response.list[i].Sales_Product_Code + '></input>';
                //content += '<input type="hidden" id="hdnProductcode' + i + '" value=' + response.list[i].DCR_Product_Detail_Code + '></input>';
                //content += '</div>';
                  // content += '</div>';

    ////The commented code is Exixting code used to show the data in grid In the form of cards(The ui not comming in responsive)// 
              
    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            Detailedfeedbackscreen.fngetDiseaseflag(response.list[i].Doctor_Code);
    //            content += '<span">Disease Flag :</span>';
    //            if (DiseaseFlag_G.length > 0) {
    //                for (var j = 0; j < DiseaseFlag_G.length; j++) {
    //                    if (DiseaseFlag_G[j].Product_Name != null) {
    //                        DF += DiseaseFlag_G[j].Product_Name + ',';
    //                    }

    //                }

    //            }
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            if (DF.length > 0) {
    //                content += '<span class="localArea_label refkey" id="diseaseflag' + i + '">' + DF + '</span> ';
    //            }
    //            else {
    //                var DF = '-';
    //                content += '<span class="localArea_label refkey" id="diseaseflag' + i + '">' + DF + '</span> ';
    //            }
    //            content += '</div>';
    //            content += '</div>';

    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            content += '<span">Product Name :</span>';
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            content += '<span class="localArea_label refkey" id="productname' + i + '">' + response.list[i].Product_Name + '</span> ';
    //            content += '<input type="hidden" id="hdnsaleProductcode' + i + '" value=' + response.list[i].Sales_Product_Code + '></input>';
    //            content += '<input type="hidden" id="hdnProductcode' + i + '" value=' + response.list[i].DCR_Product_Detail_Code + '></input>';
    //            content += '</div>';
    //            content += '</div>';

    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            content += '<span">Business Status Remarks :</span>';
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            if (response.list[i].Business_Status_Remarks != null) {
    //                content += '<span class="localArea_label refkey"  id="BPR">' + response.list[i].Business_Status_Remarks + '</span> ';
    //            }
    //            else {
    //                var BPR = '-';
    //                content += '<span class="localArea_label refkey"  id="BPR">' + BPR + '</span> ';
    //            }
    //            content += '</div>';
    //            content += '</div>';

    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            content += '<span">Business Potential :</span>';
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            if (response.list[i].BusinessPotential != 0) {
    //                content += '<span class="localArea_label refkey" id="BP">' + response.list[i].BusinessPotential + '</span> ';
    //            }
    //            else {
    //                var BP = '-';
    //                content += '<span class="localArea_label refkey"  id="BP">' + BP + '</span>';
    //            }
    //            content += '</div>';
    //            content += '</div>';

    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            content += '<span">Practice Mode :</span>';
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            if (response.list[i].Practice_Mode != null) {
    //                content += '<span class="localArea_label refkey">' + response.list[i].Practice_Mode + '</span> ';
    //            }
    //            else {
    //                var PM = '-';
    //                content += '<span class="localArea_label refkey">' + PM + '</span>';
    //            }
    //            content += '</div>';
    //            content += '</div>';
    //            content += '<div class="form-inline mt-2">';
    //            content += '<div class="col-sm-6">';
    //            content += '<span">Remarks :</span>';
    //            content += '</div>';
    //            content += '<div class="col-sm-6">';
    //            if (response.list[i].Remarks != null) {
    //                content += '<span>' + response.list[i].Remarks + '</span>'
    //            }
    //            else {
    //                content += '<textarea class="form-control col-sm-12" style="resize:none;" id="remarks' + i + '" onkeypress="return Detailedfeedbackscreen.isNumber(event)"></textarea> ';
    //            }
    //            content += '</div>';
    //            content += '</div>';

    //            content += '</div>';
    //            content += '</div>';
    //            content += '</div>';
    //            if (response.list[i].Remarks == null) {
    //                $("#btn").show();
    //            }
    //        }
    //        content += '</div>';
    //        content += '</div>';
    //        content += '</div>';



    fnsave: function () {
        debugger;
        var header = [];
        var headerdet = {};
        for (var i = 0; i < $(".dvcard").length; i++) {
            if ($('input[id=AppliedControlAutosizing' + i + ']').prop('checked') == true) {
                if ($("#remarks" + i + "").val() == "") {
                    var docname = $("#Customername" + i + "").text();
                    debugger;
                    swal({
                        icon: "info",
                        title: "Info",
                        text: 'Please Enter Remarks for ' + docname + '',
                        button: "Ok",
                    });
                    return false;
                }
                var headerdet = {
                    User_Code: $("select[name='ddluser']").val(),
                    DCR_Date: $("#ddldcrdate").val(),
                    Customer_Code: $("#AppliedControlAutosizing" + i + "").val(),
                    Product_Code: $("#hdnsaleProductcode" + i + "").val(),
                    Detailed_Product_Code: $("#hdnProductcode" + i + "").val(),
                    Remarks: $("#remarks" + i + "").val()
                };
                header.push(headerdet)
            }
        }
        var objdetailedfeedback = {
            header: header
        };
        if (header.length > 0) {
            Method_params = ["Detailedfeedbackapi/InsertDetailedProductReporting", Detailedfeedbackscreen.defaults.companyCode, Detailedfeedbackscreen.defaults.regionCode, Detailedfeedbackscreen.defaults.userCode];
            CoreREST.post(null, Method_params, objdetailedfeedback, Detailedfeedbackscreen.BindpostSuccessData, Detailedfeedbackscreen.BindpostFailure);
        }
        else {
            debugger;
            swal({
                icon: "info",
                title: "Info",
                text: 'Please select atleast one doctor.',
                button: "Ok",
            });
            return false;
        }
    },
    BindpostSuccessData: function (response) {
        debugger;
        if (response == "SUCCESS") {
            swal({
                icon: "success",
                title: "Success",
                text: 'Saved successfully.',
                button: "Ok",
            }).then(function () {
                $("#tbl").html("");
                $("#btn").hide();
            });
        }
        else {
            swal({
                icon: "info",
                title: "Info",
                text: response,
                button: "Ok",
            });
        }
    },
    BindpostFailure: function () {

    },
    fndoctordetails: function (customercode) {
        debugger;
        Method_params = ["Detailedfeedbackapi/GetDoctorprofilingdetails", Detailedfeedbackscreen.defaults.companyCode, $("select[name='ddluser']").val(), customercode];
        CoreREST.get(null, Method_params, null, Detailedfeedbackscreen.fnGetdoctordetailsSucesscallback, Detailedfeedbackscreen.fnGetdoctordetailsFailurecallback);
    },
    fnGetdoctordetailsSucesscallback: function (response) {
        debugger;
        var content = "";
        var tag = "";
        var remarks = "";
        var activityname = "";
        $("#dvdp").html("");
        if (response != null && response.list.lstheader.length > 0) {
            content += '<table class="table table-bordered">';
            content += '<thead>';
            content += '<tr>';
            content += '<th scope="col">Region Name</th>';
            content += '<th scope="col">Customer Name</th>';
            content += '<th scope="col">Speciality</th>';
            content += '<th scope="col">Category</th>';
            content += '<th scope="col">MDL Number</th>';
            content += '<th scope="col">HCPs Plans</th>';
            content += '<th scope="col">Proposed Action to Support</th>';
            content += '<th scope="col">Hobbies</th>';
            content += '<th scope="col">Others</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody>';
            content += '<tr>';
            content += '<td>' + response.list.lstheader[0].Region_Name + '</td>';
            content += '<td>' + response.list.lstheader[0].Customer_Name + '</td>';
            if (response.list.lstheader[0].Speciality_Name != null) {
                content += '<td>' + response.list.lstheader[0].Speciality_Name + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].Category_Name != null) {
                content += '<td>' + response.list.lstheader[0].Category_Name + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].MDL_Number != null) {
                content += '<td>' + response.list.lstheader[0].MDL_Number + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].BizManagement != null) {
                content += '<td>' + response.list.lstheader[0].BizManagement + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].BusinessAction != null) {
                content += '<td>' + response.list.lstheader[0].BusinessAction + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].Hobbies != null) {
                content += '<td>' + response.list.lstheader[0].Hobbies + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            if (response.list.lstheader[0].others != null) {
                content += '<td>' + response.list.lstheader[0].others + '</td>';
            }
            else {
                content += '<td>-</td>';
            }
            content += '</tr>';
            content += '</tbody>';
            content += '</table>';
            if (response.list.lstpracticedetails.length > 0) {
                content += '<table class="table table-bordered">';
                content += '<thead>';
                content += '<tr>';
                content += '<th scope="col">Disease Segment</th>';
                content += '<th scope="col">Practice Mode</th>';
                content += '<th scope="col" colspan="2">Actual Practice</th>';
                content += '<th scope="col">Essential Reason</th>';
                //content += '<th scope="col">Tags</th>';
                content += '</tr>';
                content += '</thead>';
                content += '<tbody>';
                for (var i = 0; i < response.list.lstpracticedetails.length; i++) {
                    //var disjon = $.grep(response.list.lstsubpracticedetails, function (ele, index) {
                    //    return ele.PracticeType_Id == response.list.lstpracticedetails[i].PracticeType_Id;
                    //});
                    //if (response.list.lstactivitydetails.length > i) {
                    //    var disjon1 = $.grep(response.list.lstactivitydetails, function (ele, index) {
                    //        return ele.PracticeSubType_Id == response.list.lstactivitydetails[i].PracticeSubType_Id;
                    //    });
                        var disjon2 = $.grep(response.list.lsttagdetails, function (ele, index) {
                            return ele.Activity_Id == response.list.lsttagdetails[i].Activity_Id;
                        });
                   // }

                    content += '<tr>';
                    content += '<td class="Diseasesegment" id="dis1" value="1">' + response.list.lstpracticedetails[i].DiseaseSegment + '</td>';
                   // for (var j = 0; j < disjon.length; j++) {
                    content += '<td class="DE"  id="prac1_1">' + response.list.lstpracticedetails[i].PracticeCode + '</td>';
                    //}
                   // content += '</tr>';
                    //for (var f = 0; f < disjon.length; f++) {
                    //    remarks = disjon[f].Notes;
                    //}
                    //for (var u = 0; u < disjon2.length; u++) {
                    //    tag += disjon2[u].tag + ','
                    //}
                    //for (var k = 0; k < response.list.lstpracticedetails.length.length; k++) {
                    //    activityname += disjon1[k].ActivityName + ',';
                    //    remarks = disjon1[k].Remarks;
                    //}
                   // content += '<tr>';
                    content += '<td class="DPP1" id="Subprac1_1_1" colspan="2">' + response.list.lstpracticedetails[i].ActivityName + '</td>';
                    content += '<td><label>' + response.list.lstpracticedetails[i].Remarks + '</label></td>';
                   // content += '<td><label>' + tag + '</label></td>';
                    content += '</tr>';
                }
                content += '</tbody>';
                content += '</table>';
            }

        }
        $("#dvdp").html(content);
        $("#doctorprofilingmodal").show();
    },
    fnGetdoctordetailsFailurecallback: function () {

    },
    fnclosemodal: function () {
        $("#doctorprofilingmodal").hide();
    },
    isNumber: function (evt) {
        debugger;
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode == 126) {
            return false;
        }
        return true;
    },
    fngetDiseaseflag: function (CC) {
        debugger;
        var details = Detailedfeedbackscreen.defaults.companyCode + '/' + $("select[name='ddluser']").val() + '/' + CC;
        RPAREST.requestInvoke("Detailedfeedbackapi/GetDiseaseflag", details, null, "GET", Detailedfeedbackscreen.fngetDiseaseflagSucesscallback, Detailedfeedbackscreen.fngetDiseaseflagFailurecallback, null);
        // CoreREST.requestInvoke("DoctorProfilingApi/V1/GetDiseaseflag", details, null, "GET", Detailedfeedbackscreen.fngetDiseaseflagSucesscallback, Detailedfeedbackscreen.fngetDiseaseflagFailurecallback, null);
    },
    fngetDiseaseflagSucesscallback: function (response) {
        debugger;
        DiseaseFlag_G = response.list;
    },
    fngetDiseaseflagFailurecallback: function () {
    },
}