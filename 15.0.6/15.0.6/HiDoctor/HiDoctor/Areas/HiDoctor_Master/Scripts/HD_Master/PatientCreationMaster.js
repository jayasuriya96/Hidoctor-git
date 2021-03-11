

var Page_No = "1";
var Total = "";
var flagonload = true;
var PatientCreationMaster = {
    defaults: {
        Title: '',
        Patient_Name: '',
        Gender: '',
        Age: '',
        Mobile_Number: '',
        Alternate_Mobile_Number: '',
        Address: '',
        City_Id: '',
        City:'',
        Pincode:'',
        Pincode_Id: '',
        Email: '',
        Region: '',
        RegionCode:'',
        Cirrhotic: '',
        NON_Cirrhotic: '',
        Decompensated_Cirrhotic:'',
        Region_List:'',
        Cities_List: '',
        Pincodes_list:'',
        MobileNumber_List: '',
        Patients_List:'',
        patient_id: '',
        PatientMappedRegions: '',
        CurrentRegionCode:'',
    },

    Init: function (currentRegionCode) {
        PatientCreationMaster.defaults.CurrentRegionCode=currentRegionCode;
        PatientCreationMaster.fnGetAllCities();
       
       
    },


    //Get all cities for autocomplete
    fnGetAllCities: function () {
        $.blockUI();
        $.ajax({
            type: "GET",
            data: "",
            url: "../HiDoctor_Master/PatientTracking/GetAllCities",
            success: function (resp) {
                PatientCreationMaster.defaults.Cities_List = resp;
                PatientCreationMaster.fnBindCities(resp);
            }
        });

    },

    //bind all cities into autocomplete
    fnBindCities: function (resp) {
        
        autoComplete(resp, 'city', 'city_Id', 'cities_list');
        PatientCreationMaster.fnGetMobileNumbers();
    },


    //Get all the Pincodes based on city id
    fnGetPincodes: function () {
        
        $("#pincode").removeAttr('disabled');
        var city_Id = $('#city_Id').val();
        $.ajax({
            type: "GET",
            data: "City_Id=" + city_Id,
            url: "../HiDoctor_Master/PatientTracking/GetAllPincodes",
            success: function (resp) {
                PatientCreationMaster.defaults.Pincodes_list = resp;
                PatientCreationMaster.fnBindPincodes(resp);
            }
        });
    },

    //Bind all pincodes in auto complete
    fnBindPincodes: function (resp) {
        
        autoComplete(resp, 'pincode', 'pincode_Id', 'pincodes_list');
    },

    //funtions to get all regions on load
    fnGetRegions:function(){
        debugger;

        $.ajax({
            type: "Get",
            url: "../HiDoctor_Master/PatientTracking/GetRegions",
            data: "",
            success: function (resp) {               
                PatientCreationMaster.defaults.Region_List = resp;
            
               PatientCreationMaster.fnBindRegions(resp);
            },
            complete: function (e) {
                $.unblockUI();
            }
        });
    },
    fnBindRegions:function(resp){
        debugger;

        if(resp!='' &&resp.length>=1){
            if(resp.length==1){
                autoComplete(resp,'region','hdnregionCode','regions_list');
                $('#region').val(resp[0].label);
                $('#hdnregionCode').val(resp[0].value);
            }
            else{
                autoComplete(resp, 'region', 'hdnregionCode', 'regions_list');
            }
        }
        PatientCreationMaster.fnGetAllPatientDetailsToEdit();
    },

    //Validate Patient Creation form 
    fnValidateForm: function () {
        debugger;
        flag = true;
        condtn = false;
        Ccondtn = false;
        Pcondtn = false;
        var Rcondtn = false;
        PatientCreationMaster.defaults.Title = $('#title').val();
        PatientCreationMaster.defaults.Patient_Name = $.trim($('#patientname').val());
        PatientCreationMaster.defaults.Gender = $('#Gender').val();
        PatientCreationMaster.defaults.Age = $.trim($('#Age').val());
        PatientCreationMaster.defaults.Mobile_Number = $.trim($('#mobilenumber').val());
        PatientCreationMaster.defaults.Alternate_Mobile_Number = $.trim($('#altmobilenumber').val());
        PatientCreationMaster.defaults.Address = $.trim($('#address').val());
        PatientCreationMaster.defaults.City = $.trim($('#city').val());
        PatientCreationMaster.defaults.Pincode = $.trim($('#pincode').val());
        PatientCreationMaster.defaults.Email = $.trim($('#email').val());
        PatientCreationMaster.defaults.Cirrhotic = $('input[name=cirrhotic]:checked').val();
        PatientCreationMaster.defaults.NON_Cirrhotic = $('input[name=noncirrhotic]:checked').val();
        PatientCreationMaster.defaults.Decompensated_Cirrhotic = $('input[name=deccirrhotic]:checked').val();
        PatientCreationMaster.defaults.Region = $.trim($('#region').val());
        PatientCreationMaster.defaults.RegionCode = $('#hdnregionCode').val();

        //Title
        if (PatientCreationMaster.defaults.Title == '' || PatientCreationMaster.defaults.Title == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Title');
            flag = false;
            return;
        }

        //Patient_Name
        if (PatientCreationMaster.defaults.Patient_Name == '') {
            fnMsgAlert('info', 'Patient Tracking System', 'Please enter Patient Name');
            flag = false;
            return;
        }
        else if (PatientCreationMaster.defaults.Patient_Name != '') {
            var result = PatientCreationMaster.fnValidateColumns(PatientCreationMaster.defaults.Patient_Name);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Special characters dot(.) and space are accepted in Pateint Name');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Patient_Name.length > 50) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter Patient Name within 50 characters');
                flag = false;
                return;
            }
        }

        //Gender
        if (PatientCreationMaster.defaults.Gender == '' || PatientCreationMaster.defaults.Gender == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Gender');
            flag = false;
            return;
        }

        //Age
        if (PatientCreationMaster.defaults.Age == '') {
            fnMsgAlert('info', 'Patient Tracking System', 'Please enter Patient Age');
            flag = false;
            return;
        }
        else if (PatientCreationMaster.defaults.Age != '') {
            var result = PatientCreationMaster.fnValidateAge(PatientCreationMaster.defaults.Age);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please Enter Only Numbers in Patient Age');
                flag = false;
                return;
            }
        }

        //Mobile Number
        if (PatientCreationMaster.defaults.Mobile_Number == '') {
            fnMsgAlert('info', 'Patient Tracking System', 'Please enter Mobile Number');
            flag = false;
            return;
        }
        else if (PatientCreationMaster.defaults.Mobile_Number != '') {
            var result = PatientCreationMaster.fnValidateMobile(PatientCreationMaster.defaults.Mobile_Number);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter only numbers in Mobile Number');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Mobile_Number.length > 10 || PatientCreationMaster.defaults.Mobile_Number.length < 10) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter 10 Digit(s) Mobile Number');
                flag = false;
                return;
            }
            else {
                for (var i = 0; i < PatientCreationMaster.defaults.MobileNumber_List.length; i++) {
                    if (PatientCreationMaster.defaults.Mobile_Number == PatientCreationMaster.defaults.MobileNumber_List[i].Mobile_Number) {
                        condtn = true;
                    }
                }
            }
        }

        if (condtn == true) {
            fnMsgAlert('info', 'Patient Tracking System', 'Patient already exists.');
            flag = false;
            return;
        }


        //Alternate Mobile Number
        if (PatientCreationMaster.defaults.Alternate_Mobile_Number != '') {
            var result = PatientCreationMaster.fnValidateMobile(PatientCreationMaster.defaults.Alternate_Mobile_Number);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter only numbers in Alternate Mobile Number');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Alternate_Mobile_Number.length < 10 || PatientCreationMaster.defaults.Alternate_Mobile_Number.length > 10) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter 10 Digit(s) in Alternate Mobile Number');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Alternate_Mobile_Number == PatientCreationMaster.defaults.Mobile_Number) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please Enter Different Mobile Number in Alternate Mobile Number');
                flag = false;
                return;
            }

        }

        //City
        if (PatientCreationMaster.defaults.City == "" || $('#city_Id').val() == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please Select City.');
            flag = false;
            return;
        }
        if (PatientCreationMaster.defaults.City != '') {
            //var result = PatientCreationMaster.fnValidateColumns(PatientCreationMaster.defaults.City);
            //if (result == false) {
            //    fnMsgAlert('info', 'Patient Tracking System', 'Special characters are not allowed in  the City field');
            //    flag = false;
            //    return;
            //}
            //else {
            for (var i = 0; i < PatientCreationMaster.defaults.Cities_List.length; i++) {
                if (PatientCreationMaster.defaults.City == PatientCreationMaster.defaults.Cities_List[i].label) {
                    Ccondtn = true;
                }
            }

            if (Ccondtn == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please Select City from list');
                flag = false;
                return;
            }
        }

        //Pincode
        if (PatientCreationMaster.defaults.Pincode == "" || $('#pincode_Id').val() == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please Select Pincode.');
            flag = false;
            return;
        }
        if (PatientCreationMaster.defaults.Pincode != '') {
            var result = PatientCreationMaster.fnValidateMobile(PatientCreationMaster.defaults.Pincode);

            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Special characters and Alphabets are not allowed in the Pincode');
                flag = false;
                return;
            }
            else {
                for (var i = 0; i < PatientCreationMaster.defaults.Pincodes_list.length; i++) {
                    if (PatientCreationMaster.defaults.Pincode == PatientCreationMaster.defaults.Pincodes_list[i].label) {
                        Pcondtn = true;
                    }
                }
            }
            if (Pcondtn == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please select Pincode from list');
                flag = false;
                return;
            }
        }


        //Address
        if (PatientCreationMaster.defaults.Address.length > 100) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please enter Address within 100 characters');
            flag = false;
            return;
        }
        else if (PatientCreationMaster.defaults.Address != '') {
            var result = PatientCreationMaster.regExforAlphaNumericSpecificAddress(PatientCreationMaster.defaults.Address);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Special characters [.,/\-_#()] are accepted in Address');
                flag = false;
                return;
            }
        }

        //Email
        if (PatientCreationMaster.defaults.Email != '') {
            if (PatientCreationMaster.defaults.Email.length > 50) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter Email within 50 characters');
                flag = false;
                return;
            }
            else {
                var result = PatientCreationMaster.fnCheckEmail(PatientCreationMaster.defaults.Email);
                if (result == false) {
                    fnMsgAlert('info', 'Patient Tracking System', 'Please Enter Email with Valid Format (ex: abc@gmail.com)');
                    flag = false;
                    return;
                }
            }
        }

        //Region
        if (PatientCreationMaster.defaults.Region == ''||PatientCreationMaster.defaults.RegionCode==''||PatientCreationMaster.defaults.RegionCode==0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Region from List');
            flag = false;
            return;
        }
        if (PatientCreationMaster.defaults.Region != '') {
            for (var i = 0; i <PatientCreationMaster.defaults.Region_List.length; i++) {
                if (PatientCreationMaster.defaults.Region.trim() == PatientCreationMaster.defaults.Region_List[i].label.trim()) {
                    Rcondtn = true;
                }
            }
            if (Rcondtn == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please select Region from List');
                flag = false;
                return;
            }
        }

        //Cirrhotic
        if (PatientCreationMaster.defaults.Cirrhotic.length == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Cirrhotic');
            flag = false;
            return;
        }

        //NON-Cirrhotic
        if (PatientCreationMaster.defaults.NON_Cirrhotic.length == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Non-Cirrhotic');
            flag = false;
            return;
        }

        //Decompensated-Cirrhotic
        if (PatientCreationMaster.defaults.Decompensated_Cirrhotic.length == 0) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please select Decompensated-Cirrhotic');
            flag = false;
            return;
        }
       
        return flag;
    },


    fnSumbit: function () {
        debugger;
      
        var result = PatientCreationMaster.fnValidateForm();
        if (result == true) {
            $.blockUI();
            PatientCreationMaster.defaults.Title = $('#title :selected').text();
            PatientCreationMaster.defaults.Patient_Name = $.trim($('#patientname').val());
            PatientCreationMaster.defaults.Gender = $('#Gender :selected').text();
            PatientCreationMaster.defaults.Age = $.trim($('#Age').val());
            PatientCreationMaster.defaults.Mobile_Number = $.trim($('#mobilenumber').val());
            PatientCreationMaster.defaults.City_Id = $('#city_Id').val();
            PatientCreationMaster.defaults.Pincode_Id = $('#pincode_Id').val();
            PatientCreationMaster.defaults.City = $.trim($('#city').val());
            PatientCreationMaster.defaults.Pincode = $.trim($('#pincode').val());
            PatientCreationMaster.defaults.Cirrhotic = $('input[name=cirrhotic]:checked').val();
            PatientCreationMaster.defaults.NON_Cirrhotic = $('input[name=noncirrhotic]:checked').val();
            PatientCreationMaster.defaults.Decompensated_Cirrhotic = $('input[name=deccirrhotic]:checked').val();
            PatientCreationMaster.defaults.Region = $.trim($('#region').val());
            PatientCreationMaster.defaults.RegionCode = $('#hdnregionCode').val();

            //Alternate Mobile Number
            if ($.trim($('#altmobilenumber').val()) != '') {
                PatientCreationMaster.defaults.Alternate_Mobile_Number = $.trim($('#altmobilenumber').val());
            }
            else {
                PatientCreationMaster.defaults.Alternate_Mobile_Number = '';
            }

            //Address
            if ($.trim($('#address').val()) != '') {
                PatientCreationMaster.defaults.Address = $.trim($('#address').val());
            }
            else {
                PatientCreationMaster.defaults.Address = '';
            }
            //Email
            if ($('#email').val() != '') {
                PatientCreationMaster.defaults.Email = $.trim($('#email').val());
            }
            else {
                PatientCreationMaster.defaults.Email = '';
            }
            //City
            if (PatientCreationMaster.defaults.City!='') {
                PatientCreationMaster.defaults.City_Id = $('#city_Id').val();
            }
            else {
                PatientCreationMaster.defaults.City_Id = 0;
            }
            //Pincode
            if (PatientCreationMaster.defaults.Pincode!= '') {
                PatientCreationMaster.defaults.Pincode_Id = $('#pincode_Id').val();
            }
            else {
                PatientCreationMaster.defaults.Pincode_Id = 0;
            }
            var PatientDetails = {
                Title: PatientCreationMaster.defaults.Title,
                Patient_Name: PatientCreationMaster.defaults.Patient_Name,
                Gender: PatientCreationMaster.defaults.Gender,
                Age:PatientCreationMaster.defaults.Age,
                Mobile_Number: PatientCreationMaster.defaults.Mobile_Number,
                Address: PatientCreationMaster.defaults.Address,
                City_Id: PatientCreationMaster.defaults.City_Id,
                Pincode_Id: PatientCreationMaster.defaults.Pincode_Id,
                Email: PatientCreationMaster.defaults.Email,
                Alternate_Mobile_Number: PatientCreationMaster.defaults.Alternate_Mobile_Number,
                Cirrhotic: PatientCreationMaster.defaults.Cirrhotic,
                NON_Cirrhotic: PatientCreationMaster.defaults.NON_Cirrhotic,
                Decompensated_Cirrhotic: PatientCreationMaster.defaults.Decompensated_Cirrhotic,
                Region_Name: PatientCreationMaster.defaults.Region,
                Region_Code:PatientCreationMaster.defaults.RegionCode,
            };
            var patientdetails = JSON.stringify(PatientDetails);

            $.ajax({
                type: "POST",
                url: "../HiDoctor_Master/PatientTracking/InsertPatientDetails",
                data: "patientDetails=" + patientdetails,
                //contentType: "application/json; charset=utf-8",
                success: function (resp) {

                    if (resp == "True") {
                        $.unblockUI();
                        PatientCreationMaster.fnGetAllPatientDetailsToEdit();
                        PatientCreationMaster.fnClear();
                      
                        fnMsgAlert('success', 'Patient Tracking System', 'Patient details submitted successfully');
                        return false;
                    }
                    else {
                        $.unblockUI();
                        PatientCreationMaster.fnClear();
                        //PatientCreationMaster.fnGetAllCities();
                        //PatientCreationMaster.fnGetRegions();
                        fnMsgAlert('error', 'Patient Tracking System', 'Patient details submission failed.Please try after sometime');
                        return false;
                    }
                }
            });
        }
    },

    //Clear Patient Creation Form
    fnClear: function () {
        $('#title').val(0);
        $('#patientname').val('');
        $('#Gender').val(0);
        $('#Age').val('');
        $('#mobilenumber').val('');
        $('#altmobilenumber').val('');
        $('#address').val('');
        $('#city').val('');
        $('#pincode').val('');
        $('#email').val('');
        $('#city_Id').val(0);
        $('#pincode_Id').val(0);
        $('#submit').show();
        $('#update').hide();
        $('#region').val('');
        $('#hdnregionCode').val();
        $(".NO").prop("checked", true);
        $('#mobilenumber').attr('disabled', false);
        $('#title').attr('disabled', false);
        $('#patientname').attr('disabled', false);
        $('#Gender').attr('disabled', false);
        $('#Age').attr('disabled', false);
        $('#region').attr('disabled', false);
        $('input[name=cirrhotic]').attr("disabled", false);
        $('input[name=noncirrhotic]').attr("disabled", false);
        $('input[name=deccirrhotic]').attr("disabled", false);
        PatientCreationMaster.fnGetMobileNumbers();
        PatientCreationMaster.fnGetAllCities();
        PatientCreationMaster.fnGetRegions();
    },



    //Get All Mobile Numbers
    fnGetMobileNumbers: function () {
        debugger;
        $.ajax({
            type: "GET",
            data: "",
            url: "../HiDoctor_Master/PatientTracking/GetAllMobileNumbers",
            success: function (resp) {
                
                PatientCreationMaster.defaults.MobileNumber_List = resp;
            },
            complete: function (e) {
                PatientCreationMaster.fnGetRegions();
            }
        });
    },


    //Method to validate mobile number and alternate mobile number
    fnValidateMobile: function (obj) {
        debugger;
        var phoneNumberPattern = /^\d+$/;
        if (phoneNumberPattern.test(obj) == false) {
            return false;
        }
        else {
            return true;
        }
    },
    //Method to validate age
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

    //To validate Patient Name,Ciy
    fnValidateColumns: function (value) {

        var specialCharregex = new RegExp(/^[ A-Za-z0-9. ]*$/);

        if (specialCharregex.test(value) == false) {
            return false;
        }
        else {
            return true;
        }
    },

    //To validate Address
    regExforAlphaNumericSpecificAddress:function(value) {
        var specialCharregex = new RegExp(/[*&%$^#<>+=~`""|]/g);
        //var specialCharregex = new RegExp("^[''!@#$%^*?+=|]+$");
        if (specialCharregex.test(value)==true) {
            return false;
        }
        else {
            return true;
        }
    },




    //fnValidateAddress: function (value) {

    //    var specialCharregex = new RegExp(/^[A-Za-z0-9./\#-_(), ]*$/);

    //    if (specialCharregex.test(value) == false) {
    //        return false;
    //    }
    //    else {
    //        return true;
    //    }
    //},

    //To Validate Email Id
    fnCheckEmail: function (value) {

        emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (emailReg.test(value) == false) {
            return false;
        }
        else {
            return true;
        }
    },
  
    //Function to get all details to edit
    fnGetAllPatientDetailsToEdit: function () {
        debugger;
        if (Page_No == "1") {
            Page_No = "1";
           
        }
        else {
            Page_No = Page_No.split('_')[0];
        }
        $.ajax({
            type: "GET",
            url: "../HiDoctor_Master/PatientTracking/GetAllPatientsToEdit",
            data: "pagenumber=" + Page_No + "&pageSize=10",
            success: function (resp) {
                Total = resp.TotalCount;
                PatientCreationMaster.fnBindPatientsToEdit(resp);               
            },
        complete:function(e){
            if (Total > 0) {
                if (Page_No == 1) {
                    var jData = JSON.parse(e.responseText)
                    $("#Release_Pagination").pagination({
                        items: jData.TotalCount,
                        itemsOnPage: 10,
                        hrefTextPrefix: 'javascript:PatientCreationMaster.getDetailForRelease(',
                        hrefTextSuffix: ');',
                        cssStyle: 'light-theme'
                    });
                }
                $("#Release_Pagination").show();
                Total = '';
            }
            else {
                $("#Release_Pagination").hide();
            }
            Total = '';
        }
        });
    },
    getDetailForRelease: function (page_No) {
        debugger;
        flagonload = false;
        Page_No = page_No + '_sortDC';
        PatientCreationMaster.fnGetAllPatientDetailsToEdit();
    },
    fnValidateCity:function(Id){
        debugger;
        var city_Name = $("#" + Id.id).val();
        //var mainId = Id.id.split('_')[1];
        //var subId = Id.id.split('_')[2];
        var Cities = PatientCreationMaster.defaults.Cities_List;
        if (city_Name != "") {
            var i = "false";
            var s = "";

            for (var o = 0; o < Cities.length; o++) {
                if (Cities[o].label == city_Name) {
                    i = "true";
                    s = Cities[o].value;
                }
            }
            if (i == "false") {
                $("#city_Id").val(0);
                $('#pincode').val('');
                $("#pincode_Id").val(0);
            } else {
                $("#city_Id").val(s);
                var pincodeId = $("#pincode_Id").val();
                var Pincodes = PatientCreationMaster.defaults.Pincodes_list;
                var filtPincodeList = $.grep(Pincodes, function (ele, index) {
                    return ele.Pincode_Id == pincodeId
                });
                if (filtPincodeList.length == 0) {
                    $('#pincode').val('');
                    $("#pincode_Id").val(0);
                }
            }
        } else {
            $("#city_Id").val(0);
            $('#pincode').val('');
            $("#pincode_Id").val(0);
        }
    },
    fnValidatePincode: function (Id) {
        debugger;
        var PinCode = $("#" + Id.id).val();
        //var mainId = Id.id.split('_')[1];
        //var subId = Id.id.split('_')[2];
        var Pincodes = PatientCreationMaster.defaults.Pincodes_list;
        if (PinCode != "") {
            var i = "false";
            var s = "";

            for (var o = 0; o < Pincodes.length; o++) {
                if (Pincodes[o].label == PinCode) {
                    i = "true";
                    s = Pincodes[o].value;
                }
            }
            if (i == "false") {
                $("#pincode_Id").val(0);
            } else {
                $("#pincode_Id").val(s);
            }
        } else {
            $("#pincode_Id").val(0);
        }
    },
    fnValidateRegion: function (Id) {
        debugger;
        var Region = $("#" + Id.id).val();
        //var mainId = Id.id.split('_')[1];
        //var subId = Id.id.split('_')[2];
        var Regions = PatientCreationMaster.defaults.Region_List;
        if (Region != "") {
            var i = "false";
            var s = "";

            for (var o = 0; o < Regions.length; o++) {
                if (Regions[o].label == Region) {
                    i = "true";
                    s = Regions[o].value;
                }
            }
            if (i == "false") {
                $("#hdnregionCode").val(0);
            } else {
                $("#hdnregionCode").val(s);
            }
        } else {
            $("#hdnregionCode").val(0);
        }
    },
    //function to bind patients to edit
   
    fnBindPatientsToEdit: function (resp) {
        $('#dvAjaxLoad').hide();
        var MappedRegionsArray = [];
        var content = '';
        var sno = 0;
        content += '<table class="table table-hover" id="edittbl">';
        content += '<thead>';       
        content += '<th>Action</th>';
        //content += '<th>Change Status</th>';
        content += '<th>Title</th>';
        content += '<th>Patient Name</th>';
        content += '<th>Gender</th>';
        content += '<th>Age</th>';
        content += '<th>Mobile Number</th>';
        content += '<th>Alternate Mobile Number</th>';
        content += '<th>Address</th>';
        content += '<th>City</th>';
        content += '<th>Pincode</th>';
        content += '<th>Email</th>';
        content += '<th>Cirrhotic</th>';
        content += '<th>NON-Cirrhotic</th>';
        content += '<th>Decompensated Cirrhotic</th>';
        content += '<th>Region Name</th>';
        content += '</thead>';
        content += '<tbody>';
        if (resp != '' && resp.lstPatientDetails.length >= 1) {
            PatientCreationMaster.defaults.Patients_List = resp;
            for (var i = 0; i < resp.lstPatientDetails.length; i++) {
                MappedRegionsArray = [];
                content += '<tr>';
              
                content += '<td  class="editlink" onclick="PatientCreationMaster.fnEditPatientDetails(\'' + resp.lstPatientDetails[i].Patient_Id + '\');">Edit</td>';
                // content += '<td onclick="PatientCreationMaster.fnChangePatientStatus(\'' + resp[i].Patient_Id + '\');">Change Status</td>';
                var PatientId = resp.lstPatientDetails[i].Patient_Id;
                content += '<td>' + resp.lstPatientDetails[i].Title + '</td>';
                content += '<td>' + resp.lstPatientDetails[i].Patient_Name + '</td>';
                content += '<td>' + resp.lstPatientDetails[i].Gender + '</td>';
                content += '<td>' + resp.lstPatientDetails[i].Age + '</td>';
                content += '<td>' + resp.lstPatientDetails[i].Mobile_Number + '</td>';
                if (resp.lstPatientDetails[i].Alternate_Mobile_Number != '') {
                    content += '<td>' + resp.lstPatientDetails[i].Alternate_Mobile_Number + '</td>';
                }
                else {
                    content += '<td></td>';
                }
                if (resp.lstPatientDetails[i].Address != '') {
                    content += '<td>' + resp.lstPatientDetails[i].Address + '</td>';
                }
                else {
                    content += '<td></td>';
                }
                if (resp.lstPatientDetails[i].City_Id != '' || resp.lstPatientDetails[i].City_Id != 0) {
                
                    content += '<td>' + resp.lstPatientDetails[i].City_Name + '</td>';

                }
                else {
                    content += '<td></td>';
                }
                if (resp.lstPatientDetails[i].Pincode_Id != '' || resp.lstPatientDetails[i].Pincode_Id != 0) {
                  
                    content += '<td>' + resp.lstPatientDetails[i].Pincode + '</td>';
                }
                else {
                    content += '<td></td>';
                }
                if (resp.lstPatientDetails[i].Email != '') {
                    content += '<td>' + resp.lstPatientDetails[i].Email + '</td>';
                }
                else {
                    content += '<td></td>';
                }
                if (resp.lstPatientDetails[i].Cirrhotic == 1) {
                    content += '<td>YES</td>';
                }
                else{
                    content += '<td>NO</td>';
                }
               
                if (resp.lstPatientDetails[i].NON_Cirrhotic == 1) {
                    content += '<td>YES</td>';
                }
                else {
                    content += '<td>NO</td>';
                }
                if (resp.lstPatientDetails[i].Decompensated_Cirrhotic == 1) {
                    content += '<td>YES</td>';
                }
                else {
                    content += '<td>NO</td>';
                }
                if (resp.lstRegionNames.length >= 1) {
                    content += '<td>'
                    PatientCreationMaster.defaults.PatientMappedRegions = resp.lstRegionNames;
                    var disjson = jsonPath(resp.lstRegionNames, "$.[?(@.Patient_Id=='" + PatientId + "')]");
                    for (var k = 0; k < PatientCreationMaster.defaults.Region_List.length; k++) {
                        var regionCode = PatientCreationMaster.defaults.Region_List[k].value;
                        if (regionCode != '') {
                            var DisJson = jsonPath(disjson, "$.[?(@.Region_Code=='" + regionCode + "')]");
                            if (DisJson.length >= 1) {
                                for (var m = 0; m < DisJson.length; m++) {
                                    MappedRegionsArray.push(DisJson[m]);
                                }
                              
                            }
                           
                        }
                    }
                   
                    for (var l = 0; l < MappedRegionsArray.length; l++) {
                        content += MappedRegionsArray[l].Region_Name;
                        if (l < MappedRegionsArray.length - 1) {
                            content += ",";
                        }
                    }
                    content += '</td>';
                }
                //content += '<td>' + resp[i].Region_Name + '</td>';
                content += '</tr>';
            }
        }
        content += '</tbody></table>';
        $('#EditPatDet').html(content);
        //if (flagonload == true) {
        //    $("#PatientMaster").addClass("active");
        //    $("#PatientMasterEdit").removeClass("active");
        //    $('#PatientMaster').show();
        //    $(".create").removeClass("active");
        //    $('#PatientMasterEdit').hide();
        //    $("#patmaster").addClass("ui-tabs-selected ui-state-active");
        //    $("#patmasteredit").removeClass("ui-tabs-selected ui-state-active");
        //}
       
    },

    //Function to edit selected patient from list
    fnEditPatientDetails: function (patient_Id) {
      
        if (patient_Id != '' && patient_Id != null && patient_Id != undefined) {
            PatientCreationMaster.defaults.patient_id = patient_Id;
            var patientid = patient_Id;
        }
        $("#pincode").removeAttr('disabled');
        $('#mobilenumber').attr('disabled', true);
        $('#title').attr('disabled', true);
        $('#patientname').attr('disabled', true);
        $('#Gender').attr('disabled', true);
        $('#Age').attr('disabled', true);
        $('#region').attr('disabled', true);
        $('input[name=cirrhotic]').attr("disabled", true);
        $('input[name=noncirrhotic]').attr("disabled", true);
        $('input[name=deccirrhotic]').attr("disabled", true);
        var disjson = jsonPath(PatientCreationMaster.defaults.Patients_List, "$.[?(@.Patient_Id=='" + patient_Id + "')]");
        var title = PatientCreationMaster.fngetTitle(disjson[0].Title);
        $('#title').val(title);
        $('#patientname').val(disjson[0].Patient_Name);
        var gender = PatientCreationMaster.fngetGender(disjson[0].Gender);
        $('#Gender').val(gender);
        $('#Age').val(disjson[0].Age);
        $('#mobilenumber').val(disjson[0].Mobile_Number);
        if (disjson[0].Alternate_Mobile_Number != '') {
            $('#altmobilenumber').val(disjson[0].Alternate_Mobile_Number);
        }
        else {
            $('#altmobilenumber').val('');
        }
        if (disjson[0].Address != '') {
            $('#address').val(disjson[0].Address);
        }
        else {
            $('#address').val('');
        }
        if (disjson[0].City_Id != ''||disjson[0].City_Id !=0) {
           
            $('#city').val(disjson[0].City_Name);
            $('#city_Id').val(disjson[0].City_Id);
            PatientCreationMaster.fnGetPincodes();
        }
        else {
            $('#city').val('');
            $('#city_Id').val(0);
        }
        if (disjson[0].Pincode_Id != '') {           
            $('#pincode').val(disjson[0].Pincode);
            $('#pincode_Id').val(disjson[0].Pincode_Id);
        }
        else {
            $('#pincode').val('');
            $('#pincode_Id').val(0);
        }
        if (disjson[0].Email != '') {
            $('#email').val(disjson[0].Email);
        }
        else {
            $('#email').val('');
        }
        if (disjson[0].Cirrhotic == '' || disjson[0].Cirrhotic!=null) {
            $("input[name=cirrhotic][value=" + disjson[0].Cirrhotic + "]").attr('checked', 'checked');
        }
        if (disjson[0].NON_Cirrhotic != '' || disjson[0].NON_Cirrhotic != null) {
            $("input[name=noncirrhotic][value=" + disjson[0].NON_Cirrhotic + "]").attr('checked', 'checked');
        }
        if (disjson[0].Decompensated_Cirrhotic != '' || disjson[0].Decompensated_Cirrhotic != null) {
            $("input[name=deccirrhotic][value=" + disjson[0].Decompensated_Cirrhotic + "]").attr('checked', 'checked');
        }
        if (PatientCreationMaster.defaults.PatientMappedRegions.length >= 1) {
            var disjson = jsonPath(PatientCreationMaster.defaults.PatientMappedRegions, "$.[?(@.Patient_Id=='" + patientid + "')]");
            var Disjson = jsonPath(disjson, "$.[?(@.Region_Code=='" + PatientCreationMaster.defaults.CurrentRegionCode + "')]");
            if (Disjson.length == 1) {
                $('#region').val(disjson[0].Region_Name);
                $('#hdnregionCode').val(disjson[0].Region_Code);
            }
            else {
                $('#region').val(disjson[0].Region_Name);
                $('#hdnregionCode').val(disjson[0].Region_Code);
            }
           
        }
      

        $('#submit').hide();
        $('#update').show();
        $('#dvTab').tabs('option', 'selected', 0);
        //$("#PatientMaster").addClass("active");
        //$("#PatientMasterEdit").removeClass("active");
        //$(".create").removeClass("active");
        //$('#PatientMaster').show();
        //$('#PatientMasterEdit').hide();
        //$("#patmaster").addClass("ui-tabs-selected ui-state-active");
        //$("#patmasteredit").removeClass("ui-tabs-selected ui-state-active");

    },


    //Validate Patient Creation form 
    fnValidateUpdateForm: function () {
        
        flag = true;
        condtn = false;
        Ccondtn = false;
        Pcondtn = false;
       
        PatientCreationMaster.defaults.Alternate_Mobile_Number = $.trim($('#altmobilenumber').val());
        PatientCreationMaster.defaults.Address = $.trim($('#address').val());
        PatientCreationMaster.defaults.City = $.trim($('#city').val());
        PatientCreationMaster.defaults.Pincode = $.trim($('#pincode').val());
        PatientCreationMaster.defaults.Email = $.trim($('#email').val());

       

      

        //Alternate Mobile Number
        if (PatientCreationMaster.defaults.Alternate_Mobile_Number != '') {
            var result = PatientCreationMaster.fnValidateMobile(PatientCreationMaster.defaults.Alternate_Mobile_Number);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter only numbers in Alternate Mobile Number');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Alternate_Mobile_Number.length < 10 || PatientCreationMaster.defaults.Alternate_Mobile_Number.length > 10) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter 10 Digit(s) in Alternate Mobile Number');
                flag = false;
                return;
            }
            else if (PatientCreationMaster.defaults.Alternate_Mobile_Number == PatientCreationMaster.defaults.Mobile_Number) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please Enter Different Mobile Number in Alternate Mobile Number');
                flag = false;
                return;
            }

        }

        //City
        if (PatientCreationMaster.defaults.City != '') {
            //var result = PatientCreationMaster.fnValidateColumns(PatientCreationMaster.defaults.City);
            //if (result == false) {
            //    fnMsgAlert('info', 'Patient Tracking System', 'Special characters are not allowed in  the City field');
            //    flag = false;
            //    return;
            //}
            //else {
            for (var i = 0; i < PatientCreationMaster.defaults.Cities_List.length; i++) {
                if (PatientCreationMaster.defaults.City == PatientCreationMaster.defaults.Cities_List[i].label) {
                    Ccondtn = true;
                }
            }

            if (Ccondtn == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please Select City from list');
                flag = false;
                return;
            }
        }

        //Pincode
        if (PatientCreationMaster.defaults.Pincode != '') {
            var result = PatientCreationMaster.fnValidateMobile(PatientCreationMaster.defaults.Pincode);

            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Special characters and Alphabets are not allowed in the Pincode');
                flag = false;
                return;
            }
            else {
                for (var i = 0; i < PatientCreationMaster.defaults.Pincodes_list.length; i++) {
                    if (PatientCreationMaster.defaults.Pincode == PatientCreationMaster.defaults.Pincodes_list[i].label) {
                        Pcondtn = true;
                    }
                }
            }
            if (Pcondtn == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please select Pincode from list');
                flag = false;
                return;
            }
        }


        //Address
        if (PatientCreationMaster.defaults.Address.length > 100) {
            fnMsgAlert('info', 'Patient Tracking System', 'Please enter Address within 100 characters');
            flag = false;
            return;
        }
        else if (PatientCreationMaster.defaults.Address != '') {
            var result = PatientCreationMaster.regExforAlphaNumericSpecificAddress(PatientCreationMaster.defaults.Address);
            if (result == false) {
                fnMsgAlert('info', 'Patient Tracking System', 'Special characters [.,/\-_#()] are accepted in Address');
                flag = false;
                return;
            }
        }

        //Email
        if (PatientCreationMaster.defaults.Email != '') {
            if (PatientCreationMaster.defaults.Email.length > 50) {
                fnMsgAlert('info', 'Patient Tracking System', 'Please enter Email within 50 characters');
                flag = false;
                return;
            }
            else {
                var result = PatientCreationMaster.fnCheckEmail(PatientCreationMaster.defaults.Email);
                if (result == false) {
                    fnMsgAlert('info', 'Patient Tracking System', 'Please Enter Email with Valid Format (ex: abc@gmail.com)');
                    flag = false;
                    return;
                }
            }
        }

        return flag;
    },
    fnUpdate:function(){
        
        var result = PatientCreationMaster.fnValidateUpdateForm();
        if (result == true) {
            $.blockUI();
           
            PatientCreationMaster.defaults.City_Id = $('#city_Id').val();
            PatientCreationMaster.defaults.Pincode_Id = $('#pincode_Id').val();

            //Alternate Mobile Number
            if ($.trim($('#altmobilenumber').val()) != '') {
                PatientCreationMaster.defaults.Alternate_Mobile_Number = $.trim($('#altmobilenumber').val());
            }
            else {
                PatientCreationMaster.defaults.Alternate_Mobile_Number = '';
            }

            //Address
            if ($.trim($('#address').val()) != '') {
                PatientCreationMaster.defaults.Address = $.trim($('#address').val());
            }
            else {
                PatientCreationMaster.defaults.Address = '';
            }
            //Email
            if ($('#email').val() != '') {
                PatientCreationMaster.defaults.Email = $.trim($('#email').val());
            }
            else {
                PatientCreationMaster.defaults.Email = '';
            }
            //City
            if (PatientCreationMaster.defaults.City != '') {
                PatientCreationMaster.defaults.City_Id = $('#city_Id').val();
            }
            else {
                PatientCreationMaster.defaults.City_Id = 0;
            }
            //Pincode
            if (PatientCreationMaster.defaults.Pincode != '') {
                PatientCreationMaster.defaults.Pincode_Id = $('#pincode_Id').val();
            }
            else {
                PatientCreationMaster.defaults.Pincode_Id = 0;
            }

            var PatientDetails = {               
                Address: PatientCreationMaster.defaults.Address,
                City_Id: PatientCreationMaster.defaults.City_Id,
                Pincode_Id: PatientCreationMaster.defaults.Pincode_Id,
                Email: PatientCreationMaster.defaults.Email,
                Alternate_Mobile_Number: PatientCreationMaster.defaults.Alternate_Mobile_Number,
            };
            var patientdetails = JSON.stringify(PatientDetails);
            $.ajax({
                type: "PUT",
                url: "../HiDoctor_Master/PatientTracking/UpdatePatientDetails",
                data: "patientId=" + PatientCreationMaster.defaults.patient_id + "&PatientDetails=" + patientdetails,
                success: function (resp) {
                    
                    if (resp == "True") {
                       
                        $.unblockUI();
                        PatientCreationMaster.fnClear();
                        //PatientCreationMaster.fnGetAllCities();
                        //PatientCreationMaster.fnGetRegions();
                        PatientCreationMaster.fnGetAllPatientDetailsToEdit();
                        fnMsgAlert('success', 'Patient Tracking System', 'Patient details updated successfully');
                        return false;
                    }
                    else {
                        $.unblockUI();
                        PatientCreationMaster.fnClear();
                        //PatientCreationMaster.fnGetAllCities();
                        //PatientCreationMaster.fnGetRegions();
                        fnMsgAlert('error', 'Patient Tracking System', 'Patient details updation failed.Please try after sometime');
                        return false;
                    }
                }

            });
        }
    },

    fnChangePatientStatus: function (patient_Id) {
        
        $.ajax({
            type: "POST",
            url: "../HiDoctor_Master/PatientTracking/PatientStatusChange",
            data: "Patient_Id=" + patient_Id,
            success: function (resp) {
                
                PatientCreationMaster.fnGetAllPatientDetailsToEdit();
                
            }
        });
    },
    fngetGender: function (gender) {
        if (gender == "Male") {
            return 1;
        }
        if (gender == "Female") {
            return 2;
        }
        if (gender == "Others") {
            return 3;
        }
    },
    fngetTitle: function (title) {
        if (title == "Mr.") {
            return 1;
        }
        if (title == "Ms.") {
            return 2;
        }
        if (title == "Mrs.") {
            return 3;
        }
    },

}