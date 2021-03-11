var PrescriptionTracking = {
    defaults: {
        Patient_List: '',
        Patient_Id:'',
        count: 0,
        Count: 0,
        AutoComplete_Product: '',
        AutoComplete_Group: '',
        Products: '',       
        BasketArrary: [],
        PrescriptionArrary: [],
        Region_List: '',
        Doctors_List: '',
        BasketVal: '',
        PatientMappedRegions:'',
    },
    Init: function () {
        PrescriptionTracking.fnGetPatientsList();

    },


    //Function to Get all patients
    fnGetPatientsList: function () {
        debugger;
       
        $.ajax({
            type: "Get",
            url: "../HiDoctor_Master/PatientTracking/GetAllPatients",
            data: "",
            success: function (resp) {
                PrescriptionTracking.defaults.Patient_List = resp;
                PrescriptionTracking.fnBindPatientsList(resp);
               

            }
        });
    },


    //function to bind all patients to autocomplete
    fnBindPatientsList: function (resp) {
        debugger;
        autoComplete(resp, "patientslist", "patient_det", "patient_list");
    },

    //Get selected patient details based on selected patient id
    fnGetPatientDetails: function () {
        debugger;
        var Result = PrescriptionTracking.fnValidate();
        if (Result == true) {
            $('#reginpt').val('');
            $('#hdnregCode').val('');
            $('#docinpt').val('');
            $('#doc_code').val('');
            $('#doctorsinpt').hide();
            //$('medbody').remove();
            $("#medbody").empty();
            PrescriptionTracking.defaults.BasketArrary = [];
            PrescriptionTracking.defaults.PrescriptionArrary = [];
            PrescriptionTracking.defaults.count = 0;
            PrescriptionTracking.defaults.Count = 0;
            $('#medcinpt').hide();

            PrescriptionTracking.defaults.Patient_Id = $('#patient_det').val();
            if (PrescriptionTracking.defaults.Patient_Id != '' || PrescriptionTracking.defaults.Patient_Id != 0) {
                $.ajax({
                    type: "GET",
                    url: "../HiDoctor_Master/PatientTracking/GetPatientDetailsById",
                    data: "Patient_Id=" + PrescriptionTracking.defaults.Patient_Id,
                    success: function (resp) {
                        console.log(resp);
                        PrescriptionTracking.fnBindPatientDetails(resp);
                        PrescriptionTracking.fnGetAllRegionUsers();
                    }
                });
            }
        }
    },


    //function to validate input prescription
    fnValidate: function () {
        debugger;
        var flag = true;
        var condtn = false;
        var Patient_Name = $('#patientslist').val();
        PrescriptionTracking.defaults.Patient_Id = $('#patient_det').val();
        if (PrescriptionTracking.defaults.Patient_Id == '' || PrescriptionTracking.defaults.Patient_Id == 0) {
            fnMsgAlert('info', 'Prescription Tracking', 'Please select Patient');
            flag = false;
            return;
        }
        if (PrescriptionTracking.defaults.Patient_Id != '') {
            for (var i = 0; i < PrescriptionTracking.defaults.Patient_List.length; i++) {
                if (Patient_Name == PrescriptionTracking.defaults.Patient_List[i].label) {
                    condtn = true;
                }
            }
            if (condtn == false) {
                fnMsgAlert('info', 'Prescription Tracking', 'Please select Patient from list');
                flag = false;
                return;
            }
        }
        return flag;
    },

    //Method to bind selected patient
    fnBindPatientDetails: function (resp) {
        debugger;
        var content = '';
        $('#patientname').html(resp.lstPatientDetails[0].Patient_Name);
        $('#mobnumber').html(resp.lstPatientDetails[0].Mobile_Number);
        $('#age').html(resp.lstPatientDetails[0].Age);
        $('#gender').html(resp.lstPatientDetails[0].Gender);
        //for (var i = 0; i < resp.lstRegionNames.length; i++) {
        //    content += '<span>' + resp.lstRegionNames[i].Region_Name + '</span><br/>';
        //}


        var PatientMappedRegions = "[";
        for (var i = 0; i < resp.lstRegionNames.length; i++) {
            PatientMappedRegions += "{Region_Code:" + '"' + "" + resp.lstRegionNames[i].Region_Code + "" + '",' + "Patient_Id:" + '"' + "" + resp.lstRegionNames[i].Patient_Id + "" + '"' + "}";
            if (i < resp.lstRegionNames.length - 1) {
                PatientMappedRegions += ",";
            }
        }
        PatientMappedRegions += "];";
        PrescriptionTracking.defaults.PatientMappedRegions = eval(PatientMappedRegions);
       // $('#region').html(content);
        $('#mappeddoc').show();
        $('#patientdet').show();
       
    },

    //Bind get all region users 
    fnGetAllRegionUsers:function(){
        debugger;
        $.blockUI();
        var excludeParentLevel="";
        $.ajax({
            type:"GET",
            url: "../HiDoctor_Master/PatientTracking/GetAllRegionUsers",
            data: "excludeParentLevel=" + excludeParentLevel + "&includeOneLevelParent=NO",
            success: function (resp) {
                console.log(resp);
                PrescriptionTracking.defaults.Region_List = resp;
                PrescriptionTracking.fnBindRegionUsers(resp);
            }
        });
    },

    //bind all region user to autocomplete
    fnBindRegionUsers:function(resp){
        debugger;
        var regionusers = [];
        if (resp.length == 1) {
            $('#doctorsinpt').show();
            $('#reginpt').val(resp[0].label);
            $('#hdnregCode').val(resp[0].value);
            PrescriptionTracking.fnShowDoctors();
            autoComplete(resp, 'reginpt', 'hdnregCode', 'RegInpt');
        }
        else {
            if (PrescriptionTracking.defaults.PatientMappedRegions.length >= 1) {
                for (var i = 0; i < PrescriptionTracking.defaults.PatientMappedRegions.length; i++) {
                    var regionCode = PrescriptionTracking.defaults.PatientMappedRegions[i].Region_Code;
                    if (regionCode != '') {
                        var Disjson = jsonPath(resp, "$.[?(@.value=='" + regionCode + "')]");
                        regionusers[i] = Disjson[0];
                    }                    
                }

                autoComplete(regionusers, 'reginpt', 'hdnregCode', 'RegInpt');
                $('#reginpt').val(regionusers[0].label);
                $('#hdnregCode').val(regionusers[0].value);
                PrescriptionTracking.fnShowDoctors();
            }
            else {
                autoComplete(resp, 'reginpt', 'hdnregCode', 'RegInpt');
            }
          
        }
        $.unblockUI();
       
    },
   

    //show doctors input
    fnShowDoctors:function(){
        debugger;
        var condt=false;
        var regionuser=$('#reginpt').val();
        if (regionuser != '') {

            for (var i = 0; i < PrescriptionTracking.defaults.Region_List.length; i++) {
                if (regionuser == PrescriptionTracking.defaults.Region_List[i].label) {
                    condt = true;
                }
            }
            if (condt == false) {
                return false;
            } else if (condt == true) {
                $('#doctorsinpt').show();
                PrescriptionTracking.fnGetAllDoctorsByRegion();
            }
        }
    },

    fnValidateRegion:function(){
        debugger;
        var Region_User=$('#reginpt').val();
        var Region_Code=$('#hdnregCode').val();
        var flag=true;
        var condt=false;
        if (Region_User != '') {
            for (var i = 0; i <PrescriptionTracking.defaults.Region_List.length; i++) {
                if (Region_User == PrescriptionTracking.defaults.Region_List[i].label) {
                    condt = true;
                }
            }
            if (condt == false) {
                fnMsgAlert('info', 'Prescription Tracking', 'Please select Region from list');
                flag = false;
                return;
            }
        }
        else if (Region_Code == '' || Region_Code == 0) {
            fnMsgAlert('info', 'Prescription Tracking', 'Please select Region');
            flag = false;
            return;
        }
        return flag;
    },

    //function to get doctors by region
    fnGetAllDoctorsByRegion: function () {
        var regionCode = $('#hdnregCode').val();
        $('#docinpt').val('');
        $('#doc_code').val('');
        $("#medbody").empty();
        PrescriptionTracking.defaults.BasketArrary = [];
        PrescriptionTracking.defaults.PrescriptionArrary = [];
        PrescriptionTracking.defaults.count = 0;
        PrescriptionTracking.defaults.Count = 0;
        $('#medcinpt').hide();

        debugger;
        $.ajax({
            type:"Get",
            url:"../HiDoctor_Master/PatientTracking/GetAllDoctorsByRegion",
            data: "regionCode=" + regionCode,
            success:function(resp){
                console.log(resp);
                PrescriptionTracking.defaults.Doctors_List = resp;
                PrescriptionTracking.fnBindDoctors(resp);
            }
        });
    },

    //function to bind doctors to autocomplete
    fnBindDoctors: function (resp) {
        debugger;
        autoComplete(resp, "docinpt", "doc_code", "DocInpt");
    },



    fnShowMedInputs:function(){
        debugger;
        var condt=false;
        var Doctor = $('#docinpt').val();
   
        if (Doctor != '') {
            for (var i = 0; i < PrescriptionTracking.defaults.Doctors_List.length; i++) {
                if (Doctor == PrescriptionTracking.defaults.Doctors_List[i].label) {
                    condt = true;
                }
            }
            if (condt == false) {
                return false;
            }
            else {
                PrescriptionTracking.fnInsertBaskets(0);
            }
        }
    },

    fnInsertBaskets: function (bcount) {
        debugger;
        $("#medbody").empty();
        PrescriptionTracking.defaults.BasketArrary = [];
        PrescriptionTracking.defaults.PrescriptionArrary = [];
        PrescriptionTracking.defaults.count = 0;
        PrescriptionTracking.defaults.Count = 0;
        var result = PrescriptionTracking.fnValidateDoctors();
        if (result == true) {


            var Doctor_Name = $('#docinpt').val();
            $('#docname').html(Doctor_Name);


            var content = '';
            PrescriptionTracking.defaults.BasketArrary.push(PrescriptionTracking.defaults.count);
            if (PrescriptionTracking.defaults.BasketArrary.length == 1) {
                content += '<tr id="tableRow' + PrescriptionTracking.defaults.count + '" class="RowData">';
                content += '<td style="width:14%;"><input type="text" id="basket' + PrescriptionTracking.defaults.count + '" class="auto_bask_list" onblur="PrescriptionTracking.fnGetInputsandProducts(' + PrescriptionTracking.defaults.count + ');"><input type="hidden" id="hdnbaskId' + PrescriptionTracking.defaults.count + '"></td>';
                content += '</tr>';
            }
            $('#medcinpt').show();
            $('#medbody').append(content);
            PrescriptionTracking.fnGetProductsandGroups(bcount);

        }
    },
    //fnInsertBaskets1: function (bcount) {
    //    debugger;
    //    var result = PrescriptionTracking.fnValidateDoctors();
    //    if (result == true) {

    //        var content = '';
    //        PrescriptionTracking.defaults.BasketArrary.push(PrescriptionTracking.defaults.count);
    //        var MaxCountArray = Math.max.apply(Math, PrescriptionTracking.defaults.BasketArrary);
    //        if (MaxCountArray != bcount) {
    //            content += '<tr id="tableRow' + PrescriptionTracking.defaults.count + '" class="RowData">';
    //            content += '<td><input type="text" id="basket' + PrescriptionTracking.defaults.count + '" class="auto_bask_list" onblur="PrescriptionTracking.fnGetMedInputs(' + PrescriptionTracking.defaults.count + ');"><input type="hidden" id="hdnbaskId' + PrescriptionTracking.defaults.count + '"></td>';
    //            content += '</tr>';
    //        }
    //        else {
    //            return false;
    //        }
    //    }
    //    $('#medcinpt').show();
    //    $('#medbody').append(content);
    //    PrescriptionTracking.fnGetProductsandGroups();

    //},


    fnValidateDoctors:function(){
        debugger;
        var flag = true;
        var condt = false;
        var Doctor_Name = $('#docinpt').val();
        var Doctor_Code = $('#doc_code').val();

        if (Doctor_Code == '' || Doctor_Code == 0) {
            fnMsgAlert('info', 'Prescription Tracking', 'Please select doctor');
            flag = false;
            return;
        }
        else if (Doctor_Name != '') {
            for (var i = 0; i < PrescriptionTracking.defaults.Doctors_List.length; i++) {
                if (Doctor_Name == PrescriptionTracking.defaults.Doctors_List[i].label) {
                    condt = true;
                }
            }
            if (condt == false) {
                fnMsgAlert('info', 'Prescription Tracking', 'Please select doctor from list');
                flag = false;
                return;
            }
        }
        return flag;
    },
    fnGetInputsandProducts:function(value){
        debugger;
        var basket = $('#basket' + value).val();
        var groupCode = $('#hdnbaskId' + value).val();
        if (basket == "" || basket == undefined) {
            return false;
        }
        else {
            var tbl_Colmn_lngth=$('#tableRow'+value+' td').length;
            if (tbl_Colmn_lngth > 2) {
                $('#product' + value).val('');
                $('#hdnproductCode' + value).val('');
                $('#units' + value).val('');
                $('#presc_date' + value).val('');
                $('#doc' + value).val('');
                $('#fud' + value).val('');

                PrescriptionTracking.fnGetMedInputs(value);
                PrescriptionTracking.fnGetInputsBasedonGroup(groupCode, value);
                PrescriptionTracking.fnBindProducts(PrescriptionTracking.defaults.AutoComplete_Product, value);
            }
            else {
                PrescriptionTracking.fnGetMedInputs(value);
                PrescriptionTracking.fnGetInputsBasedonGroup(groupCode, value);
                PrescriptionTracking.fnBindProducts(PrescriptionTracking.defaults.AutoComplete_Product, value);
            }
        }
    },

    fnAddInsertBaskets1: function (AddCount) {
        debugger;
        $('#basket'+AddCount).attr('disabled', true);
        $('#product' + AddCount).attr('disabled', true);
        var arr = PrescriptionTracking.defaults.BasketArrary;
        var AddCountBaskets = AddCount;
        var addcount = AddCount;
        AddCountBaskets++;
        PrescriptionTracking.defaults.count++;
        //for (var i = 0; i < arr.length; i++) {
        //    if (arr[i] == AddCountBaskets) {
        //        alert("same");
        //        return false;
        //    } else {
        //        return true;
        //    }

        //}
        //var AddCountBaskets = AddCount;
        //AddCountBaskets++;
        var content = '';
        PrescriptionTracking.defaults.BasketArrary.push(AddCountBaskets);
        //var MaxCountArray = Math.max.apply(Math, PrescriptionTracking.defaults.BasketArrary);
        //if (MaxCountArray != bcount) {
        content += '<tr id="tableRow' + AddCountBaskets + '" class="RowData">';
        content += '<td style="width:14%;"><input type="text" id="basket' + AddCountBaskets + '" class="auto_bask_list" onblur="PrescriptionTracking.fnGetInputsandProducts(' + AddCountBaskets + ');"><input type="hidden" id="hdnbaskId' + AddCountBaskets + '"></td>';
            content += '</tr>';
       // }
        //else {
          //  return false;
        //}
            if (PrescriptionTracking.defaults.BasketArrary.length == 1) {
                $('#remove' + addcount).hide();
                $('#add' + addcount).show();
            } else {
               
                $('#remove' + addcount).show();
                $('#add' + addcount).hide();
            }

        $('#medcinpt').show();
        $('#medbody').append(content);
        PrescriptionTracking.fnGetProductsandGroups(AddCountBaskets);

    },
    fnGetMedInputs: function (pcount) {
        debugger;
        var condt = false;
        var basket = $('#basket' + pcount).val();
        if (basket == "" || basket == undefined) {
            return false;
        }
        var arr = PrescriptionTracking.defaults.PrescriptionArrary;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == pcount) {                
                condt = true;
            }
        }
        if (condt == true) {
            return false;
        } else {


            var content = '';
            PrescriptionTracking.defaults.PrescriptionArrary.push(PrescriptionTracking.defaults.Count);


            if (PrescriptionTracking.defaults.PrescriptionArrary.length == 1) {
                content += '<td style="width:14%;" id="dynainpt' + PrescriptionTracking.defaults.Count + '"></td>';
                content += '<td style="width:14%;"><input type="text" style="width:100%;" id="product' + PrescriptionTracking.defaults.Count + '" class="auto_prod_list" onblur="PrescriptionTracking.fnInsertBaskets1(' + PrescriptionTracking.defaults.Count + ');"><input type="hidden" id="hdnproductCode' + PrescriptionTracking.defaults.Count + '"></td>';

                content += '<td style="width:14%;"><input type="text" style="width:100%;" maxLength="6" id="units' + PrescriptionTracking.defaults.Count + '"></td>';
                content += '<td style="width:14%;"><input type="text" style="width:100%;" id="presc_date' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td style="width:14%;"><input type="text" style="width:100%;" id="doc' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td style="width:14%;"><input type="text" style="width:100%;" id="fud' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td id="remove' + PrescriptionTracking.defaults.Count + '" class="removerow" style="display:none;width:2%;"><i onclick="PrescriptionTracking.RemoveRow(' + PrescriptionTracking.defaults.Count + ')"  title="Remove Row" class="fa fa-times-circle"></i></td>';
                content += '<td style="width:2%;"id="add' + PrescriptionTracking.defaults.Count + '"><i onclick="PrescriptionTracking.fnAddInsertBaskets1(' + PrescriptionTracking.defaults.Count + ')"  title="Remove Row" class="fa fa-plus-circle"></i></td>';

            }
            else {
                //  var MaxCountArray = Math.max.apply(Math, PrescriptionTracking.defaults.PrescriptionArrary);

                content += '<td style="width:14%;" id="dynainpt' + PrescriptionTracking.defaults.Count + '"></td>';
                content += '<td style="width:14%;"><input type="text" id="product' + PrescriptionTracking.defaults.Count + '" class="auto_prod_list" onblur="PrescriptionTracking.fnInsertBaskets1(' + PrescriptionTracking.defaults.Count + ');"><input type="hidden" id="hdnproductCode' + PrescriptionTracking.defaults.Count + '"></td>';

                content += '<td style="width:14%;"><input type="text" style="width:100%;" maxLength="6" id="units' + PrescriptionTracking.defaults.Count + '"></td>';
                content += '<td style="width:14%;"><input type="text" style="width:100%;" id="presc_date' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td style="width:14%;"><input type="text"  style="width:100%;"id="doc' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td style="width:14%;"><input type="text"  style="width:100%;"id="fud' + PrescriptionTracking.defaults.Count + '" readonly="readonly"></td>';
                content += '<td id="remove' + PrescriptionTracking.defaults.Count + '" class="removerow" style="display:none; width:2%;"><i onclick="PrescriptionTracking.RemoveRow(' + PrescriptionTracking.defaults.Count + ')"  title="Remove Row" class="fa fa-times-circle"></i></td>';
                content += '<td  style="width:2%;" id="add' + PrescriptionTracking.defaults.Count + '"><i onclick="PrescriptionTracking.fnAddInsertBaskets1(' + PrescriptionTracking.defaults.Count + ')" title="Remove Row" class="fa fa-plus-circle"></i></td>';

            }
  
           
            $('#tableRow' + PrescriptionTracking.defaults.Count + '').append(content);
            PrescriptionTracking.fnGetDatePickers();
            PrescriptionTracking.fnBindProducts();
        }
       
    },
    RemoveRow:function(rcount){
        var table_length = $('#tblMedicinesinpt tr').length;
        if (table_length == 1) {
            return false;
            $('#remove' + rcount).hide();
            $('#add' + rcount).show();
        }else{

            $('#tableRow' + rcount).remove();
            PrescriptionTracking.defaults.PrescriptionArrary.remove(rcount);
            PrescriptionTracking.defaults.BasketArrary.remove(rcount);
        }
    },
    fnGetDatePickers:function(){
        $(function () {
            $("#presc_date" + PrescriptionTracking.defaults.Count).datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                maxDate: 0,
             
            });
        });
        $(function () {
            $("#doc" + PrescriptionTracking.defaults.Count).datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                 maxDate: 0,
                // startDate:'+1d'
            });
        });
        $(function () {
            $("#fud" + PrescriptionTracking.defaults.Count).datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                minDate: 0,
                // startDate:'+1d'
            });
        });
        PrescriptionTracking.defaults.Count++;
    },

    fnSubmit: function () {
        debugger;
        var result = PrescriptionTracking.fnValidateSubmit();

        if (result == true) {
        $.blockUI();
            var PrescriptionDetails = [];
            
            var pshcount = 0;
            var inptpshcount = 0;
            var Doctor_Code = $('#doc_code').val();
            var Region_Code = $('#hdnregCode').val();
            var Patient_Id = $('#patient_det').val();
       
            $('.RowData').each(function (index, obj) {
                var InputDetails = [];
                var ERCount = obj.id.replace("tableRow", "");
      
                var groupCode = $('#hdnbaskId' + ERCount).val();
                if (groupCode != '' || groupCode != "") {



                    var prod_Code = $('#hdnproductCode' + ERCount).val();
                    var Units = $('#units' + ERCount).val();
                    var dateofconsumpt = $('#doc' + ERCount).val();
                    var followupdate = $('#fud' + ERCount).val();
                    var Pres_Date = $('#presc_date' + ERCount).val();


                    var doc = dateofconsumpt.split('/');
                    doc = doc[2] + '/' + doc[1] + '/' + doc[0];
                    var fud = followupdate.split('/');
                    fud = fud[2] + '/' + fud[1] + '/' + fud[0];
                    var presdate = Pres_Date.split('/');
                    presdate = presdate[2] + '/' + presdate[1] + '/' + presdate[0];

                    var inputtbl = $('#inptrprtdet' + ERCount + ' tr').length;
                    //if (inputtbl != 0 || inputtbl.inputtbl >= 1) {

                    $(".rowData" + ERCount).each(function (index, obj) {
                        debugger;
                        var $this = $(this);
                        // InsertDetails = [];
                        var IPcount = obj.id.replace("rowdatatbl", "");

                        var InputId = $('#hdnID' + IPcount).val();
                        var InputValue = $('#Inpt' + IPcount).val();
                        if (InputValue != 0 && InputValue != undefined && InputValue != null) {
                            var Inputdetails = {
                                Input_Id: InputId,
                                Input_Value: InputValue,
                            };
                            InputDetails.push(Inputdetails);
                        }
                        
                       
                        // inptpshcount++;
                    });


                    //$('.RowData').each(function (index, Obj) {

                    //var IPcount = Obj.id.replace("rowdatatbl", "");
                    //var InputName = $('#hdnID' + IPcount).val();
                    //var InputValue = $('#Inpt' + IPcount).val();
                    //var Inputdetails = {
                    //    Input_Name: InputName,
                    //    Input_Value: InputValue,
                    //};
                    //InputDetails[inptpshcount] = Inputdetails;
                    //inptpshcount++;
                    //});

                    //}
                    var Prescription = {
                        Product_Code: prod_Code,
                        Units: Units,
                        Date_Of_Consumption: doc,
                        Follow_Up_Date: fud,
                        Prescription_Date: presdate,
                        lstInput: InputDetails,
                    };

                    PrescriptionDetails.push(Prescription);
                    InsertDetails = [];
                    pshcount++;
                }
            });
            


            var prescription = JSON.stringify(PrescriptionDetails);
            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/PatientTracking/InsertPrescriptionDetails",
                data: "Patient_Id=" + Patient_Id + "&Doctor_Code=" + Doctor_Code + "&Prescription=" + prescription+"&frregionCode="+Region_Code,
                success: function (resp) {
                    console.log(resp);
                    if (resp = "True") {
                        //PrescriptionTracking.fnClear();
                        $.unblockUI();
                        fnMsgAlert('success', 'Prescription Tracking', 'Successfully recorded prescription details');
                        $('#main').load("HiDoctor_Master/PatientTracking/PrescriptionTracking");
                        return false;
                    } else {
                        $.unblockUI();
                        fnMsgAlert('error', 'Prescription Tracking', 'Failed to record prescription details.Please try after sometime');
                        return false;
                    }
                }
            });
        }
    },

    fnValidateSubmit:function(){
        debugger;
        var flag = true;
        var BCondt = false;
        var Patient_Id = $('#patient_det').val();
        $('.RowData').each(function (index, obj) {
            var ERCount = obj.id.replace("tableRow", "");
            var groupCode = $('#hdnbaskId' + ERCount).val();
            var prod_Code = $('#hdnproductCode' + ERCount).val();
            var Units = $('#units' + ERCount).val();
            var dateofconsumpt = $('#doc' + ERCount).val();
            var followupdate = $('#fud' + ERCount).val();
            var Pres_Date = $('#presc_date' + ERCount).val();
            var tbl_tr_length = $('#medbody tr').length;
            if (tbl_tr_length == 1) {
                if (groupCode == '') {
                    fnMsgAlert('info', 'Prescription Tracking', 'Please enter atleast one portfolio and product to submit');
                    flag = false;
                    return;
                }
            }
            var groupName = $('#basket' + ERCount).val();
            if (groupName != '') {
                for (var i = 0; i <PrescriptionTracking.defaults.AutoComplete_Group.length; i++) {
                    if (groupName == PrescriptionTracking.defaults.AutoComplete_Group[i].label) {
                        BCondt = true;
                    }
                }
                if (BCondt == false) {
                    fnMsgAlert('info', 'Prescription Tracking', 'Please select portfolio from list');
                    flag = false;
                    return;
                }
            }
            var tbl_Td_Length = $('#tableRow' + ERCount + ' td').length;
            if (groupCode != '' && groupCode != "" && tbl_Td_Length > 2) {

                if (prod_Code == '') {
                    fnMsgAlert('info', 'Prescription Tracking', 'Please select Product from list');
                    flag = false;
                    return;
                }
                if (Units == '' || Units == 0) {
                    fnMsgAlert('info', 'Prescription Tracking', 'Please enter Quantity');
                    flag = false;
                    return;
                }
                else {
                    var result = PrescriptionTracking.fnValidateAge(Units);
                    if (result == false) {
                        fnMsgAlert('info', 'Patient Tracking System', 'Please enter number in Quantity');
                        flag = false;
                        return;
                    }
                }
                if (Pres_Date == '') {
                    fnMsgAlert('info', 'Patient Tracking System', 'Please select prescription date');
                    flag = false;
                    return;
                }
                if (dateofconsumpt == '') {
                    fnMsgAlert('info', 'Patient Tracking System', 'Please select consumption date');
                    flag = false;
                    return;
                }
 
                if (followupdate == '') {
                    fnMsgAlert('info', 'Patient Tracking System', 'Please select followup date');
                    flag = false;
                    return;
                }
            }


            $(".rowData" + ERCount).each(function (index, obj) {
                debugger;
                var $this = $(this);
              
                var IPcount = obj.id.replace("rowdatatbl", "");
                var Hdnval=$('#hdnval'+IPcount).val();

                var InputValue = $('#Inpt' + IPcount).val();
                if (InputValue != "" && Hdnval==0) {
                    var result = PrescriptionTracking.regExforAlphaNumericSpecificAddress(InputValue);
                    if (result == false) {
                        fnMsgAlert('info', 'Patient Tracking System', 'Please enter valid input(s)');
                        flag = false;
                        return;
                    }
                }
                else if (InputValue != "" && Hdnval ==2) {
                    var result = PrescriptionTracking.fnValidateAge(InputValue);
                    if (result == false) {
                        fnMsgAlert('info', 'Patient Tracking System', 'Please enter valid input(s)');
                        flag = false;
                        return;
                    }
                }
            });

        });
        return flag;
    },
    fnClear: function () {
        debugger;
        $("#medbody").empty();
        PrescriptionTracking.defaults.BasketArrary = [];
        PrescriptionTracking.defaults.PrescriptionArrary = [];     
        PrescriptionTracking.defaults.count = 0;
        PrescriptionTracking.defaults.Count = 0;
        PrescriptionTracking.fnInsertBaskets(0);

    },
    fnGetInputsBasedonGroup:function(groupCode,value){
        debugger;
        var Value=value;
        $.ajax({
            type: "Get",
            url: "../HiDoctor_Master/PatientTracking/GetInputsBasedonGroup",
            data: "groupCode="+groupCode,
            success: function (resp) {
                console.log(resp);
                PrescriptionTracking.fnBindInputs(Value,resp);
            }
        });
    },
    fnBindInputs:function(value,resp){
        debugger;
        var content='';
        var val=value;
        var date="date";
        var string = "varchar";
        var deccimal = "decimal";
     
        content += '<table class="table table-hover IPtable" id="inptrprtdet">';
        content+='<tbody>';
        if (resp != '' && resp != null && resp.length >= 1) {
            for (var i = 0; i < resp.length; i++) {
                content += '<tr id="rowdatatbl' + val + i + '" class="rowData' + val + '">';
                if(string.toUpperCase()==resp[i].Input_DataType.toUpperCase())
                {
                    content += '<td><span id="input' + val + '">' + resp[i].Input_Name + '</span><br /><input type="hidden" value="' + resp[i].Input_ID + '" id="hdnID' + val + i + '"><input type="hidden" id="hdnval' + val + i + '" value="0"><input type="text" style="width:100%;" id="Inpt' + val + +i + '" maxLength="30"></td>';
                } else if (date.toUpperCase() == resp[i].Input_DataType.toUpperCase()) {
                    content += '<td><span id="input' + val + '">' + resp[i].Input_Name + '</span><br /><input type="hidden" value="' + resp[i].Input_ID + '" id="hdnID' + val + i + '"><input type="hidden" id="hdnval' + val + i + '" value="1"><input type="text" style="width:100%;" id="Inpt' + val + +i + '" maxLength="30"></td>';
                    PrescriptionTracking.fnInputDatePicker(val, i);
                }
                else if (deccimal.toUpperCase() == resp[i].Input_DataType.toUpperCase()) {
                    content += '<td><span id="input' + val + '">' + resp[i].Input_Name + '</span><br /><input type="hidden" value="' + resp[i].Input_ID + '" id="hdnID' + val + i + '"><input type="hidden" id="hdnval' + val + i + '" value="2"><input type="text" style="width:100%;" id="Inpt' + val + +i + '" maxLength="30" placeholder="Number(s) Only"></td>';
                }
                content += '</tr>';
            }
          
        }
        else {
            content += '<tr id="rowdatatbl' + val + 0 +  '" class="rowData' + val + '">';
            content += '</tr>';
        }
        content += '</tbody></table>';
        $('#dynainpt'+val).html(content);

    },
    fnInputDatePicker: function (val, i) {
        debugger;
        $(function () {
            $("#Inpt" + val + i).datepicker({
                dateFormat: 'dd/mm/yy',
                numberOfMonths: 1,
                //maxDate: 0,

            });
        });

    },

    fnGetProductsandGroups: function (value) {
        debugger;
       var Value = value;
        $.ajax({
            type: "Get",
            url: "../HiDoctor_Master/PatientTracking/GetProductsandGroups",
            data: "",
            success: function (resp) {
                console.log(resp);

                var ProductLst = "[";
                for (var i = 0; i < resp.lsproductDetails.length; i++) {
                    ProductLst += "{label:" + '"' + "" + resp.lsproductDetails[i].Product_Name + "" + '",' + "value:" + '"' + "" + resp.lsproductDetails[i].Product_Code + "" + '",' + "Product_Group_Code:" + '"' + "" + resp.lsproductDetails[i].Product_Group_Code + "" + '"' + "}";
                    if (i < resp.lsproductDetails.length - 1) {
                        ProductLst += ",";
                    }
                }
                ProductLst += "];";
                PrescriptionTracking.defaults.AutoComplete_Product = eval(ProductLst);


                var GroupsLst = "[";
                for (var i = 0; i < resp.lsGroupDetails.length; i++) {
                    GroupsLst += "{label:" + '"' + "" + resp.lsGroupDetails[i].Product_Group_Name + "" + '",' + "value:" + '"' + "" + resp.lsGroupDetails[i].Product_Group_Code + "" + '"' + "}";
                    if (i < resp.lsGroupDetails.length - 1) {
                        GroupsLst += ",";
                    }
                }
                GroupsLst += "];";
            PrescriptionTracking.defaults.AutoComplete_Group = eval(GroupsLst);
            PrescriptionTracking.fnBindGroups(PrescriptionTracking.defaults.AutoComplete_Group, Value);
            PrescriptionTracking.fnBindProducts(PrescriptionTracking.defaults.AutoComplete_Product);

            }
        });
    },

    fnBindGroups: function (grps,value) {
        debugger;
        autoComplete(grps, 'basket' + value + '', 'hdnbaskId' + value + '', 'auto_bask_list');
    },
    fnBindProducts: function (prds,value) {
        debugger;
        if (prds != undefined) {
           PrescriptionTracking.defaults.Products = prds;
        }
   
        var grpCode = $('#hdnbaskId' + value + '').val();
        if (grpCode != '') {
            var disjson = jsonPath(PrescriptionTracking.defaults.AutoComplete_Product, "$.[?(@.Product_Group_Code=='" + grpCode + "')]");


            autoComplete(disjson, 'product' + value, 'hdnproductCode' + value, 'auto_prod_list');
        }
     

    },

    regExforAlphaNumericSpecificAddress: function (value) {
        var specialCharregex = new RegExp(/^[ A-Za-z0-9. ]*$/);

        if (specialCharregex.test(value) == false) {
            return false;
        }
        else {
            return true;
        }


    },


    //fnValidateMobile: function (obj) {
    //    debugger;
    //    var phoneNumberPattern = /^\d+$/
    //    if (phoneNumberPattern.test(obj) == false) {
    //        return false;
    //    }
    //    else {
    //        return true;
    //    }
    //},
    fnValidateAge: function (obj) {
        debugger;
        var phoneNumberPattern = new RegExp(/^[0-9. ]*$/);
        if (phoneNumberPattern.test(obj) == false) {
            return false;
        }
        else {
            return true;
        }
    },
}