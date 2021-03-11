var res = '';
var CompanyCode;
var UserCode;
var RegionCode;
var Source;
var Speciality_List = '';
var Company_Code = CompanyCode;
var User_Code = UserCode;
var Region_Code = RegionCode;
var Source = Source;
var DoctorName = DoctorName;
var SpecialityCode;
SPLCodeon = SpecialityCode;
var count = 0;
var cityid = '';
var spcoded = '';
var catcode = '';
var selectedvalue = '';
var spname = '';
var spld = '';
var catg = '';
var spclresp = '';
var dynamiccol = '';
var Customer_Name = '';
var SPECIALITYSourcecode = '';
var CityList = '';
var cityname = '';
var x = '';
var citynum = '';
var y = '';
function fnGetCMDoctor() {

    debugger;
    Method_params = ["CustomerApi/CustomerMasterFields", CompanyCode, UserCode];
    CoreREST.get(null, Method_params, null, BindSuccessData, BindFailure);


}
function BindSuccessData(response) {
    debugger;
    dynamiccol = response;
    $("#load").hide();
    var content = '';
    var content1 = '';
    var content2 = '';
    var content3 = '';
    var content4 = '';
    var content5 = '';
    var content6 = '';
    var content7 = '';
    var content8 = '';

    for (var i = 0; i < response.list.length; i++) {

        if (response.list[i].Field_Name == "Customer_Name") {
            //$("#customername").show();
            content += '<label id="customername"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="star" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
            content += '<input id="cusname" class="form-control" type="text" style="font-size:16px;" onkeypress="javascript:return fnvalidatenameedit(this,event);"  maxlength=300 minlength=3>';
            $("#customer").html(content);
            if (DoctorName != null) {
                $("#cusname").attr("disabled", "disabled");
                $("#cusname").val(DoctorName);
            }
            if (response.list[i].Is_Mandatory == 1) {
                $("#star").show();
            }


        }
        else if (response.list[i].Field_Name == "MDL_Number") {
            //  $(".MDLN").show();
            content1 += ' <label class="MDLN"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="starm" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
            content1 += '<input id="mno" class="form-control" type="text" style="font-size:16px;" maxlength=30 minlength=1 onkeypress="javascript:return fnvalidatenumberedit(this,event);">';
            $("#mdl").html(content1);
            if (response.list[i].Is_Mandatory == 1) {
                $("#starm").show();
            }
        }

        else if (response.list[i].Field_Name == "Speciality_Code") {
            // $("#spcl").show();
            if (SpecialityCode != null) {
                content2 += '<label  id="spcl"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="starsp" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
                content2 += '<label class="form-control" type="text" onkeypress="return false;" id="spclbind" data-disabled-touch-keyboard>';
            }
            else {
                content2 += '<label  id="spcl"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="starsp" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
                content2 += '<label class="form-control" type="text" onclick="fnBindspl();" onkeypress="return false;" id="spclbind" data-disabled-touch-keyboard>';
            }

            content2 += '<input class="form-control" type="hidden" id="hdnspclbind">';
            $("#Specialty").html(content2);
            if (response.list[i].Is_Mandatory == 1) {
                $("#starsp").show();
            }
        }


        else if (response.list[i].Field_Name == "Category") {
            //fngetcategory();
            // $(".Category").show();
            content3 += '<label class="Category"><b>' + response.list[i].Field_Alias_Name + '</b> </label>';
            content3 += '<label class="form-control"  onkeypress="return false;" onclick="fngetcategory(event);" id="catlist" data-disabled-touch-keyboard>';
            $("#Category").html(content3);
            if (response.list[i].Is_Mandatory == 1) {
                $("#starc").show();
            }

        }



        else if (response.list[i].Field_Name == "Gender") {
            // $("#gen").show();
            content4 += ' <label  id="gen"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="starg" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
            content4 += ' <label><input id="radiobtn" type="radio" name="optradio" value="F">Female</label>';
            content4 += ' <label style="padding-left:19px;"><input id="radiobtn" type="radio" value="M" name="optradio">Male</label>';
            $("#Gender").html(content4);
            if (response.list[i].Is_Mandatory == 1) {
                $("#starg").show();
            }
            if (response.list[i].Field_Name != "Gender") {
                $("input[name='optradio']:checked").val(null);
            }
        }


        else if (response.list[i].Field_Name == "Sur_Name") {
            // $(".SurName").show();
            content5 += '<label class="SurName"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="stars" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>';
            content5 += '<input class="form-control" id="sname" style="font-size:16px;" type="text" maxlength=300 minlength=3 onkeypress="javascript:return fnvalidatenameedit(this,event);">';
            $("#SurName").html(content5);
            if (response.list[i].Is_Mandatory == 1) {
                $("#stars").show();
            }
            if (response.list[i].Field_Name != "Sur_Name") {
                $("#sname").val(null);
            }
        }


        else if (response.list[i].Field_Name == "Registration_No") {
            //  $("#reg").show();
            content6 += ' <label id="reg"><b>' + response.list[i].Field_Alias_Name + '</b><i class="fa fa-star" id="starr" style="color:red;font-size:9px;margin-left:5px;display:none;"></i></label>'
            content6 += '<input class="form-control" id="regn" style="font-size:16px;" type="text" maxlength=50 minlength=3 onkeypress="javascript:return fnvalidateregedit(this,event);">';
            $("#RegistrationNo").html(content6);
            if (response.list[i].Is_Mandatory == 1) {
                $("#starr").show();
            }
            if (response.list[i].Field_Name != "Registration_No") {
                $("#regn").val(null);
            }
        }


    }

    $(".addcls").show();
    $("#btnshow").show();
    fnGetspecialty();
    fngetcity();
}
function BindFailure() {
    //alert(0);
}
function fngen(value) {

    selectedvalue = $("input[name='optradio']:checked").val();

}

function fnvalidatenameedit(ele, e) {
    //alert(e.keyCode);
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode == 19 || e.keyCode == 32) {
        // $('#name_err').hide();
        return true;
    }
    else {
        //  $('#name_err').show();
        return false;
    }
}
function fnvalidatenumberedit(ele, e) {
    //alert(e.keyCode);
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode == 19 || e.keyCode == 32) {
        // $('#name_err').hide();
        return true;
    }
    else {
        //  $('#name_err').show();
        return false;
    }
}
function fnvalidateregedit(ele, e) {
    debugger;
    //alert(e.keyCode);
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode == 19 || e.keyCode == 32 || e.keyCode == 47 || e.keyCode == 45) {
        // $('#name_err').hide();
        return true;
    }
    else {
        //  $('#name_err').show();
        return false;
    }
}
//function validateEmailedit() {
//    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value)) {
//        return (true)
//    }
//    alert("You have entered an invalid email address!")
//    return (false)
//}
function validateEmailedit(value) {

    emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailReg.test(value) == false) {

        return false;
    }
    else {
        return true;
    }
}
function fnvalidatephnoedit(ele, e) {
    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 45 || e.keyCode == 43) {
        $('#phno_err1').hide();
        return true;
    }
    else {
        $('#phno_err1').show();
        return false;
    }
}
function fnaddcity() {
    debugger;
    var content = '';
    content += '<input type="text" style="font-size:16px;" class="form-control" id="additionalcity"><button type="button" style="margin-left:104%;padding:4px 12px;margin-top:-6%;" id="btnshowcity" class="btn btn-default"  onclick="fnInputCityName();">SAVE</button>';

    $("#addcity").html(content);
}

function fnadd() {
    debugger;
    $(".addcls").hide();
    // fngetcity();
    var val = "";
    var value = "";

    count = count + 1;

    var content = '';
    content += '<div class="col-sm-12 col-xs-12 addadrscls">';
    content += '<div class="form-group col-sm-4" style="clear:both;">';
    content += '<label id=adrs' + count + ' for="exampleInputEmail1" style="color:red;font-size:9px;margin-left:5px;"><b>Address ' + count + '</b></label>';
    content += '<textarea class="form-control" id=adrstxt' + count + ' maxlength="500" style="resize: none;" onkeypress="javascript:return fnvalidateregedit(this,event);"></textarea>';
    // content += '<input id=adrstxt' + count + ' type="text" class="form-control" onkeypress="javascript:return fnvalidateregedit(this,event);" id="exampleInputEmail1" >';
    content += '</div>';
    content += '<div class="form-group col-sm-4">';
    content += ' <label id=city' + count + ' for="exampleInputPassword1" style="color:red;font-size:9px;margin-left:5px;"><b>City</b></label>';
    content += ' <label  id=citytxt' + count + ' onkeypress="return false;" data-disabled-touch-keyboard type="text" onclick="fngetcity();" class="citylist form-control">';
    content += '</div>';
    content += '<div class="form-group col-sm-4" style="clear:both;">';
    content += '<label id=local' + count + ' for="exampleInputEmail1" ><b>Local Area</b><i class="fa fa-star" id="starlocalarea" ></i></label>';
    content += '<input id=localtext' + count + ' type="email" class="form-control" onkeypress="javascript:return fnvalidatenameedit(this,event);" id="exampleInputEmail1" >';
    content += '</div>';


    content += '<div class="form-group col-sm-4">';
    content += '<label id=mob' + count + ' for="exampleInputEmail1" style="color:red;font-size:9px;margin-left:5px;"><b>Mobile</b></label>';

    content += '<input id=mobtxt' + count + ' type="text" maxlength="12" class="form-control" id="exampleInputEmail1" onkeypress="javascript:return fnvalidatephnoedit(this,event);">';
    content += '</div>';
    content += '<div class="form-group col-sm-4" style="clear:both;">';
    content += ' <label id=email' + count + ' for="exampleInputPassword1"><b>Email</b></label>';
    content += ' <input onblur="validateEmailedit();" id=emailtxt' + count + ' type="text" class="form-control">';
    content += '<span id="email_err1" style="font-size:12px; color:red;display:none;">Enter e-Mail id</span>';
    content += '</div>';
    content += '</div>';
    $("#add").append(content);



}

function fnGetspecialty() {
    debugger;
    var content = '';
    //$("#dvAjaxLoad").show();
    $.ajax({
        url: '../CMDoctor/GetDoctorspcl',
        type: "GET",
        data: "CompanyCode=" + CompanyCode,
        success: function (response) {
            spclresp = response;
            debugger;

            if (SpecialityCode != null) {
                fnsourcespl();
            }
            //else{
            //    fnBindspl(response);
            //}
        }
    });

}

//bind all cities into autocomplete
function fnBindspl() {
    //var speciallist=''
    var content = '';

    var speciallist = ''

    for (var i = 0; i < spclresp.length; i++) {
        content += '<input type="radio"  name="nmchck" onclick="fnchk(' + spclresp[i].Speciality_Code + ');" id=' + spclresp[i].Speciality_Code + ' value= \'' + spclresp[i].Speciality_Name + '\'>&nbsp&nbsp&nbsp' + spclresp[i].Speciality_Name + '</br>';

        spcoded = spclresp[i].Speciality_Code
    }



    $("#splist").html(content);
    $("#myModaltree").show('modal');


}


function fnsourcespl() {
    debugger;
    var Speciality_List = '';
    var content = '';
    //   var stateid = sel.value;
    if (SpecialityCode != '') {
        Speciality_List = jsonPath(spclresp, "$.[?(@.Speciality_Code=='" + SpecialityCode + "')]");
    }

    var name = '';

    if (Speciality_List.length > 0) {
        name = Speciality_List[0].Speciality_Name;
        SPECIALITYSourcecode = Speciality_List[0].Speciality_Code;
    }



    $("#spclbind").html(name);


}
function fnchk(value) {
    debugger;
    // var s='';
    var sp = value;
    spld = sp.id;
    //   s=value.id;
    var x = '';
    x = $('input[name="nmchck"]:checked').val();
    $("#spclbind").html(x);
    $("#hdnspclbind").val(value);
}
function fndone() {

    $("#myModaltree").hide('modal');
}
function fngetcity() {
    debugger;

    $.ajax({
        url: '../CMDoctor/GetAllCities',
        type: "GET",
        // data: "State_Id=" + StateId,
        success: function (response) {
            // fnBindcities(response);
            CityList = response;

        },
        error: function (response) {
            // alert(0);
        }
    })
}
function fnBindcities() {
    debugger;
    var content = '';
    var City_List = '';

    var city_Dropdwn = [];
    for (var i = 0; i < CityList.length; i++) {
        _objData = {};
        _objData.value = CityList[i].City_ID;
        _objData.label = CityList[i].City_Name;
        city_Dropdwn.push(_objData);
    }

    var data = city_Dropdwn;

    var dropDownListObj = new ej.dropdowns.DropDownList({
        showClearButton: true,
        allowFiltering: true,
        dataSource: data,
        fields: { text: 'label', value: 'value' },
        filtering: function (e) {
            var dropdown_query = new ej.data.Query();
            dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            e.updateData(data, dropdown_query);
        }
    });

    content += '<input id="txtCityName" style="width:100%!important;text-align:left;"/>';
    $("#citlist").html(content);
    dropDownListObj.appendTo('#txtCityName');
    //  content += '<option value="0" disabled selected hidden>Select City</option>';
    //for (var i = 0; i < CityList.length; i++) {
    //    content += '<input type="radio" name="nmchck" onclick="fncitychk(' + CityList[i].City_ID + ');" id=' + CityList[i].City_ID + ' value=\'' + CityList[i].City_Name + '\'>&nbsp&nbsp&nbsp' + CityList[i].City_Name + '</br>';
    //    cityid = CityList[i].City_ID
    //}
    //$("#citlist").html(content);
    for (var i = 0; i < CityList.length; i++) {
        var cts = $('#cts').text();
        if (cts == CityList[i].City_Name) {
            debugger;
            // $(".citylist").html(cityname);
            //$("input:radio[name=nmchck][value=" + cityname + "]").attr('checked', true);
            $('#txtCityName').val(cts);

        }
    }
    //if (y != '') {
    //    $("input:radio[name=nmchck][id=" + citynum + "]").attr('checked', true);
    //}

    $("#myModaltreecity").show('modal');

}
function fncitychk(value) {
    debugger;
    var cityvalue = value;
    citynum = value;


    y = $('input[name="nmchck"]:checked').val();
    $(".citylist").html(y);
    // $("#hdnspclbind").val(value);
}
function fndonecity() {
    debugger;
    y = $('#txtCityName').val();
    $(".citylist").html(y);
    $("#myModaltreecity").hide('modal');
}
function fngetcategory(event) {
    debugger;
    $.ajax({
        url: '../CMDoctor/GetDoctorcat',
        type: "GET",
        data: "CompanyCode=" + CompanyCode + "&RegionCode=" + RegionCode,
        success: function (response) {
            fnBindcategory(response);
        },
        error: function (response) {
            // alert(0);
        }
    });
    event.preventDefault();
}
function fnBindcategory(response) {
    debugger;

    var content = '';
    // content += '<option value="0" disabled selected hidden>Select Category</option>';
    for (var i = 0; i < response.length; i++) {
        content += '<input type="radio" name="nmchck" onclick="fncatchk(\'' + response[i].Category_Code + '\');" id=' + response[i].Category_Code + ' value=\'' + response[i].Category_Name + '\'>&nbsp&nbsp&nbsp' + response[i].Category_Name + '</br>';
        $("#categorylist").html(content);
        catcode = response[i].Category_Code;
    }
    if (catg != '') {
        $("input:radio[name=nmchck][id=" + catg + "]").attr('checked', true);
    }
    $("#myModaltreecat").show('modal');
    $('#myModaltreecat').focus();
}
function fncatchk(value) {
    debugger;

    var caty = value;
    catg = value;
    //  var c='';
    // c = value.id;

    x = $('input[name="nmchck"]:checked').val();
    $("#catlist").html(x);
    //  $("#categorylist").html(x);
    // $("#hdnspclbind").val(value);
}
function fndonecat() {
    $("#myModaltreecat").hide('modal');
}
function fnclose() {
    $("#spclbind").html('');
    $("#myModaltree").hide('modal');
}
function fnclcat() {
    $("#catlist").html('');
    $("#myModaltreecat").hide('modal');
}
function fnclcity() {
    debugger;
    $(".citylist").html('');
    $("#myModaltreecity").hide('modal');
}
function fnsave(Source) {

    debugger;
    $("#load").show();
    $("#btnshow").hide();
    var Company_Code = CompanyCode;

    var NewCity_List = '';
    var isValidCand = fnCandidateValidation();  
    if (isValidCand == true) {
        var isvalidlength = fnCandidatelengthValidation();
        if (isvalidlength == true) {
            //$("#btnshow").show();
            var add = [];

            if (Source != 1 && Source != 2) {


                for (var i = 0; i < $(".addcls").length; i++) {

                    var addobj = {}

                    var addobj = {
                        Address1: $("#adrstxt" + count + "").val(),
                        Local_Area: $("#localtext" + count + "").val(),

                        City_Id: citynum,
                        City: $("#citytxt" + count + "").val(),
                        Mobile: $("#mobtxt" + count + "").val(),
                        Email_Id: $("#emailtxt" + count + "").val(),

                    }

                    add.push(addobj)
                    addobj = "";

                }

            }
            else {


                for (var i = 0; i < $(".addcls").length; i++) {

                    var addobj = {}
                    if (cityname != "") {
                        var disjson = jsonPath(CityList, "$.[?(@.City_Name=='" + $("#cts").html() + "')]");
                        citynum = disjson[0].City_ID;
                    }

                    var addobj = {
                        Address1: $("#ads").val(),
                        Local_Area: $("#las").val(),
                        City_Id: citynum,
                        City: $("#cts").html(),
                        Mobile: $("#ms").val(),
                        Email_Id: $("#es").val(),

                    }

                    add.push(addobj)
                    addobj = "";



                }
            }


            if (SpecialityCode != null) {
                var objcus = {

                    Company_Code: CompanyCode,
                    Customer_Name: $("#cusname").val() == undefined ? "" : $("#cusname").val(),
                    User_Code: UserCode,
                    Region_Code: RegionCode,
                    MDL_Number: $("#mno").val() == undefined ? "" : $("#mno").val(),
                    Specialty: SPECIALITYSourcecode == undefined ? "" : SPECIALITYSourcecode,
                    Category: catg == undefined ? "" : catg,
                    Gender: $("input[name='optradio']:checked").val() == undefined ? "" : $("input[name='optradio']:checked").val(),

                    Sur_Name: $("#sname").val() == undefined ? "" : $("#sname").val(),
                    Registration_no: $("#regn").val() == undefined ? "" : $("#regn").val(),
                    lstCustomerAdditionalData: add


                }
            }
            else {
                //var spclty = spld == undefined ? "" : spld
                if (spld == undefined) {
                    spld = ""
                }
                var objcus = {

                    Company_Code: CompanyCode,
                    Customer_Name: $("#cusname").val() == undefined ? "" : $("#cusname").val(),
                    User_Code: UserCode,
                    Region_Code: RegionCode,
                    MDL_Number: $("#mno").val() == undefined ? "" : $("#mno").val(),
                    //Specialty: spld,
                    Specialty: spld,
                    Category: catg == undefined ? "" : catg,
                    Gender: $("input[name='optradio']:checked").val() == undefined ? "" : $("input[name='optradio']:checked").val(),

                    Sur_Name: $("#sname").val() == undefined ? "" : $("#sname").val(),
                    Registration_no: $("#regn").val() == undefined ? "" : $("#regn").val(),
                    lstCustomerAdditionalData: add

                }
            }
            Method_params = ["DCRDoctorVisitAPI/InsertDoctorData", Company_Code];
            CoreREST.post(null, Method_params, objcus, BindpostSuccessData, BindpostFailure);
        }
    }
}

function BindpostSuccessData(response) {
    debugger;
    $("#load").hide();
    $("#btnshow").show();
    if (response.Status == 1) {

        if (Source == 2) {
            fnMsgAlert('info', '', 'Customer has been added successfully. Please tap on close button and also please download the master data');
            //clearForm();
        }
        else {
            fnMsgAlert('info', '', 'Customer has been added successfully');
            //clearForm();
        }
        clearForm();
        //window.location.reload();

    }

    else {


        var errorMsg = response.Message;
        var doctorDisplayName = "";
        var mdlDisplayName = "";
        var categoryDisplayName = "";
        var spltyDisplayName = "";
        // for (var i = 0; i < dynamiccol.list.length; i++) {

        var filteredList = jsonPath(dynamiccol, "$.[?(@.Field_Name=='Customer_Name')]");
        if (filteredList.length > 0) {
            doctorDisplayName = filteredList[0].Field_Alias_Name;
        }

        filteredList = jsonPath(dynamiccol, "$.[?(@.Field_Name=='MDL_Number')]");
        if (filteredList.length > 0) {
            mdlDisplayName = filteredList[0].Field_Alias_Name;
        }

        filteredList = jsonPath(dynamiccol, "$.[?(@.Field_Name=='Category')]");
        if (filteredList.length > 0) {
            categoryDisplayName = filteredList[0].Field_Alias_Name;
        }

        filteredList = jsonPath(dynamiccol, "$.[?(@.Field_Name=='Speciality_Code')]");
        if (filteredList.length > 0) {
            spltyDisplayName = filteredList[0].Field_Alias_Name;
        }

        errorMsg = errorMsg.replace(/@@DOCTOR/g, doctorDisplayName);
        errorMsg = errorMsg.replace(/@@MDL_Number/g, mdlDisplayName);
        errorMsg = errorMsg.replace(/@@CATEGORY/g, categoryDisplayName);
        errorMsg = errorMsg.replace(/@@SPECIALTY/g, spltyDisplayName);

        fnMsgAlert('info', '', errorMsg);
    }

    //   window.location.reload();


}

function BindpostFailure() {
    debugger;
    $("#btnshow").show();
    // alert(0);
}

function clearForm() {
    debugger;
    $("#cusname").attr("disabled", false);

    $("#cusname").val('');
    $("#mno").val('');
    $("#spclbind").html('');
    $("#catlist").html('');
    $("input[name='optradio']:checked").val('');
    $("#sname").val('');
    $("#regn").val('');
    $("#ads").val('');
    $("#las").val('');

    $("#cts").html('');
    $("#ms").val('');
    $("#es").val('');

}

function fnCandidateValidation() {
    debugger;
    var count = 0;   
    var flag = true;
 
    if ($("#ads").val() == "") {
        debugger;
        $("#load").hide();
        $("#btnshow").show();
        fnMsgAlert('info', '', 'Please enter Address.');
      
        flag = false;
    }
    else if ($("#cts").text().trim() == "") {
        debugger;
        $("#load").hide();
        $("#btnshow").show();
        fnMsgAlert('info', '', 'Please enter City.');
    
        flag = false;
    }
    else if ($("#las").val() == "") {
        debugger;
        $("#load").hide();
        $("#btnshow").show();
        fnMsgAlert('info', '', 'Please enter Local Area.');

        flag = false;
    }
    else if ($("#ms").val() == "") {
        $("#load").hide();
        $("#btnshow").show();
        fnMsgAlert('info', '', 'Please enter Mobile.');      
        flag = false;
    }
    else if ($("#las").val() == "") {
        debugger;
        $("#load").hide();
        $("#btnshow").show();
        fnMsgAlert('info', '', 'Please enter Local Area.');        
        flag = false;
    }
    else if ($("#adrstxt").val() < 5) {        
        fnMsgAlert('info', '', 'Address 1 should be minimum of 5 characters.');
        $("#load").hide();
        $("#btnshow").show();     
        flag = false;
    }
    else if ($("#localtext").val() < 3) {
       
        fnMsgAlert('info', '', 'Local area should be minimum of 3 characters.');
        $("#load").hide();
        $("#btnshow").show();

        // });
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }
    else if ($("#localtext").val() > 500) {
       
        fnMsgAlert('info', '', 'Local Area cannot be more than 255 characters.');
        $("#load").hide();
        $("#btnshow").show();
 
        flag = false;
      
    }
    else if ($("#ads").val() != '' && $("#ads").val().length < 5) {
        //swal("Address 1 should be minimum of 5 characters").then(() => {
        fnMsgAlert('info', '', 'Address 1 should be minimum of 5 characters.');
        // $("#myModal1").modal('show');
        //$.unblockUI();
        $("#load").hide();
        $("#btnshow").show();

        //});
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }

    else if ($("#ads").val() != '' && $("#ads").val().length > 255) {
        // swal("Address 1 can't be more than 255 characters").then(() => {
        fnMsgAlert('info', '', 'Address 1 cannot be more than 255 characters.');
        // $("#myModal1").modal('show');
        //$.unblockUI();
        $("#load").hide();
        $("#btnshow").show();

        // });
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }
    else if ($("#adrstxt").val() > 255) {
      
        fnMsgAlert('info', '', 'Address 1 cannot be more than 255 characters.');
        $("#load").hide();
        $("#btnshow").show(); 
        flag = false;      
    }
    else if ($("#las").val() != '' && $("#las").val().length < 3) {
        
        fnMsgAlert('info', '', 'Local area should be minimum of 3 characters.');
       
        $("#load").hide();
        $("#btnshow").show();       
        flag = false;
      
    }
    else if ($("#las").val() != '' && $("#las").val().length > 500) {
        //swal("Local Area can't be more than 255 characters").then(() => {
        fnMsgAlert('info', '', 'Local Area cannot be more than 255 characters.');
        // $("#myModal1").modal('show');
        //$.unblockUI();
        $("#load").hide();
        $("#btnshow").show();

        // });
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }
    else if ($("#ms").val() != '' && $("#ms").val().length < 10) {
        // swal("Mobile number must be 10 digits").then(() => {
        fnMsgAlert('info', '', 'Mobile number must be 10 digits.');
        // $("#myModal1").modal('show');
        //$.unblockUI();
        $("#load").hide();
        $("#btnshow").show();
        //  });
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }
    else if ($("#ms").val() != '' && $("#ms").val().length > 10) {
        // swal("Mobile number must be 10 digits").then(() => {
        fnMsgAlert('info', '', 'Mobile number must be 10 digits.');
        // $("#myModal1").modal('show');
        //$.unblockUI();
        $("#load").hide();
        $("#btnshow").show();
        //  });
        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }
    else if ($("#mobtxt").val() != '' && $("#mobtxt").val() < 10) {
        fnMsgAlert('info', '', 'Mobile number must be 10 digits.');
        $("#load").hide();
        $("#btnshow").show();

        flag = false;
        //alert("RequestedDate should be filled");
        //return;
    }

        //else if ($("#emailtxt").val() != '') {
        //    if ($("#emailtxt" + count + "").val()> 50) {
        //        fnMsgAlert('info', '', 'Please enter email within 50 characters.');
        //        $("#load").hide();
        //        flag = false;
        //        //alert("RequestedDate should be filled");
        //        return;
        //    }

        //    else {
        //        var result = validateEmailedit($("#emailtxt" + count + "").val());
        //        fnMsgAlert('info', '', 'Please Enter Email with Valid Format (ex: abc@gmail.com).');
        //                $("#load").hide();


        //            flag = false;
        //            return;
        //        }

        //}

    else if ($("#es").val() != '') {
        if ($("#es").val().length > 50) {
            //  swal("Please enter email within 50 characters").then(() => {
            // $("#myModal1").modal('show');
            fnMsgAlert('info', '', 'Please enter email within 50 characters.');
            //$.unblockUI();
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;
            //alert("RequestedDate should be filled");
            //return;
        }
        else {
            var result = validateEmailedit($("#es").val());
            if (result == false) {
                //swal('Please Enter Email with Valid Format (ex: abc@gmail.com)').then(() => {
                fnMsgAlert('info', '', 'Please Enter Email with Valid Format (ex: abc@gmail.com).');
                $("#load").hide();
                $("#btnshow").show();
                //    });

                flag = false;
                //return;
            }
        }
    }
    //}
    return flag;

}
function fnCandidatelengthValidation() {
    debugger;
    // $.blockUI();
    var flag = true;
    for (var i = 0; i < dynamiccol.list.length; i++) {


        if (dynamiccol.list[i].Field_Name == "Customer_Name" && $("#cusname").val().length < dynamiccol.list[i].Min_Length) {
            fnMsgAlert('info', '', 'Please Enter minimum 3 characters for Customer Name');
            $("#load").hide();
            $("#btnshow").show();

            flag = false;

            return;
        }
        if (dynamiccol.list[i].Field_Name == "Customer_Name" && dynamiccol.list[i].Is_Mandatory == 1 && $("#cusname").val() == '') {

            //swal("Please Enter Customer Name").then(() => {
            // $("#myModal1").modal('show');
            //$.unblockUI();
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //});
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }
        if (dynamiccol.list[i].Field_Name == "Speciality_Code" && dynamiccol.list[i].Is_Mandatory == 1 && spcoded == "" && SPECIALITYSourcecode == "") {

            //  swal("Please Enter Speciality").then(() => {
            // $("#myModal1").modal('show');
            //$.unblockUI();
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }
        if (dynamiccol.list[i].Field_Name == "MDL_Number" && dynamiccol.list[i].Is_Mandatory == 1 && $("#mno").val() == "") {

            //swal("Please Enter MDL Number").then(() => {
            // $("#myModal1").modal('show');
            //$.unblockUI();
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //});
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }

        //if (dynamiccol.list[i].Field_Name == "Category" && dynamiccol.list[i].Is_Mandatory == 1 && catg == "") {

        //    //swal("Please Enter Category").then(() => {
        //    // $("#myModal1").modal('show');
        //    //$.unblockUI();
        //    fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
        //    $("#load").hide();
        //    $("#btnshow").show();
        //    //  });
        //    flag = false;
        //    //alert("RequestedDate should be filled");
        //    return;
        //}
        if (dynamiccol.list[i].Field_Name == "Sur_Name" && dynamiccol.list[i].Is_Mandatory == 1 && $("#sname").val() == "") {

            // swal("Please Enter Sur Name").then(() => {
            // $("#myModal1").modal('show');
            //$.unblockUI();
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            // });
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }
        if (dynamiccol.list[i].Field_Name == "Gender" && dynamiccol.list[i].Is_Mandatory == 1 && $("input[name='optradio']:checked").val() == null) {

            //swal("Please Enter Gender").then(() => {
            // $("#myModal1").modal('show');
            //$.unblockUI();
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }
        if (dynamiccol.list[i].Field_Name == "Registration_No" && dynamiccol.list[i].Is_Mandatory == 1 && $("#regn").val() == "") {

            //swal("Please Enter RegistratioNo").then(() => {
            // $("#myModal1").modal('show');
            fnMsgAlert('info', '', 'Please Enter ' + dynamiccol.list[i].Field_Alias_Name + '');
            //$.unblockUI();
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;
            //alert("RequestedDate should be filled");
            return;
        }
        if (dynamiccol.list[i].Field_Name == "MDL_Number" && $("#mno").val() != '' && $("#mno").val().length < dynamiccol.list[i].Min_Length) {
            //    swal("Please Enter minimum 1 characters for MDL Number").then(() => {
            fnMsgAlert('info', '', 'Please Enter minimum 1 characters for ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            //  $("#btnshow").show();
            //   });
            flag = false;

            return;
        }
        if (dynamiccol.list[i].Field_Name == "Sur_Name" && $("#sname").val() != '' && $("#sname").val().length < dynamiccol.list[i].Min_Length) {
            //swal("Please Enter minimum 3 characters for Sur Name").then(() => {
            fnMsgAlert('info', '', 'Please Enter minimum 3 characters for ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //});
            flag = false;

            return;
        }

        if (dynamiccol.list[i].Field_Name == "Registration_No" && $("#regn").val() != '' && $("#regn").val().length < dynamiccol.list[i].Min_Length) {
            //swal("Please Enter minimum 3 characters for Registration No").then(() => {
            fnMsgAlert('info', '', 'Please Enter minimum 3 characters for ' + dynamiccol.list[i].Field_Alias_Name + '');
            $("#load").hide();
            $("#btnshow").show();
            //});
            flag = false;

            return;
        }

        if (dynamiccol.list[i].Field_Name == "Customer_Name" && $("#cusname").val() != '' && $("#cusname").val().length > dynamiccol.list[i].Max_Length) {
            // swal("Customer Name can't be more than 300 characters").then(() => {
            fnMsgAlert('info', '', '' + dynamiccol.list[i].Field_Alias_Name + ' cannot be more than 300 characters');
            $("#load").hide();
            $("#btnshow").show();
            // });
            flag = false;

            return;
        }
        if (dynamiccol.list[i].Field_Name == "MDL_Number" && $("#mno").val() != '' && $("#mno").val().length > dynamiccol.list[i].Max_Length) {
            // swal("MDL Number can't be more than 30 characters").then(() => {
            fnMsgAlert('info', '', '' + dynamiccol.list[i].Field_Alias_Name + ' cannot be more than 300 characters');
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;

            return;
        }
        if (dynamiccol.list[i].Field_Name == "Sur_Name" && $("#sname").val().length > dynamiccol.list[i].Max_Length) {
            // swal("Sur Name can't be more than 300 characters").then(() => {
            fnMsgAlert('info', '', '' + dynamiccol.list[i].Field_Alias_Name + ' cannot be more than 300 characters');
            $("#load").hide();
            $("#btnshow").show();
            //  });
            flag = false;

            return;
        }

        if (dynamiccol.list[i].Field_Name == "Registration_No" && $("#regn").val().length > dynamiccol.list[i].Max_Length) {
            //swal("RegistrationNo can't be more than 50 characters").then(() => {
            fnMsgAlert('info', '', '' + dynamiccol.list[i].Field_Alias_Name + ' cannot be more than 50 characters');
            $("#load").hide();
            $("#btnshow").show();
            // });
            flag = false;

            return;
        }



    }
    return flag;

}
function fnInputCityName() {
    debugger;
    //fngetcity();
    var flag = false;
    cityname = $('#additionalcity').val();
    if (cityname == '') {
        fnMsgAlert('info', '', 'Please Enter a city Name');
        return false;
    }
    for (i = 0; i < CityList.length; i++) {
        if (cityname.toUpperCase().replace(/[^A-Z0-9]/ig, ' ') == CityList[i].City_Name.toUpperCase().replace(/[^A-Z0-9]/ig, ' ')) {
            flag = true;
        }
    }
    if (flag == true) {
        fnMsgAlert('info', '', 'Entered City Name Already Exists');
        $('#additionalcity').val('');
    }
    else {

        fnsavecity();
    }
}

function fnsavecity() {
    debugger;
    //var UserCode = UserCode;
    var cityname = $('#additionalcity').val().replace(/[^A-Z0-9]/ig, ' ');
    //  cityname = $('#additionalcity').val();

    $.ajax({
        type: 'POST',
        url: '../CMdoctor/InsertNewCityDetails',
        data: "cityname=" + cityname + "&UserCode=" + UserCode,
        async: false,
        success: function () {
            fnMsgAlert('info', '', 'New City is Added Successfully .');

            $("#cts").html(cityname)
            $('#additionalcity').val('');
            $("#additionalcity").hide();
            $("#btnshowcity").hide();
            fngetcity();

        }

    });

}
