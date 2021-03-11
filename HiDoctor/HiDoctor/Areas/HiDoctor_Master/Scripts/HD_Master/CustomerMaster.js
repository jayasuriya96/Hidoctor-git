/*
* Created By Rajeswari R
* CustomerMaster.js
*/

/*
* Global Variables
*/
var categoryJson_g = "";
var specialityJson_g = "";
var subRegion_g = "";
var customerGroup_g = "";
var depot_g = "";
var productJson_g = "";
var place = "";
var lat = "0";
var log = "0";
var groupAr = new Array();
var docProductRowNum = "0";
var arProduct = new Array;
var rowNumber = "0";
var oldSelecetdRow = "";

var geocoder;
//var map;
var marker;
var pageNum = 0;

/* Load Map*/
var geocoder;
var map;
//var infowindow = new google.maps.InfoWindow();
var infowindow="";
var marker;

/*Added for Check mandatory column and duplicate column*/
var REGISTRATION_NO = 'REGISTRATION_NO', LOCAL_AREA = 'LOCAL_AREA', MOBILE = 'MOBILE', PIN_CODE = 'PIN_CODE', HOSPITAL_NAME = 'HOSPITAL_NAME';
var QUALIFICATION = 'QUALIFICATION', GENDER = 'GENDER', SUR_NAME = 'SUR_NAME', CITY = 'CITY', PHONE = 'PHONE', LOCAL_AREA = 'LOCAL_AREA', MOBILE = 'MOBILE';
var EMAIL = 'EMAIL', REGISTRATION_NUMBER = 'REGISTRATION_NUMBER', TIN_NUMBER = 'TIN_NUMBER', DRUG_LICENSE_NUMBER1 = 'DRUG_LICENSE_NUMBER1';
var DEPOT_CODE = 'DEPOT_CODE', CST_NUMBER = 'CST_NUMBER';
var registrationNamearr = [];
var phonenOarr = [];
var registrationNowithKeyvaluepair = new Array();
var mobileNowithkeyvaluepair = new Array();
var jsonCheckDuplicate_g = "";
var jsonMandatory_g = "";
var duplicatecountonkeycolumn = 0;
var duplicateValue = false;
var genderJson_g = new Array("M", "F");
//Error indication for Error message when submitting
function fnIndicateError(id) {

    var currentRow = id.parentsUntil('tbody');
    $(id).addClass('cls_Errorindication');
    $(currentRow).addClass('cls-ErrorindicationRow');
    // $(id).focus();
}
//function used to Remove the Error Indication
function fnRemoveIndication(obj) {
    if ($(obj).hasClass('cls_Errorindication')) {
        $(obj).removeClass('cls_Errorindication')
    }
    //  $('#tblBulkDoctor tbody tr').removeClass('cls-ErrorindicationRow');
}
//Error indication for Error message when onblur
function fnIndicateErrorforColumn(id) {
    var currentRow = id.parentsUntil('tbody');
    $(id).addClass('cls_Errorindication');

}
//function used to Remove the Error Indication
function fnRemoveIndicationforColumn(obj) {
    if ($(obj).hasClass('cls_Errorindication')) {
        $(obj).removeClass('cls_Errorindication')
    }
    $(obj).removeAttr("title");
    //  $('#tblBulkDoctor tbody tr').removeClass('cls-ErrorindicationRow');
}
//Used to indicate the Duplicate Enter Row
function fnErrorindicationforDuplicateRow(i, s) {

    var currentRow = i.parentsUntil('tbody');
    var duplicateRow = s.parentsUntil('tbody');

    $(currentRow).addClass('cls-ErrorindicationRow');
    $(duplicateRow).addClass('cls-ErrorindicationRow');
}

//Regular expression
//Registration No
var specialcharecterforregistrationNo_g = "-_()";
//Hospital Name,city and Local area
var specialchracterforHospitalname_g = "-_()/.&,";
//Sur Name,qualification
var specialcharacterforSurname_g = '.,()';
//Local Area 
var specialCharacterforLocalArea_g = '.-';
//Validate Mobile No
function fnValidateMobileNumber(obj, device) {
    if ($.trim($(obj).val()) != '') {
        if (device.toUpperCase() == "MOBILE") {
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }
        else {
            var phoneNumberPattern = /^\d+$/
            return phoneNumberPattern.test($.trim($(obj).val()));
        }
    }
    return true;
}
function fnBingMapIntialize() {
    curLat = 28.633349;
    curLng = 77.222557;
    map = new Microsoft.Maps.Map(
                           document.getElementById("map_canvas"),
                              {
                                  credentials: "VdT3XM3RpQFPOHCQ252X~7Dgh7zzr8aT2-MB_Vwai2g~AuwOT8eNvsraB6BfV0g2P79XjRZ8ApxEkRgtoh1v5EjGEayfRr3M9Iialwrcud2J",
                                  center: new Microsoft.Maps.Location(curLat, curLng),
                                  mapTypeId: Microsoft.Maps.MapTypeId.road,
                                  zoom: 12
                              });
    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        var options = {
            maxResults: 4,
            map: map
        };
        var manager = new Microsoft.Maps.AutosuggestManager(options);
        manager.attachAutosuggest('#txtMap', '#dvMap', selectedSuggestion);
    });
}
function fnBindBingMap(lat, lng) {
    BinginfoWindow = new Microsoft.Maps.Infobox();
    BinginfoWindow.setMap(null);
    $("#hdnLatVal").val('0');
    $("#hdnLngVal").val('0');
    $(".Infobox").remove();
    if (lat == '') {
        //lat = '12.98267';
        lat = "20.593684";
    }
    if (lng == '') {
        lng = '78.962880';
    }
    if (lat == '0') {
        // lat = '12.98267';
        lat = "20.593684";
    }
    if (lng == '0') {
        // log = '80.26338';
        lng = '78.962880';
    }
    if (lat != undefined || lng != undefined) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            var searchManager = new Microsoft.Maps.Search.SearchManager(map);
            var reverseGeocodeRequestOptions = {
                location: new Microsoft.Maps.Location(lat, lng),
                callback: function (result) {
                    debugger;
                    $("#txtMap").val(result.address.formattedAddress);

                    map.entities.clear();
                    //var latLon = new Microsoft.Maps.Location(lat, lng);
                    //var pin = new Microsoft.Maps.Pushpin(latLon, { text: '1', draggable: true });
                    BinginfoWindow = new Microsoft.Maps.Infobox(reverseGeocodeRequestOptions.location,
                       {
                           title: 'Details',
                           description: '<h3>Position:' + lat.toString() + ',' + lng.toString() + '</h3>' + result.address.formattedAddress + '<br />'
                       });
                    BinginfoWindow.setMap(null);
                    map.entities.push(new Microsoft.Maps.Pushpin(reverseGeocodeRequestOptions.location));
                    BinginfoWindow.setMap(map);
                    $("#hdnLatVal").val(lat);
                    $("#hdnLngVal").val(lng);
                    map.setView({ center: reverseGeocodeRequestOptions.location, zoom: 10 });
                }
            };
            searchManager.reverseGeocode(reverseGeocodeRequestOptions);
        });

    }
}
function selectedSuggestion(suggestionResult) {
    $("#hdnLatVal").val('0');
    $("#hdnLngVal").val('0');
    BinginfoWindow = new Microsoft.Maps.Infobox();
    BinginfoWindow.setMap(null);
    $(".Infobox").remove();
    map.entities.clear();
    map.setView({ center: suggestionResult.location, zoom: 10 });
    var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
    map.entities.push(pushpin);
    BinginfoWindow = new Microsoft.Maps.Infobox(suggestionResult.location,
  {
      title: 'Details',
      description: '<h3>Position:' + suggestionResult.location.latitude + ',' + suggestionResult.location.longitude + '</h3>' + suggestionResult.formattedSuggestion + '<br />'
  });
    $("#hdnLatVal").val(suggestionResult.location.latitude);
    $("#hdnLngVal").val(suggestionResult.location.longitude);
    BinginfoWindow.setMap(map);
}
function fnBindMap(lat, log) {
    // $("#dvAjaxLoad").show();
    if (lat == '') {
        //lat = '12.98267';
        lat = "20.593684";
    }
    if (log == '') {
        log = '78.962880';
    }
    if (lat == '0') {
        // lat = '12.98267';
        lat = "20.593684";
    }
    if (log == '0') {
        // log = '80.26338';
        log = '78.962880';
    }

    var defaultBounds = new google.maps.LatLngBounds(
           new google.maps.LatLng(lat, log),
          new google.maps.LatLng(lat, log));

    var input = document.getElementById("txtMap");
    var mapOptions = {
        center: new google.maps.LatLng(lat, log),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, log),
        map: map
    });

    //$("#dvAjaxLoad").hide();
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        input.className = '';
        place = autocomplete.getPlace();
        if (place != undefined) {
            if (!place.geometry) {
                // Inform the user that the place was not found and return.
                input.className = 'notfound';
                return;
            }
        }
        else {
            input.className = 'notfound';
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        var image = new google.maps.MarkerImage(
                              place.icon,
                              new google.maps.Size(71, 71),
                              new google.maps.Point(0, 0),
                              new google.maps.Point(17, 34),
                              new google.maps.Size(35, 35));
        marker.setIcon(image);
        marker.setPosition(place.geometry.location);

        var address = '';
        if (place.address_components) {
            address = [
                              (place.address_components[0] && place.address_components[0].short_name || ''),
                              (place.address_components[1] && place.address_components[1].short_name || ''),
                              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);

    });

    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + log + '&sensor=true',
        success: function (data) {
            //  alert(data.results[4].formatted_address);
            $("#txtMap").val(data.results[4].formatted_address);

        }
    });

}
/* Load Map*/
function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
}

/*
* Get the depending master data for customerMasterexample Category,Specilaity,depot,customergroup,subregion
*/
function fnGetDoctorCategory() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/DoctorMaster/GetDoctorCategory/',
        type: "POST",
        data: "DateTime=" + new Date().getTime() + "&selectedRegionCode=" + $("#Region_Code").val(),

        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                var category = "[";
                for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                    category += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].Category_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].Category_Code + "" + '"' + "}";
                    if (i < jsData.Tables[0].Rows.length - 1) {
                        category += ",";
                    }
                }
                category += "];";
                categoryJson_g = eval(category);
                //  autoComplete(categoryJson_g, "Category", "CategoryCode", "autoCategory");
            }
            if (jsData.Tables[1].Rows.length > 0) {
                var speciality = "[";
                for (var i = 0; i < jsData.Tables[1].Rows.length; i++) {
                    speciality += "{label:" + '"' + "" + jsData.Tables[1].Rows[i].Speciality_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[1].Rows[i].Speciality_Code + "" + '"' + "}";
                    if (i < jsData.Tables[1].Rows.length - 1) {
                        speciality += ",";
                    }
                }
                speciality += "];";
                specialityJson_g = eval(speciality);
                //autoComplete(specialityJson_g, "Speciality_Code", "SpecialityCode", "autoSpeciality");
            }
            if (jsData.Tables[2].Rows.length > 0) {
                var subRegion = "[";
                for (var i = 0; i < jsData.Tables[2].Rows.length; i++) {
                    subRegion += "{label:" + '"' + "" + jsData.Tables[2].Rows[i].Subregion_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[2].Rows[i].Subregion_Code + "" + '"' + "}";
                    if (i < jsData.Tables[2].Rows.length - 1) {
                        subRegion += ",";
                    }
                }
                subRegion += "];";
                subRegion_g = eval(subRegion);
                // autoComplete(subRegion_g, "Subregion_Code", "hdnSubRegion", "autoSubRegion");
            }
            if (jsData.Tables[3].Rows.length > 0) {
                var customerGroup = "[";
                for (var i = 0; i < jsData.Tables[3].Rows.length; i++) {
                    customerGroup += "{label:" + '"' + "" + jsData.Tables[3].Rows[i].Customer_Group_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[3].Rows[i].Customer_Group_Code + "" + '"' + "}";
                    if (i < jsData.Tables[3].Rows.length - 1) {
                        customerGroup += ",";
                    }
                }
                customerGroup += "];";
                customerGroup_g = eval(customerGroup);
                //  autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
            }
            if (jsData.Tables[4].Rows.length > 0) {
                var depot = "[";
                for (var i = 0; i < jsData.Tables[4].Rows.length; i++) {
                    depot += "{label:" + '"' + "" + jsData.Tables[4].Rows[i].Depot_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[4].Rows[i].Depot_Code + "" + '"' + "}";
                    if (i < jsData.Tables[4].Rows.length - 1) {
                        depot += ",";
                    }
                }
                depot += "];";
                depot_g = eval(depot);
                //  autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");
            }
            fnCreateEntityColumns();
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}
//this is the method to check the array existance:
function fnInclude(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == obj) return true;
    }

}


/*
* Create input fields using customer entity table for customer Single Add 
*/
function fnCreateEntityColumns() {
    var content = "";
    var fullContent = "";
    if (entityColumns_g.Tables[0].Rows.length > 0) {
        var dateClass = "";
        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
            if ($.inArray(entityColumns_g.Tables[0].Rows[i].Group_Name, groupAr) == -1) {
                groupAr.push(entityColumns_g.Tables[0].Rows[i].Group_Name);
            }
        }
        for (var j = 0; j < groupAr.length; j++) {
            var disGroupJson = jsonPath(entityColumns_g, "$.Tables[0].Rows[?(@.Group_Name=='" + groupAr[j] + "')]");
            if (disGroupJson != false) {
                var visibleCnt = 0;
                if (disGroupJson.length > 0) {
                    content += "<div style='border-bottom:1px solid #f2f2f2'>";
                    for (var k = 0; k < disGroupJson.length; k++) {
                        if (disGroupJson[k].Display_Option.toUpperCase() == 'Y') {
                            visibleCnt++;
                        }
                    }
                    if (visibleCnt > 0) {
                        content += "<div class='fontcolor' style='width: 100%; cursor: pointer;' onclick='fnFade('dv_" + j + "');'>" + groupAr[j] + "</div>";
                        content += "<div style='width: 100%;float:left;'>";
                    }
                    else {
                        content += "<div class='fontcolor' style='width: 100%; cursor: pointer; display:none;'  id='dvGroup_" + j + "'  onclick='fnFade('dv_" + j + "');'>" + groupAr[j] + "</div>";
                        content += "<div style='width: 100%;float:left;'>";
                    }
                    for (var a = 0; a < disGroupJson.length; a++) {
                        if (disGroupJson[a].Field_Name.toUpperCase() != "CUSTOMER_NAME") {
                            if (disGroupJson[a].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {
                                if (disGroupJson[a].Field_Name.toUpperCase() == "DOB" || disGroupJson[a].Field_Name.toUpperCase() == "ANNIVERSARY_DATE") {
                                    dateClass = 'DOBDatePicker';
                                }
                                else {
                                    dateClass = 'datepicker';
                                }
                            }
                            else {
                                dateClass = '';
                            }
                            if (disGroupJson[a].Display_Option.toUpperCase() == 'Y') {
                                if (disGroupJson[a].Field_Name.toUpperCase() == 'SPECIALITY_CODE') {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer' id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='autoSpeciality'  onfocus='fnShowEntityBackgroundtxt(this);' onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'/>";
                                    content += "<input type='hidden' id='hdnSpecialityCode'/></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                                else if (disGroupJson[a].Field_Name.toUpperCase() == 'CATEGORY') {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='autoCategory'   onfocus='fnShowEntityBackgroundtxt(this);'  onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'/>";
                                    content += "<input type='hidden' id='hdnCategory'/></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                                else if (disGroupJson[a].Field_Name.toUpperCase() == 'SUBREGION_CODE') {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div  class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='autoSubRegion'  onfocus='fnShowEntityBackgroundtxt(this);'  onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'/>";
                                    content += "<input type='hidden' id='hdnSubRegionCode'/></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                                else if (disGroupJson[a].Field_Name.toUpperCase() == 'CUSTOMER_GROUP') {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div  class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='autoCustomerGroup'  onfocus='fnShowEntityBackgroundtxt(this);'  onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'/>";
                                    content += "<input type='hidden' id='hdnCustomerGroup'/></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                                else if (disGroupJson[a].Field_Name.toUpperCase() == 'DEPOT_CODE') {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div  class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='autoDepot'  onfocus='fnShowEntityBackgroundtxt(this);'  onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'/>";
                                    content += "<input type='hidden' id='hdnDepotCode'/></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                                else {
                                    content += "<div style='width:100%' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                    content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%' ><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                    content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                    content += "<div  class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'>";
                                    content += "<input type='text' id='txt_" + disGroupJson[a].Field_Name + "' class='" + dateClass + "' maxlength=" + disGroupJson[a].Len + "  onkeypress='fnShowEntityBackgroundtxt(this);'  onfocus='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);' value='" + disGroupJson[a].COLUMN_DEFAULT + "'></div>";
                                    content += "<div style='clear:both'></div></div>";
                                }
                            }
                            else {
                                content += "<div style='width:100%;display:none;' id='dvMain_" + disGroupJson[a].Field_Name + "' class='dvMain clsdvfocus'>";
                                content += "<div class='dvImgContainer'  id='dvImg_" + disGroupJson[a].Field_Name + "' onclick='fnShowEntityBackground(this);'><div style='width: 100%'><div class='img_" + disGroupJson[a].Field_Name + " dvImg'></div><div class='dvImgText'>" + disGroupJson[a].Field_Alias_Name + "</div><div class='clearfix'></div></div><div class='clearfix'></div></div>";
                                content += "<div id='dvlbl_" + disGroupJson[a].Field_Name + "' style='display:none;' class='dvLabel'>" + disGroupJson[a].Field_Alias_Name + "</div>";
                                content += "<div  class='dvText' id='dvtxt_" + disGroupJson[a].Field_Name + "'><input type='text' id='txt_" + disGroupJson[a].Field_Name + "'  class='" + dateClass + "' maxlength=" + disGroupJson[a].Len + "  onfocus='fnShowEntityBackgroundtxt(this);'  onkeypress='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);' value='" + disGroupJson[a].COLUMN_DEFAULT + "'/></div>";
                                content += "<div style='clear:both'></div></div>";
                            }

                        }
                    }
                    content += "</div>";
                    if (groupAr[j].toUpperCase() == "COMMUNICATION INFO") {
                        //// content += " <div style='float: left; width: 100%;'><div id='map_canvas' style='width: 100%; height: 250px; border: 1px solid #f2f2f2;'></div></div>";
                        // content += "<div style='clear: both;'>";
                        content += "<div style='width:100%;'>";
                        content += "<div style='width:30%;float:left;color: #999;' class='dvMain' id='dvSearchDoctor'>Search Doctor location</div><div style='width:50%;float:left;' id='dvMap'>";
                        content += "<input type='text' id='txtMap' placeholder='' /> <input type='hidden' id='hdnLatVal' /><input type='hidden' id='hdnLngVal' /></div>";
                        content += "</div>";
                        content += "<div style='width:100%;padding-left: 10%;'><div style='clear:both'></div>";
                        content += "<div id='map_canvas' style='width: 85%;display: block; height: 250px; border: 1px solid #f2f2f2;'> <h2 style='text-align:center; padding-top:100px;'>Temporarily map is unavailable</h2></div><div style='clear:both'></div></div>";
                        //content += "<div style='width:100%' id='dvMain_Map' class='dvMain clsdvfocus'>";
                        //content += "<div class='dvImgContainer'  id='dvImg_Map' onclick='fnShowEntityBackground(this);'><div ><div class='img_Map dvImg'></div><div class='dvImgText'>Search Doctor location</div></div></div>";
                        //content += "<div id='dvlbl_Map' style='display:none;' class='dvLabel'>Search Doctor location</div>";
                        //content += "<div  class='dvText' id='dvtxt_Map'><input type='text' id='txt_Map'  onkeypress='fnShowEntityBackgroundtxt(this);'  onfocus='fnShowEntityBackgroundtxt(this);' onblur='fnHideEntityBackgroundtxt(this);'></div>";
                        //content += "<div style='clear:both'></div></div>";
                    }
                    //content += "<div style='clear:both'></div>
                    content += "<div style='clear:both'></div></div>";
                }
            }
        }
        $('#dvContent').html(content);
        if (currMap.toUpperCase() == "GOOGLE") {
            fnBindMap('0', '0');
        }
        if (currMap.toUpperCase() == "BING")
        {
        fnBingMapIntialize();
        fnBindBingMap('0', '0');
        }
        autoComplete(categoryJson_g, "txt_Category", "hdnCategory", "autoCategory");
        autoComplete(specialityJson_g, "txt_Speciality_Code", "hdnSpecialityCode", "autoSpeciality");
        autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegionCode", "autoSubRegion");
        autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
        autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");
        if (categoryJson_g == '') {
            $(".autoCategory").attr('disabled', 'disabled');
        }
        if (specialityJson_g == '') {
            $(".autoSpeciality").attr('disabled', 'disabled');
        }
        if (subRegion_g == '') {
            $(".autoSubRegion").attr('disabled', 'disabled');
        }
        if (customerGroup_g == '') {
            $(".autoCustomerGroup").attr('disabled', 'disabled');
        }
        if (depot_g == '') {
            $(".autoDepot").attr('disabled', 'disabled');
        }
        $(".datepicker").datepicker({
            changeMonth: true,
            changeYear: true,
            dateFormat: 'dd/mm/yy',
            yearRange: '-80:+30'
        });
        $(".clsdvfocus").mouseover(function () {
            fnShowBackground(this);
        })
        var year = new Date(currentDate).getFullYear();
        var dobYear = year - 150;
        $(".DOBDatePicker").datepicker({
            dateFormat: 'dd/mm/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: (year - 150) + ':' + (year + 0)
        });
        var fieldContent = "";
        fieldContent += "<table class='data display filterable' style='width: 85%; border: 1px solid #f2f2f2;' id='tblColumns'>";
        for (var c = 0; c < entityColumns_g.Tables[0].Rows.length; c++) {
            if ($("#Entity").val().toUpperCase() == "DOCTOR") {
                if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "SPECIALITY_CODE") {
                    if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CATEGORY") {
                        if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CUSTOMER_NAME") {
                            if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "MDL_NUMBER") {
                                if (entityColumns_g.Tables[0].Rows[c].Display_Option == 'Y') {
                                    fieldContent += "<tr><td><input type='checkbox' value='dvMain_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "^" + entityColumns_g.Tables[0].Rows[c].Group_Name + "' checked='checked' name='chkFields' /></td>";
                                    fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                                }
                                else {
                                    fieldContent += "<tr><td><input type='checkbox' value='dvMain_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "^" + entityColumns_g.Tables[0].Rows[c].Group_Name + "'  name='chkFields' /></td>";
                                    fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                                }
                            }
                        }
                    }
                }
            }
            else {
                if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CUSTOMER_NAME") {
                    if (entityColumns_g.Tables[0].Rows[c].Display_Option == 'Y') {
                        fieldContent += "<tr><td><input type='checkbox' value='dvMain_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "^" + entityColumns_g.Tables[0].Rows[c].Group_Name + "' checked='checked' name='chkFields' /></td>";
                        fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                    }
                    else {
                        fieldContent += "<tr><td><input type='checkbox' value='dvMain_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "^" + entityColumns_g.Tables[0].Rows[c].Group_Name + "'  name='chkFields' /></td>";
                        fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                    }
                }
            }
        }
        fieldContent += "</table>";
        $("#dvField").html(fieldContent);

        //$("#tblColumns tr:has(td)").each(function () {
        //    var t = $(this).text().toLowerCase(); //all row text
        //    $("<td class='indexColumn'></td>")
        //     .hide().text(t).appendTo(this);
        //}); //each tr
        //$("#txtColumnSearch").keyup(function () {
        //    var s = $(this).val().toLowerCase().split(" ");
        //    //show all rows.
        //    $(".filterable tr:hidden").show();
        //    $.each(s, function () {
        //        $(".filterable tr:visible .indexColumn:not(:contains('"
        //    + this + "'))").parent().hide();
        //    }); //each
        //}); //key up.
        $("#dvBtnSave").css('display', '');
    }
}

/*
* Show or hide the fields when click the more fields button
*/
function fnShowHiddenEntity() {
    $("input:checkbox[name=chkFields]").each(function () {
        var dvName = this.value;
        if (this.checked) {
            if (groupAr.length > 0) {
                for (var l = 0; l < groupAr.length; l++) {
                    if (groupAr[l].toUpperCase() == dvName.split('^')[1].toUpperCase()) {
                        $("#dvGroup_" + l).css("display", "");
                    }
                }
                $("#" + dvName.split('^')[0]).css("display", "");
            }
        }
        else {
            if (groupAr.length > 0) {
                for (var l = 0; l < groupAr.length; l++) {
                    if (groupAr[l].toUpperCase() == dvName.split('^')[1].toUpperCase()) {
                        //  $("#dvGroup_" + l).css("display", "none");
                    }
                }
                $("#" + dvName.split('^')[0]).css("display", "none");

            }
        }
    });
    $("#dvColumns").overlay().close();
}
/*
* show doctor product mapping button if the entity is doctor. hide other than doctor entity
*/
function fnShowDocProduct() {
    var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/MarketingCampaign/DoctorProductMapping')]");
    if (disDCRJson != false) {
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            $("#dvMainDocPro").css('display', '')
        }
        else {
            $("#dvMainDocPro").css('display', 'none')
        }
    }
    else {
        fnMsgAlert("info", "Doctor Master", "Dear User, You have not access for Doctor Product Mapping. Please contact administrator.");
    }

}

/*
* Doctor product mappind default two rows
*/
function fnDoctorProduct(jsonData) {
    $("#dvDoctorProduct").html('');
    var content = "";
    content += "<table style='width:100%; border:1px solid #f2f2f2;overflow:auto;' id='tblDocProduct'>";
    content += "<thead style='width:100%;background-color:#F2F2F2'><tr style='height:30px;'><th style='width:60%;text-align:center;'>Product Name</th>";
    content += "<th style='width:10%;text-align:center;'>Yield per day</th><th style='width:10%;text-align:center;'>Potential per day</th>";
    content += "<th style='width:10%;text-align:center;'>Priority</th><th>Delete</th></tr></thead><tbody style='width:100%'>";
    if (jsonData != '') {
        for (var c = 0; c < jsonData.Tables[0].Rows.length; c++) {
            content += "<tr id='tr_" + c + 1 + "'>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtProductName_" + (parseFloat(c) + 1) + "' style='width:90%' value='" + jsonData.Tables[0].Rows[c].Product_Name + "' onblur='fnCreateDocProductNewRow(" + parseFloat(c) + 1 + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct'/><input type='hidden' id='hdnProductCode_" + (parseFloat(c) + 1) + "'/></td>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtYieldQty_" + (parseFloat(c) + 1) + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");'  value='" + jsonData.Tables[0].Rows[c].Support_Quantity + "'/></td>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtPotentialQty_" + (parseFloat(c) + 1) + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10  onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");' value='" + jsonData.Tables[0].Rows[c].Potential_Quantity + "'/></td>";
            if (jsonData.Tables[0].Rows[c].Product_Priority_No == null) {
                content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + (parseFloat(c) + 1) + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\"); fnValidatePriority(this);' value=''/></td>";
            }
            else {
                content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + (parseFloat(c) + 1) + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\"); fnValidatePriority(this);' value='" + jsonData.Tables[0].Rows[c].Product_Priority_No + "'/></td>";
            }
            content += "<td class='tblDoctorTr'><div class='docProDelete'  id='tdDelete_" + (parseFloat(c) + 1) + "' onclick='fnDelete(this);'></div></td>";
            content += "</tr>";
            docProductRowNum = (parseFloat(c) + 1);
        }
        content += "</tbody></table>";
        $("#dvDoctorProduct").html(content);
        docProductRowNum = parseFloat(docProductRowNum) + 1;
        fnCreateDocProductNewRow('');
    }
    else {
        for (var c = 1; c <= 2; c++) {
            content += "<tr id='tr_" + c + "'>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtProductName_" + c + "' style='width:90%' onblur='fnCreateDocProductNewRow(" + parseFloat(c) + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct'/><input type='hidden' id='hdnProductCode_" + c + "'/></td>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtYieldQty_" + c + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");'/></td>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtPotentialQty_" + c + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");'/></td>";
            content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + c + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Priority\"); fnValidatePriority(this);'/></td>";
            content += "<td class='tblDoctorTr' ><div class='docProDelete' id='tdDelete_" + c + "' onclick='fnDelete(this);'></div></td>";
            content += "</tr>";
        }
        content += "</tbody></table>";
        $("#dvDoctorProduct").html(content);
        docProductRowNum = "3";
    }
    autoComplete(productJson_g, "txtProductName", "hdnProductCode", "autoProduct");
}
/*
* Create new row for doctor product mapping
*/
function fnCreateDocProductNewRow(rowId) {
    if (rowId != '') {
        var number = parseInt(docProductRowNum) - 1;
        var id = number;
        if (rowId != id) {
            return;
        }
    }
    var rCnt = document.getElementById("tblDocProduct").getElementsByTagName("tr").length;
    var newRow = document.getElementById("tblDocProduct").insertRow(parseInt(rCnt));
    var tdDocProd = newRow.insertCell(0);
    $(tdDocProd).addClass('tblDoctorTr');
    var tdYieldQty = newRow.insertCell(1);
    $(tdYieldQty).addClass('tblDoctorTr');
    var tdPotentialQty = newRow.insertCell(2);
    $(tdPotentialQty).addClass('tblDoctorTr');
    var tdPriority = newRow.insertCell(3);
    $(tdPriority).addClass('tblDoctorTr');
    var tdDelete = newRow.insertCell(4);
    $(tdDelete).addClass('tblDoctorTr');
    $(tdDocProd).html("<input type='text' id='txtProductName_" + docProductRowNum + "' style='width:90%' onblur='fnCreateDocProductNewRow(" + docProductRowNum + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct'/><input type='hidden' id='hdnProductCode_" + docProductRowNum + "'/>");
    $(tdYieldQty).html("<input type='text' id='txtYieldQty_" + docProductRowNum + "'  style='text-align:right;padding-right:5px;width:33px !important;' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");'/>");
    $(tdPotentialQty).html("<input type='text' id='txtPotentialQty_" + docProductRowNum + "' style='text-align:right;padding-right:5px;width:33px  !important;' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Quantity\");'/>");
    $(tdPriority).html("<input type='text' id='txtPriority_" + docProductRowNum + "' style='text-align:right;padding-right:5px;width:33px; !important' maxlength=10 onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Priority\"); fnValidatePriority(this);'/>");
    $(tdDelete).html("<div class='docProDelete' id='tdDelete_" + docProductRowNum + "' onclick='fnDelete(this);'></div>");
    docProductRowNum = parseInt(docProductRowNum) + 1;
    autoComplete(productJson_g, "txtProductName", "hdnProductCode", "autoProduct");
    // fnValidateAutofill(this, productJson_g, 'txtProductName', 'hdnProductCode');
}
/*
* Get the customer details for the selected region and selected mode
*/
function fnGetCustomerEntityDetails() {
    fnClearEntityDetails();
    $('#dvRightPanel input').removeAttr('disabled');
    $("#dvDoctors").html('');
    if ($("#Region_Code").val() == '') {
        fnMsgAlert('info', 'Validate', 'Please select region name then proceed');
        return;
    }
    //fnClearEntityDetails();
    var count = 0;
    var mode = "";
    var flag = true;
    $("input:checkbox[name=chkMode]").each(function () {
        if (this.checked) {
            if ($(this).val() == 'ALL') {
                flag = false;
            }
            mode += "^" + $(this).val() + "^,";
            count = parseInt(count) + 1;
        }
    });
    mode = mode.slice(0, -1);
    if (flag == false) {
        mode = 'ALL';
    }
    if (count > 0) {
        $("#dvAjaxLoad").show();
        $.ajax({
            url: '../HiDoctor_Master/DoctorMaster/GetCustomers/',
            type: "POST",
            data: "Mode=" + mode + "&DateTime=" + new Date().getTime() + "&RegionCode=" + $("#Region_Code").val() + "&EntityName=" + $("#Entity").val() + "&PageName=SINGLE",
            success: function (jsData) {
                $("#dvAjaxLoad").hide();
                if (jsData != null && jsData != undefined) {
                    $("#dvDoctors").html(jsData);
                    $("#tblDoctor_info").html('');
                }

                $.ajax({
                    url: '../HiDoctor_Master/DoctorMaster/GetSalesProductByRegion/',
                    type: "POST",
                    data: "RegionCode=" + $("#Region_Code").val() + "",
                    success: function (jsData) {
                        $("#dvAjaxLoad").hide();
                        jsData = eval('(' + jsData + ')');
                        if (jsData.Tables[0].Rows.length > 0) {
                            var products = "[";
                            for (var i = 0; i < jsData.Tables[0].Rows.length; i++) {
                                products += "{label:" + '"' + "" + jsData.Tables[0].Rows[i].Product_Name + "" + '",' + "value:" + '"' + "" + jsData.Tables[0].Rows[i].Product_Code + "" + '"' + "}";
                                if (i < jsData.Tables[0].Rows.length - 1) {
                                    products += ",";
                                }
                            }
                            products += "];";
                            productJson_g = eval(products);
                            fnDoctorProduct('');

                            fnBindAllProducts();
                            $('#main').unblock();
                        }
                        else {
                            $('#main').unblock();
                        }
                    },
                    error: function () {
                        $('#main').unblock();
                        // $("#dvAjaxLoad").hide();
                    }
                });

            },
            error: function () {
                //$("#dvAjaxLoad").hide();
                $('#main').unblock();
            }
        });
    }
    else {
        $('#main').unblock();
    }
}

/*
* Bind all products 
*/
function fnBindAllProducts() {
    if (productJson_g != '') {
        var product = "";
        product += "<table class='data display filterable' style='width: 85%; border: 1px solid #f2f2f2;' id='tblAllProducts'>";
        for (var p = 0; p < productJson_g.length; p++) {
            product += "<tr><td ><input type='checkbox' value='" + productJson_g[p].value + "' id='td_Pro_Code_" + p + "' name='chkProducts' onclick='fnClearProArray(this);' /></td>";
            product += "<td id='td_Pro_Name_" + p + "'>" + productJson_g[p].label + "</td></tr>";
        }
        product += "</table>";
        $("#dvAllProducts").html(product);

        $("#tblAllProducts tr:has(td)").each(function () {
            var t = $(this).text().toLowerCase(); //all row text
            $("<td class='indexColumn'></td>")
             .hide().text(t).appendTo(this);
        }); //each tr
        $("#txtProductSearch").keyup(function () {
            var s = $(this).val().toLowerCase().split(" ");
            //show all rows.
            $(".filterable tr:hidden").show();
            $.each(s, function () {
                $(".filterable tr:visible .indexColumn:not(:contains('"
            + this + "'))").parent().hide();
            }); //each
        }); //key up.
    }
}
/*
* Show all products while click the show products button. 
*/


function fnShowAllProducts() {
    var proCnt = $("#tblDocProduct tbody tr").length;
    arProduct = new Array;
    for (var i = 1; i <= proCnt ; i++) {
        if ($("#txtProductName_" + i) != null) {
            if ($("#hdnProductCode_" + i).val() != '') {
                if ($.inArray($("#hdnProductCode_" + i).val(), arProduct) == -1) {
                    arProduct.push($("#txtProductName_" + i).val() + "^" + $("#hdnProductCode_" + i).val() + "^" + $("#txtYieldQty_" + i).val() + "^" + $("#txtPotentialQty_" + i).val() + "^" + $("#txtPriority_" + i).val());
                }
            }
        }
    }
    if (arProduct.length > 0) {
        $("input:checkbox[name=chkProducts]").each(function () {
            var tdName = this.value;
            for (var j = 0; j < arProduct.length; j++) {
                if (arProduct[j].split('^')[1] == tdName) {
                    this.checked = true;
                }
            }

        });
    }
    else {
        $("input:checkbox[name=chkProducts]").prop('checked', false);
    }
    $("#dvProducts").overlay().load();
}
/*
* while deselect the selected product clear that product from the common product array
*/
function fnClearProArray(obj) {
    if (obj.checked) {

    }
    else {
        var productCode = obj.value;
        for (var i = 0; i < arProduct.length; i++) {
            if (arProduct[i].split('^')[1] == productCode) {
                arProduct.splice(i, 1);
                break;
            }
        }
    }
}

/*
* bind the selected product in the doctor product mapping table
*/
function fnBindSelectedProducts() {
    $("#dvDoctorProduct").html('');
    docProductRowNum = "1";
    var content = "";
    content += "<table style='width:100%; border:1px solid #f2f2f2;overflow:auto;' id='tblDocProduct' border='1'>";
    content += "<thead style='width:100%;background-color:#F2F2F2'><tr style='height:30px;'><th style='width:60%;padding-left:10px;text-align:left;'>Product Name</th>";
    content += "<th style='width:10%;padding-left:10px;text-align:center;'>Yield per day</th>";
    content += "<th style='width:10%;padding-left:10px;text-align:center;'>Potential per day</th>";
    content += "<th style='width:10%;padding-left:10px;text-align:center;'>Priority</th>";
    content += "<th style='padding-left:10px;text-align:center;'>Delete</th>";
    content += "</tr></thead><tbody style='width:100%'>";
    for (var i = 0; i < arProduct.length ; i++) {
        content += "<tr id='tr_" + docProductRowNum + "'>";
        content += "<td class='tblDoctorTr'><input type='text' id='txtProductName_" + docProductRowNum + "' onblur='fnCreateDocProductNewRow(" + docProductRowNum + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct' value='" + arProduct[i].split('^')[0] + "'/><input type='hidden' id='hdnProductCode_" + docProductRowNum + "' value='" + arProduct[i].split('^')[1] + "'/></td>";
        content += "<td class='tblDoctorTr'><input type='text' id='txtYieldQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;width:33px !important;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;' value='" + arProduct[i].split('^')[2] + "'/></td>";
        content += "<td class='tblDoctorTr'><input type='text' id='txtPotentialQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;width:33px !important;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;' value='" + arProduct[i].split('^')[3] + "'/></td>";
        content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;width:33px !important;' onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Priority\"); fnValidatePriority(this);' style='width:90% !important;' value='" + arProduct[i].split('^')[4] + "'/></td>";
        content += "<td class='tblDoctorTr' ><div class='docProDelete' id='tdDelete_" + docProductRowNum + "' onclick='fnDelete(this);'></div></td>";
        content += "</tr>";
        docProductRowNum = parseFloat(docProductRowNum) + 1;
    }
    $("input:checkbox[name=chkProducts]").each(function () {
        var tdName = this.value;
        if (this.checked) {
            var productCode = this.value;
            if (arProduct.length > 0) {
                //   if ($.inArray(productCode, arProduct) != -1) {
                var cnt = 0;
                for (var k = 0; k < arProduct.length; k++) {
                    if (arProduct[k].split('^')[1] == productCode) {
                        cnt = parseFloat(cnt) + 1;
                    }
                }
                if (cnt == 0) {
                    content += "<tr id='tr_" + docProductRowNum + "'>";
                    content += "<td class='tblDoctorTr'><input type='text' id='txtProductName_" + docProductRowNum + "' onblur='fnCreateDocProductNewRow(" + docProductRowNum + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct' value='" + $("#" + this.id.replace("td_Pro_Code", "td_Pro_Name")).html() + "'/><input type='hidden' id='hdnProductCode_" + docProductRowNum + "' value='" + productCode + "'/></td>";
                    content += "<td class='tblDoctorTr'><input type='text' id='txtYieldQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;'/></td>";
                    content += "<td class='tblDoctorTr'><input type='text' id='txtPotentialQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;'/></td>";
                    content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Priority\"); fnValidatePriority(this);' style='width:90% !important;'/></td>";
                    content += "<td class='tblDoctorTr' ><div class='docProDelete' id='tdDelete_" + docProductRowNum + "' onclick='fnDelete(this);'></div></td>";
                    content += "</tr>";
                    docProductRowNum = parseInt(docProductRowNum) + 1;
                    // }
                }
            }
            else {
                content += "<tr id='tr_" + docProductRowNum + "'>";
                content += "<td class='tblDoctorTr'><input type='text' id='txtProductName_" + docProductRowNum + "' onblur='fnCreateDocProductNewRow(" + docProductRowNum + ");fnValidateAutofill(this," + 'productJson_g' + ",\"txtProductName\",\"hdnProductCode\");' class='autoProduct' value='" + $("#" + this.id.replace("td_Pro_Code", "td_Pro_Name")).html() + "'/><input type='hidden' id='hdnProductCode_" + docProductRowNum + "' value='" + productCode + "'/></td>";
                content += "<td class='tblDoctorTr'><input type='text' id='txtYieldQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;'/></td>";
                content += "<td class='tblDoctorTr'><input type='text' id='txtPotentialQty_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"Invalid Quantity\");' style='width:90% !important;'/></td>";
                content += "<td class='tblDoctorTr'><input type='text' id='txtPriority_" + docProductRowNum + "' maxlength=10 style='text-align:right;padding-right:5px;' onblur='fnCurrencyFormatCheck(this,\"info\",\"Valiadte\",\"Invalid Priority\"); fnValidatePriority(this);' style='width:90% !important;'/></td>";
                content += "<td class='tblDoctorTr' ><div class='docProDelete' id='tdDelete_" + docProductRowNum + "' onclick='fnDelete(this);'></div></td>";
                content += "</tr>";
                docProductRowNum = parseInt(docProductRowNum) + 1;
            }
        }

    });
    content += "</tbody></table>";
    $("#dvDoctorProduct").html(content);

    //docProductRowNum = parseFloat(docProductRowNum) + 1;
    var number = parseInt(docProductRowNum) - 1;
    fnCreateDocProductNewRow(number);
    autoComplete(productJson_g, "txtProductName", "hdnProductCode", "autoProduct");
    $("#dvProducts").overlay().close();
}
/*
* Get the selected customer details while click the customer table 
*/
function fnBindEntityDetails(rowNo, id) {
    var customerStatus = $(this).attr('td_Customer_Status_' + id).innerHTML;
    if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
        $('#dvRightPanel').show();
        $('#btnAddNew').hide();
    }
    else {
        $('#dvRightPanel input').removeAttr('disabled');
        $('#btnAddNew').show();
    }
    var Mandatoryentity = "";
    var customerNameEdit = fnGetPrivilegeVal("CAN_CHANGE_CUSTOMER_NAME", "NO");
    var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        Mandatoryentity = true;
    }
    $("#dvAjaxLoad").show();
    // fnClearEntityDetails();
    if (oldSelecetdRow == "") {
        var tdLen = $(rowNo).find("td").length;
        for (var j = 0; j < tdLen; j++) {
            $($(rowNo).find("td")[j]).css('background-color', '#f2f2f2');
            $($(rowNo).find("td")[j]).css('font-weight', 'bold');
        }
        oldSelecetdRow = rowNo;
    }
    if (oldSelecetdRow != "") {
        var tdLen = $(oldSelecetdRow).find("td").length;
        for (var j = 0; j < tdLen; j++) {
            $($(oldSelecetdRow).find("td")[j]).css('background-color', '#fff');
            $($(oldSelecetdRow).find("td")[j]).css('font-weight', '');
        }
        oldSelecetdRow = rowNo;
        var tdLen = $(rowNo).find("td").length;
        for (var j = 0; j < tdLen; j++) {
            $($(oldSelecetdRow).find("td")[j]).css('background-color', '#f2f2f2');
            $($(oldSelecetdRow).find("td")[j]).css('font-weight', 'bold');
        }
    }
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "") != null) {

            if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
                if (customerStatus.toUpperCase() == 'APPROVED') {

                    if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").attr("disabled", "disabled");
                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        $("#hdnSpecialityCode").val($("#hdnSpecialityCode_" + id + "").val());
                    }
                    else {
                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        $("#hdnSpecialityCode").val($("#hdnSpecialityCode_" + id + "").val());
                    }
                }
                else {
                    $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                    $("#hdnSpecialityCode").val($("#hdnSpecialityCode_" + id + "").val());
                }
            }

            else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
                var priValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
                if (priValue == "YES") {
                    // var privilegeValue = fnGetPrivilegeVal("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                    if (customerStatus.toUpperCase() == 'APPROVED') {
                        if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").attr("disabled", "disabled");
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                        }
                        else {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                        }
                    }
                    else {
                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                    }
                }

                else {
                    if (customerStatus.toUpperCase() == 'APPROVED') {
                        if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").attr("disabled", "disabled");
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                        }
                        else {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                        }
                    }
                    else {
                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        $("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                    }
                    //$("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                    //$("#hdnCategory").val($("#hdnCategory_" + id + "").val());
                }
            }
            else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'SUBREGION_CODE') {
                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                $("#hdnSubRegionCode").val($("#hdnSubRegionCode_" + id + "").val());
            }
            else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'CUSTOMER_GROUP') {
                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                $("#hdnCustomerGroup").val($("#hdnCustomerGroup_" + id + "").val());
            }
            else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'DEPOT_CODE') {
                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                $("#hdnDepotCode").val($("#hdnDepotCode_" + id + "").val());
            }
            else {
                if ($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html() == '') {
                    $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val('');
                }
                else {
                    if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "MDL_NUMBER") {
                        // var privilegeValue = fnGetPrivilegeVal("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                        if (customerStatus.toUpperCase() == 'APPROVED') {
                            if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").attr("disabled", "disabled");
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            }
                            else {
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            }
                        }
                        else {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        }
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_NAME") {
                        //  var privilegeValue = fnGetPrivilegeVal("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                        if (customerStatus.toUpperCase() == 'APPROVED') {
                            if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").attr("disabled", "disabled");
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            }
                            else {
                                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                            }
                        }
                        else {
                            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                        }
                    }
                    else {

                        $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val($("#td_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + id + "").html());
                    }
                }
            }
        }
    }
    //  $("#Customer_Name").css('color', 'black');

    //var privilegeValue = fnGetPrivilegeVal("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
    if ($("#td_Customer_Status_" + id + "").html().toUpperCase() == "APPROVED" && $("#Entity").val().toUpperCase() == "DOCTOR") {
        if (privilegeValue == "DISABLED" && Mandatoryentity == true) {
            $("#Customer_Name").attr("disabled", "disabled");
        }
    }
    if ($("#td_Customer_Status_" + id + "").html().toUpperCase() == "APPROVED" && $("#Entity").val().toUpperCase() == "DOCTOR") {
        if (customerNameEdit != "YES") {
            $("#Customer_Name").attr("disabled", "disabled");
        }
        else {
            $("#Customer_Name").removeAttr("disabled");
        }
    }
    $("#Customer_Name").val($("#td_Customer_Name_" + id + "").html());
    $("#Customer_Code").val($("#hdnCustomerCode_" + id + "").val());

    if ($("#td_Customer_Status_" + id + "").html().toUpperCase() != 'UNLISTED') {
        $("#hdnMode").val('UPDATE');
    }
    else {
        $("#hdnDCRVisitCode").val($("#hdnDCRVisitCode_" + id + "").val());
    }
    $("#hdnStatus").val($("#td_Customer_Status_" + id + "").html());

    $("#dvAjaxLoad").hide();

    if ($("#hdnCustomerCode_" + id + "").val() != '') {
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            $("#dvAjaxLoad").show();
            $.ajax({
                url: '../HiDoctor_Master/DoctorMaster/GetCustomerDetails/',
                type: "POST",
                data: "CustomerCode=" + $("#hdnCustomerCode_" + id + "").val() + "&RegionCode=" + $("#Region_Code").val() + "",
                success: function (jsCustomer) {
                    jsCustomer = eval('(' + jsCustomer + ')');

                    if (jsCustomer.Tables[0].Rows.length > 0) {


                        fnDoctorProduct(jsCustomer);
                        $("#dvAjaxLoad").hide();
                    }
                    else {

                        fnDoctorProduct('');
                        $("#dvAjaxLoad").hide();
                    }
                },
                error: function () {
                    $("#dvAjaxLoad").hide();
                }
            });
        }
    }
    if (currMap.toUpperCase() == "GOOGLE") {
        fnBindMap($("#hdnLat_" + id + "").val(), $("#hdnLog_" + id + "").val());
    }
    if (currMap.toUpperCase() == "BING") {
        fnBindBingMap($("#hdnLat_" + id + "").val(), $("#hdnLog_" + id + "").val());
    }
    $("#dvAjaxLoad").hide();
}

/*
* Clear all the input fields
*/
function fnClearEntityDetails() {
    if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
        $('#dvRightPanel').hide();
    }
    else {
        $('#dvRightPanel').show();
    }
    if ($("#Region_Code").val() == "") {
        fnMsgAlert('info', 'Region Missing', 'Please select the Region and then proceed');
        return;
    }
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "") != null) {

            if (entityColumns_g.Tables[0].Rows[i].COLUMN_DEFAULT != '') {
                if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() != "DEPOT_CODE") {
                    $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val(entityColumns_g.Tables[0].Rows[i].COLUMN_DEFAULT);
                }
                else {
                    $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val('');
                }
            }
            else {
                $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val('');
            }
        }
    }
    $("#hdnSpecialityCode").val('');
    $("#hdnCategory").val('');
    $("#Customer_Code").val('');
    //  $("#Customer_Name").css('color', '#aaa');
    $("#Customer_Name").val('');
    $("#hdnMode").val('INSERT');
    fnDoctorProduct('');
    $("#dvMainDocPro").css('display', 'none');
    // $("#btnDocProduct").css('display', 'none')
    $("#hdnStatus").val('');
    $("#txtMap").val('');
    if ($("#map_canvas").length > 0) {
        if (currMap.toUpperCase() == "GOOGLE") {
             fnBindMap("0", "0");
        }
        if (currMap.toUpperCase() == "BING") {
            fnBindBingMap("0", "0");
        }
    }
    if (oldSelecetdRow != "") {
        var tdLen = $(oldSelecetdRow).find("td").length;
        for (var j = 0; j < tdLen; j++) {
            $($(oldSelecetdRow).find("td")[j]).css('background-color', '#fff');
            $($(oldSelecetdRow).find("td")[j]).css('font-weight', '');
        }
    }
    $("#Customer_Name").removeAttr('disabled');
    $('#txt_Category').removeAttr('disabled');
    $('#txt_Speciality_Code').removeAttr('disabled');
    $('#txt_MDL_Number').removeAttr('disabled');
}
function fnSaveAlert() {
    if ($("#hdnStatus").val().toUpperCase() == "UNAPPROVED") {
        $("#dvSaveConfirm").dialog({
            resizable: false,
            height: 200,
            modal: true,
            buttons: {
                "Yes": function () {
                    $(this).dialog("close");
                    fnCustomerSave("ISAPPLIED");
                },
                "No": function () {
                    $(this).dialog("close");
                    fnCustomerSave("");
                },
                "Cancel": function () {
                    $(this).dialog("close");
                }
            }
        });
    }
    else {
        fnCustomerSave("");
    }
}
/*
* Single Add customer save
*/
function fnCustomerSave(transferMode) {
    $("#dvAjaxLoad").show();
    $("#btnSave").css('display', 'none');
    $("#btnSubSave").css('display', 'none');

    var result = fnSubmitValidate();
    if (result) {

        var columnNames = "";
        var columnValues = "";
        var ColVal = "";
        if ($("#hdnMode").val().toUpperCase() == 'INSERT') {
            for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
                columnNames += entityColumns_g.Tables[0].Rows[i].Field_Name + ",";
                if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "") != null) {
                    if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_NAME") {
                        columnValues += "^" + $.trim($("#Customer_Name").val()).replace(/'/g, " ") + "^" + ",";
                        ColVal += +$.trim($("#Customer_Name").val()).replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
                        columnValues += "^" + $("#hdnSpecialityCode").val().replace(/'/g, " ") + "^" + ",";
                        ColVal += $("#hdnSpecialityCode").val().replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
                        columnValues += "^" + $("#hdnCategory").val().replace(/'/g, " ") + "^" + ",";
                        ColVal += $("#hdnCategory").val().replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SUBREGION_CODE") {
                        columnValues += "^" + $("#hdnSubRegionCode").val().replace(/'/g, " ") + "^" + ",";
                        ColVal += $("#hdnSubRegionCode").val().replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_GROUP") {
                        columnValues += "^" + $("#hdnCustomerGroup").val().replace(/'/g, " ") + "^" + ",";
                        ColVal += $("#hdnCustomerGroup").val().replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "DEPOT_CODE") {
                        columnValues += "^" + $("#hdnDepotCode").val().replace(/'/g, " ") + "^" + ",";
                        ColVal += $("#hdnDepotCode").val().replace(/'/g, " ") + "|";
                    }
                    else {
                        if (entityColumns_g.Tables[0].Rows[i].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {
                            var date = $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val();
                            if (date != '') {
                                var convertedDate = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];
                                columnValues += "^" + convertedDate + "^" + ",";
                                ColVal += convertedDate + "|";
                            }
                            else {
                                columnValues += "^^" + ",";
                                ColVal += "|";
                            }
                        }
                        else {

                            columnValues += "^" + $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val()).replace(/'/g, " ") + "^" + ",";
                            ColVal += $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val()).replace(/'/g, " ") + "|";
                        }
                    }
                }
            }
        }
        else {
            for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {

                columnNames += entityColumns_g.Tables[0].Rows[i].Field_Name + ",";
                if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "") != null) {
                    if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_NAME") {
                        columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $.trim($("#Customer_Name").val()).replace(/'/g, " ") + "^" + ",";
                        ColVal += $.trim($("#Customer_Name").val()).replace(/'/g, " ") + "|";
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
                        //columnValues += "^" + $("#hdnSpeciality_Code").val() + "^" + ",";
                        if ($("#hdnSpecialityCode").val() != null) {
                            columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnSpecialityCode").val().replace(/'/g, " ") + "^,";
                            ColVal += $("#hdnSpecialityCode").val().replace(/'/g, " ") + "|";
                        }
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
                        // columnValues += "^" + $("#hdnCategory").val() + "^" + ",";
                        if ($("#hdnCategory").val() != null) {
                            columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnCategory").val().replace(/'/g, " ") + "^,";
                            ColVal += $("#hdnCategory").val().replace(/'/g, " ") + "|";
                        }
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SUBREGION_CODE") {
                        if ($("#hdnSubRegionCode").val() != null) {
                            columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnSubRegionCode").val().replace(/'/g, " ") + "^" + ",";
                            ColVal += $("#hdnSubRegionCode").val().replace(/'/g, " ") + "|";
                        }
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_GROUP") {
                        if ($("#hdnCustomerGroup").val() != null) {
                            columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnCustomerGroup").val().replace(/'/g, " ") + "^" + ",";
                            ColVal += $("#hdnCustomerGroup").val().replace(/'/g, " ") + "|";
                        }
                    }
                    else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "DEPOT_CODE") {
                        if ($("#hdnDepotCode").val() != null) {
                            columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnDepotCode").val().replace(/'/g, " ") + "^" + ",";
                            ColVal += $("#hdnDepotCode").val().replace(/'/g, " ") + "|";
                        }
                    }
                    else {
                        if (entityColumns_g.Tables[0].Rows[i].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {

                            var date = $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val();

                            var convertedDate = "";
                            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() != null) {
                                if (date != '') {
                                    convertedDate = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];
                                    columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + convertedDate + "^,";
                                    ColVal += convertedDate + "|";
                                }
                                else {
                                    columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + convertedDate + "^,";
                                    ColVal += "|";
                                }
                            }
                            else {
                                //columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + convertedDate + "^,";
                                ColVal += "|";
                            }

                        }
                        else {
                            // columnValues += "^" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() + "^" + ",";
                            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() != null) {
                                columnValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val()).replace(/'/g, " ") + "^,";
                                ColVal += $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().replace(/'/g, " ")) + "|";
                            }
                        }
                    }
                }
            }
        }
        var productCount = "0";
        var productContent = "";
        var productlength = $("#tblDocProduct tr").length;
        for (var j = 1; j < productlength; j++) {
            //Check if product is delete
            if ($("#txtProductName_" + j + "").is(":visible")) {
                var productCode = $("#hdnProductCode_" + j).val();
                if (productCode != "") {
                    productCount++;
                    productContent += productCode + "$";
                    productContent += $("#txtYieldQty_" + j).val() + "$";
                    productContent += $("#txtPotentialQty_" + j).val() + "$";
                    productContent += $("#txtPriority_" + j).val() + "$";
                    productContent += "|";
                }
            }
            else {
                productCount++;
            }

        }

        columnNames = columnNames.slice(0, -1);
        columnValues = columnValues.slice(0, -1);
        ColVal = ColVal.slice(0, -1);
        var latitude = "";
        var longitude = "";
        if (currMap.toUpperCase() == "BING") {
            latitude = $("#hdnLatVal").val();
            longitude = $("#hdnLngVal").val();
        }
        if (currMap.toUpperCase() == "GOOGLE" && place != undefined) {
            if (place != '') {
                if (place.geometry.location != undefined) {
                    latitude = place.geometry.location.lat();
                    longitude = place.geometry.location.lng();
                }
            }
        }
        var customerName = $.trim($("#Customer_Name").val());
        var speciality = $("#hdnSpecialityCode").val();
        //Added By Srisudhan For validate manuval entry speciality //
        //if (speciality == "") {
        //    fnMsgAlert('info', 'Validate', 'Please enter valid speciality');
        //    return false;
        //}

        var category = $("#hdnCategory").val();
        var MDLNumber = $("#txt_MDL_Number").val();
        var cusStatus = "";
        var status = $("#hdnStatus").val();
        if (status.toUpperCase() == "APPROVED") {
            cusStatus = "1";
        }
        else if (status.toUpperCase() == "APPLIED") {
            cusStatus = "2";
        }
        else if (status.toUpperCase() == "UNAPPROVED") {
            cusStatus = "0";
        }
        else {
            cusStatus = status;
        }
        $.ajax({
            url: '/DoctorMaster/SingleAdd/',
            type: "POST",
            data: $("form").serialize() + "&DateTime=" + new Date().getTime() + "&RegionCode=" + $("#Region_Code").val() + "&EntityName=" + $("#Entity").val() +
                "&Columns=" + columnNames + "&Values=" + columnValues + "&Mode=" + $("#hdnMode").val() + "&CustomerCode=" + $("#Customer_Code").val() + "&Latitude=" + latitude +
                "&Longitude=" + longitude + "&No_Of_Product=" + productCount + "&Products=" + productContent + "&SpecialityCode=" + speciality + "&CategoryCode=" + category +
                "&CustomerName=" + customerName + "&MDL=" + MDLNumber + "&Status=" + cusStatus + "&ColumnValues=" + ColVal
                + "&TransferMode=" + transferMode + "&DCRVisitCode=" + $("#hdnDCRVisitCode").val() + "",
            success: function (result) {
                $("#dvAjaxLoad").hide();
                if (result.split(':')[0].toUpperCase() == "SUCCESS") {
                    if ($("#hdnMode").val().toUpperCase() == "INSERT") {
                        fnMsgAlert('success', 'Success', $("#Entity").val() + ' Added Successfully');
                    }
                    else {
                        fnMsgAlert('success', 'Success', $("#Entity").val() + ' Updated Successfully');
                        if ($("#Entity").val().toUpperCase() == 'DOCTOR') {
                            $('#dvRightPanel').hide();
                        }
                    }
                    fnClearEntityDetails();
                    fnGetCustomerEntityDetails();
                    fnGetDoctorCategoryBasedonselectedRegion();
                    $("#btnSave").css('display', '');
                    $("#btnSubSave").css('display', '');
                }
                else {
                    fnMsgAlert('error', 'Error', 'Failed:' + result.split(':')[1]);
                    $("#btnSave").css('display', '');
                    $("#btnSubSave").css('display', '');
                }
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                $("#btnSave").css('display', '');
                $("#btnSubSave").css('display', '');
            }
        });
    }
    else {
        $("#dvAjaxLoad").hide();
        $("#btnSave").css('display', '');
        $("#btnSubSave").css('display', '');
    }
}

/*
* Validate fiels before save
*/
function fnSubmitValidate() {
    if ($.trim($("#Customer_Name").val()) == "") {
        fnMsgAlert('info', 'Validate', 'Please enter ' + $("#Entity").val() + ' Name');
        return false;
    }
    if ($("#Customer_Name").val().toUpperCase() == $("#Entity").val().toUpperCase() + ' NAME') {
        fnMsgAlert('info', 'Validate', 'Please enter ' + $("#Entity").val() + ' Name');
        return false;
    }
    //special character validation
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() != "CUSTOMER_NAME") {
            var dataType = entityColumns_g.Tables[0].Rows[i].DATA_TYPE;
            if (dataType.slice(0, 4).toUpperCase() != "DATE") {
                if (dataType.toUpperCase() == "DECIMAL" || dataType.toUpperCase() == "FLOAT") {
                    var result = fnCurrencyFormatCheck("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Valiadte', 'Decimals only accept.Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                    if (!result) {
                        fnMsgAlert('info', 'Validate', 'Decimals only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                        return false;
                    }
                }
                else if (dataType.slice(0, 2).toUpperCase() == "INT") {
                    var result = fnChekInteger("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                    if (!result) {
                        fnMsgAlert('info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                        return false;
                    }
                }
                else {
                    if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_EMAIL"
                        && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_PRIMARY_EMAIL") {
                        if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_ADDRESS1"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_ADDRESS2"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_REMARKS"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_DRUG_LICENSE_NUMBER1"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_DRUG_LICENSE_NUMBER2"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_QUALIFICATION"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_LOCAL_AREA"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_SUR_NAME"
                            && ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() != "TXT_MDL_NUMBER") {
                            if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_CATEGORY") {
                                if ($.trim($("#txt_Category").val()) != '' && $("#txt_Category").val() != undefined) {
                                    if ($("#txt_Category").val().indexOf('"') == -1 && $("#txt_Category").val().indexOf('\\') == -1) {
                                        var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category").val()).toUpperCase() + "\")]");
                                        if (disJson != null) {
                                            if (disJson != false) {
                                                $("#hdnCategory").val(disJson[0].value);
                                            }
                                            else {
                                                fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                                return false;
                                            }
                                        }
                                        else {
                                            fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                            return false;
                                        }
                                    }
                                    else {// We handle double quotes.
                                        fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                            }
                            else if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_SPECIALITY_CODE") {
                                if ($.trim($("#txt_Speciality_Code").val()) != '' && $("#txt_Speciality_Code").val() != undefined) {
                                    if ($("#txt_Speciality_Code").val().indexOf('"') == -1 && $("#txt_Speciality_Code").val().indexOf('\\') == -1) {
                                        var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($("#txt_Speciality_Code").val()).toUpperCase() + "\")]");
                                        if (disJson != null) {
                                            if (disJson != false) {
                                                $("#hdnSpecialityCode").val(disJson[0].value);
                                            }
                                            else {
                                                fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                                return false;
                                            }
                                        }
                                        else {
                                            fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                            return false;
                                        }
                                    }
                                    else {
                                        fnMsgAlert('info', 'Validate', 'Please Validate the ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                            }
                            else {
                                var result = fnCheckSpecialCharacter("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                if (!result) {
                                    fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    return false;
                                }
                            }
                        }
                        else {
                            if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_DRUG_LICENSE_NUMBER1"
                                 || ("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_DRUG_LICENSE_NUMBER2") {
                                var result = fnCheckLicNumSpecialChar("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name
                                        + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                if (!result) {
                                    fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    return false;
                                }
                            }
                            else {
                                if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_LOCAL_AREA") {
                                    var result = fnCheckspecialcharacterLocalarea("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    if (!result) {
                                        fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                                else if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_MDL_NUMBER") {
                                    var result = fnCheckSpecialCharacterforMDLNo("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    if (!result) {
                                        fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                                else if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_SUR_NAME") {
                                    var result = fnCheckSpecialCharacterforCustomerName("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    if (!result) {
                                        fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                                //else if (("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_PHONE") {
                                //    var result = fnChekInteger("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                //    if (!result) {
                                //        fnMsgAlert('info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                //        return false;
                                //    }
                                //}
                                //else if(("txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).toUpperCase() == "TXT_PRIMARY_CONTACT") {
                                //    var result = fnChekInteger("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "", 'info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                //    if (!result) {
                                //        fnMsgAlert('info', 'Validate', 'Special Characters are not allowed. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                //        return false;
                                //    }
                                //}
                                else {
                                    var result = fnCheckAddressSpecialChar("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name
                                        + "", 'info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                    if (!result) {
                                        fnMsgAlert('info', 'Validate', 'Please remove the special character in  ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                                        return false;
                                    }
                                }
                            }

                        }
                    }
                    else {
                        var result = fnEmailCheck("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name);
                        if (!result) {
                            fnMsgAlert('info', 'Validate', 'Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                            return false;
                        }
                    }
                }
            }
        }
        else {

            var result = fnCheckSpecialCharacterforCustomerName("#Customer_Name", 'info', 'Validate', 'Please remove the special character in  the Customer Name field');
            if (!result) {
                fnMsgAlert('info', 'Validate', 'Please remove the special characters from the ' + $("#Entity").val().toUpperCase() + ' field');
                return false;
            }
        }
    }
    if ($("#Entity").val().toUpperCase() == 'DOCTOR') {
        if ($("#txt_Speciality_Code").val() == '') {
            fnMsgAlert('info', 'Validate', 'Please select speciality');
            return false;
        }
        if ($("#txt_Category").val() == '') {
            var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
            if (privilegeValue == "YES") {
                fnMsgAlert('info', 'Validate', 'Please select Category');
                return false;
            }
        }
        if (entityColumns_g.Tables[0].Rows.Display_Option == 'Y') {
            if ($("#txt_MDL_Number").val() == '') {
                fnMsgAlert('info', 'Validate', 'Please enter MDL Number');
                return false;
            }
        }
    }
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if ($("#Customer_Name").val() == '') {
            fnMsgAlert('info', 'Validate', 'Please enter customer name');
            return false;
        }

        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "MDL_NUMBER" && entityColumns_g.Tables[0].Rows[i].Display_Option == 'Y') {
            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() == '') {
        
                fnMsgAlert('info', 'Validate', 'Please enter MDL Number');
                return false;
            }
        }
        if ($("#Entity").val().toUpperCase() == "CHEMIST") {
            if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "MOBILE") {
                if ($("#txt_Mobile").val() != '') {
                    if ($.trim($("#txt_Mobile").val()).length > 13) {
                        fnMsgAlert('info', 'Doctor Master ', 'The Mobile No length should not exceed 13 characters.');
                        return false;
                    }

                    if ($("#txt_Mobile").val() != '' && $("#txt_Mobile").val() != undefined) {
                        if ($.trim($("#txt_Mobile").val()).length < 10) {
                            fnMsgAlert('info', 'Doctor Master', 'Please Enter Valid Mobile No.Mobile number must contains atleast 10 characters.');
                            return false;
                        }
                    }
                }
            }
        }

        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
            if ($("#txt_Speciality_Code").val() == '') {
                $("#hdnSpecialityCode" + j).val('');
                if ($("#Entity").val().toUpperCase() == 'DOCTOR') {
                    fnMsgAlert('info', 'Validate', 'Please select speciality');
                    return false;
                }
            }
            else {
                if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).val().indexOf('"') == -1 && $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).val().indexOf('\\') == -1) {
                    var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name).val().toUpperCase() + "\")]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#hdnSpecialityCode" + j).val(disJson[0].value);
                        }
                        else {
                            $("#hdnSpecialityCode" + j).val('');
                            fnMsgAlert('info', 'Validate', 'Please validate speciality');
                            return false;
                        }
                    }
                    else {
                        $("#hdnSpecialityCode" + j).val('');
                        fnMsgAlert('info', 'Validate', 'Please validate speciality');
                        return false;
                    }
                }
                else {
                    $("#hdnSpecialityCode" + j).val('');
                    fnMsgAlert('info', 'Validate', 'Please validate speciality');
                    return false;
                }
            }
        }
        else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
            if ($("#txt_Category").val() == '') {
                $("#hdnCategory").val('');
                if ($("#Entity").val().toUpperCase() == 'DOCTOR') {
                    var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
                    if (privilegeValue == "YES") {
                        fnMsgAlert('info', 'Validate', 'Please select Category');
                        return false;
                    }
                }
            }
            else {
                if ($("#txt_Category").val() != '') {
                    if (categoryJson_g != '') {
                        if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().indexOf('"') == -1 && $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().indexOf('\\') == -1) {
                            var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().toUpperCase() + "\")]");
                            if (disJson != false) {
                                if (disJson != undefined) {
                                    $("#hdnCategory").val(disJson[0].value);
                                }
                                else {
                                    $("#hdnCategory").val('');
                                    fnMsgAlert('info', 'Validate', 'Please validate category');
                                    return false;
                                }
                            }
                            else {
                                $("#hdnCategory").val('');
                                fnMsgAlert('info', 'Validate', 'Please validate category');
                                return false;
                            }
                        }
                        else {
                            $("#hdnCategory").val('');
                            fnMsgAlert('info', 'Validate', 'Please validate category');
                            return false;
                        }
                    }
                }
            }
        }
        else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "GENDER") {
            
            if ($.trim($('#txt_Gender').val()) != '') {
                var gender = $.trim($('#txt_Gender').val()).toUpperCase();
                if ($.inArray(gender, genderJson_g) == -1) {
                    fnMsgAlert('info', 'Validate', 'Please enter M for Male and F for Female on Gender column.');
                    return false;
                }
            }
        }
        else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SUBREGION_CODE") {
            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() != '') {
                if ($("#hdnSubRegionCode").val() == '') {
                    fnMsgAlert('info', 'Validate', 'Please select subregion');
                    return false;
                }
                else {
                    var disJson = jsonPath(subRegion_g, "$[?(@.label=='" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().toUpperCase() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#hdnSubRegionCode").val(disJson[0].value);
                        }
                        else {
                            $("#hdnSubRegionCode").val('');
                            fnMsgAlert('info', 'Validate', 'Please validate subregion');
                            return false;
                        }
                    }
                    else {
                        $("#hdnSubRegionCode").val('');
                        fnMsgAlert('info', 'Validate', 'Please validate subregion');
                        return false;
                    }
                }
            }
            else {
                $("#hdnSubRegionCode").val('');
            }
        }
        else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_GROUP") {
            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() != '') {
                if ($("#hdnCustomerGroup").val() == '') {
                    fnMsgAlert('info', 'Validate', 'Please validate customer group');
                    return false;
                }
                else {
                    var disJson = jsonPath(customerGroup_g, "$[?(@.label=='" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().toUpperCase() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#hdnCustomerGroup").val(disJson[0].value);
                        }
                        else {
                            $("#hdnCustomerGroup").val('');
                            fnMsgAlert('info', 'Validate', 'Please validate customer group');
                            return false;
                        }
                    }
                    else {
                        $("#hdnCustomerGroup").val('');
                        fnMsgAlert('info', 'Validate', 'Please validate customer group');
                        return false;
                    }
                }
            }
            else {
                $("#hdnCustomerGroup").val('');
            }
        }
        else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "DEPOT_CODE") {
            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val() != '') {
                if ($("#hdnDepotCode").val() == '') {
                    fnMsgAlert('info', 'Validate', 'Please validate depot name');
                    return false;
                }
                else {
                    var disJson = jsonPath(depot_g, "$[?(@.label=='" + $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().toUpperCase() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#hdnDepotCode").val(disJson[0].value);
                        }
                        else {
                            $("#hdnDepotCode").val('');
                            fnMsgAlert('info', 'Validate', 'Please validate depot name');
                            return false;
                        }
                    }
                    else {
                        $("#hdnDepotCode").val('');
                        fnMsgAlert('info', 'Validate', 'Please validate depot name');
                        return false;
                    }
                }
            }
            else {
                $("#hdnDepotCode").val('');
            }
        }
        else {

            var arExist = new Array();
            var ar = new Array();
            arExist = entityColumns_g.Tables[0].Rows[i].Field_Alias_Name.split('(');
            if (arExist.length > 1) {
                var text = entityColumns_g.Tables[0].Rows[i].Field_Alias_Name.split('(')[1].replace(')', '');
                ar = text.split('/');
                var cnt = 0;
                for (var j = 0; j < ar.length; j++) {
                    if ($.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val()) == "") {
                        if (entityColumns_g.Tables[0].Rows[i].Nullable.toUpperCase() == "NO") {
                            fnMsgAlert('info', 'Validate', "Please validate " + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name + " ");
                            return false;
                        }
                    }
                    else {
                        if ($.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val().toUpperCase()) == ar[j].toUpperCase()) {
                            cnt++;
                        }
                    }
                }
                if (cnt == 0) {
                    //Nullable
                    if ($.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").val()) != "") {
                        fnMsgAlert('info', 'Validate', "Please validate " + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name + " ");
                        return false;
                    }
                }
            }
        }

    }
    var disProArray = new Array();
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        var productlength = $("#tblDocProduct tr").length;
        for (var j = 1; j < productlength - 1; j++) {
            //Check if product is delete
            if ($("#txtProductName_" + j + "").is(":visible")) {
                if ($("#txtProductName_" + j + "").val() != "") {

                    var disJson = jsonPath(productJson_g, "$[?(@.label=='" + $("#txtProductName_" + j + "").val().toUpperCase() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#hdnProductCode_" + j).val(disJson[0].value);
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate product name ' + $("#txtProductName_" + j + "").val());
                            return false;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Validate', 'Please validate product name ' + $("#txtProductName_" + j + "").val());
                        return false;
                    }

                    if ($("#hdnProductCode_" + j).val() == '') {
                        fnMsgAlert('info', 'Validate', 'Please validate Product name ' + ($("#txtProductName_" + j + "").val()));
                        return false;
                    }
                    else {
                        if ($.inArray($("#hdnProductCode_" + j).val(), disProArray) == -1) {
                            disProArray.push($("#hdnProductCode_" + j).val());
                        }
                        else {
                            fnMsgAlert('info', 'Validate', $("#txtProductName_" + j + "").val() + ' already exists');
                            return false;
                        }
                    }
                }
            }
        }
    }


    var MandatoryFieldsarraw = new Array();
    MandatoryFieldsarraw = configMandatoryFields.split(',');
    if ($("#Entity").val().toUpperCase() == "CHEMIST")
    {
        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
            var fieldname = entityColumns_g.Tables[0].Rows[i].Field_Name;
            if ($.inArray(fieldname.toUpperCase(), MandatoryFieldsarraw) != -1) {
                for (var j = 0; j < MandatoryFieldsarraw.length ; j++) {
                    if ("PHONE" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Phone').css('display') != 'none') {
                            if ($.trim($("#txt_Phone").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Phone');
                                return false;
                            }
                        }
                    }
                    if ("LOCAL_AREA" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Local_Area').css('display') != 'none') {
                            if ($.trim($("#txt_Local_Area").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Local Area');
                                return false;
                            }
                        }
                    }
                    if ("MOBILE" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Mobile').css('display') != 'none') {
                            if ($.trim($("#txt_Mobile").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Mobile');
                                return false;
                            }
                        }
                    }
                    if ("EMAIL" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Email').css('display') != 'none') {
                            if ($.trim($("#txt_Email").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Email');
                                return false;
                            }
                        }

                    }
                    if ("REGISTRATION_NUMBER" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Registration_Number').css('display') != 'none') {
                            if ($.trim($("#txt_Registration_Number").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Registration Number');
                                return false;
                            }
                        }

                    }
                    if ("TIN_NUMBER" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Tin_Number').css('display') != 'none') {
                            if ($.trim($("#txt_Tin_Number").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Tin Number');
                                return false;
                            }
                        }

                    }
                    if ("DRUG_LICENSE_NUMBER1" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Drug_License_Number1').css('display') != 'none') {
                            if ($.trim($("#txt_Drug_License_Number1").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Drug License Number1');
                                return false;
                            }
                        }

                    }
                    if ("DEPOT_CODE" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_Depot_Code').css('display') != 'none') {
                            if ($.trim($("#txt_Depot_Code").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Depot Code');
                                return false;
                            }
                        }

                    }
                    if ("CST_NUMBER" == MandatoryFieldsarraw[j].toUpperCase()) {
                        if ($('#dvMain_CST_Number').css('display') != 'none') {
                            if ($.trim($("#txt_CST_Number").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter CST Number');
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        for (var i = 0 ; i < entityColumns_g.Tables[0].Rows.length; i++) {
            var fieldname = entityColumns_g.Tables[0].Rows[i].Field_Name;
            if ($.inArray(fieldname.toUpperCase(), MandatoryFieldsarraw) != -1) {
                for (var j = 0 ; j < MandatoryFieldsarraw.length ; j++) {
                    if ("SUR_NAME" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Sur_Name').css('display') != 'none') {
                            if ($.trim($("#txt_Sur_Name").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter sur name');
                                return false;
                            }
                        }
                    }
                    if ("REGISTRATION_NO" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Registration_No').css('display') != 'none') {
                            if ($.trim($("#txt_Registration_No").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Registration number');
                                return false;
                            }
                        }
                    }
                    if ("LOCAL_AREA" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Local_Area').css('display') != 'none') {
                            if ($.trim($("#txt_Local_Area").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Local Area');
                                return false;
                            }
                        }
                    }
                    if ("MOBILE" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Mobile').css('display') != 'none') {
                            if ($.trim($("#txt_Mobile").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter mobile number');
                                return false;
                            }
                        }
                    }
                    if ("CITY" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_City').css('display') != 'none') {
                            if ($.trim($("#txt_City").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter city');
                                return false;
                            }
                        }
                    }
                    if ("PIN_CODE" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Pin_Code').css('display') != 'none') {
                            if ($.trim($("#txt_Pin_Code").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter pincode number');
                                return false;
                            }
                        }
                    }
                    if ("HOSPITAL_NAME" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Hospital_Name').css('display') != 'none') {
                            if ($.trim($("#txt_Hospital_Name").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Hospital name');
                                return false;
                            }
                        }
                    }
                    if ("QUALIFICATION" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Qualification').css('display') != 'none') {
                            if ($.trim($("#txt_Qualification").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter qualification');
                                return false;
                            }
                        }
                    }
                    if ("GENDER" == MandatoryFieldsarraw[j]) {
                        if ($('#dvMain_Gender').css('display') != 'none') {
                            if ($.trim($("#txt_Gender").val()) == '') {
                                fnMsgAlert('info', 'Validate', 'Please enter Gender');
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    if ($.trim($("#txt_Qualification").val()).length > 0) {
        var obj = txt_Qualification;
        var result = fnCheckspecialcharacterSurName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
        if (!result) {
            fnMsgAlert('info', 'Validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
            return false;

        }
    }

    var isnumaricMDL = "";
    var intregex = new RegExp("^[0-9]+$");

    if ($.trim($("#txt_Sur_Name").val()).length > 0) {
        var obj = txt_Sur_Name;
        var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Enter the Valid Sur Name.');
        if (!result) {
            fnMsgAlert('info', 'Validate', 'Please Enter the Valid Sur Name.');
            return false;

        }
    }

    if ($("#txt_Mobile").val() != '' && $("#txt_Mobile").val() != undefined) {
        if ($.trim($("#txt_Mobile").val()).length > 0) {
            if (!intregex.test($(txt_Mobile).val())) {
                fnMsgAlert('info', 'Validate', 'Please enter only numbers in Mobile.');
                return false;
            }
        }
    }
    if ($("#txt_Mobile").val() != '' && $("#txt_Mobile").val() != undefined) {
        if ($.trim($("#txt_Mobile").val()).length > 13) {
            fnMsgAlert('info', 'Doctor Master ', 'The Mobile No length should not exceed 13 characters.');
            return false;
        }
    }

    if ($("#txt_Mobile").val() != '' && $("#txt_Mobile").val() !=undefined) {
        if ($.trim($("#txt_Mobile").val()).length < 10) {
            fnMsgAlert('info', 'Validate', 'Please Enter Valid Mobile No.Mobile number must contains atleast 10 characters.');
            return false;
        }
    }


    //if ($("#Entity").val().toUpperCase() == "CHEMIST") {
    //    if ($.trim($("#txt_Phone").val()).length == 0) {
    //        fnMsgAlert('info', 'Validate', 'Please enter the phone number.');
    //        return false;
    //    }
    //}

    //if ($("#Entity").val().toUpperCase() == "CHEMIST") {
    //    if ($.trim($("#txt_Primary_Contact").val()).length == 0) {
    //        fnMsgAlert('info', 'Validate', 'Please enter the primary contact name.');
    //        return false;
    //    }
    //}


    if ($.trim($("#txt_Phone").val()).length > 0) {
        if (!intregex.test($(txt_Phone).val())) {
            fnMsgAlert('info', 'Validate', 'Please enter only numbers in phone.');
            return false;
        }
    }

    if ($("#txt_Phone").val() != '') {
        if ($.trim($("#txt_Phone").val()).length > 13) {
            fnMsgAlert('info', 'Doctor Master ', 'The phone No length should not exceed 13 characters.');
            return false;
        }

        if ($.trim($("#txt_Phone").val()).length < 5) {
            fnMsgAlert('info', 'Doctor Master', 'Please Enter Valid phone No.phone number must contains atleast 5 characters.');
            return false;
        }
    }

    if ($("#txt_Local_Area").val() != '') {
        if ($.trim($("#txt_Local_Area").val()).length > 50) {
            fnMsgAlert('info', 'Doctor Master ', 'The Local Area length should not exceed 50 characters.');
            return false;
        }
    }


    if ($.trim($("#txt_Pin_Code").val()).length > 0) {
        if (!intregex.test($(txt_Pin_Code).val())) {
            fnMsgAlert('info', 'Validate', 'Please enter only numbers in Pin Code.');
            return false;
        }

    }
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        var MDLNumberCheck = $("#txt_MDL_Number").val();
        if ($.trim($(txt_MDL_Number).val()).length > 0) {
            if (!intregex.test($(txt_MDL_Number).val())) {
                isnumaricMDL = "NO";
            }
            else {
                isnumaricMDL = "YES";
            }
        }
        if (isnumaricMDL == "YES") {
            if (MDLNumberCheck.length > 9) {
                fnMsgAlert('info', 'Validate', 'MDL Number can not be greater than 9 digits');
                return false;
            }
        }
        else {
            if (MDLNumberCheck.length > 30) {
                fnMsgAlert('info', 'Validate', 'MDL Number can not be greater than 30 digits');
                return false;
            }
        }
        if ($.trim($("#txt_Speciality_Code").val()).length > 0) {
            if ($.trim($("#txt_Speciality_Code").val()).indexOf('"') == -1 && $.trim($("#txt_Speciality_Code").val()).indexOf('\\') == -1) {
                var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $("#txt_Speciality_Code").val().toUpperCase() + "\")]");
                if (disJson != false) {
                    if (disJson != undefined) {
                        $("#hdnSpecialityCode").val(disJson[0].value);
                    }
                    else {
                        $("#hdnSpecialityCode").val('');
                        fnMsgAlert('info', 'Validate', 'Please enter valid speciality');
                        return false;
                    }
                }
                else {
                    $("#hdnSpecialityCode").val('');
                    fnMsgAlert('info', 'Validate', 'Please enter valid speciality');
                    return false;
                }
            }
            else {
                $("#hdnSpecialityCode").val('');
                fnMsgAlert('info', 'Validate', 'Please enter valid speciality');
                return false;
            }
        }



        var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
        if (privilegeValue == "YES") {
            if ($("#txt_Category").val().indexOf('"') == -1 && $("#txt_Category").val().indexOf('\\') == -1) {
                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $("#txt_Category").val().toUpperCase() + "\")]");
                if (disJson != false) {
                    if (disJson != undefined) {
                        $("#hdnCategory").val(disJson[0].value);
                    }
                    else {
                        $("#hdnCategory").val('');
                        fnMsgAlert('info', 'Validate', 'Please validate category');
                        return false;
                    }
                }
                else {
                    $("#hdnCategory").val('');
                    fnMsgAlert('info', 'Validate', 'Please validate category');
                    return false;
                }
            }
            else {
                $("#hdnCategory").val('');
                fnMsgAlert('info', 'Validate', 'Please validate category');
                return false;
            }
        }

        var speciality = $("#hdnSpecialityCode").val();

        if (speciality == "") {
            fnMsgAlert('info', 'Validate', 'Please enter valid speciality');
            return false;
        }
    }
    if ($.trim($("#txt_Pin_Code").val()).length > 0) {
        var obj = txt_Pin_Code;
        var result = fnCheckspecialcharacterPincode(obj, 'info', 'validate', 'Please Enter the valid Pin Code.');
        if (!result) {
            fnMsgAlert('info', 'Validate', 'Please Enter the valid Pin Code.');
            return false;

        }
    }
    var result = fnconfiqDupilicationCheck();
    if (result) {
        return true;
    }
}

function fnconfiqDupilicationCheck() {
    var resultCheck = "";
    var dupilcationCheckValue = configDuplicationcheck
    var mobileno = "";
    var regNo = "";

    if (dupilcationCheckValue.toUpperCase() == "MOBILE") {
        mobileno = $("#txt_Mobile").val()
    }
    else if (dupilcationCheckValue.toUpperCase() == "REGISTRATION_NO") {
        regNo = $("#txt_Registration_No").val()
    }

    $.ajax({
        type: "POST",
        url: '../HiDoctor_Master/DoctorMaster/GetConfiqdupicationValue/',
        data: "regionCode=" + $("#Region_Code").val() + "&mobileNo=" + mobileno + "&regNo=" + regNo + "&configValue=" + dupilcationCheckValue,
        async: false,
        success: function (result) {
            if (result > 0) {

                var result = confirm('The doctors are already entered for ' + dupilcationCheckValue + '. Do you wish to continue?');
                if (result) {
                    resultCheck = true;
                }
                else {
                    resultCheck = false;
                }
            }
            else {
                resultCheck = true;
            }
        }
    });
    return resultCheck;
}


/*
* Open pop up while click the more button
*/
function fnOpenFieldPopUp() {
    $("#dvMore").css('display', 'none');
    $("#dvColumns").overlay().load();
}
/*
*  show or hide the input fields
*/
function fnShowEntityColums() {
    // fnShowHide();
    var tableWidth = "0";
    $("input:checkbox[name=chkFields]").each(function () {
        var tdName = this.value;
        if (this.checked) {
            tableWidth = parseFloat(tableWidth) + $("#" + tdName.replace('td', 'tdMain_')).width() + 1;
            $("#" + tdName).css("display", "");
            $("#" + tdName.replace('td', 'tdMain_')).css("display", "");
            for (var i = 0; i < parseFloat(rowNumber) ; i++) {
                $("#" + tdName.replace('td', 'tdMain_') + "_" + i).css("display", "");
                $("#" + tdName + "_" + i).css("display", "");
            }
        }
        else {
            $("#" + tdName).css("display", "none");
            $("#" + tdName.replace('td', 'tdMain_')).css("display", "none");
            for (var i = 1; i <= parseFloat(rowNumber) ; i++) {
                $("#" + tdName.replace('td', 'tdMain_') + "_" + i).css("display", "none");
                $("#" + tdName + "_" + i).css("display", "none");
            }

        }
    });
    $("#tblBulkDoctor").width(tableWidth);
    //    $("#dvBulkDoctors").width(tableWidth);
}

/*
*  change the background color when mouse over like asana.com 
*/
function fnShowBackground(obj) {
    var dvMainId = obj.id;
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == dvMainId.replace("dvMain_", "").toUpperCase()) {
            $("#dvMain_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass('dvBackHighLight');
            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('background-color', '#FAFAFA');
        }
        else {
            $("#dvMain_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass('dvBackHighLight');
            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('background-color', '#FFF');
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass("txtBorder");
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass("txtBorderNone");
            $("#dvlbl_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', 'none');
            $("#dvImg_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', '');
        }
    }
}
function fnShowEntityBackground(obj) {
    var dvImgId = obj.id;
    $("#" + dvImgId.replace("dvImg", "txt")).focus();
}

/*
*  show the textbox and hide the image when click the image or text like asana.com 
*/

function fnShowEntityBackgroundtxt(obj) {
    var txt = obj.id;
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == txt.replace('txt_', '').toUpperCase()) {
            $("#dvlbl_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', '');
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass("txtBorderNone");
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass("txtBorder");
            $("#dvImg_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', 'none');
            $("#dvMain_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass('dvBackHighLight');
        }
        else {
            $("#dvlbl_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', 'none');
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass("txtBorder");
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass("txtBorderNone");
            $("#dvImg_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', '');
            $("#dvMain_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass('dvBackHighLight');

        }
    }
}

/*
*  hide the textbox border after  like asana.com 
*/
function fnHideEntityBackgroundtxt(obj) {
    if (obj != undefined) {
        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
            $("#dvMain_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass('dvBackHighLight');
            $("#dvlbl_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', 'none');
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").removeClass("txtBorder");
            $("#dvtxt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").addClass("txtBorderNone");
            $("#dvImg_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('display', '');
            $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "").css('background-color', '#FFF');
        }
    }
}


//************************ Customer Bulk Add *************************/
function fnShowSelectedStatusDoctors() {
    pageNum = 0;
    fnGetBulkCustomerDetails("NO");
}
/*
*  Get the bulk customer details for the selected region and create the table
*/
var resultJson_g = "";
var oldVar = "";
var noOfCustomerRecords = "";
function fnGetBulkCustomerDetails(emptyRows) {
    if (emptyRows == "YES") {
        $('#dvPre').hide();
        $('#spnPageNo').hide();
        $('#dvNext').hide();
    }
    else {
        $('#dvPre').show();
        $('#spnPageNo').show();
        $('#dvNext').show();
    }
    if ($("#Region_Code").val() == "") {
        fnMsgAlert('info', 'Message', 'Please select any one region');
        pageNum = 0;
        return;
    }
    $("#dvBulkDoctors").html('');
    var privilegeValuebulk = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
    var customerNameEdit = fnGetPrivilegeVal("CAN_CHANGE_CUSTOMER_NAME", "NO");
    //$("#dvPreNext").css('display', '');
    var content = "";
    var tableWidth = "";
    $("#dvAjaxLoad").show();
    if (excelValues_g == '') {
        var count = 0;
        var mode = "";
        var flag = true;
        $("input:checkbox[name=chkMode]").each(function () {
            if (this.checked) {
                if ($(this).val() == 'ALL') {
                    flag = false;
                }
                mode += "^" + $(this).val() + "^,";
                count = parseInt(count) + 1;
            }
        });
        mode = mode.slice(0, -1);
        if (flag == false) {
            mode = 'ALL';
        }
        if (mode == '' && emptyRows.toUpperCase() != "YES") {
            fnMsgAlert('info', 'Info', 'Please select atleast any one status');
            pageNum = 0;
            $("#dvAjaxLoad").hide();
            $("#dvTopSave").css('display', 'none');
            $("#dvSave").css('display', 'none');
            return;
        }
        else if (mode == '' && emptyRows.toUpperCase() == "YES") {
            $("#chkAll").removeAttr('checked');
            $("#chkDraft").removeAttr('checked');
            $("#chkApplied").removeAttr('checked');
            $("#chkApproved").removeAttr('checked');
            $("#chkUnapproved").removeAttr('checked');
            pageNum = 0;
            mode = "^^";
        }
        $.ajax({
            url: '../HiDoctor_Master/DoctorMaster/GetCustomers/',
            type: "POST",
            data: "Mode=" + mode + "&DateTime=" + new Date().getTime() + "&RegionCode=" + $("#Region_Code").val() + "&EntityName="
                + $("#Entity").val() + "&PageNum=" + pageNum + "&PageName=BULK&EmptyRows=" + emptyRows + "&privilageValue="
                + privilegeValuebulk + "&status=" + $('input[@name="chkMode"]:checked').val() + "&SearchKey="
                + $("#txtSearch").val() + "&Customer_Edit=" + customerNameEdit + "",
            success: function (jsData) {
                var result = jsData.split('~')[0];
                var noOfRecords = jsData.split('~')[1];
                noOfCustomerRecords = noOfRecords;
                $("#dvBulkDoctors").html(result);
                //if ((parseFloat(noOfRecords) / 50) < 1) {
                //    $('#spnPageNo').html(parseInt(pageNum) + 1 + 'of 1');
                //}
                //else {
                if (parseFloat(Math.ceil((parseFloat(noOfRecords) / 50))) > 0) {
                    $('#spnPageNo').html(parseInt(pageNum) + 1 + ' of ' + Math.ceil((parseFloat(noOfRecords) / 50)));
                }
                else {
                    $('#spnPageNo').html(parseInt(pageNum) + 1 + ' of 1');
                }
                //}

                // $('#tblBulkDoctor').tablePagination({});
                rowNumber = parseFloat($("#tblBulkDoctor tr").length);
                if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR" && rowNumber == "1") {
                    $('#btnTopSave').hide();
                    $('#btnSave').hide();
                }
                else {
                    $('#btnTopSave').show();
                    $('#btnSave').show();
                }
                //autoComplete(categoryJson_g, "txt_Category", "hdnCategory", "autoCategory");
                //autoComplete(specialityJson_g, "txt_Speciality_Code", "hdnSpecialityCode", "autoSpeciality");
                //autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegionCode", "autoSubRegion");
                //autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
                //autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");
                $(".datepicker").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: 'dd/mm/yy',
                    yearRange: '-80:+30'
                });
                var year = new Date(currentDate).getFullYear();
                var dobYear = year - 150;
                $(".DOBDatePicker").datepicker({
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: 'dd/mm/yy',
                    yearRange: (year - 150) + ':' + (year + 0)
                });

                //Restrict the Add new customer       
                if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
                }
                else {
                    if ($("#tblBulkDoctor tr").length == 1) {
                        fnCreateAddRow(0, "B");
                        var newRowNo = 0;
                        for (var l = 0; l < 9; l++) {
                            newRowNo = parseFloat(newRowNo) + 1;
                            fnCreateAddRow(newRowNo, "B");
                        }
                        // rowNumber = parseFloat(newRowNo) + 1;
                    }
                    else if (emptyRows.toUpperCase() == "YES") {
                        $("#chkAll").removeAttr('checked');
                        $("#chkDraft").removeAttr('checked');
                        $("#chkApplied").removeAttr('checked');
                        $("#chkApproved").removeAttr('checked');
                        $("#chkUnapproved").removeAttr('checked');
                        fnCreateAddRow(0, "B");
                        var newRowNo = 0;

                        for (var l = 0; l < 9; l++) {
                            newRowNo = parseFloat(newRowNo) + 1;
                            fnCreateAddRow(newRowNo, "B");
                        }

                    }
                    else {
                        fnCreateAddRow(parseFloat($("#tblBulkDoctor tr").length) - 1, "B");
                    }
                }
                autoComplete(categoryJson_g, "txt_Category", "hdnCategory", "autoCategory");
                autoComplete(specialityJson_g, "txt_Speciality_Code", "hdnSpecialityCode", "autoSpeciality");
                //autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegion", "autoSubRegion");
                autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegionCode", "autoSubRegion");
                // $('.autoSubRegion').blur(function () { fnValidateAutofill(this, subRegion_g, "txt_SubRegion_Code", "hdnSubRegion"); });
                autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
                autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");
                $("#dvTopSave").show();
                $("#dvSave").show();
                $("#dvAjaxLoad").hide();
            },
            error: function () {
                $("#dvAjaxLoad").hide();
                fnMsgAlert('error', 'Error', 'Bind bulk customer details failed');
            }
        })

    }
    else {
        jsData = excelValues_g;
        console.log(jsData);
        //fnMsgAlert('info', 'Info', 'Process started...');
        $("#dvAjaxLoad").hide();
        if (confirm('Process started. Click ok to continue...')) {
            $("#dvBulkDoctors").html(jsData);
            rowNumber = parseFloat($("#tblBulkDoctor tr").length);

            $(".datepicker").datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd/mm/yy',
                yearRange: '-80:+30'
            });
            var year = new Date(currentDate).getFullYear();
            var dobYear = year - 150;
            $(".DOBDatePicker").datepicker({
                dateFormat: 'dd/mm/yy',
                changeMonth: true,
                changeYear: true,
                yearRange: (year - 150) + ':' + (year + 0)
            });
            fnCreateAddRow(parseFloat($("#tblBulkDoctor tr").length) - 1, "E");
            $("tblBulkDoctor_info").css('display', 'none');
            //  $("#dvAjaxLoad").hide();
        }
        var fieldContent = "";
        fieldContent += "<table class='data display filterable' style='width: 85%; border: 1px solid #f2f2f2;' id='tblColumns'>";
        for (var c = 0; c < entityColumns_g.Tables[0].Rows.length; c++) {
            if ($("#Entity").val().toUpperCase() == "DOCTOR") {
                if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "SPECIALITY_CODE") {
                 
                    if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CATEGORY") {
                        if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CUSTOMER_NAME") {
                            if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "MDL_NUMBER") {
                                if (entityColumns_g.Tables[0].Rows[c].Display_Option == 'Y') {
                                    fieldContent += "<tr><td><input type='checkbox' value='dv_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "' checked='checked' name='chkFields' /></td>";
                                    fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                                }
                                else {
                                    fieldContent += "<tr><td><input type='checkbox' value='dv_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "'  name='chkFields' /></td>";
                                    fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                                }
                            }
                        }
                    }
                }
            }
            else {
                if ((entityColumns_g.Tables[0].Rows[c].Field_Name).toUpperCase() != "CUSTOMER_NAME") {
                    if (entityColumns_g.Tables[0].Rows[c].Display_Option == 'Y') {
                        fieldContent += "<tr><td><input type='checkbox' value='dv_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "' checked='checked' name='chkFields' /></td>";
                        fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                    }
                    else {
                        fieldContent += "<tr><td><input type='checkbox' value='dv_" + entityColumns_g.Tables[0].Rows[c].Field_Name + "'  name='chkFields' /></td>";
                        fieldContent += "<td>" + entityColumns_g.Tables[0].Rows[c].Field_Alias_Name + "</td></tr>";
                    }
                }
            }
        }
        fieldContent += "</table>";
        $("#dvField").html(fieldContent);
    }
}


/*
*  hide the textbox after entered the values and validate the entered values
*/
function fnHideTextBox(obj, number, aliasName, dataType) {
    var txtId = obj.id;
    //if ($("#" + txtId).val().toUpperCase() != oldVar.toUpperCase()) {
    if ($("#hdnEdit_" + number).val().toUpperCase() != 'INSERT') {
        $("#hdnEdit_" + number).val('Y');
        if (txtId.toUpperCase() == "TXT_SPECIALITY_CODE_" + number) {
            $("#hdnHistory_" + number).val('Y');
        }
        if (txtId.toUpperCase() == "TXT_CATEGORY_" + number) {
            $("#hdnHistory_" + number).val('Y');
        }
        if (txtId.toUpperCase() == "TXT_MDL_NUMBER_" + number) {
            $("#hdnHistory_" + number).val('Y');
        }
        if (txtId.toUpperCase() == "TXT_CUSTOMER_NAME_" + number) {
            $("#hdnHistory_" + number).val('Y');
        }

    }
    if (dataType.slice(0, 4).toUpperCase() != "DATE") {
        if (dataType.toUpperCase() == "DECIMAL" || dataType.toUpperCase() == "FLOAT") {
            var result = fnCurrencyFormatCheck(obj, 'info', 'Validate', 'Decimals only accept.Please validate your entry');
            var id = $("#" + txtId);
            if (!result) {
                $("#" + txtId).addClass("errorIndicator");
                $("#" + txtId).attr('title', 'Decimals only accept.Please validate your entry.');
                fnIndicateErrorforColumn(id);
                return false;
            }
            else {
                fnRemoveIndicationforColumn("#" + txtId);
                $("#" + txtId).removeClass("errorIndicator");
            }
        }
        else if (dataType.slice(0, 2).toUpperCase() == "INT") {
            var result = fnChekInteger(obj, 'info', 'Validate', 'Integer only accepted. Please valiadte');
            var id = $("#" + txtId);
            if (!result) {
                $("#" + txtId).addClass("errorIndicator");
                $("#" + txtId).attr('title', 'Integer only accepted. Please valiadte');
                fnIndicateErrorforColumn(id);
                return false;
            }
            else {
                fnRemoveIndicationforColumn("#" + txtId);
                $("#" + txtId).removeClass("errorIndicator");
            }
        }
        else {
            if (txtId.toUpperCase() != "TXT_EMAIL_" + number && txtId.toUpperCase() != "TXT_PRIMARY_EMAIL_" + number) {
                if (txtId.toUpperCase() != "TXT_ADDRESS1_" + number && txtId.toUpperCase() != "TXT_ADDRESS2_" + number && txtId.toUpperCase() != "TXT_REMARKS_" + number && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER1_" + number && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER2_" + number) {

                    if (txtId.toUpperCase() == "TXT_REGISTRATION_NO_" + number) {
                        var result = fnCheckspecialcharacterregistrationno(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_CITY_" + number || txtId.toUpperCase() == "TXT_HOSPITAL_NAME_" + number) {
                        var result = fnCheckspecialcharacterHospitalName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_QUALIFICATION_" + number) {
                        var result = fnCheckspecialcharacterSurName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_PIN_CODE_" + number) {
                        var result = fnCheckspecialcharacterPincode(obj, 'info', 'validate', 'Please Enter the Valite PIN Code.');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Enter the Valite PIN Code.');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_LOCAL_AREA_" + number) {

                        var result = fnCheckspecialcharacterLocalarea(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialCharacterforLocalArea_g + ').');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialCharacterforLocalArea_g + ').');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_MDL_NUMBER_" + number) {

                        var result = fnCheckSpecialCharacterforMDLNo(obj, 'info', 'validate', 'Please Remove the special characters in mdl no.');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please Remove the special characters in mdl no.');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_CUSTOMER_NAME_" + number) {

                        var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Remove the special characters at customer name.');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please remove the special characters In Customer Name');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_SUR_NAME_" + number) {
                        var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Remove the special characters at Sur name.');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please remove the special characters In Sur Name');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_PHONE_" + number || txtId.toUpperCase() == "TXT_MOBILE_" + number) {
                        var result = fnCheckMobileNoSpecialCharandCorrect(obj, 'info', 'validate', 'Please Enter the Valid Mobile/Phone NO.');
                        var id = $("#" + txtId);
                        if (!result) {
                            if (txtId.toUpperCase() == "TXT_PHONE_" + number) {
                                $("#" + txtId).addClass("errorIndicator");
                                $("#" + txtId).attr('title', 'Please Enter the Valid Mobile/Phone NO.');
                                fnIndicateErrorforColumn(id);
                                flag = false;
                            }
                            else {
                                fnRemoveIndicationforColumn("#" + txtId);
                                $("#" + txtId).removeClass("errorIndicator");
                            }
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_CATEGORY_" + number) {
                        if ($("#" + txtId).val() != '' && $("#" + txtId).val() != undefined) {
                            var id = $("#" + txtId);
                            if ($.trim($(id).val()).indexOf('"') == -1 && $.trim($(id).val()).indexOf('\\') == -1) {
                                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($(id).val()).toUpperCase() + "\")]");
                                if (disJson != null) {
                                    if (disJson != false) {
                                        $("#hdnCategory_" + number).val(disJson[0].value);
                                        fnRemoveIndicationforColumn("#" + txtId);
                                        $("#" + txtId).removeClass("errorIndicator");
                                    }
                                    else {
                                        $(id).addClass("errorIndicator");
                                        $(id).attr('title', 'Please validate category.');
                                        fnIndicateErrorforColumn(id);
                                        flag = false;
                                    }
                                }
                            }
                            else {// We handle double quotes , because json not handling double quots.
                                $(id).addClass("errorIndicator");
                                $(id).attr('title', 'Please validate category.');
                                fnIndicateErrorforColumn(id);
                                flag = false;
                            }
                        }
                    }
                    else if (txtId.toUpperCase() == "TXT_SPECIALITY_CODE_" + number) {
                        if ($("#" + txtId).val() != '' && $("#" + txtId).val() != undefined) {
                            var id = $("#" + txtId);
                            if ($("#" + txtId).val().indexOf('"') == -1 && $("#" + txtId).val().indexOf('\\') == -1) {
                                var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($(id).val()).toUpperCase() + "\")]");
                                if (disJson != null) {
                                    if (disJson != false) {
                                        $("#hdnSpecialityCode_" + number).val(disJson[0].value);
                                        fnRemoveIndicationforColumn("#" + txtId);
                                        $("#" + txtId).removeClass("errorIndicator");
                                    }
                                    else {
                                        $(id).addClass("errorIndicator");
                                        $(id).attr('title', 'Please validate speciality.');
                                        fnIndicateErrorforColumn(id);
                                        flag = false;
                                    }
                                }
                            }
                            else {// We handle double quotes , because json not handling double quots.
                                $(id).addClass("errorIndicator");
                                $(id).attr('title', 'Please validate speciality.');
                                fnIndicateErrorforColumn(id);
                                flag = false;
                            }
                        }
                    }
                        //Gender 'F','M' allow restriction
                    else if (txtId.toUpperCase() == "TXT_GENDER_" + number) {
                        
                        if ($.trim($("#" + txtId).val()).length > 0) {
                            var gender = $.trim($("#" + txtId).val()).toUpperCase();
                            if ($.inArray(gender, genderJson_g) == -1) {
                                $("#" + txtId).addClass("errorIndicator");
                                $("#" + txtId).attr('title', 'Please enter M for Male and F for Female on Gender column.');
                                fnIndicateErrorforColumn(id);
                                flag = false;
                            }
                            else {
                                fnRemoveIndicationforColumn("#" + txtId);
                                $("#" + txtId).removeClass("errorIndicator");
                            }
                        }
                    }

                    else {
                        var result = fnCheckSpecialCharacter(obj, 'info', 'Validate', 'Please remove the special character');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please remove the special character.');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                        }
                    }
                }
                else {
                    if (txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER1_" + number || txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER2_" + number) {
                        var result = fnCheckLicNumSpecialChar(obj, 'info', 'Validate', 'Please remove the special character');
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please remove the special character.');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                            // $(obj.parentElement).removeClass('errorHighlight');
                        }
                    }
                    else {
                        var result = fnCheckAddressSpecialChar(obj);
                        var id = $("#" + txtId);
                        if (!result) {
                            $("#" + txtId).addClass("errorIndicator");
                            $("#" + txtId).attr('title', 'Please remove the special character.');
                            fnIndicateErrorforColumn(id);
                            flag = false;
                        }
                        else {
                            fnRemoveIndicationforColumn("#" + txtId);
                            $("#" + txtId).removeClass("errorIndicator");
                            // $(obj.parentElement).removeClass('errorHighlight');
                        }
                    }
                }
            }
            else {
                var result = fnEmailCheck(obj);
                var id = $("#" + txtId);
                if (!result) {
                    $("#" + txtId).addClass("errorIndicator");
                    $("#" + txtId).attr('title', 'Please validate Email Id.');
                    fnIndicateErrorforColumn(id);
                    flag = false;
                }
                else {
                    fnRemoveIndicationforColumn("#" + txtId);
                    $("#" + txtId).removeClass("errorIndicator");
                    //$(obj.parentElement).removeClass('errorHighlight');
                }
            }
        }
    }
    var arExists = new Array();
    var ar = new Array();
    arExists = aliasName.split('(');
    if (arExists.length > 1) {
        var text = aliasName.split('(')[1].replace(')', '');
        ar = text.split('/');
        var cnt = 0;
        for (var j = 0; j < ar.length; j++) {
            if ($.trim($(obj).val().toUpperCase()) != "") {
                if ($(obj).val().toUpperCase() == ar[j].toUpperCase()) {
                    cnt++;
                }
            }
        }
        if (cnt == 0) {
            if ($.trim($(obj).val().toUpperCase()) != "") {
                fnMsgAlert('info', 'Validate', "Please validate the entry ");
                return;
            }
        }

    }
}


/*
*  Create new row for bulk customer add
*/
function fnCreateAddRow(id, screenName) {
    if (id != parseFloat(rowNumber) - 1) {
        return;
    }
    var content = "";
    var addRow = "";
    var rowCnt = $("#tblBulkDoctor tr").length;
    var newRow = document.getElementById("tblBulkDoctor").insertRow(parseInt(rowCnt));
    $(newRow).id = "tr_" + rowNumber + "";
    var tdSNo = newRow.insertCell(0);
    var tdCheckbox = newRow.insertCell(1);
    $(tdCheckbox).html("<input type='checkbox' id='chkSelect_" + rowNumber + "' name='chkSelectCustomer'/>");
    var tdSNo1 = newRow.insertCell(2);
    //  $(tdSNo1).html(rowNumber);
    if (screenName.toUpperCase() == "E") {
        $(tdSNo1).html(rowNumber);
    }
    else {
        var pageRowNo = parseFloat(pageNum) * 50;
        $(tdSNo1).html(parseInt(pageRowNo) + parseInt($("#tblBulkDoctor tr:visible").length) - 1);
    }
    for (var h = 0; h < entityColumns_g.Tables[0].Rows.length; h++) {
        var td = newRow.insertCell(parseFloat(h) + 3);
        $(td).addClass('dataTableTdCss');
        td.id = "tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "";
        var dateClassName = '';
        var displayClass = '';
        if (entityColumns_g.Tables[0].Rows[h].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {
            dateClassName = 'datepicker';
        }
        if (entityColumns_g.Tables[0].Rows[h].Display_Option == 'N') {
            if (excelValues_g == '') {
                $(td).css('display', 'none');
            }
        }
        if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == "CUSTOMER_NAME") {
            addRow = "onkeypress = 'fnCreateAddRow(" + rowNumber + ",\"" + screenName + "\");'";
        }
        if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'SPECIALITY_CODE') {//
            content = "<input type='text' class='txtInput autoSpeciality' id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
            content += "onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'";
            content += " title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "'/>";
        }
        else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'CATEGORY') {
            content = "<input type='text' class='txtInput autoCategory' id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
            content += " onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'  title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "'/>";
        }
        else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'SUBREGION_CODE') {
            content = "<input type='text' class='txtInput autoSubRegion' id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
            content += " onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\""
                + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");' title='"
                + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "'/>";
        }
        else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'CUSTOMER_GROUP') {
            content = "<input type='text' class='txtInput autoCustomerGroup' id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
            content += " onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'  title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "'/>";
        }
        else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'DEPOT_CODE') {
            content = "<input type='text' class='txtInput autoDepot' id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
            content += " onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'  title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "'/>";
        }
        else {
            if (entityColumns_g.Tables[0].Rows[h].COLUMN_DEFAULT != '') {
                content = "<input type='text' class='txtInput " + dateClassName + "' maxlength=" + entityColumns_g.Tables[0].Rows[h].Len + "  id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
                content += " value='" + entityColumns_g.Tables[0].Rows[h].COLUMN_DEFAULT + "' title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'  placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' " + addRow + "/>";
            }
            else {
                content = "<input type='text' class='txtInput " + dateClassName + "' maxlength=" + entityColumns_g.Tables[0].Rows[h].Len + "  id='txt_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + rowNumber + "'";
                content += " title='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' onblur='fnHideTextBox(this," + rowNumber + ",\"" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "\",\"" + entityColumns_g.Tables[0].Rows[h].DATA_TYPE + "\");'  onkeypress='fnCreateAddRow(" + rowNumber + ",\"" + screenName + "\");' placeholder='" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "' " + addRow + "/>";
            }
        }
        $(td).html(content);
    }
    if (screenName != "E") {
        var tdStatus = newRow.insertCell(parseFloat(entityColumns_g.Tables[0].Rows.length) + 3);
        $(tdStatus).html("");
        $(tdStatus).addClass('dataTableTdCss');
        var tdIsAplied = newRow.insertCell(parseFloat(entityColumns_g.Tables[0].Rows.length) + 4);
        $(tdIsAplied).html("");
        $(tdIsAplied).addClass('dataTableTdCss');
        var tdLast = newRow.insertCell(parseFloat(entityColumns_g.Tables[0].Rows.length) + 5);
        $(tdLast).addClass('dataTableTdCss');
        content = "";
        if (rowNumber == "1") {
            content += "<div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...</div>";
        }
        content += "<input type='hidden' id='hdnCategory_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnSpecialityCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnSubRegionCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnCustomerGroup_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnDepotCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnCustomerCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnHistory_" + rowNumber + "' value='N'/>";
        content += "<input type='hidden' id='hdnDCRVisitCode_" + rowNumber + "' value=''/>";//
        content += "<input type='hidden' id='hdnEdit_" + rowNumber + "' value='INSERT'/>";
        $(tdLast).css('min-width', '80px !important');
        $(tdLast).html(content);
    }
    else {
        var tdLast = newRow.insertCell(parseFloat(entityColumns_g.Tables[0].Rows.length) + 3);
        $(tdLast).addClass('dataTableTdCss');
        content = "";
        if (rowNumber == "1") {
            content += "<div id='dvMore' class='dvMore' onclick='fnOpenFieldPopUp();'>More...</div>";
        }
        content += "<input type='hidden' id='hdnCategory_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnSpecialityCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnSubRegionCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnCustomerGroup_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnDepotCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnCustomerCode_" + rowNumber + "'/>";
        content += "<input type='hidden' id='hdnHistory_" + rowNumber + "' value='N'/>";
        content += "<input type='hidden' id='hdnDCRVisitCode_" + rowNumber + "' value=''/>";//
        content += "<input type='hidden' id='hdnEdit_" + rowNumber + "' value='INSERT'/>";
        $(tdLast).css('min-width', '80px !important');
        $(tdLast).html(content);
    }

    //autoComplete(categoryJson_g, "txt_Category", "hdnCategory", "autoCategory");
    //autoComplete(specialityJson_g, "txt_Speciality_Code", "hdnSpecialityCode", "autoSpeciality");
    //autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegionCode", "autoSubRegion");
    //autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
    //autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");
    rowNumber = parseFloat(rowNumber) + 1;
    autoComplete(categoryJson_g, "txt_Category", "hdnCategory", "autoCategory");
    autoComplete(specialityJson_g, "txt_Speciality_Code", "hdnSpecialityCode", "autoSpeciality");
    // autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegion", "autoSubRegion");
    autoComplete(subRegion_g, "txt_SubRegion_Code", "hdnSubRegionCode", "autoSubRegion");
    autoComplete(customerGroup_g, "txt_Customer_Group", "hdnCustomerGroup", "autoCustomerGroup");
    autoComplete(depot_g, "txt_Depot_Code", "hdnDepotCode", "autoDepot");

    $(".datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        yearRange: '-80:+30'
    });
    // Invoke the plugin
    $('input, textarea').placeholder();
}

/*
*  Open more button while click the last column in the bulk customer table
*/
function fnShowMore() {
    $("#dvMore").css('display', 'block');
}
/*
*  Open columns popup while click the last column in the bulk customer table
*/
function fnOpenFieldPopUp() {
    if ($("#dvMore") != []) {
        $("#dvMore").css('display', 'none');
    }
    $("#dvColumns").overlay().load();
}
/*
*  show or hide the fields after select or deselect the columns
*/
function fnShowColums() {
    // fnShowHide();
    $("#dvMore").css('display', '');
    $("#dvColumns").overlay().close();
    var tableWidth = "0";
    $("input:checkbox[name=chkFields]").each(function () {
        var tdName = this.value;
        if (this.checked) {
            tableWidth = parseFloat(tableWidth) + 150 + 1;
            $("#" + tdName.replace('dv', 'tdMain')).css("display", "");
            $("#" + tdName.replace('dv', 'tdMain')).css("min-width", "150px !important");
            $("#" + tdName.replace('dv', 'dvTh')).css("width", "150px !important");
            $("#" + tdName).css("display", "");

            for (var i = 0; i < parseFloat(rowNumber) ; i++) {
                $("#" + tdName.replace('dv', 'tdMain') + "_" + i).css("display", "");
                $("#" + tdName.replace('dv', 'tdMain')).css("min-width", "150px !important");
                // $("#" + tdName + "_" + i).css("display", "");
            }
        }
        else {
            $("#" + tdName.replace('dv', 'tdMain')).css("display", "none");
            $("#" + tdName.replace('dv', 'tdMain')).css("width", "100px !important");
            $("#" + tdName.replace('dv', 'dvTh')).css("min-width", "0px !important");
            $("#" + tdName).css("display", "none");
            for (var i = 1; i <= parseFloat(rowNumber) ; i++) {
                $("#" + tdName.replace('dv', 'tdMain') + "_" + i).css("display", "none");
                $("#" + tdName.replace('dv', 'tdMain')).css("width", "100px !important");
                //$("#" + tdName + "_" + i).css("display", "none");
            }

        }
    });
    $("#tblBulkDoctor").width(tableWidth);
    //    $("#dvBulkDoctors").width(tableWidth);
}


//********************** Bulk Customer Save ***************************//

function fnBulkCustomerSave(option) {
    phonenOarr = [];
    registrationNamearr = [];
    duplicateValue = false;
    fnAlertSpecialCharacters();
    if (confirm('Do you want to save the records')) {

        $('#tblBulkDoctor tbody tr').removeClass('cls-ErrorindicationRow');
        $("#dvAjaxLoad").show();
        if (option == "N") {
            var count = 0;
            var mode = "";
            $("input:checkbox[name=chkMode]").each(function () {
                if (this.checked) {
                    count = parseInt(count) + 1;
                }
            });

            if (count == '0') {
                fnMsgAlert('info', 'Info', 'Please select atleast any one status');
                $("#dvAjaxLoad").hide();
                return;
            }
        }
        var flag = true;
        var appliedCnt = 0; var oldStatus = 0;
        if (option != "N" && option != "S") {
            $("#btnTopSave").hide();
            $("#btnSave").hide();

        }
        else {
            $("#btnTopSave").show();
            $("#btnSave").show();
            $("input:checkbox[name=chkMode]").each(function () {
                if (this.checked) {
                    if ($(this).val() == 'ALL') {
                        flag = false;
                    }
                    else if ($(this).val() == '0') {
                        flag = false;
                    }
                }
            });
            if (!flag) {
                $("input:checkbox[name=chkSelectCustomer]").each(function () {
                    if (this.checked) {

                        appliedCnt = parseInt(appliedCnt) + 1;
                    }
                    else {
                        oldStatus = parseInt(oldStatus) + 1;
                    }
                });
                if (confirm("You are going to change the status from Unapproved to Applied for " + appliedCnt + " Doctors")) {
                }
                else {
                    $("#dvAjaxLoad").hide();
                    return false;
                }
            }
        }
        var columnNames = "";
        var columnValues = "";
        var editedValues = "";
        var ColVal = "";
        var status = "";
        var result = fnValidateValues(option);

        if (result) {
            if (duplicateValue) {
                $('#dvAjaxLoad').hide();
                if (!confirm('The Highlighted row(s) are Duplicated for ' + jsonCheckDuplicate_g + '. Do you wish to continue?')) {
                    return false;
                }
            }
            // $("#dvAjaxLoad").show();
            var rowCnt = $("#tblBulkDoctor tr").length;
            for (var j = 0; j < entityColumns_g.Tables[0].Rows.length; j++) {
                columnNames += entityColumns_g.Tables[0].Rows[j].Field_Name + ",";
            }

            //for (var r = 1; r <= rowCnt - 1; r++) {
            //    
            //    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
            //        if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "GENDER") {
            //            if ($.trim($('#txt_Gender_' + r + '').val()) != '') {
            //                
            //                var gender = $.trim($('#txt_Gender_' + r + '').val()).toUpperCase();
            //                if ($.inArray(gender, genderJson_g) == -1) {
            //                    
            //                    fnMsgAlert('info', 'Validate', 'Please enter M for Male and F for Female on Gender column.');
            //                    return false;
            //                }
            //            }
            //        }
            //    }
            //}
            for (var r = 1; r <= rowCnt - 1; r++) {
                if (($("#chkSelect_" + r).is(':checked'))){
                if ($("#txt_Customer_Name_" + r + "").val() != '') {
                    if ($("#hdnEdit_" + r + "").val().toUpperCase() == 'INSERT') {
                        columnValues += $("#hdnDCRVisitCode_" + r).val() + "|";
                        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
                            // columnNames += entityColumns_g.Tables[0].Rows[i].Field_Name + ",";
                            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "") != null) {
                                if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
                                    if ($("#hdnSpecialityCode_" + r + "").val() != '' && $("#hdnSpecialityCode_" + r + "").val() != null && $("#hdnSpecialityCode_" + r + "").val() != undefined) {
                                        columnValues += "^" + $("#hdnSpecialityCode_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                    }
                                    else {
                                        columnValues += "^^" + ",";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
                                    if ($("#hdnCategory_" + r + "").val() != '' && $("#hdnCategory_" + r + "").val() != null && $("#hdnCategory_" + r + "").val() != undefined) {
                                        columnValues += "^" + $("#hdnCategory_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                    }
                                    else {
                                        columnValues += "^^" + ",";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SUBREGION_CODE") {
                                    if ($("#hdnSubRegionCode_" + r + "").val() != '' && $("#hdnSubRegionCode_" + r + "").val() != null && $("#hdnSubRegionCode_" + r + "").val() != undefined) {
                                        columnValues += "^" + $("#hdnSubRegionCode_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                    }
                                    else {
                                        columnValues += "^^" + ",";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_GROUP") {
                                    if ($("#hdnCustomerGroup_" + r + "").val() != '' && $("#hdnCustomerGroup_" + r + "").val() != null && $("#hdnCustomerGroup_" + r + "").val() != undefined) {
                                        columnValues += "^" + $("#hdnCustomerGroup_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                    }
                                    else {
                                        columnValues += "^^" + ",";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "DEPOT_CODE") {
                                    if ($("#hdnDepotCode_" + r + "").val() != '' && $("#hdnDepotCode_" + r + "").val() != null && $("#hdnDepotCode_" + r + "").val() != undefined) {
                                        columnValues += "^" + $("#hdnDepotCode_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                    }
                                    else {
                                        columnValues += "^^" + ",";
                                    }
                                }
                                else {
                                    if (entityColumns_g.Tables[0].Rows[i].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {
                                        var date = $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val();
                                        if (date != '' && date != undefined && date != null) {
                                            var convertedDate = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];
                                            columnValues += "^" + convertedDate + "^" + ",";
                                        }
                                        else {
                                            columnValues += "^^" + ",";
                                        }
                                    }
                                    else {
                                        columnValues += "^" + $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val()).replace(/'/g, " ") + "^" + ",";
                                    }
                                }
                            }
                            else {
                                columnValues += "^^,";
                            }

                        }
                        columnValues = columnValues.slice(0, -1);
                        columnValues += "~";
                    }                 
                    else if ($("#hdnEdit_" + r + "").val().toUpperCase() == 'Y') {
                        editedValues += $("#hdnCustomerCode_" + r + "").val() + "|" + $("#hdnHistory_" + r + "").val() + "|";


                        if ($("#tdStatus_" + r).html().toUpperCase() == "APPLIED") {
                            status = "2";
                        }
                        else if ($("#tdStatus_" + r).html().toUpperCase() == "APPROVED") {
                            status = "1";
                        }
                        else if ($("#tdStatus_" + r).html().toUpperCase() == "UNAPPROVED") {
                            status = "0";
                        }
                        else {
                            status = "UNLISTED";
                        }
                        if ($("#chkIsApplied_" + r + "") != null && $("#chkIsApplied_" + r + "") != undefined) {
                            if ($("#chkIsApplied_" + r + "").attr('checked') == "checked") {
                                editedValues += "ISAPPLIED|" + status + "|" + $("#hdnDCRVisitCode_" + r + "").val() + "$";
                            }
                            else {
                                if ($("#chkIsApplied_" + r + "").attr('checked') != undefined) {
                                    if ($("#hdnHistory_" + r + "").val().toUpperCase() == "Y") {
                                        editedValues += "ISAPPLIED|" + status + "|" + $("#hdnDCRVisitCode_" + r + "").val() + "$";
                                    }
                                    else {
                                        editedValues += "|" + status + "|" + $("#hdnDCRVisitCode_" + r + "").val() + "$";
                                    }
                                }
                                else {
                                    editedValues += "|" + status + "|" + $("#hdnDCRVisitCode_" + r + "").val() + "$";
                                }
                            }
                        }
                        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
                            if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "") != null) {
                                if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SPECIALITY_CODE") {
                                    if ($("#hdnSpecialityCode_" + r + "").val() != null && $("#hdnSpecialityCode_" + r + "").val() != '' && $("#hdnSpecialityCode_" + r + "").val() != undefined) {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnSpecialityCode_" + r + "").val().replace(/'/g, " ") + "^,";
                                        ColVal += $("#hdnSpecialityCode_" + r + "").val().replace(/'/g, " ") + "|";
                                    }
                                    else {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                        ColVal += "|";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CATEGORY") {
                                    if ($("#hdnCategory_" + r + "").val() != null && $("#hdnCategory_" + r + "").val() != '' && $("#hdnCategory_" + r + "").val() != undefined) {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnCategory_" + r + "").val().replace(/'/g, " ") + "^,";
                                        ColVal += $("#hdnCategory_" + r + "").val().replace(/'/g, " ") + "|";
                                    }
                                    else {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                        ColVal += "|";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "SUBREGION_CODE") {
                                    if ($("#hdnSubRegionCode_" + r + "").val() != null && $("#hdnSubRegionCode_" + r + "").val() != '' && $("#hdnSubRegionCode_" + r + "").val() != undefined) {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnSubRegionCode_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                        ColVal += $("#hdnSubRegionCode_" + r + "").val().replace(/'/g, " ") + "|";
                                    }
                                    else {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                        ColVal += "|";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "CUSTOMER_GROUP") {
                                    if ($("#hdnCustomerGroup_" + r + "").val() != null && $("#hdnCustomerGroup_" + r + "").val() != '' && $("#hdnCustomerGroup_" + r + "").val() != undefined) {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnCustomerGroup_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                        ColVal += $("#hdnCustomerGroup_" + r + "").val().replace(/'/g, " ") + "|";
                                    }
                                    else {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                        ColVal += "|";
                                    }
                                }
                                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == "DEPOT_CODE") {
                                    if ($("#hdnDepotCode_" + r + "").val() != null && $("#hdnDepotCode_" + r + "").val() != '' && $("#hdnDepotCode_" + r + "").val() != undefined) {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $("#hdnDepotCode_" + r + "").val().replace(/'/g, " ") + "^" + ",";
                                        ColVal += $("#hdnDepotCode_" + r + "").val().replace(/'/g, " ") + "|";
                                    }
                                    else {
                                        editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                        ColVal += "|";
                                    }
                                }
                                else {
                                    if (entityColumns_g.Tables[0].Rows[i].DATA_TYPE.slice(0, 4).toUpperCase() == 'DATE') {
                                        var date = $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val();
                                        if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val() != null) {
                                            if (date != '' && date != undefined && date != null) {
                                                var convertedDate = date.split('/')[2] + "-" + date.split('/')[1] + "-" + date.split('/')[0];
                                                editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + convertedDate + "^,";
                                                ColVal += convertedDate + "|";
                                            }
                                            else {
                                                editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                                ColVal += "|";
                                            }
                                        }
                                    }
                                    else {
                                        if ($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val() != null && $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val() != '' &&
                                             $("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val() != undefined) {
                                            editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^" + $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val()).replace(/'/g, " ") + "^,";
                                            ColVal += $.trim($("#txt_" + entityColumns_g.Tables[0].Rows[i].Field_Name + "_" + r + "").val()).replace(/'/g, " ") + "|";
                                        }
                                        else {
                                            editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                            ColVal += "|";
                                        }
                                    }
                                }
                            }
                            else {
                                editedValues += entityColumns_g.Tables[0].Rows[i].Field_Name + "=^^,";
                                ColVal += "|";
                            }
                        }
                        editedValues = editedValues.slice(0, -1);
                        editedValues += "~";
                        ColVal = ColVal.slice(0, -1);
                        ColVal += "~";
                        $("#hdnEdit_" + r + "").val('0');
                    }
                }
            }
        }
            columnNames = columnNames.slice(0, -1);
            columnValues = columnValues.slice(0, -1);
            editedValues = editedValues.slice(0, -1);
            ColVal = ColVal.slice(0, -1);
            if (columnValues == '') {
                if (editedValues == '') {
                    $("#dvAjaxLoad").hide();
                    fnMsgAlert('info', 'Info', 'Please do some changes then click save.');
                    return;
                }
                else {
                    $("#dvAjaxLoad").hide();
                }
            }

            var latitude = "";
            var longitude = "";
            if (Option == 'S' && jsonCheckDuplicate_g != null && jsonCheckDuplicate_g != '' && jsonCheckDuplicate_g != undefined && jsonCheckDuplicate_g.length > 0) {
                fnCheckduplicatevalidationOnkeycolumn();
                if (duplicatecountonkeycolumn > 0) {
                    if (!confirm('The doctors are already entered for ' + jsonCheckDuplicate_g + '. Do you wish to continue?'))
                        return false;
                }
                $.ajax({
                    url: '/DoctorMaster/BulkAdd/',
                    type: "POST",
                    data: $("form").serialize() + "&DateTime=" + new Date().getTime() + "&RegionCode=" + $("#Region_Code").val() + "&EntityName=" + $("#Entity").val() +
                        "&Columns=" + columnNames + "&Values=" + escape(columnValues) + "&Edited_Values=" + escape(editedValues) + "&ColumnValues=" + escape(ColVal) + "",
                    success: function (result) {
                        if (result.split(':')[0] == 'SUCCESS') {
                            $("#dvAjaxLoad").hide();
                            //  fnMsgAlert('success', 'Success', result.split(':')[1].split('^')[0] + ' Rows inserted.' + result.split(':')[1].split('^')[1] + ' Rows updated.');
                            fnMsgAlert('success', 'Success', 'Records updated successfully');
                            //   fnGetCustomerEntityDetails();
                            $("#dvBulkDoctors").html('');
                            if (option == "N") {
                                pageNum = parseInt(pageNum) + 1;
                                fnGetBulkCustomerDetails("NO");
                            }
                            else if (option == "S") {
                                fnGetBulkCustomerDetails("YES");
                            }
                            else {
                                $("#dvExcelTopSave").css('display', 'none');
                                $("#dvExcelBottomSave").css('display', 'none');
                            }
                            $("#btnTopSave").show();
                            $("#btnSave").show();
                            $('#cboFields').val('0')
                        }
                        else {
                            fnMsgAlert('error', 'Error', 'Customer addition failed');
                            $("#dvAjaxLoad").hide();
                        }
                    },
                    error: function () {
                        fnMsgAlert('error', 'Error', 'Failed');
                        $("#btnTopSave").show();
                        $("#btnSave").css('display', '');
                        $('#cboFields').val('0')
                        $("#dvAjaxLoad").show();
                    }
                });
            }
            else {
                $.ajax({
                    url: '/DoctorMaster/BulkAdd/',
                    type: "POST",
                    data: $("form").serialize() + "&DateTime=" + new Date().getTime() + "&RegionCode=" + $("#Region_Code").val() + "&EntityName=" + $("#Entity").val() +
                        "&Columns=" + columnNames + "&Values=" + escape(columnValues) + "&Edited_Values=" + escape(editedValues) + "&ColumnValues=" + escape(ColVal) + "",
                    success: function (result) {
                        if (result.split(':')[0] == 'SUCCESS') {
                            $("#dvAjaxLoad").hide();
                            //  fnMsgAlert('success', 'Success', result.split(':')[1].split('^')[0] + ' Rows inserted.' + result.split(':')[1].split('^')[1] + ' Rows updated.');
                            fnMsgAlert('success', 'Success', 'Records updated successfully');
                            //   fnGetCustomerEntityDetails();
                            $("#dvBulkDoctors").html('');
                            if (option == "N") {
                                pageNum = parseInt(pageNum) + 1;
                                fnGetBulkCustomerDetails("NO");
                            }
                            else if (option == "S") {
                                fnGetBulkCustomerDetails("YES");
                            }
                            else {
                                $("#dvExcelTopSave").css('display', 'none');
                                $("#dvExcelBottomSave").css('display', 'none');
                            }
                            $("#btnTopSave").show();
                            $("#btnSave").show();
                            $('#cboFields').val('0')
                        }
                        else {
                            fnMsgAlert('error', 'Error', 'Customer addition failed');
                            $("#dvAjaxLoad").hide();
                        }
                    },
                    error: function () {
                        fnMsgAlert('error', 'Error', 'Failed');
                        $("#btnTopSave").show();
                        $("#btnSave").css('display', '');
                        $('#cboFields').val('0')
                        $("#dvAjaxLoad").show();
                    }
                });
            }

            //need to write
            // $("#dvAjaxLoad").hide();
        }
        else {
            $("#btnTopSave").show();
            $("#btnSave").show();
            $('#cboFields').val('0')
            $("#dvAjaxLoad").hide();
        }
    }

}

/*
*  Bind columns for bulk edit 
*/
function fnBindFields() {
    var fields = $("#cboFields");
    fields.append("<option value='0'>-Select Field-</option>");
    for (var j = 0; j < entityColumns_g.Tables[0].Rows.length; j++) {
        fields.append("<option value='" + entityColumns_g.Tables[0].Rows[j].Field_Name + "'>" + entityColumns_g.Tables[0].Rows[j].Field_Alias_Name + "</option>");
    }
    $("select#cboFields").attr('selectedIndex', 0);
}

/*
*  update the selected row values 
*/
function fnUpdate() {
    var flag = true;
    var errormsg = "";
    var cboFieldValue = $("#cboFields").val();
    cboFieldValue = $.trim(cboFieldValue);
    var fieldValue = $("#txtField").val();
    fieldValue = $.trim(fieldValue);
    if ($.trim(fieldValue) != '') {
        var cnt = 0;
        var arExist = new Array();
        var ar = new Array();
        arExist = $("#cboFields option:selected").text().split('(');
        if (arExist.length > 1) {
            var text = $("#cboFields option:selected").text().split('(')[1].replace(')', '');
            ar = text.split('/');
            var cnt = 0;
            for (var j = 0; j < ar.length; j++) {
                if (fieldValue.toUpperCase() == ar[j].toUpperCase()) {
                    cnt++;
                }
            }
            if (cnt == 0) {
                fnMsgAlert('info', 'Validate', "Please validate " + $("#cboFields option:selected").text() + " ");
                return false;
            }
        }
        if ($("input:checkbox[name=chkSelectCustomer]:checked").length == 0) {
            fnMsgAlert('info', 'Validate', "Please select any one customer");
            return false;
        }

        var i = 0;
        $("input:checkbox[name=chkSelectCustomer]").each(function () {
            var txtId = this.id;
            //var a = txtId.split('_')[1];
            //a = parseInt(a) + 1
            //var txtId = 'chkSelect_' + a;
            i++;
            if (this.checked) {

                if ($("#cboFields").val().toUpperCase() == "SPECIALITY_CODE") {
                    var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                    if (privilegeValue != "DISABLED") {
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                        if ($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('"') == -1 && $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('\\') == -1) {
                            var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "\")]");
                            if (disJson != false) {
                                if (disJson != undefined) {
                                    $("#" + txtId.replace("chkSelect", "hdnSpecialityCode")).val(disJson[0].value);
                                    if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                        $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                    }
                                }
                                else {
                                    fnMsgAlert('info', 'Validate', 'Please validate speciality');
                                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                    flag = false;
                                    return false;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'Validate', 'Please validate speciality');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                flag = false;
                                //Category

                                return false;
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate speciality');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                            flag = false;
                            //Category

                            return false;
                        }

                    }

                    else {
                        if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() != 'APPROVED') {
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                            if ($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('"') == -1 && $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('\\') == -1) {
                                var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "\")]");
                                if (disJson != false) {
                                    if (disJson != undefined) {
                                        $("#" + txtId.replace("chkSelect", "hdnSpecialityCode")).val(disJson[0].value);
                                        if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                            $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                            $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                        }
                                    }
                                    else {
                                        fnMsgAlert('info', 'Validate', 'Please validate speciality');
                                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                        flag = false;
                                        return false;
                                    }
                                }
                                else {
                                    fnMsgAlert('info', 'Validate', 'Please validate speciality');
                                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                    flag = false;
                                    //Category

                                    return false;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'Validate', 'Please validate speciality');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                flag = false;
                                //Category

                                return false;
                            }
                        }
                        else {
                            flag = false;
                            errormsg += i + ',';
                        }
                    }
                }

                else if ($("#cboFields").val().toUpperCase() == "CATEGORY") {
                    var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                    if (privilegeValue != "DISABLED") {
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                        if ($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('"') == -1 && $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('\\') == -1) {
                            var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "\")]");
                            if (disJson != false) {
                                if (disJson != undefined) {
                                    $("#" + txtId.replace("chkSelect", "hdnCategory")).val(disJson[0].value);
                                    if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                        $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                    }
                                }
                                else {
                                    fnMsgAlert('info', 'Validate', 'Please validate category');
                                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                    flag = false;
                                    return false;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'Validate', 'Please validate category');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                flag = false;
                                return false;
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate category');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                            flag = false;
                            return false;
                        }
                    }
                    else {
                        if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() != 'APPROVED') {
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                            if ($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('"') == -1 && $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val().indexOf('\\') == -1) {
                                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "\")]");
                                if (disJson != false) {
                                    if (disJson != undefined) {
                                        $("#" + txtId.replace("chkSelect", "hdnCategory")).val(disJson[0].value);
                                        if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                            $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                            $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                        }
                                    }
                                    else {
                                        fnMsgAlert('info', 'Validate', 'Please validate category');
                                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                        flag = false;
                                        return false;
                                    }
                                }
                                else {
                                    fnMsgAlert('info', 'Validate', 'Please validate category');
                                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                    flag = false;
                                    return false;
                                }
                            }
                            else {
                                fnMsgAlert('info', 'Validate', 'Please validate category');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                                flag = false;
                                return false;
                            }
                        }
                        else {
                            flag = false;
                            errormsg += i + ',';
                        }
                    }
                }
                    //Depot Code
                else if ($("#cboFields").val().toUpperCase() == "DEPOT_CODE") {
                   

                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    var disJson = jsonPath(depot_g, "$[?(@.label=='" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#" + txtId.replace("chkSelect", "hdnDepotCode")).val(disJson[0].value);
                            if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate Depot');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                            flag = false;
                            return false;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Validate', 'Please validate Depot');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                        flag = false;
                        return false;
                    }
                }
                //else if ($("#cboFields").val().toUpperCase() == "Phone_Number") {
                //    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                //    var result =fnChekInteger($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase()));
                //    if (!result) {
                //        fnMsgAlert('info', 'Validate', 'Numbers only accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                //        return false;
                //    }
                //}
                //else if($("#cboFields").val().toUpperCase() == "Primary_Contact")
                //{
                //    var result = fnCheckSpecialCharacterforCustomerName($("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase()));
                //    if (!result) {
                //        fnMsgAlert('info', 'Validate', 'Special Characters are not accepted. Please validate ' + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name);
                //        return false;
                //    }
                //}
                    //Sub region

                else if ($("#cboFields").val().toUpperCase() == "SUBREGION_CODE") {
                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    var disJson = jsonPath(subRegion_g, "$[?(@.label=='" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#" + txtId.replace("chkSelect", "hdnSubRegionCode")).val(disJson[0].value);
                            if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate SubRegion');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                            flag = false;
                            return false;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Validate', 'Please validate SubRegion');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                        flag = false;
                        return false;
                    }
                }
                    //Customer Group

                else if ($("#cboFields").val().toUpperCase() == "CUSTOMER_GROUP") {

                    $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    var disJson = jsonPath(customerGroup_g, "$[?(@.label=='" + $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val() + "')]");
                    if (disJson != false) {
                        if (disJson != undefined) {
                            $("#" + txtId.replace("chkSelect", "hdnCustomerGroup")).val(disJson[0].value);
                            if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                                $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                            }
                        }
                        else {
                            fnMsgAlert('info', 'Validate', 'Please validate Customer Group');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                            flag = false;
                            return false;
                        }
                    }
                    else {
                        fnMsgAlert('info', 'Validate', 'Please validate Customer Group');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val('');
                        flag = false;
                        return false;
                    }
                }
                else if (cboFieldValue.toUpperCase() == "CUSTOMER_NAME") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                        if (privilegeValue == "DISABLED") {
                            var customerNameEdit = fnGetPrivilegeVal("CAN_CHANGE_CUSTOMER_NAME", "NO");
                            if (customerNameEdit == "YES") {
                                $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                            }
                            else {
                                flag = false;
                                errormsg += i + ',';
                            }
                        }
                        else {
                            var customerNameEdit = fnGetPrivilegeVal("CAN_CHANGE_CUSTOMER_NAME", "NO");
                            if (customerNameEdit == "YES") {
                                $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                                $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                                $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                            }
                            else {
                                flag = false;
                                errormsg += i + ',';
                            }
                        }
                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "DRUG_LICENSE_NUMBER1") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "DRUG_LICENSE_NUMBER2") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "TIN_NUMBER") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "CST_NUMBER") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "REGISTRATION_NUMBER") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "SUBREGION_CODE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "ADDRESS1") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "LOCAL_AREA") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "CITY") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PIN_CODE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PHONE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "MOBILE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "FAX") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "EMAIL") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "DESTINATION_PLACE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "PRODUCT_DISCOUNT_APPLICABLE_STATUS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "SPECIAL_DISCOUNT_RATE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PLACE_TYPE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "REGISTERED_DELEAR_STATUS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PARTY_LOCATION") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "LOCKED") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "DOB") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "REMARKS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PRIMARY_CONTACT") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "PRIMARY_EMAIL") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "OCTROI_RATE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "TAX_EXEMPTED_STATUS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else if (cboFieldValue.toUpperCase() == "CFORM_AVAILABILITY") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "OCTROI_REIMBURSMENT_STATUS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

                else if (cboFieldValue.toUpperCase() == "ADDITIONAL_SURCHARGE_STATUS") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "CST_APPLICABLE") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());

                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }


                else if (cboFieldValue.toUpperCase() == "MDL_NUMBER") {
                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");

                        alert(privilegeValue);
                        if (privilegeValue == "DISABLED") {
                            flag = false;
                            errormsg += i + ',';
                        }
                        else {
                            $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                            $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                        }
                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                    //Gender
                else if (cboFieldValue.toUpperCase() == "GENDER") {

                    if ($("#" + txtId.replace("chkSelect", "tdStatus")).html() == 'APPROVED') {
                        var gender = $.trim($('#txtField').val()).toUpperCase();
                        if ($.inArray(gender, genderJson_g) == -1) {
                            // $("#txt_Gender_" + s).addClass("errorIndicator");
                            //$("#" + txtId).attr('title', 'Please enter M for Male and F for Female on Gender column.');
                            //fnIndicateError(id);
                            flag = false;
                            fnMsgAlert('info', 'Validate', 'Please enter M for Male and F for Female on Gender column.');
                            return false;
                        }
                        var privilegeValue = fnGetPrivilegeValue("DOCTOR_MANDATORY_FIELD_MODIFICATION", "ENABLED");
                        if (privilegeValue == "DISABLED") {
                            flag = false;
                            errormsg += i + ',';
                        }
                        else {
                            $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                            $("#" + txtId.replace("chkSelect", "hdnHistory")).val('Y');
                            $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                        }
                    }
                    else {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');                 
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }
                else {
                    if ($("#" + txtId.replace("chkSelect", "hdnEdit")).val().toUpperCase() != 'INSERT') {
                        $("#" + txtId.replace("chkSelect", "hdnEdit")).val('Y');
                        $("#txt_" + txtId.replace("chkSelect", cboFieldValue)).val(fieldValue.toUpperCase());
                    }
                }

            }
        });

        if (flag && errormsg == '') {
            fnMsgAlert('success', 'Success', 'Field values updated successfully');
            $("#txtField").val('');
        }
        else {
            if (errormsg != '') {
                var arr = $.unique(errormsg.split(','));
                var data = arr.join(",");
                fnMsgAlert('info', 'Info', "you cannot change the mandatory fields at row number" + data.slice(0, -1));
                $("#txtField").val('');
            }
        }
    }
    else {
        fnMsgAlert('info', 'Validate', 'Please fill any value then click update');
        return;
    }

}

/*
* select all checkboxes
*/
function fnSelectAll() {

    if ($("input:checkbox[name=chkSelect]").attr("checked") == "checked") {
        $("input:checkbox[name=chkSelectCustomer]").each(function () {
            this.checked = true;
        });
        $("#chkSelect_" + (parseFloat(rowNumber) - 1).toString()).attr("checked", false);
    }
    else {
        $("input:checkbox[name=chkSelectCustomer]").each(function () {
            this.checked = false;
        });
    }
}

/*
* select all checkboxes
*/
function fnTransferSelectAll() {
    if ($("input:checkbox[name=chkTransferSelectAll]").attr("checked") == "checked") {
        $("input:checkbox[name=chkStatusChange]").each(function () {
            this.checked = true;
        });
        $("#chkIsApplied_" + (parseFloat(rowNumber) - 1).toString()).attr("checked", false);
    }
    else {
        $("input:checkbox[name=chkStatusChange]").each(function () {
            this.checked = false;
        });
    }
}


/*
* page navigation option
*/
function fnOpenOptions(page) {

    $("#dvPages").html('');
    var content = "";
    if (page.toUpperCase() == "SINGLE") {
        if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Modify</div>";
        }
        else {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk/Add Modify</div>";
            //   content = "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div><div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }

    else if (page.toUpperCase() == "BULK") {
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>";
        if (ccmConfigValue.toUpperCase() != 'ENABLED' && $("#Entity").val().toUpperCase() != "DOCTOR") {
            // content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        // <div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div><div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }

    else if (page.toUpperCase() == "EXCEL" && ccmConfigValue.toUpperCase() != 'ENABLED' && $("#Entity").val().toUpperCase() != "DOCTOR") {
        content += " <div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>";
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Add/Modify</div>";
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        // <div style='width: 100%;' onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div><div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }

    else if (page.toUpperCase() == "DOCTOR PRODUCT") {
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>";
        if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Modify</div>";
        }
        else {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk/Add Modify</div>";
            // content = "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div><div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }

    else if (page.toUpperCase() == "HDINSIGHTS") {
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>";
        if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Modify</div>";
        }
        else {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk/Add Modify</div>";
            // content = "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        // <div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div>";
    }

    else if (page.toUpperCase() == "DATA QUALITY") {
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>";
        if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Modify</div>";
        }
        else {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk/Add Modify</div>";
        }
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkCopy\");'>Copy Customer from other region</div>";
        //content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        // <div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }

    else {
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"SingleAdd\");'>Single Add</div>"
        if (ccmConfigValue.toUpperCase() == 'ENABLED' && $("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk Modify</div>";
        }
        else {
            content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"BulkAdd\");'>Bulk/Add Modify</div>";
            //content = "<div onclick='fnRedirectPages(\"DoctorMaster\",\"ExcelUpload\");'>Bulk Add(Excel Upload)</div>";
        }
        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
            content += "<div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        }
        //  content += " <div onclick='fnRedirectToDocProd()'>Doctor Product Mapping</div>";
        content += "<div onclick='fnRedirectPages(\"DoctorMaster\",\"HDDataQuality\");'>" + $("#Entity").val() + " Data Quality</div><div onclick='fnRedirectPages(\"DoctorMaster\",\"HDInsights\");'>HD Insights</div>";
    }
    $("#dvPages").html(content);
    if ($("#dvPages").is(":visible")) {
        $("#dvPages").css('display', 'none');
    }
    else {
        $("#dvPages").css('display', '');
    }
}

/*
* redirect page
*/
function fnRedirectPages(controller, page) {

    $("#main").load("HiDoctor_Master/" + controller + "/" + page + "/" + $("#Table_Name").val() + "_" + $("#Entity").val());
}

function fnRedirectToDocProd() {
    //var obj = jsonPath(menu_g , "$.Tables[0].Rows[?(@.Menu_URL=='~/ScreensMaster/DoctorProductMapping1.aspx')]");
    //if (obj.length > 0) {
    //    $("#main").load("Home/SFAWA/" + obj[0].Menu_Id);
    //}

    var disDCRJson = jsonPath(menuContent_g, "$.Tables[0].Rows[?(@.Menu_URL=='HiDoctor_Master/MarketingCampaign/DoctorProductMapping')]");
    if (disDCRJson != false) {
        fnLoadBody(disDCRJson[0].Menu_URL, '', disDCRJson[0].Menu_Id);
        //content += "<div class='quickLinks' onclick='fnLoadBody(\"" + disDCRJson[0].Menu_URL + "\",\"\",\"" + disDCRJson[0].Menu_Id + "\");'>";
        //content += "<img src='../Images/DCR_approval.png' title='Click here to approve DCRs' /></div>";
    }
    else {
        fnMsgAlert("info", "Doctor Master", "Dear User, You have not access for Doctor Product Mapping. Please contact administrator.");
    }
    // parent.location.href = "http://" + domainName_g + "/Screensmaster/DoctorProductMapping1.aspx";
}
/*
* delete flexi doctor entry
*/
function fnDeleteFlexiEntry(customerName, dcrCode, page) {

    var res = confirm('Do you want to change the status of this customer?');
    if (res) {
        $("#dvAjaxLoad").show();
        //ChangeFlexiDocStatus
        $.ajax({
            url: '../HiDoctor_Master/DoctorMaster/ChangeFlexiDocStatus/',
            type: "POST",
            data: "RegionCode=" + $("#Region_Code").val() + "&CustomerName=" + customerName + "&DCRCode=" + dcrCode + "",
            success: function (result) {
                $("#dvAjaxLoad").hide();
                if (result.split(':')[0].toUpperCase() == 'SUCCESS') {
                    fnMsgAlert('success', 'Success', 'Flexi doctor status changed successfully');
                    if (page.toUpperCase() == "SINGLE") {
                        fnGetCustomerEntityDetails();
                    }
                    else {
                        fnGetBulkCustomerDetails("NO");
                    }
                }
                else {
                    fnMsgAlert('error', 'Error', 'Flexi doctor status change failed');
                }
            },
            error: function () {
                $("#dvAjaxLoad").hide();
            }
        });
    }
}

function fnClosePopUp(id) {
    $("#" + id).overlay().close();
}


function fnShowRCPA() {
}

/**************** Customer Bulk Copy *******************/
function fnGetApproval() {
    $.ajax({
        url: '../HiDoctor_Master/DoctorMaster/BulkCopy/',
        type: "POST",
        data: "Inherited_Region=" + selKeys + "",
        success: function (jsData) {
            fnMsgAlert('success', 'Success', 'Your request sent for approval');
            $("#dvRightPanel").css("display", 'none');
        },
        error: function () {
            // $("#dvAjaxLoad").hide();
        }
    });
}

function fnGetCustomers() {
    $("#dvBulkDoctors").html('');
    $("#dvAjaxLoad").show();
    var regionCodes = "";
    for (var a = 0; a < selKeys.length; a++) {
        regionCodes += '^' + selKeys[a] + '^,';
    }
    regionCodes = regionCodes.slice(0, -1);
    if (regionCodes != "") {
        $.ajax({
            url: '../HiDoctor_Master/DoctorMaster/GetInheritedCustomers/',
            type: "POST",
            data: "Inherited_Region=" + regionCodes + "&EntityName=" + $("#Entity").val() + "&TableName=" + $("#Table_Name").val() + "",
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                fnCreateTable(jsData);
                $("#dvAjaxLoad").hide();
            },
            error: function () {
                // $("#dvAjaxLoad").hide();
            }
        });
    }
    else {
        fnMsgAlert('info', 'Error', 'Please select any one region');
        $("#dvAjaxLoad").hide();
        return;
    }
}



function fnCreateTable(jsData) {
    var content = "";
    var tableWidth = "";

    if (entityColumns_g.Tables[0].Rows.length > 0) {
        content += "<table class='data display datatable filterable' style='overflow:auto !important;' id='tblBulkDoctor'>";
        content += "<thead style='background-color:#F8F8F8;' id='tblHeadBulkDoctor'>";
        content += "<tr style='background-color:#F8F8F8;'>";
        content += "<th id='tdMain' style='min-width:20px !important;background-color:#f8f8f8'></th>";
        content += "<th id='tdMainChkSelectBox' style='min-width:20px !important;'><input type='checkbox' id='chkSelect' name='chkSelect' onclick='fnSelectAll()'; /></th>";
        content += "<th style='background-color:#f8f8f8'>Region Name</th>";
        content += "<th style='background-color:#f8f8f8'>Division Name</th>";
        for (var h = 0; h < entityColumns_g.Tables[0].Rows.length; h++) {
            if (entityColumns_g.Tables[0].Rows[h].Display_Option == 'Y') {
                content += "<th style='min-width:150px !important;overflow:auto;'>";
                content += "" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "</th>";
                tableWidth = parseFloat(tableWidth) + 150;
            }
            else {
                content += "<th style='overflow:auto;display:none;'>";
                content += "" + entityColumns_g.Tables[0].Rows[h].Field_Alias_Name + "</th>";
            }
        }
        content += "<th style='min-width:40px !important;'></th>";
        content += "</thead><tbody>";
        //bind table body
        if (jsData.Tables[0].Rows.length > 0) {
            for (var r = 0; r < jsData.Tables[0].Rows.length; r++) {
                content += "<tr id='tr_" + (r + 1) + "'>";
                content += "<td id='tdMain_" + (r + 1) + "' style='min-width:20px !important;background-color:#f8f8f8' >";
                content += "</td>";
                content += "<td style='min-width:20px !important;'><input type='checkbox'  id='chkSelect_" + (r + 1) + "' name='chkSelectCustomer'   value='" + jsData.Tables[0].Rows[r]["Customer_Code"] + "'/></td>";
                content += "<td style='min-width:100px !important;'>" + jsData.Tables[0].Rows[r]["Region_Name"] + "</td>";
                content += "<td style='min-width:100px !important;'>" + jsData.Tables[0].Rows[r]["Division_Name"] + "</td>";
                for (var h = 0; h < entityColumns_g.Tables[0].Rows.length; h++) {
                    var displayClass = '';

                    if (entityColumns_g.Tables[0].Rows[h].Display_Option == 'N') {
                        displayClass = 'display:none;';
                    }
                    if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'SPECIALITY_CODE') {//
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r]["Speciality_Name"] + "</td>";
                    }
                    else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'CATEGORY') {
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r]["Category_Name"] + "</td>";
                    }
                    else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'DEPOT_CODE') {
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r]["Depot_Name"] + "</td>";
                    }
                    else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'CUSTOMER_GROUP') {
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r]["Customer_Group_Name"] + "</td>";
                    }
                    else if (entityColumns_g.Tables[0].Rows[h].Field_Name.toUpperCase() == 'SUBREGION_CODE') {
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r]["Subregion_Name"] + "</td>";
                    }
                    else {
                        content += "<td  id='tdMain_" + entityColumns_g.Tables[0].Rows[h].Field_Name + "_" + (r + 1) + "' style='min-width:100px !important;" + displayClass + "'>" + jsData.Tables[0].Rows[r][entityColumns_g.Tables[0].Rows[h].Field_Name] + "</td>";
                    }
                }
                content += "<td style='min-width:40px !important;'><input type='hidden' id='hdnRegionCode_" + (r + 1) + "' value='" + jsData.Tables[0].Rows[r].Region_Code + "'/></td>";
                content += "</tr>";
            }
            content += "</tbody></table>";

            $("#dvCopy").css('display', '');
        }
        else {
            fnMsgAlert('info', 'Message', 'No ' + $("#Entity").val() + ' found for the selectd region');
        }
        $("#dvBulkDoctors").html(content);
        //$(".filterable tr:has(td)").each(function () {
        //    var t = $(this).text().toLowerCase(); //all row text
        //    $("<td class='indexColumn'></td>")
        //     .hide().text(t).appendTo(this);
        //}); //each tr
        //$("#txtSearch").keyup(function () {
        //    var s = $(this).val().toLowerCase().split(" ");
        //    //show all rows.
        //    $(".filterable tr:hidden").show();
        //    $.each(s, function () {
        //        $(".filterable tr:visible .indexColumn:not(:contains('"
        //    + this + "'))").parent().hide();
        //    }); //each
        //}); //key up.
        //$("#tblBulkDoctor").dataTable({});
        $('#tblBulkDoctor').dataTable({
            "sPaginationType": "full_numbers", "bPaginate": false, "bDestroy": true, "sDom": 'T<"clear">lfrtip', "bSort": true, "bSearch": true//, "sGroupBy": "Doctor Name"
        });
    }
    $("#dvSearch").css('display', '');
}

function fnCopy() {
    var customerCodes = "";

    var count = 0;
    $("input:checkbox[name=chkSelectCustomer]").each(function () {
        if (this.checked) {
            var regionCode = "";
            regionCode = $("#" + this.id.replace("chkSelect", "hdnRegionCode")).val();
            customerCodes += $(this).val() + "_" + regionCode + "^";
            count = parseInt(count) + 1;
        }

    });
    if (count == 0) {
        fnMsgAlert('info', 'Validate', 'Please select atleast any one customer');
        return;
    }
    $.ajax({
        url: '../HiDoctor_Master/DoctorMaster/CopyCustomers/',
        type: "POST",
        data: "CustomerCodes=" + customerCodes + "&EntityName=" + $("#Entity").val() + "&TableName=" + $("#Table_Name").val() + "",
        success: function (jsData) {
            if (jsData.split(':')[0].toUpperCase() == "SUCCESS") {
                fnMsgAlert('success', 'Success', 'Inheritance done successfully');
                $("#dvSelectedRegion").html('');
                $("#spnSelectedCount").html(' 5 ');
                $("#dvBulkDoctors").html('');
                $("#dvCopy").css('display', 'none');
                fnValidateCopy();
                $("input:checkbox[name=chkSelectCustomer]").each(function () {
                    $(this).removeAttr("checked");
                });
            }
            else {
                fnMsgAlert('error', 'Error', 'Inheritance failed');
            }
        }
    });
}
function fnValidateCopy() {
    $.ajax({
        url: '../HiDoctor_Master/DoctorMaster/CheckCustomerApproval/',
        type: "POST",
        data: "A",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            if (jsData.Tables[0].Rows.length > 0) {
                fnMsgAlert('info', 'Message', "Your Previous request is waiting for approval. so you can not proceed.");
                return;
            }
            else if (jsData.Tables[1].Rows.length > 0) {
                fnBindFullRegionTreeWithCheckbox("dvRegionTree");
                fnGetInheritedCustomers();
            }
            else {
                fnBindFullRegionTreeWithCheckbox("dvRegionTree");
                //NEED_APPROVAL_FOR_INHERITED_CUSTOMERS
                var privilegeValue = fnGetPrivilegeVal("NEED_APPROVAL_FOR_INHERITED_CUSTOMERS", "NO");
                if (privilegeValue.toUpperCase() == "NO") {
                    $("#dvApproval").css("display", "none");
                    $("#dvGetDoctor").css("display", "");
                    $("#dvChangeRegion").css('display', 'none');
                }
                else {
                    $("#dvNotification").css('display', '');
                    $("#dvSelReg").css('display', '');
                    $("#dvApproval").css("display", "");
                    $("#dvNotification").css('display', '');
                }
                $("#dvRightPanel").css("display", '');
            }
        },
        error: function () {
            // $("#dvAjaxLoad").hide();
        }
    });
}

function fnGetInheritedCustomers() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '../HiDoctor_Master/DoctorMaster/GetApprovedInheritedCustomers/',
        type: "POST",
        data: "EntityName=" + $("#Entity").val() + "&TableName=" + $("#Table_Name").val() + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            fnCreateTable(jsData);
            $("#dvRightPanel").css("display", '');
            $("#dvNotification").css('display', 'none');
            $("#dvSelReg").css('display', 'none');
            $("#dvCopy").css('display', '');
            $("#dvSearch").css('display', '');
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnChangeRegion() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '../HiDoctor_Master/DoctorMaster/ChangeRegionForInheritance/',
        type: "POST",
        data: "A",
        success: function (result) {
            fnMsgAlert('Success', 'Success', 'Region Changed successfully');
            var privilegeValue = fnGetPrivilegeVal("NEED_APPROVAL_FOR_INHERITED_CUSTOMERS", "NO");
            if (privilegeValue.toUpperCase() == "NO") {
                $("#dvApproval").css("display", "none");
                $("#dvGetDoctor").css("display", "");
                $("#dvChangeRegion").css('display', 'none');
            }
            else {
                $("#dvNotification").css('display', '');
                $("#dvSelReg").css('display', '');
                $("#dvApproval").css("display", "");
                $("#dvNotification").css('display', '');
            }
            $("#dvBulkDoctors").html('');
            $("#dvAjaxLoad").hide();
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}

function fnValidateSpecialChar() {
    var cboFieldValue = $("#cboFields").val();
    var fieldValue = $("#txtField").val();
    if (cboFieldValue != '') {
        if (cboFieldValue.toUpperCase() == "ADDRESS1") {
            var result = fnCheckAddressSpecialChar("#txtField", 'info', 'Validate', 'Please remove the special character');
        }
        else if (cboFieldValue.toUpperCase() == "ADDRESS2") {
            var result = fnCheckAddressSpecialChar("#txtField", 'info', 'Validate', 'Please remove the special character');
        }
        else if (cboFieldValue.toUpperCase() == "EMAIL") {
            var result = fnEmailCheck("#txtField");
            if (!result) {
                fnMsgAlert('info', 'Validate', 'Please validate email id');
                return false;
            }
        }
        else if (cboFieldValue.toUpperCase() == "PRIMARY_EMAIL") {
            var result = fnEmailCheck("#txtField");
            if (!result) {
                fnMsgAlert('info', 'Validate', 'Please validate email id');
                return false;
            }
        }
        else {
            var result = fnCheckSpecialCharacter("#txtField", 'info', 'Validate', 'Please remove the special character');
        }
    }
}




//HD Insights
function fnBindDetails(mode) {
    var content = "";
    content = "<table class='data display datatable filterable'  style='width:100% !important' id='tblDoctor'><thead><tr>";
    for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
        if (entityColumns_g.Tables[0].Rows[i].Display_Option == 'Y') {
            content += "<th style='min-width:150px !important;'>" + entityColumns_g.Tables[0].Rows[i].Field_Alias_Name + "</th>";
        }
    }
    content += "</tr></thead>";
    content += "<tbody>";
    var obj = jsonPath(customerDtlJson, "$.Tables[0].Rows[?(@.Customer_Status=='" + mode.toUpperCase() + "')]");
    for (var j = 0; j < obj.length; j++) {
        content += "<tr>";
        for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
            if (entityColumns_g.Tables[0].Rows[i].Display_Option == 'Y') {
                if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'SPECIALITY_CODE') {
                    content += "<td>" + obj[j].Speciality_Name + "</td>";
                }
                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'CATEGORY') {
                    content += "<td>" + obj[j].Category_Name + "</td>";
                }
                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'SUBREGION_CODE') {
                    content += "<td>" + obj[j].Subregion_Name + "</td>";
                }
                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'CUSTOMER_GROUP') {
                    content += "<td>" + obj[j].Customer_Group_Name + "</td>";
                }
                else if (entityColumns_g.Tables[0].Rows[i].Field_Name.toUpperCase() == 'DEPOT_CODE') {
                    content += "<td>" + obj[j].Depot_Name + "</td>";
                }

                else {
                    content += "<td>" + obj[j][entityColumns_g.Tables[0].Rows[i].Field_Name] + "</td>";
                }
            }
        }
        content += "</tr>";
    }
    content += "</tbody>";
    $("#dvCustomerDetails").html(content);
    $('#tblDoctor').tablePagination({});
    //$('#tblDoctor').dataTable({
    //    "sPaginationType": "full_numbers", "bDestroy": true, "sDom": 'T<"clear">lfrtip', "oTableTools": { "sSwfPath": "/Content/ZeroClipboard.swf" }
    //});
}


//Data Quality
function fnDataQuality() {
    $("#dvAjaxLoad").show();
    $.ajax({
        url: '/DoctorMaster/GetDataQuality/',
        type: "POST",
        data: "Entity=" + $("#Entity").val() + "&RegionCode=" + $("#Region_Code").val() + "",
        success: function (jsData) {
            jsData = eval('(' + jsData + ')');
            customerDtlJson = jsData;
            if (jsData.Tables[0].Rows.length > 0) {
                var content = "";
                content += "<table class='data display datatable'>"
                content += "<thead><tr><td>Filed Name</td><td>Not Filled</td></tr></thead>"
                content += "<tbody>"
                for (var i = 0; i < entityColumns_g.Tables[0].Rows.length; i++) {
                    content += "<tr>"
                    content += "<td>" + entityColumns_g.Tables[0].Rows[i].Field_Name + "</td>";
                    if (jsData.Tables[0].Rows[0][entityColumns_g.Tables[0].Rows[i].Field_Name] != null) {
                        content += "<td>" + jsData.Tables[0].Rows[0][entityColumns_g.Tables[0].Rows[i].Field_Name] + "<td>"
                    }
                    else {
                        content += "<td>0<td>"
                    }
                    content += "</tr>"
                }
                content += "</tbody>"
                content += "</table>"

                $("#dvDataQuality").html(content);

                var value = 0;
                var data = "[";
                for (var c = 0; c < entityColumns_g.Tables[0].Rows.length; c++) {
                    if (jsData.Tables[0].Rows[0][entityColumns_g.Tables[0].Rows[c].Field_Name] != null) {
                        value = jsData.Tables[0].Rows[0][entityColumns_g.Tables[0].Rows[c].Field_Name];
                    }
                    data += "['" + entityColumns_g.Tables[0].Rows[c].Field_Name + "'," + parseFloat(value) + "]";
                    if (c < entityColumns_g.Tables[0].Rows.length - 1) {
                        data += ",";
                    }
                }
                data += "]";

                data = eval('(' + data + ')');
                var data1 = new google.visualization.DataTable(); // ([arr]);
                data1.addColumn('string', 'Field Name');
                data1.addColumn('number', 'Value');
                data1.addRows(data);
                productWrapper = new google.visualization.ChartWrapper({
                    dataTable: data1,
                    containerId: 'dvDataQualtityChart',
                    chartType: 'BarChart',
                    colors: ['red', '#004411'],
                    width: 700,
                    height: 1000
                });
                productWrapper.draw();


                $("#dvAjaxLoad").hide();
            }
            else {
                $("#dvAjaxLoad").hide();
            }
        },
        error: function () {
            $("#dvAjaxLoad").hide();
        }
    });
}


function fnDoctor360Popup() {
    if ($("#Customer_Code").val() == "") {
        fnMsgAlert('info', 'Validate', 'Please select any one doctor');
        return;
    }
    $.ajax({
        url: '../DoctorMaster/GetRegionwiseUser/',
        type: "POST",
        data: "RegionCode=" + $("#Region_Code").val() + "",
        success: function (jsData) {
            if (jsData != '') {
                jsData = eval('(' + jsData + ')');
                if (jsData.Tables[0].Rows.length > 0) {
                    var userCode = jsData.Tables[0].Rows[0].User_Code;
                    var customerCode = $("#Customer_Code").val()
                    var regionCode = $("#Region_Code").val();
                    var val = regionCode + "_" + customerCode + "_" + userCode;
                    //  $.modal({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + val, title: 'Reports', overlayClose: false });
                    $.modalWithoutHeader({ ajax: '../HiDoctor_Reports/Reports/Customer360/' + customerCode, title: 'Reports', overlayClose: true });
                    return;
                }
                else {
                    fnMsgAlert('info', 'Information', 'User details not found for the selected region');
                }
            }
        }
    });

}



function fnNext() {
    if (parseInt(pageNum) + 1 < Math.ceil((parseFloat(noOfCustomerRecords) / 50))) {
        pageNum = parseInt(pageNum) + 1;
        fnGetBulkCustomerDetails("NO");
    }
}


function fnPrevious() {
    if (pageNum > 0) {
        pageNum = parseInt(pageNum) - 1;
        fnGetBulkCustomerDetails("NO");
    }
}


//function fnGoToPrevPage() {
//    var pno = parseInt($('#pageno').html()) - 1;
//    fnGetBulkCustomerDetails("NO", pno);
//}
//function fnGoToNextPage() {
//    var pno = parseInt($('#pageno').html()) + 1;
//    fnGetBulkCustomerDetails("NO", pno);
//}
//function fnGoToPage() {
//    var pno = $('#drpPaging :selected').val();
//    fnGetBulkCustomerDetails("NO", pno);
//}

function fnValidateSelection() {
    fnClearEntityDetails();
    var flag = true;
    $("input:checkbox[name=chkMode]").each(function () {
        if (this.checked) {
            if ($(this).val() == 'ALL') {
                flag = false;
            }
        }
    });
    if (flag == false) {
        $("#chkDraft").removeAttr('checked');
        $("#chkApplied").removeAttr('checked');
        $("#chkApproved").removeAttr('checked');
        $("#chkUnapproved").removeAttr('checked');
    }
    pageNum = 0;
}



function fnValidateValues(exceloption) {
    var configresult = false

    try {
        //   $("#dvAjaxLoad").show();
        var flag = true;
        var rowCnt = $("#tblBulkDoctor tr").length;
        var ErrorCount = 0;
        for (var i = 1; i < rowCnt - 1; i++) {
            if (($("#chkSelect_" + i).is(':checked'))){
            var tdLen = $("#tblBulkDoctor tr").eq(i).find("td").length;
            if ($("#txt_Customer_Name_" + i).val() != "") {
                var rowErrorCount = 0;
                for (var d = 3; d < tdLen; d++) {
                    var td = $($("#tblBulkDoctor tr").eq(i).find("td")[d])[0];
                    var obj = $(td).eq(0).find("input")[0];
                    if (obj != undefined) {
                        var inputId = $(td).eq(0).find("input")[0].id;
                        for (var s = 0; s < entityColumns_g.Tables[0].Rows.length; s++) {
                            var fName = entityColumns_g.Tables[0].Rows[s].Field_Name;
                            var compareName = "txt_" + fName + "_" + i;
                            if (inputId.toUpperCase() == compareName.toUpperCase()) {
                                var dataType = entityColumns_g.Tables[0].Rows[s].DATA_TYPE;
                                var aliasName = entityColumns_g.Tables[0].Rows[s].Field_Alias_Name;
                                var textMaxlength = entityColumns_g.Tables[0].Rows[s].Len;
                                var txtId = inputId;
                                var isNullable = entityColumns_g.Tables[0].Rows[s].Nullable;
                                //Customer Name Validation                              
                                if (inputId.toUpperCase() == "TXT_CUSTOMER_NAME_" + i) {
                                    var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Remove the special characters at customer name.');
                                    var id = $("#" + txtId);
                                    if (!result) {
                                        $("#" + txtId).addClass("errorIndicator");
                                        $("#" + txtId).attr('title', 'Please remove the special characters In Customer Name');
                                        fnIndicateError(id);
                                        ErrorCount = 1;
                                        rowErrorCount = 1;
                                    }
                                    else {
                                        fnRemoveIndicationforColumn("#" + txtId);
                                        $("#" + txtId).removeClass("errorIndicator");
                                    }
                                }
                                    //if (txtId.toUpperCase() == "TXT_PHONE_" + i) {
                                    //    if ($("#Entity").val().toUpperCase() == "CHEMIST") {
                                    //        if ($.trim($("#" + txtId).val()).length == 0) {
                                    //            fnMsgAlert('info', 'Validate', 'Please Enter phone number.');
                                    //            fnIndicateError(id);
                                    //            ErrorCount = 1;
                                    //            rowErrorCount = 1;
                                    //        }
                                    //    }
                                    //}
                                    //if (txtId.toUpperCase() == "TXT_PRIMARY_CONTACT_" + i) {
                                    //    if ($("#Entity").val().toUpperCase() == "CHEMIST") {
                                    //        if ($.trim($("#" + txtId).val()).length == 0) {
                                    //            fnMsgAlert('info', 'Validate','Please Enter primary contact name.');
                                    //            fnIndicateError(id);
                                    //            ErrorCount = 1;
                                    //            rowErrorCount = 1;
                                    //        }
                                    //    }
                                    //}
                                    //Category Validation
                                else if (inputId.toUpperCase() == "TXT_CATEGORY_" + i) {
                        
                                    var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
                                    // If Privilege YES
                                    if (($("#Entity").val().toUpperCase() == "DOCTOR") && (privilegeValue == "YES")) {
                                        var id = $("#txt_Category_" + i);
                                        if ($.trim($("#txt_Category_" + i).val()) == '' && $("#txt_Category_" + i).val() != undefined) {
                                            $("#txt_Category_" + i).addClass("errorIndicator");
                                            $("#txt_Category_" + i).attr('title', 'Please Enter category.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1
                                        }


                                        if ($.trim($("#txt_Category_" + i).val()) != '' && $("#txt_Category_" + i).val() != undefined) {
                                            if ($("#txt_Category_" + i).val().indexOf('"') == -1 && $("#txt_Category_" + i).val().indexOf('\\') == -1) {
                                                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category_" + i).val()).toUpperCase() + "\")]");
                                                var id = $("#txt_Category_" + i);
                                                if (disJson != null) {
                                                    if (disJson != false) {
                                                        $("#hdnCategory_" + i).val(disJson[0].value);
                                                    }
                                                    else {
                                                        $("#txt_Category_" + i).addClass("errorIndicator");
                                                        $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                        fnIndicateError(id);
                                                        ErrorCount = 1;
                                                        rowErrorCount = 1;
                                                    }
                                                }
                                                else {
                                                    $("#txt_Category_" + i).addClass("errorIndicator");
                                                    $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                    fnIndicateError(id);
                                                    ErrorCount = 1;
                                                    rowErrorCount = 1;
                                                }
                                            }
                                        }
                                        else {// We handled the double quoets.
                                            var id = $("#txt_Category_" + i);
                                            $("#txt_Category_" + i).addClass("errorIndicator");
                                            $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }

                                    }
                                    else {
                                        if ($("#txt_Category_" + i).val() != '' && $("#txt_Category_" + i).val() != undefined) {
                                            if ($("#txt_Category_" + i).val().indexOf('"') == -1 && $("#txt_Category_" + i).val().indexOf('\\') == -1) {
                                                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category_" + i).val()).toUpperCase() + "\")]");
                                                var id = $("#txt_Category_" + i);
                                                if (disJson != null) {
                                                    if (disJson != false) {
                                                        $("#hdnCategory_" + i).val(disJson[0].value);
                                                    }
                                                    else {
                                                        $("#txt_Category_" + i).addClass("errorIndicator");
                                                        $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                        fnIndicateError(id);
                                                        ErrorCount = 1;
                                                        rowErrorCount = 1;
                                                    }
                                                }
                                                else {
                                                    $("#txt_Category_" + i).addClass("errorIndicator");
                                                    $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                    fnIndicateError(id);
                                                    ErrorCount = 1;
                                                    rowErrorCount = 1;
                                                }
                                            }
                                            else {// We handle double quoets.
                                                var id = $("#txt_Category_" + i);
                                                $("#txt_Category_" + i).addClass("errorIndicator");
                                                $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                                $("#hdnCategory_" + i).val('');
                                            }
                                        }
                                        else {

                                            $("#hdnCategory_" + i).val('');
                                        }
                                    }
                                }

                                else if (inputId.toUpperCase() == "TXT_SPECIALITY_CODE_" + i) {
                                    var id = $("#txt_Speciality_Code_" + i);
                                    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
                                        if ($.trim($("#txt_Speciality_Code_" + i).val()) == "") {
                                            $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                            $("#txt_Speciality_Code_" + i).attr('title', 'Please enter speciality.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                    }
                                    if ($.trim($("#txt_Speciality_Code_" + i).val()) != '' && $("#txt_Speciality_Code_" + i).val() != undefined) {
                                        if ($("#txt_Speciality_Code_" + i).val().indexOf('"') == -1 && $("#txt_Speciality_Code_" + i).val().indexOf('\\') == -1) {
                                            var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($("#txt_Speciality_Code_" + i).val()).toUpperCase() + "\")]");
                                            if (disJson != null) {
                                                if (disJson != false) {
                                                    $("#hdnSpecialityCode_" + i).val(disJson[0].value);
                                                }
                                                else {
                                                    $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                    $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                    fnIndicateError(id);
                                                    ErrorCount = 1;
                                                    rowErrorCount = 1;
                                                }
                                            }
                                            else {
                                                $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                        else {// We handle double quotes.
                                            $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                            $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                    }
                                    else {
                                        //ErrorCount = 1;
                                        //rowErrorCount = 1;
                                        $("#hdnSpecialityCode_" + i).val('');
                                    }
                                }
                                else if (inputId.toUpperCase() == "TXT_SUBREGION_CODE_" + i) {
                              
                                    var id = $("#txt_SubRegion_Code_" + i);
                                    if ($("#txt_SubRegion_Code_" + i).val() != '' & $("#txt_SubRegion_Code_" + i).val() != undefined) {
                                        var disJson = jsonPath(subRegion_g, "$[?(@.label=='" + $.trim($("#txt_SubRegion_Code_" + i).val()).toUpperCase() + "')]");
                                        if (disJson != false) {
                                            if (disJson != undefined) {
                                                $("#hdnSubRegionCode_" + i).val(disJson[0].value);
                                            }
                                            else {
                                                $("#txt_SubRegion_Code_" + i).addClass("errorIndicator");
                                                $("#txt_SubRegion_Code_" + i).attr('title', 'Please validate subregion.');
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                        else {
                                            $("#txt_SubRegion_Code_" + i).addClass("errorIndicator");
                                            $("#txt_SubRegion_Code_" + i).attr('title', 'Please validate subregion.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                    }
                                    else {
                                        $("#hdnSubRegionCode_" + i).val('');
                                    }

                                }
                                else if (inputId.toUpperCase() == "TXT_DEPOT_CODE_" + i) {
                                    var id = $("#txt_Depot_Code_" + i);
                                    if ($("#txt_Depot_Code_" + i).val() != '' & $("#txt_Depot_Code_" + i).val() != undefined) {
                                        var cnt = 0;
                                        for (var a = 0; a < depot_g.length; a++) {
                                            if ($.trim($("#txt_Depot_Code_" + i).val()).toUpperCase() == depot_g[a].label.toUpperCase()) {
                                                $("#hdnDepotCode_" + i).val(depot_g[a].value);
                                                cnt++;
                                                break;
                                            }
                                        }
                                        if (cnt == 0) {
                                            $("#txt_Depot_Code_" + i).addClass("errorIndicator");
                                            $("#txt_Depot_Code_" + i).attr('title', 'Please validate depot.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                    }
                                    else {
                                        $("#hdnDepotCode_" + i).val('');
                                    }
                                }
                                else if (inputId.toUpperCase() == "TXT_CUSTOMER_GROUP_" + i) {
                                    var id = $("#txt_Customer_Group_" + i);
                                    if ($("#txt_Customer_Group_" + i).val() != '' & $("#txt_Customer_Group_" + i).val() != undefined) {
                                        var disJson = jsonPath(customerGroup_g, "$[?(@.label=='" + $.trim($("#txt_Customer_Group_" + i).val()).toUpperCase() + "')]");
                                        if (disJson != false) {
                                            if (disJson != undefined) {
                                                $("#hdnCustomerGroup_" + i).val(disJson[0].value);
                                            }
                                            else {
                                                $("#txt_Customer_Group_" + i).addClass("errorIndicator");
                                                $("#txt_Customer_Group_" + i).attr('title', 'Please validate customergroup.');
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                        else {
                                            $("#txt_Customer_Group_" + i).addClass("errorIndicator");
                                            $("#txt_Customer_Group_" + i).attr('title', 'Please validate customergroup.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                    }
                                    else {
                                        $("#hdnCustomerGroup_" + i).val('');
                                    }
                                }
                                else if (inputId.toUpperCase() == "TXT_MDL_NUMBER_" + i) {
                                    var id = $("#txt_MDL_Number_" + i);
                                    if ($.trim($("#txt_MDL_Number_" + i).val()) == '') {
                                        $("#txt_MDL_Number_" + i).addClass("errorIndicator");
                                        $("#txt_MDL_Number_" + i).attr('title', 'Please enter MDL Number.');
                                        fnIndicateError(id);
                                        ErrorCount = 1;
                                        rowErrorCount = 1;
                                    }
                                   
                                    else {
                                        var result = fnCheckSpecialCharacterforMDLNo(obj, 'info', 'validate', 'Please Remove the special characters in mdl no.');
                                        var id = $("#" + inputId);
                                        if (!result) {
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', 'Please Remove the special characters in mdl no.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                            flag = false;
                                        }
                                        else {
                                            fnRemoveIndicationforColumn("#" + inputId);
                                            $("#" + inputId).removeClass("errorIndicator");
                                        }
                                    }
                                }
                      
                                else if (inputId.toUpperCase() == "TXT_MOBILE_" + i) {
                                    //if (entity_g.toUpperCase() == "DOCTOR")
                                    //{
                                    //    var id = $("#txt_Mobile_" + i);
                                    //    if ($.trim($("#txt_Mobile_" + i).val()) == '') {
                                    //        debugger;
                                    //    $("#txt_Mobile_" + i).addClass("errorIndicator");
                                    //    $("#txt_Mobile_" + i).attr('title', 'Please enter MOBILE Number.');
                                    //    fnIndicateError(id);
                                    //    ErrorCount = 1;
                                    //    rowErrorCount = 1;
                                    //    }   
                                    //}
                                    if($("#txt_Mobile_" + i)!="" && $("#txt_Mobile_" + i) != undefined)   
                                    {
                                        var result = fnCheckSpecialCharacterforMDLNo(obj, 'info', 'validate', 'Please Remove the special characters in Mobile Number.');
                                        var id = $("#" + inputId);
                                        if (!result) {
                                            $("#" + inputId).addClass("errorIndicator");
                                        $("#" + inputId).attr('title', 'Please Remove the special characters in Mobile Number.');
                                        fnIndicateError(id);
                                        ErrorCount = 1;
                                        rowErrorCount = 1;
                                        flag = false;
                                    }
                                    else {
                                        //fnRemoveIndicationforColumn("#" + inputId);
                                        //$("#" + inputId).removeClass("errorIndicator");
                                        }
                                    }
                            }
                                                                                  
                                if (dataType.slice(0, 4).toUpperCase() != "DATE") {
                                    if (dataType.toUpperCase() == "DECIMAL" || dataType.toUpperCase() == "FLOAT") {
                                        var result = fnCurrencyFormatCheck(obj, 'info', 'Validate', 'Decimals only accept.Please validate your entry.');
                                        var id = $("#" + inputId);
                                        if (!result) {
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', 'Decimals only accept.Please validate your entry.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                        else {
                                            fnRemoveIndicationforColumn("#" + inputId);
                                            $("#" + inputId).removeClass("errorIndicator");
                                        }

                                    }
                                    else if (dataType.slice(0, 2).toUpperCase() == "INT") {
                                        var result = fnChekInteger(obj, 'info', 'Validate', 'Integer only accepted. Please validate your entry.');
                                        var id = $("#" + inputId);
                                        if (!result) {
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', 'Integer only accepted. Please validate your entry.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                        else {
                                            fnRemoveIndicationforColumn("#" + inputId);
                                            $("#" + inputId).removeClass("errorIndicator");
                                        }
                                    }
                                    else if (txtId.toUpperCase() != "TXT_EMAIL_" + i && txtId.toUpperCase() != "TXT_PRIMARY_EMAIL_" + i) {
                                        if (txtId.toUpperCase() != "TXT_ADDRESS1_" + i && txtId.toUpperCase() != "TXT_ADDRESS2_" + i
                                            && txtId.toUpperCase() != "TXT_REMARKS_" + i && txtId.toUpperCase() != "TXT_LOCAL_AREA_" + i
                                            && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER1_" + i && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER2_" + i
                                            && (txtId.toUpperCase() != "TXT_MOBILE_" + i 
                                            )) {
                                            

                                            if (txtId.toUpperCase() == "TXT_LOCAL_AREA_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckLocalareaNoSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_MDL_NUMBER_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckMDlNoSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_CUSTOMER_NAME_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckCustomerNameSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_SUR_NAME_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckCustomerNameSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_SPECIALITY_CODE_" + i) {
                                                if ($("#txt_Speciality_Code_" + i).val() != '' && $("#txt_Speciality_Code_" + i).val() != undefined) {
                                                    if ($("#txt_Speciality_Code_" + i).val().indexOf('"') == -1 && $("#txt_Speciality_Code_" + i).val().indexOf('\\') == -1) {

                                                        var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($("#txt_Speciality_Code_" + i).val()).toUpperCase() + "\")]");
                                                        if (disJson != null) {
                                                            if (disJson != false) {
                                                                $("#hdnSpecialityCode_" + i).val(disJson[0].value);
                                                                fnRemoveIndicationforColumn("#" + txtId);
                                                                $("#" + txtId).removeClass("errorIndicator");

                                                            }
                                                            else {
                                                                $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                                $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                                fnIndicateError(id);
                                                                ErrorCount = 1;
                                                                rowErrorCount = 1;
                                                            }
                                                        }
                                                    }
                                                    else { // We Handle Double Quotes.
                                                        $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                        $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                        fnIndicateError(id);
                                                        ErrorCount = 1;
                                                        rowErrorCount = 1;
                                                    }
                                                }
                                            }
                                            else if (txtId.toUpperCase() == "TXT_CATEGORY_" + i) {
                                                if ($("#txt_Category_" + i).val() != '' & $("#txt_Category_" + i).val() != undefined) {
                                                    var id = $("#" + txtId);
                                                    if ($("#" + txtId).val().indexOf('"') == -1 && $("#" + txtId).val().indexOf('\\') == -1) {
                                                        var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category_" + i).val()).toUpperCase() + "\")]");
                                                        if (disJson != null) {
                                                            if (disJson != false) {
                                                                $("#hdnCategory_" + i).val(disJson[0].value);
                                                                fnRemoveIndicationforColumn("#" + txtId);
                                                                $("#" + txtId).removeClass("errorIndicator");

                                                            }
                                                            else {
                                                                $("#txt_Category_" + i).addClass("errorIndicator");
                                                                $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                                fnIndicateError(id);
                                                                ErrorCount = 1;
                                                                rowErrorCount = 1;
                                                            }
                                                        }
                                                    }
                                                }
                                                else {// We handle double quotes here.
                                                    if ($("#Entity").val().toUpperCase() != "STOCKIEST") {
                                                        if ($("#Entity").val().toUpperCase() == "DOCTOR") {
                                                            var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
                                                            if (privilegeValue == "YES") {
                                                                var id = $("#" + txtId);
                                                                $("#txt_Category_" + i).addClass("errorIndicator");
                                                                $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                                fnIndicateError(id);
                                                                ErrorCount = 1;
                                                                rowErrorCount = 1;
                                                            }
                                                        }
                                                }
                                            }
                                            }
                                            //else {
                                            //    if ($.trim($("#" + txtId).val()).length > 0) {
                                            //        fnCheckSpecialCharacterandCorrect(obj);
                                            //        fnRemoveIndicationforColumn("#" + txtId);
                                            //        $("#" + txtId).removeClass("errorIndicator");
                                            //    }

                                            //}
                                        }
                                        else {
                                            if (txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER1_" + i || txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER2_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckLicNumSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_MOBILE_" + i || txtId.toUpperCase() == "TXT_PHONE_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckMobileNoSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_LOCAL_AREA_" + i) {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckLocalareaNoSpecialCharandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }

                                            }
                                            else if (txtId.toUpperCase() == "TXT_SPECIALITY_CODE_" + i) {
                                                if ($("#txt_Speciality_Code_" + i).val() != '' && $("#txt_Speciality_Code_" + i).val() != undefined) {
                                                    if ($("#txt_Speciality_Code_" + i).val().indexOf('"') == -1 && $("#txt_Speciality_Code_" + i).val().indexOf('\\') == -1) {

                                                        var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($("#txt_Speciality_Code_" + i).val()).toUpperCase() + "\")]");
                                                        if (disJson != null) {
                                                            if (disJson != false) {
                                                                $("#hdnSpecialityCode_" + i).val(disJson[0].value);
                                                                fnRemoveIndicationforColumn("#" + txtId);
                                                                $("#" + txtId).removeClass("errorIndicator");

                                                            }
                                                            else {
                                                                $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                                $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                                fnIndicateError(id);
                                                                ErrorCount = 1;
                                                                rowErrorCount = 1;
                                                            }
                                                        }
                                                    }
                                                    else { // We Handle Double Quotes.
                                                        $("#txt_Speciality_Code_" + i).addClass("errorIndicator");
                                                        $("#txt_Speciality_Code_" + i).attr('title', 'Please validate speciality.');
                                                        fnIndicateError(id);
                                                        ErrorCount = 1;
                                                        rowErrorCount = 1;
                                                    }
                                                }
                                            }
                                            else if (txtId.toUpperCase() == "TXT_CATEGORY_" + i) {
                                                if ($("#txt_Category_" + i).val() != '' & $("#txt_Category_" + i).val() != undefined) {
                                                    var id = $("#" + txtId);
                                                    if ($("#" + txtId).val().indexOf('"') == -1 && $("#" + txtId).val().indexOf('\\') == -1) {
                                                        var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category_" + i).val()).toUpperCase() + "\")]");
                                                        if (disJson != null) {
                                                            if (disJson != false) {
                                                                $("#hdnCategory_" + i).val(disJson[0].value);
                                                                fnRemoveIndicationforColumn("#" + txtId);
                                                                $("#" + txtId).removeClass("errorIndicator");

                                                            }
                                                            else {
                                                                $("#txt_Category_" + i).addClass("errorIndicator");
                                                                $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                                fnIndicateError(id);
                                                                ErrorCount = 1;
                                                                rowErrorCount = 1;
                                                            }
                                                        }
                                                    }
                                                }
                                                else {// We handle double quotes here.
                                                    $("#txt_Category_" + i).addClass("errorIndicator");
                                                    $("#txt_Category_" + i).attr('title', 'Please validate category.');
                                                    fnIndicateError(id);
                                                    ErrorCount = 1;
                                                    rowErrorCount = 1;
                                                }
                                            }
                                            else {
                                                if ($.trim($("#" + txtId).val()).length > 0) {
                                                    fnCheckSpecialCharacterandCorrect(obj);
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        var result = fnEmailCheck(obj);
                                        var id = $("#" + inputId);
                                        if (!result) {
                                         
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', 'Please validate email Id.');
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }
                                        else {
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                    }
                                }
                                else {
                                    var txtDate = $(obj).val();
                                    if (txtDate != '') {
                                        var id = $("#" + inputId);
                                        var dateArr = new Array();
                                        dateArr = $(obj).val().split('/');
                                        if (dateArr.length != 3) {
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', "Not a valid date format in " + aliasName + ".Please enter date in dd/mm/yyyy format.");
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                            fnMsgAlert('info', 'Validate', "Not a valid date format in " + aliasName + ".Please enter date in dd/mm/yyyy format.");
                                        }
                                        else {

                                            var result = new Date(txtDate.split('/')[2] + "-" + txtDate.split('/')[1] + "-" + txtDate.split('/')[0]);
                                            if (result == "Invalid Date") {
                                                $("#" + inputId).addClass("errorIndicator");
                                                $("#" + inputId).attr('title', "Please enter date in " + aliasName + "  error.");
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                    }

                                }
                                var arExists = new Array();
                                var ar = new Array();
                                arExists = aliasName.split('(');
                                if (arExists.length > 1) {
                                    var id = $("#" + inputId);
                                    var text = aliasName.split('(')[1].replace(')', '');
                                    ar = text.split('/');
                                    var cnt = 0;
                                    for (var j = 0; j < ar.length; j++) {
                                        if ($.trim($(obj).val().toUpperCase()) == "") {
                                            if (isNullable.toUpperCase() == "NO") {
                                                $("#" + inputId).addClass("errorIndicator");
                                                $("#" + inputId).attr('title', "Please validate " + aliasName + ".");
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                        else {
                                            if ($.trim($(obj).val().toUpperCase()) == ar[j].toUpperCase()) {
                                                cnt++;
                                            }
                                        }
                                    }
                                    if (cnt == 0) {
                                        if ($.trim($(obj).val().toUpperCase()) != "") {
                                            $("#" + inputId).addClass("errorIndicator");
                                            $("#" + inputId).attr('title', "Please validate " + aliasName + ".");
                                            fnIndicateError(id);
                                            ErrorCount = 1;
                                            rowErrorCount = 1;
                                        }

                                    }
                                    //length check
                                    if (inputId.toUpperCase() != "TXT_CATEGORY_" + i && inputId.toUpperCase() != "TXT_SPECIALITY_CODE_" + i && inputId.toUpperCase() != "TXT_SUBREGION_CODE_" + i
                                        && inputId.toUpperCase() != "TXT_DEPOT_CODE_" + i && inputId.toUpperCase() != "TXT_CUSTOMER_GROUP_" + i) {
                                        if (textMaxlength != null) {
                                            if ($.trim($(obj).val().toUpperCase()).length > textMaxlength) {
                                                $("#" + inputId).addClass("errorIndicator");
                                                $("#" + inputId).attr('title', textMaxlength + "Characters only accepted in " + aliasName + "");
                                                fnIndicateError(id);
                                                ErrorCount = 1;
                                                rowErrorCount = 1;
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
       
                //check mandatory column based on Config values
                configresult = fnValidateMandatoryColumnbasedonConfig(i, exceloption);
                if (!configresult) {
                    ErrorCount = 1;
                    rowErrorCount = 1;
                }
                if (rowErrorCount == 0) {
                    // $(obj.parentElement).removeClass('errorHighlight');
                }
            }
            }
         
        }
        if (ErrorCount == 1) {
            return false;
        }
        else {
            return true;
        }
        // $("#dvAjaxLoad").hide();
    }
    catch (e) {
        alert(e.message);
        // $("#dvAjaxLoad").hide();
    }
    //  $("#dvAjaxLoad").hide();
}


function fnCheckSpecialCharacter(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '.]+$");
        if (!specialCharregex.test($(id).val())) {
            // fnMsgAlert(msgType, msgTitle, msg);
            // $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}


function fnCheckSpecialCharacterforCustomerName(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9-. ]+$");
        if (!specialCharregex.test($(id).val())) {
            // fnMsgAlert(msgType, msgTitle, msg);
            // $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnCheckSpecialCharacterforMDLNo(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
        if (!specialCharregex.test($(id).val())) {
            // fnMsgAlert(msgType, msgTitle, msg);
            // $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnCheckSpecialCharacterandCorrect(id) {
    if ($.trim($(id).val()) != "") {
        var value = $.trim($(id).val());
        $(id).val(value.replace(/[^a-zA-Z0-9()' '.]/gi, ''));
    }
}


function fnCheckAddressSpecialChar(id, msgType, msgTitle, msg) {
    if ($(id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9()' '._#;{}*-\/,?]+$");
        if (!specialCharregex.test($(id).val())) {
            //  fnMsgAlert(msgType, msgTitle, msg);
            // $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnCheckAddressSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != "") {
        var value = $(id).val();
        $(id).val(value.replace(/[^a-zA-Z0-9()' '._#;{}*-\/,?]/gi, ''));
    }
}

function fnCheckMobileNoSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != '') {
        var phoneNumberPattern = /^\d+$/
        return phoneNumberPattern.test($.trim($(id).val()));
    }
    return true;
}

function fnCheckLocalareaNoSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != '') {
        var value = $(id).val();
        $(id).val(value.replace(/[^a-zA-Z0-9-. ]/gi, ''));
    }
    return true;
}

function fnCheckCustomerNameSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != '') {
        var value = $(id).val();
        $(id).val(value.replace(/[^a-zA-Z0-9-. ]/gi, ''));
    }
    return true;
}

function fnCheckMDlNoSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != '') {
        var value = $(id).val();
        $(id).val(value.replace(/[^a-zA-Z0-9 ]/gi, ''));
    }
    return true;
}

function fnCheckLicNumSpecialChar(id, msgType, msgTitle, msg) {
    if ($(id).val() != "") {
        var specialCharregex = new RegExp("^[a-zA-Z0-9.:\/-]+$");
        if (!specialCharregex.test($(id).val())) {
            //  fnMsgAlert(msgType, msgTitle, msg);
            // $(id).val('');
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

function fnCheckLicNumSpecialCharandCorrect(id) {
    if ($.trim($(id).val()) != "") {
        var value = $(id).val();
        $(id).val(value.replace(/[^a-zA-Z0-9.:\/-]/gi, ''));
    }
}

function fnCurrencyFormatCheck(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()).length > 0) {
        if (!/^\d{1,5}(\.\d{1,3})?$/.test($(id).val())) {
            fnMsgAlert(msgType, msgTitle, msg);
            $(id).val('0');
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}


function fnChekInteger(id, msgType, msgTitle, msg) {
    var intregex = new RegExp("^[0-9]+$");
    if ($.trim($(id).val()).length > 0) {
        if (!intregex.test($(id).val())) {
            fnMsgAlert(msgType, msgTitle, msg);
            $(id).val('0');
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}

//Newly added for Mandatory validation based on Privilege
//Registration No
function fnCheckspecialcharacterregistrationno(id, msgType, msgTitle, msg) {

    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp(/^[a-zA-Z0-9-_()/']+$/);
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

//Local Area
function fnCheckspecialcharacterLocalarea(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp(/^[a-zA-Z0-9-. ']+$/);
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}
//city and hospital Name
function fnCheckspecialcharacterHospitalName(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp(/^[a-zA-Z0-9,&.\-_() ']+$/);
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}
//Pin code
function fnCheckspecialcharacterPincode(id, msgType, msgTitle, msg) {

    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp(/^[0-9]{6}$/);
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}

//Qualification and Sur Name
function fnCheckspecialcharacterSurName(id, msgType, msgTitle, msg) {
    if ($.trim($(id).val()) != "") {
        var specialCharregex = new RegExp(/^[a-zA-Z0-9,.() ']+$/);
        if (!specialCharregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true
}
//Validate the Mdl no for numeric restriction
function fnCheckMDLNoforNumeric(id) {
    var intregex = new RegExp("^[0-9]+$");
    if ($.trim($(id).val()).length > 0) {
        if (!intregex.test($(id).val())) {
            return false;
        }
        else {
            return true;
        }
    }
    return true;
}


function fnCheckSpcialChar() {
   
    var flag = true;
    $("#dvAjaxLoad").show();
    if (confirm('Do you want to check the special characters...')) {
        // ShowModalPopup('dvLoading');
        flag = fnAlertSpecialCharacters();

        if (flag) {
            //  HideModalPopup('dvLoading');
            $("#dvAjaxLoad").hide()
            fnMsgAlert('info', 'Info', 'Special character validation done.Plese save your changes');
            $("#dvExcelTopSave").css('display', '');
            $("#dvExcelBottomSave").css('display', '');
            return true;
        }
        else {
            // HideModalPopup('dvLoading');
            $("#dvAjaxLoad").hide()
            $.msgAlert({
                type: 'warning'
           , title: 'Validation'
           , text: 'Highlighted cells has the special characters. Do you want to remove all these special characters'
           , callback: function () {
               fnRemoveSpecialCharacters();
               $("#dvExcelTopSave").css('display', '');
               $("#dvExcelBottomSave").css('display', '');
           }
            });
            return false;
        }
    }
    else {
        $("#dvAjaxLoad").hide()
    }
}

function fnAlertSpecialCharacters() {

    var flag = true;
    var rowCnt = $("#tblBulkDoctor tr").length;
    for (var i = 1; i < rowCnt - 1; i++) {
        $("#dvAjaxLoad").triggerHandler("show");
        var tdLen = $("#tblBulkDoctor tr").eq(i).find("td").length;
        for (var d = 3; d < tdLen; d++) {
            var td = $($("#tblBulkDoctor tr").eq(i).find("td")[d])[0];
            var obj = $(td).eq(0).find("input")[0];
            if (obj != undefined) {
                var inputId = $(td).eq(0).find("input")[0].id;
                for (var s = 0; s < entityColumns_g.Tables[0].Rows.length; s++) {
                    var fName = entityColumns_g.Tables[0].Rows[s].Field_Name;
                    var compareName = "txt_" + fName + "_" + i;
                    if (inputId.toUpperCase() == compareName.toUpperCase()) {
                        var dataType = entityColumns_g.Tables[0].Rows[s].DATA_TYPE;
                        var aliasName = entityColumns_g.Tables[0].Rows[s].Field_Alias_Name;
                        var txtId = inputId;
                        if (dataType.slice(0, 4).toUpperCase() != "DATE") {
                            if (dataType.toUpperCase() == "DECIMAL" || dataType.toUpperCase() == "FLOAT") {
                            }
                            else if (dataType.slice(0, 2).toUpperCase() == "INT") {
                            }
                            else {
                                if (txtId.toUpperCase() != "TXT_EMAIL_" + i && txtId.toUpperCase() != "TXT_PRIMARY_EMAIL_" + i) {
                                    if (txtId.toUpperCase() != "TXT_ADDRESS1_" + i && txtId.toUpperCase() != "TXT_ADDRESS2_" + i && txtId.toUpperCase() != "TXT_REMARKS_" + i && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER1_" + i && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER2_" + i) {

                                        if (txtId.toUpperCase() == "TXT_REGISTRATION_NO_" + i) {
                                            var result = fnCheckspecialcharacterregistrationno(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
                                                fnIndicateErrorforColumn(id);
                                                //  $(obj.parentElement).addClass('errorHighlight');
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                                // $(obj.parentElement).removeClass('errorHighlight');
                                            }
                                            //var result = fnCheckspecialcharacterregistrationno(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
                                            //if (!result) {
                                            //    $(obj.parentElement).addClass('errorHighlight');
                                            //    flag = false;
                                            //}
                                        }
                                        else if (txtId.toUpperCase() == "TXT_LOCAL_AREA_" + i) {

                                            var id = $("#" + txtId);
                                            var result = fnCheckspecialcharacterLocalarea(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialCharacterforLocalArea_g + ').');
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialCharacterforLocalArea_g + ').');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_MDL_NUMBER_" + i) {

                                            var result = fnCheckSpecialCharacterforMDLNo(obj, 'info', 'validate', 'Please Remove the special characters in mdl no.');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Remove the special characters in mdl no.');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_CUSTOMER_NAME_" + i) {

                                            var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Remove the special characters at customer name.');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please remove the special characters In Customer Name');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_SUR_NAME_" + i) {
                                            var result = fnCheckSpecialCharacterforCustomerName(obj, 'info', 'validate', 'Please Remove the special characters at Sur Name.');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please remove the special characters In Sur Name');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_CITY_" + i || txtId.toUpperCase() == "TXT_HOSPITAL_NAME_" + i) {
                                            var result = fnCheckspecialcharacterHospitalName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_QUALIFICATION_" + i) {
                                            var result = fnCheckspecialcharacterSurName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        //else if (txtId.toUpperCase() == "txt_Primary_Contact_" + i) {
                                        //    var result = fnCheckspecialcharacterSurName(obj, 'info', 'validate', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                                        //    var id = $("#" + txtId);
                                        //    if (!result) {
                                        //        $("#" + txtId).addClass("errorIndicator");
                                        //        $("#" + txtId).attr('title', 'Please Remove the special characters.Following characters only allowed (' + specialcharacterforSurname_g + ').');
                                        //        fnIndicateErrorforColumn(id);
                                        //        flag = false;
                                        //    }
                                        //    else {
                                        //        fnRemoveIndicationforColumn("#" + txtId);
                                        //        $("#" + txtId).removeClass("errorIndicator");
                                        //    }
                                        //}
                                        else if (txtId.toUpperCase() == "TXT_PIN_CODE_" + i) {
                                            var result = fnCheckspecialcharacterPincode(obj, 'info', 'validate', 'Please Enter the Valite PIN Code.');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please Enter the Valite PIN Code.');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else if (txtId.toUpperCase() == "TXT_PHONE_" + i || txtId.toUpperCase() == "TXT_MOBILE_" + i) {
                                            var result = fnCheckMobileNoSpecialCharandCorrect(obj, 'info', 'validate', 'Please Enter the Valid Mobile/Phone NO.');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                if (txtId.toUpperCase() == "TXT_PHONE_" + i) {
                                                    $("#" + txtId).addClass("errorIndicator");
                                                    $("#" + txtId).attr('title', 'Please Enter the Valid Mobile/Phone NO.');
                                                    fnIndicateErrorforColumn(id);
                                                    flag = false;
                                                }
                                                else {
                                                    fnRemoveIndicationforColumn("#" + txtId);
                                                    $("#" + txtId).removeClass("errorIndicator");
                                                }
                                            }
                                        }
                                        else {
                                            var result = fnCheckSpecialCharacter(obj, 'info', 'Validate', 'Please remove the special character');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please remove the special character.');
                                                fnIndicateErrorforColumn(id);
                                                return false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                    }
                                    else {
                                        if (txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER1_" + i || txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER2_" + i) {
                                            var result = fnCheckLicNumSpecialChar(obj, 'info', 'Validate', 'Please remove the special character');
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please remove the special character.');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                        else {
                                            var result = fnCheckAddressSpecialChar(obj);
                                            var id = $("#" + txtId);
                                            if (!result) {
                                                $("#" + txtId).addClass("errorIndicator");
                                                $("#" + txtId).attr('title', 'Please remove the special character.');
                                                fnIndicateErrorforColumn(id);
                                                flag = false;
                                            }
                                            else {
                                                fnRemoveIndicationforColumn("#" + txtId);
                                                $("#" + txtId).removeClass("errorIndicator");
                                            }
                                        }
                                    }
                                }
                                else {
                                }
                            }
                        }
                    }
                }
            }
        }
        //  $("#dvAjaxLoad").hide();
    }
    return flag;


    // $("#dvAjaxLoad").hide();
}


function fnRemoveSpecialCharacters() {

    $("#dvAjaxLoad").show();
    var flag = true;
    var rowCnt = $("#tblBulkDoctor tr").length;
    for (var i = 1; i < rowCnt - 1; i++) {
        var tdLen = $("#tblBulkDoctor tr").eq(i).find("td").length;
        for (var d = 3; d < tdLen; d++) {
            var td = $($("#tblBulkDoctor tr").eq(i).find("td")[d])[0];
            var obj = $(td).eq(0).find("input")[0];
            if (obj != undefined) {
                var inputId = $(td).eq(0).find("input")[0].id;
                for (var s = 0; s < entityColumns_g.Tables[0].Rows.length; s++) {
                    var fName = entityColumns_g.Tables[0].Rows[s].Field_Name;
                    var compareName = "txt_" + fName + "_" + i;
                    if (inputId.toUpperCase() == compareName.toUpperCase()) {
                        var dataType = entityColumns_g.Tables[0].Rows[s].DATA_TYPE;
                        var aliasName = entityColumns_g.Tables[0].Rows[s].Field_Alias_Name;
                        var txtId = inputId;
                        if (dataType.slice(0, 4).toUpperCase() != "DATE") {
                            if (dataType.toUpperCase() == "DECIMAL" || dataType.toUpperCase() == "FLOAT") {
                            }
                            else if (dataType.slice(0, 2).toUpperCase() == "INT") {
                            }
                            else {

                                if (txtId.toUpperCase() != "TXT_EMAIL_" + i && txtId.toUpperCase() != "TXT_PRIMARY_EMAIL_" + i) {
                                    if (txtId.toUpperCase() != "TXT_ADDRESS1_" + i && txtId.toUpperCase() != "TXT_ADDRESS2_" + i && txtId.toUpperCase() != "TXT_REMARKS_" + i && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER1_" + i && txtId.toUpperCase() != "TXT_DRUG_LICENSE_NUMBER2_" + i
                                        && txtId.toUpperCase() != "TXT_MOBILE_" + i || txtId.toUpperCase() != "TXT_PHONE_" + i) {

                                        if (txtId.toUpperCase() == "TXT_LOCAL_AREA_" + i) {
                                            fnCheckLocalareaNoSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else if (txtId.toUpperCase() == "TXT_MDL_NUMBER_" + i) {
                                            fnCheckMDlNoSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else if (txtId.toUpperCase() == "TXT_CUSTOMER_NAME_" + i) {
                                            fnCheckCustomerNameSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else if (txtId.toUpperCase() == "TXT_SUR_NAME_" + i) {
                                            fnCheckCustomerNameSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else {
                                            fnCheckSpecialCharacterandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                    }
                                    else {
                                        if (txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER1_" + i || txtId.toUpperCase() == "TXT_DRUG_LICENSE_NUMBER2_" + i) {
                                            fnCheckLicNumSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else if (txtId.toUpperCase() == "TXT_MOBILE_" + i || txtId.toUpperCase() == "TXT_PHONE_" + i) {
                                            fnCheckMobileNoSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                        else {
                                            fnCheckAddressSpecialCharandCorrect(obj);
                                            fnRemoveIndicationforColumn("#" + txtId);
                                            $("#" + txtId).removeClass("errorIndicator");
                                        }
                                    }
                                }
                                else {
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $("#dvAjaxLoad").hide();
}

function fnDelete(obj) {
    if ($("#tblDocProduct tr:visible").length == 2) {
        fnMsgAlert('info', 'Warning', 'You can not delete the entire rows');
        return;
    }
    var lastTd = "tdDelete_" + (parseInt(docProductRowNum) - 1).toString();
    if (obj.id == lastTd) {
        fnMsgAlert('info', 'Warning', 'You can not delete the last row');
        return;
    }
    if (confirm("Are you sure you want to delete this row?")) {
        var parent = $(obj).parent().parent();
        parent.fadeOut('slow', function () { });
    }
}


function fnValidatePriority(obj) {
    var id = obj.id;
    if ($(obj).val() != '') {
        for (var i = 0; i < parseInt(docProductRowNum) ; i++) {
            if ($("#txtProductName_" + (parseInt(i) + 1).toString()) != undefined) {
                if (id != "txtPriority_" + (parseInt(i) + 1)) {
                    if ($("#txtProductName_" + (parseInt(i) + 1).toString()).val() != '') {
                        if ($(obj).val() == $("#txtPriority_" + (parseInt(i) + 1).toString()).val()) {
                            fnMsgAlert('info', 'Validate', 'Priority no must be unique');
                            $(obj).val('');
                            return;
                        }
                    }
                }
            }
        }
    }
}


function fnGetUserPrivileges(userCode) {
    $("#dvAjaxLoad").show();
    $.ajax({
        type: 'POST',
        url: '/Master/GetPrivilegesByUser',
        async: false,
        data: "UserCode=" + userCode + "",
        success: function (response) {
            userPrivilege_g = response;
            $("#dvAjaxLoad").hide();
        },
        error: function (e) {
            $("#dvAjaxLoad").hide();
        }
    });
}


// Retrives the Privilege Value.

function fnGetPrivilegeVal(privilegeName, defaultValue) {

    if (userPrivilege_g != null && userPrivilege_g != '') {
        if (privilegeName != "") {
            var selectedValue = jsonPath(userPrivilege_g, "$[?(@.PrivilegeName=='" + privilegeName + "')]");
            if (selectedValue.length > 0) {
                defaultValue = selectedValue[0].PrivilegeValue;
            }
        }
    }
    return defaultValue;
}

/*************START: Bulk Upload *****************************/
function GetCustomerMasterXLTemplate() {
    $('#spndownload').css('display', '');
    $.ajax({
        type: 'POST',
        data: "Entity_Type=" + tType_g,
        url: '/DoctorMaster/GetCustomerMasterXLTemplate',
        success: function (response) {
            var mastersheet = response.split('^')[0];
            var referSheet = response.split('^')[1];
            $('#fileLink').attr("href", "../Content/XLTemplates/" + mastersheet);
            $('#fileLink').html(mastersheet);
            if (referSheet.indexOf('NO REFERENCE SHEET FOUND') == -1) {
                $('#refersheetlink').attr("href", "../Content/XLTemplates/" + referSheet)
            }
            $('#refersheetlink').html(referSheet);

            $('#lnkExcelFile').css("display", "");
            $('#spndownload').html("Completed");
        },
        error: function (e) {
        }
    });
}


function fnvalidateFile() {
    var fileName = $('#fileUpload').val();
    if (fileName.length == 0) {

        $('#dvErrMsgFileUpload').html("Please choose the file.")
        $('#dvErrMsgFileUpload').css('display', '');
        return false;
    }
    else {
        var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (ext == "xls") {
            $('#dvErrMsgFileUpload').html("");
            $('#dvErrMsgFileUpload').css('display', 'none');
            $('#lnkBP').css('display', '');
            return true;
        }
        else {
            $('#dvErrMsgFileUpload').html("Please uplaod xls file only.")
            $('#dvErrMsgFileUpload').css('display', '');
            return false;
        }
    }


}
function fnRedirectToBatchProcessing() {
    var t = tType_g.toUpperCase() == "D" ? "DOCTOR_UPLOAD" : tType_g.toUpperCase() == "C" ? "CHEMIST_UPLOAD" : tType_g.toUpperCase() == "S" ? "STOCKIEST_UPLOAD" : "";
    $('#main').load('../BatchProcessing/Index?bpType=' + t);
}
/*************END: Bulk Upload *****************************/


/**************START -CONFIG VALUES*******************************/
function fnGetConfigvalues(entity_g) {
    $.ajax({
        url: '/DoctorMaster/GetConfigurationValues',
        type: "POST",
        data:"Entity="+entity_g,
        async: false,
        success: function (jsData) {
   
            if (jsData != null && jsData != '') {
                var jsonMandatorycolumn = jsData[0].Config_MandatoryColumns;
                var jsonDuplicatecheckvalue = jsData[0].Config_DuplicatecheckColumn;

                var MandatoryColumns = new Array();
                var Duplicatecheckvalue = new Array();
                if (jsonMandatorycolumn != null) {
                MandatoryColumns = jsonMandatorycolumn.split(',');
                }         
                Duplicatecheckvalue = jsonDuplicatecheckvalue.split(',');

                jsonCheckDuplicate_g = Duplicatecheckvalue;
                jsonMandatory_g = MandatoryColumns;
            }
            HideModalPopup('dvLoading');
        },
        error: function (e) {
            fnMsgAlert('info', '', 'Error.' + e.Message);
            HideModalPopup('dvLoading');
        }
    });
}
/**************END - CONFIG VALUES*******************************/

/************************START - CUSTOMER VALIDATION BASED ON CONFIGURATION*********************************/
function fnValidateMandatoryColumnbasedonConfig(s, option) {

    //Registration No               
    //To check Mandatory or not
    //Customer Name Length check
    //fnGetConfigvalues($("#Entity").val().toUpperCase());

    if ($("#txt_Customer_Name_" + s).val() != '') {
        var id = $("#txt_Customer_Name_" + s);
        if ($.trim($("#txt_Customer_Name_" + s).val()).length > 300) {
            $("#txt_Customer_Name_" + s).addClass("errorIndicator");
            $("#txt_Customer_Name_" + s).attr('title', 'The Customer Name length should not exceed 300.');
            fnIndicateError(id);
            return false;
        }
    }

   
    //MDL No length check   
    if ($("#txt_MDL_Number_" + s).val() != '') {
        var id = $("#txt_MDL_Number_" + s);
        var mdlcheck = fnCheckMDLNoforNumeric($("#txt_MDL_Number_" + s));
        if (mdlcheck) {
            if ($.trim($("#txt_MDL_Number_" + s).val()).length > 9) {
                $("#txt_MDL_Number_" + s).addClass("errorIndicator");
                $("#txt_MDL_Number_" + s).attr('title', 'MDL Number length should not exceed 9 characters.');
                fnIndicateError(id);
                return false;
            }
        }
        else {
            if ($.trim($("#txt_MDL_Number_" + s).val()).length > 30) {
                $("#txt_MDL_Number_" + s).addClass("errorIndicator");
                $("#txt_MDL_Number_" + s).attr('title', 'MDL Number length should not exceed 30 characters.');
                fnIndicateError(id);
                return false;
            }
        }
    }
    if ($.inArray(PHONE, jsonMandatory_g) != -1) {
        var id = $("#txt_Phone_" + s);
        if ($("#txt_Phone_" + s).val() == '') {
            $("#txt_Phone_" + s).addClass("errorIndicator");
            $("#txt_Phone_" + s).attr('title', 'Please Enter the Phone No.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(LOCAL_AREA, jsonMandatory_g) != -1) {
        var id = $("#txt_Local_Area_" + s);
        if ($("#txt_Local_Area_" + s).val() == '') {
            $("#txt_Local_Area_" + s).addClass("errorIndicator");
            $("#txt_Local_Area_" + s).attr('title', 'Please Enter the Local Area.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(MOBILE, jsonMandatory_g) != -1) {
        var id = $("#txt_Mobile_" + s);
        if ($("#txt_Mobile_" + s).val() == '') {
            $("#txt_Mobile_" + s).addClass("errorIndicator");
            $("#txt_Mobile_" + s).attr('title', 'Please Enter the Mobile No.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(EMAIL, jsonMandatory_g) != -1) {
        var id = $("#txt_Email_" + s);
        if ($("#txt_Email_" + s).val() == '') {
            $("#txt_Email_" + s).addClass("errorIndicator");
            $("#txt_Email_" + s).attr('title', 'Please Enter the Email.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(REGISTRATION_NUMBER, jsonMandatory_g) != -1) {
        var id = $("#txt_Registration_Number_" + s);
        if ($("#txt_Registration_Number_" + s).val() == '') {
            $("#txt_Registration_Number_" + s).addClass("errorIndicator");
            $("#txt_Registration_Number_" + s).attr('title', 'Please Enter the Registration Number.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(TIN_NUMBER, jsonMandatory_g) != -1) {
        var id = $("#txt_Tin_Number_" + s);
        if ($("#txt_Tin_Number_" + s).val() == '') {
            $("#txt_Tin_Number_" + s).addClass("errorIndicator");
            $("#txt_Tin_Number_" + s).attr('title', 'Please Enter the Tin Number.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(DRUG_LICENSE_NUMBER1, jsonMandatory_g) != -1) {
        var id = $("#txt_Drug_License_Number1_" + s);
        if ($("#txt_Drug_License_Number1_" + s).val() == '') {
            $("#txt_Drug_License_Number1_" + s).addClass("errorIndicator");
            $("#txt_Drug_License_Number1_" + s).attr('title', 'Please Enter the Drug License Number1.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(DEPOT_CODE, jsonMandatory_g) != -1) {
        var id = $("#txt_Depot_Code_" + s);
        if ($("#txt_Depot_Code_" + s).val() == '') {
            $("#txt_Depot_Code_" + s).addClass("errorIndicator");
            $("#txt_Depot_Code_" + s).attr('title', 'Please Enter the Depot Code.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(CST_NUMBER, jsonMandatory_g) != -1) {
        var id = $("#txt_CST_Number_" + s);
        if ($("#txt_CST_Number_" + s).val() == '') {
            $("#txt_CST_Number_" + s).addClass("errorIndicator");
            $("#txt_CST_Number_" + s).attr('title', 'Please Enter the CST Number.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($.inArray(REGISTRATION_NO, jsonMandatory_g) != -1) {
        var id = $("#txt_Registration_No_" + s);
        if ($("#txt_Registration_No_" + s).val() == '') {
            $("#txt_Registration_No_" + s).addClass("errorIndicator");
            $("#txt_Registration_No_" + s).attr('title', 'Please Enter the Registration No.');
            fnIndicateError(id);
            return false;
        }
    }
    var registrationNo = $("#txt_Registration_No_" + s).val();
    //Length check
    if ($("#txt_Registration_No_" + s).val() != '') {
        var id = $("#txt_Registration_No_" + s);
        if ($.trim($("#txt_Registration_No_" + s).val()).length > 50) {
            $("#txt_Registration_No_" + s).addClass("errorIndicator");
            $("#txt_Registration_No_" + s).attr('title', 'The Registration Number length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txt_Registration_No_" + s).val()) != "") {
        var id = $("#txt_Registration_No_" + s);
        var specialCharregexforregistration = new RegExp(/^[a-zA-Z0-9-_()/']+$/);
        if (!specialCharregexforregistration.test($.trim($("#txt_Registration_No_" + s).val()))) {
            $("#txt_Registration_No_" + s).addClass("errorIndicator");
            $("#txt_Registration_No_" + s).attr('title', 'Please Remove the special characters in Registration No.Following characters only allowed (' + specialcharecterforregistrationNo_g + ').');
            fnIndicateError(id);
            return false;
        }
    }
    //Restrict dulication allowed
    if (option == 'S' || option == 'N') {
        if (jsonCheckDuplicate_g == REGISTRATION_NO) {
            if ($("#txt_Registration_No_" + s).val() != '') {
                var objcur = $("#txt_Registration_No_" + s);
                if ($("#txt_Registration_No_" + s).val() != undefined) {
                if ($.inArray($("#txt_Registration_No_" + s).val().toUpperCase(), registrationNamearr) > -1) {
                    for (var i = 1; i <= $("#tblBulkDoctor thead tr").length; i++) {
                        var registrationNo = $("#txt_Registration_No_" + s).val();
                        if ($("#txt_Registration_No_" + i).val().toUpperCase() == registrationNo.toUpperCase()) {
                            var objcheck = $("#txt_Registration_No_" + i);
                            duplicateValue = true;
                            fnErrorindicationforDuplicateRow(objcheck, objcur);
                        }
                    }
                }
                }
                if ($("#txt_Registration_No_" + s).val() != undefined) {
                var registernamearr = $("#txt_Registration_No_" + s).val().toUpperCase();
                registrationNamearr.push(registernamearr);
            }
        }
    }
    }

    //Mobile No Validation
    if ($.inArray(MOBILE, jsonMandatory_g) != -1) {
        var id = $("#txt_Mobile_" + s);
        if ($("#txt_Mobile_" + s).val() == '') {
            $("#txt_Mobile_" + s).addClass("errorIndicator");
            $("#txt_Mobile_" + s).attr('title', 'Please Enter the Mobile No.');
            fnIndicateError(id);
            return false;
        }
    }
    var Mobileno = $("#txt_Mobile_" + s).val();
    //Length check
    if ($("#txt_Mobile_" + s).val() != '' &&  $("#txt_Mobile_" + s).val() !=undefined) {
        var id = $("#txt_Mobile_" + s);
        if ($.trim($("#txt_Mobile_" + s).val()).length > 13) {
            $("#txt_Mobile_" + s).addClass("errorIndicator");
            $("#txt_Mobile_" + s).attr('title', 'The Mobile No length should not exceed 13.');
            fnIndicateError(id);
            return false;
        }

        if ($.trim($("#txt_Mobile_" + s).val()).length < 10) {
            $("#txt_Mobile_" + s).addClass("errorIndicator");
            $("#txt_Mobile_" + s).attr('title', 'Please Enter Valid Mobile No.Mobile number must contains atleast 13 digits.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txt_Mobile_" + s).val()) != "" && $("#txt_Mobile_" + s).val() != undefined) {
        var id = $("#txt_Mobile_" + s);
        var result = fnValidateMobileNumber($("#txt_Mobile_" + s), "MOBILE");
        if (!result) {
            $("#txt_Mobile_" + s).addClass("errorIndicator");
            $("#txt_Mobile_" + s).attr('title', 'Please enter valid Mobile No.');
            fnIndicateError(id);
            return false;
        }
    }
    //Restrict dulication allowed
    if (option == 'S' || option == 'N') {
        if (jsonCheckDuplicate_g == MOBILE) {
            if ($("#txt_Mobile_" + s).val() != '' && $("#txt_Mobile_" + s).val() != undefined) {
                if ($.inArray($("#txt_Mobile_" + s).val(), phonenOarr) > -1) {
                    var objcur = $("#txt_Mobile_" + s);
                    for (var i = 1; i <= $("#tblBulkDoctor thead tr").length; i++) {
                        var mobileNo = $("#txt_Mobile_" + s).val();
                        if ($("#txt_Mobile_" + i).val() == mobileNo) {
                            var objcheck = $("#txt_Mobile_" + i);
                            duplicateValue = true;
                            fnErrorindicationforDuplicateRow(objcheck, objcur);
                        }
                    }
                }
                phonenOarr.push($("#txt_Mobile_" + s).val());
            }
        }
    }


    //Phone No
    //Special characters validation               
    if ($.trim($("#txt_Phone_" + s).val()) != "") {
        var id = $("#txt_Phone_" + s);
        var result = fnValidateMobileNumber($("#txt_Phone_" + s), "PHONE");
        if (!result) {
            $("#txt_Phone_" + s).addClass("errorIndicator");
            $("#txt_Phone_" + s).attr('title', 'Please validate the Phone number.');
            fnIndicateError(id);
            return false;
        }
    }
    //Length check
    if ($("#txt_Phone_" + s).val() != '') {
        var id = $("#txt_Phone_" + s);
        if ($.trim($("#txt_Phone_" + s).val()).length > 13) {
            $("#txt_Phone_" + s).addClass("errorIndicator");
            $("#txt_Phone_" + s).attr('title', 'The Phone No. should not exceed 13 characters.');
            fnIndicateError(id);
            return false;
        }

        if ($.trim($("#txt_Phone_" + s).val()).length < 5) {
            $("#txt_Phone_" + s).addClass("errorIndicator");
            $("#txt_Phone_" + s).attr('title', 'Please Enter Valid Phone No.Phone no must contains atleast 5 characters.');
            fnIndicateError(id);
            return false;
        }
    }


    //Local Area
    if ($.inArray(LOCAL_AREA, jsonMandatory_g) != -1) {
        var id = $("#txt_Local_Area_" + s);
        var localarea = $("#txt_Local_Area_" + s).val();
        if ($.trim($("#txt_Local_Area_" + s).val()) == '') {
            $("#txt_Local_Area_" + s).addClass("errorIndicator");
            $("#txt_Local_Area_" + s).attr('title', 'Please Enter the Local Area.');
            fnIndicateError(id);
            return false;
        }
    }
    //Length check
    if ($("#txt_Local_Area_" + s).val() != '') {
        var id = $("#txt_Local_Area_" + s);
        if ($.trim($("#txt_Local_Area_" + s).val()).length > 50) {
            $("#txt_Local_Area_" + s).addClass("errorIndicator");
            $("#txt_Local_Area_" + s).attr('title', 'The Local Area length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txt_Local_Area_" + s).val()) != "") {
        var id = $("#txt_Local_Area_" + s);
        var specialCharregexforLocalarea = new RegExp(/^[a-zA-Z0-9-. ']+$/);
        if (!specialCharregexforLocalarea.test($.trim($("#txt_Local_Area_" + s).val()))) {
            $("#txt_Local_Area_" + s).addClass("errorIndicator");
            $("#txt_Local_Area_" + s).attr('title', 'Please Remove the special characters in Local Area.Following characters only allowed (' + specialCharacterforLocalArea_g + ').');
            fnIndicateError(id);
            return false;
        }
    }

    //PIN Code validation
    if ($.inArray(PIN_CODE, jsonMandatory_g) != -1) {
        var id = $("#txt_Pin_Code_" + s);
        if ($("#txt_Pin_Code_" + s).val() == '') {
            $("#txt_Pin_Code_" + s).addClass("errorIndicator");
            $("#txt_Pin_Code_" + s).attr('title', 'Please Enter the PIN Code.');
            fnIndicateError(id);
            return false;
        }
    }
    var pinCode = $("#txt_Pin_Code_" + s).val();
    //Length check
    if ($.trim($("#txt_Pin_Code_" + s).val()) != '') {
        var id = $("#txt_Pin_Code_" + s);
        if ($.trim($("#txt_Pin_Code_" + s).val()).length > 10) {
            $("#txt_Pin_Code_" + s).addClass("errorIndicator");
            $("#txt_Pin_Code_" + s).attr('title', 'The PIN Code length should not exceed 6 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txt_Pin_Code_" + s).val()) != "") {
        var id = $("#txt_Pin_Code_" + s);
        var specialCharregexforPINcode = new RegExp(/^[0-9]{6}$/);
        if (!specialCharregexforPINcode.test($.trim($("#txt_Pin_Code_" + s).val()))) {
            $("#txt_Pin_Code_" + s).addClass("errorIndicator");
            $("#txt_Pin_Code_" + s).attr('title', 'Please Enter a valid PIN code.Pin code No length should not exceed 6.');
            fnIndicateError(id);
            return false;
        }
    }
    //Hospital Name
    if ($.inArray(HOSPITAL_NAME, jsonMandatory_g) != -1) {
        var id = $("#txt_Hospital_Name_" + s);
        var hospitalName = $("#txt_Hospital_Name_" + s).val();
        if ($.trim($("#txt_Hospital_Name_" + s).val()) == '') {
            $("#txt_Hospital_Name_" + s).addClass("errorIndicator");
            $("#txt_Hospital_Name_" + s).attr('title', 'Please Enter the Hospital Name.');
            fnIndicateError(id);
            return false;
        }
    }

    //Length check
    if ($("#txt_Hospital_Name_" + s).val() != '') {
        var id = $("#txt_Hospital_Name_" + s);
        if ($.trim($("#txt_Hospital_Name_" + s).val()).length > 100) {
            $("#txt_Hospital_Name_" + s).addClass("errorIndicator");
            $("#txt_Hospital_Name_" + s).attr('title', 'The Hospital Name length should not exceed 100 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    //if ($.trim($("#txt_Hospital_Name_" + s).val()) != "") {

    //    var specialCharregexforLocalarea = new RegExp(/^[a-zA-Z0-9,&.\-_() ']+$/);
    //    if (!specialCharregexforLocalarea.test($.trim($("#txt_Hospital_Name_" + s).val()))) {
    //        fnMsgAlert('info', 'Doctor Master Bulk upload for Single Region', 'Please Remove the special characters in Hospital Name at row no ' + s + '.Following characters only allowed (' + specialchracterforHospitalname_g + ').');
    //        fnIndicateError("#txt_Hospital_Name_" + s);
    //        return false;
    //    }
    //}
    //city
    if ($.inArray(CITY, jsonMandatory_g) != -1) {
        var id = $("#txt_City_" + s);
        var city = $("#txt_City_" + s).val();
        if ($.trim($("#txt_City_" + s).val()) == '') {
            $("#txt_City_" + s).addClass("errorIndicator");
            $("#txt_City_" + s).attr('title', 'Please Enter the City.');
            fnIndicateError(id);
            return false;
        }
    }

    //Length check
    if ($("#txt_City_" + s).val() != '') {
        var id = $("#txt_City_" + s);
        if ($.trim($("#txt_City_" + s).val()).length > 50) {
            $("#txt_City_" + s).addClass("errorIndicator");
            $("#txt_City_" + s).attr('title', 'The City length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    if ($.trim($("#txt_City_" + s).val()) != "") {
        var id = $("#txt_City_" + s);
        var specialCharregexforLocalarea = new RegExp(/^[a-zA-Z0-9,&.\-_() ']+$/);
        if (!specialCharregexforLocalarea.test($.trim($("#txt_City_" + s).val()))) {
            $("#txt_City_" + s).addClass("errorIndicator");
            $("#txt_City_" + s).attr('title', 'Please Remove the special characters in City.Following characters only allowed (' + specialCharregexforLocalarea + ').');
            fnIndicateError(id);
            return false;
        }
    }
    //Gender
    if ($.inArray(GENDER, jsonMandatory_g) != -1) {
        var id = $("#txt_Gender_" + s);
        var gender = $("#txt_Gender_" + s).val();
        if ($.trim($("#txt_Gender_" + s).val()) == '') {
            $("#txt_Gender_" + s).addClass("errorIndicator");
            $("#txt_Gender_" + s).attr('title', 'Please Enter the Gender.');
            fnIndicateError(id);
            return false;
        }
    }

    //Length check
    if ($("#txt_Gender_" + s).val() != '') {
        var id = $("#txt_Gender_" + s);
        if ($.trim($("#txt_Gender_" + s).val()).length > 1) {
            $("#txt_Gender_" + s).addClass("errorIndicator");
            $("#txt_Gender_" + s).attr('title', 'Please Enter the Gender.');
            fnIndicateError(id);
            return false;
        }
    }
    
    //Gender 'F','M' allow restriction
    if ($.trim($("#txt_Gender_" + s).val()).length > 0) {
        var gender = $.trim($("#txt_Gender_" + s).val()).toUpperCase();
        if ($.inArray(gender, genderJson_g) == -1) {
            $("#txt_Gender_" + s).addClass("errorIndicator");
            $("#txt_Gender_" + s).attr('title', 'Please enter M for Male and F for Female on Gender column.');
            fnIndicateError(id);
            return false;
        }
    }
    //Qualification
    if ($.inArray(QUALIFICATION, jsonMandatory_g) != -1) {
        var id = $("#txt_Qualification_" + s);
        var qualification = $("#txt_Qualification_" + s).val();
        if ($.trim($("#txt_Qualification_" + s).val()) == '') {
            $("#txt_Qualification_" + s).addClass("errorIndicator");
            $("#txt_Qualification_" + s).attr('title', 'Please Enter the Qualification.');
            fnIndicateError(id);
            return false;
        }
    }

    //Length check
    if ($("#txt_Qualification_" + s).val() != '') {
        var id = $("#txt_Qualification_" + s);
        if ($.trim($("#txt_Qualification_" + s).val()).length > 30) {
            $("#txt_Qualification_" + s).addClass("errorIndicator");
            $("#txt_Qualification_" + s).attr('title', 'The Qualification length should not exceed 30 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    //if ($.trim($("#txt_Qualification_" + s).val()) != "") {
    //    var specialCharregexforqualification = new RegExp(/^[a-zA-Z0-9,.() ']+$/);
    //    if (!specialCharregexforqualification.test($.trim($("#txt_Qualification_" + s).val()))) {
    //        fnMsgAlert('info', 'Doctor Master Bulk upload for Single Region', 'Please Remove the special characters in Qualification at row no ' + s + '.Following characters only allowed (' + specialcharacterforSurname_g + ').');
    //        fnIndicateError("#txt_Qualification_" + s);
    //        return false;
    //    }
    //}
    //surName
    if ($.inArray(SUR_NAME, jsonMandatory_g) != -1) {
        var id = $("#txt_Sur_Name_" + s);
        var surname = $("#txt_Sur_Name_" + s).val();
        if ($("#txt_Sur_Name_" + s).val() == '') {
            $("#txt_Sur_Name_" + s).addClass("errorIndicator");
            $("#txt_Sur_Name_" + s).attr('title', 'Please Enter the Sur Name.');
            fnIndicateError(id);
            return false;
        }
    }

    //Length check
    if ($("#txt_Sur_Name_" + s).val() != '') {
        var id = $("#txt_Sur_Name_" + s);
        if ($.trim($("#txt_Sur_Name_" + s).val()).length > 300) {
            $("#txt_Sur_Name_" + s).addClass("errorIndicator");
            $("#txt_Sur_Name_" + s).attr('title', 'The Sur Name length should not exceed 300 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Special characters validation               
    //if ($.trim($("#txt_Sur_Name_" + s).val()) != "") {
    //    var specialCharregexforsurname = new RegExp(/^[a-zA-Z0-9,&.-_() ']+$/);
    //    if (!specialCharregexforsurname.test($.trim($("#txt_Sur_Name_" + s).val()))) {
    //        fnMsgAlert('info', 'Doctor Master Bulk upload for Single Region', 'Please Remove the special characters in Sur Name at row no ' + s + '.Following characters only allowed (' + specialcharacterforSurname_g + ').');
    //        fnIndicateError("#txt_Sur_Name_" + s);
    //        return false;
    //    }
    //}

    //Address1 Length check
    if ($("#txt_Address1_" + s).val() != '') {
        var id = $("#txt_Address1_" + s);
        if ($.trim($("#txt_Address1_" + s).val()).length > 255) {
            $("#txt_Address1_" + s).addClass("errorIndicator");
            $("#txt_Address1_" + s).attr('title', 'The Address1 length should not exceed 255 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Address1 Length check
    if ($("#txt_Address2_" + s).val() != '') {
        var id = $("#txt_Address2_" + s);
        if ($.trim($("#txt_Address2_" + s).val()).length > 255) {
            $("#txt_Address2_" + s).addClass("errorIndicator");
            $("#txt_Address2_" + s).attr('title', 'The Address2 length should not exceed 255 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Fax Length check
    if ($("#txt_Fax_" + s).val() != '') {
        var id = $("#txt_Fax_" + s);
        if ($.trim($("#txt_Fax_" + s).val()).length > 20) {
            $("#txt_Fax_" + s).addClass("errorIndicator");
            $("#txt_Fax_" + s).attr('title', 'The Fax length should not exceed 20 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Email Length check
    if ($("#txt_Email_" + s).val() != '') {
        var id = $("#txt_Fax_" + s);
        if ($.trim($("#txt_Email_" + s).val()).length > 100) {
            $("#txt_Email_" + s).addClass("errorIndicator");
            $("#txt_Email_" + s).attr('title', 'The Email length should not exceed 100 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Hospital classification name Length check
    if ($("#txt_Hospital_Classification_" + s).val() != '') {
        var id = $("#txt_Hospital_Classification_" + s);
        if ($.trim($("#txt_Hospital_Classification_" + s).val()).length > 50) {
            $("#txt_Hospital_Classification_" + s).addClass("errorIndicator");
            $("#txt_Hospital_Classification_" + s).attr('title', 'The Hospital Classification length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Remarks Length check
    if ($("#txt_Remarks_" + s).val() != '') {
        var id = $("#txt_Remarks_" + s);
        if ($.trim($("#txt_Remarks_" + s).val()).length > 500) {
            $("#txt_Remarks_" + s).addClass("errorIndicator");
            $("#txt_Remarks_" + s).attr('title', 'The Remarks length should not exceed 500 characters.');
            fnMsgAlert('info', 'Doctor Master Bulk upload for Single Region', 'The Remarks length should not exceed 500 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Ref1 Length check
    if ($("#txt_Ref_Key1_" + s).val() != '') {
        var id = $("#txt_Ref_Key1_" + s);
        if ($.trim($("#txt_Ref_Key1_" + s).val()).length > 50) {
            $("#txt_Ref_Key1_" + s).addClass("errorIndicator");
            $("#txt_Ref_Key1_" + s).attr('title', 'The Ref Key1 length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    //Ref2 Length check
    if ($("#txt_Ref_Key2_" + s).val() != '') {
        var id = $("#txt_Ref_Key2_" + s);
        if ($.trim($("#txt_Ref_Key2_" + s).val()).length > 50) {
            $("#txt_Ref_Key2_" + s).addClass("errorIndicator");
            $("#txt_Ref_Key2_" + s).attr('title', 'The Ref Key2 length should not exceed 50 characters.');
            fnIndicateError(id);
            return false;
        }
    }
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        if ($.trim($("#txt_Speciality_Code_" + s).val()).length > 0) {
            if ($("#txt_Speciality_Code_" + s).val().indexOf('"') == -1 && $("#txt_Speciality_Code_" + s).val().indexOf('\\') == -1) {
                var disJson = jsonPath(specialityJson_g, "$[?(@.label==\"" + $.trim($("#txt_Speciality_Code_" + s).val()).toUpperCase() + "\")]");
                var id = $("#txt_Speciality_Code_" + s);
                if (disJson != false) {
                    if (disJson != undefined) {
                        $("#hdnSpecialityCode_" + s).val(disJson[0].value);
                    }
                    else {
                        $("#txt_Speciality_Code_" + s).addClass("errorIndicator");
                        $("#txt_Speciality_Code_" + s).attr('title', 'Please validate speciality.');
                        fnIndicateError(id);
                        return false;
                    }
                }
                else {
                    $("#txt_Speciality_Code_" + s).addClass("errorIndicator");
                    $("#txt_Speciality_Code_" + s).attr('title', 'Please validate speciality.');
                    fnIndicateError(id);
                    return false;
                }
            }
            else {
                $("#txt_Speciality_Code_" + s).addClass("errorIndicator");
                $("#txt_Speciality_Code_" + s).attr('title', 'Please validate speciality.');
                fnIndicateError(id);
                return false;
            }
        }
    }
    if ($("#Entity").val().toUpperCase() == "DOCTOR") {
        var privilegeValue = fnGetPrivilegeVal("DOCTOR_CATEGORY", "NO");
        if (privilegeValue == "YES") {
            if ($.trim($("#txt_Category_" + s).val()).indexOf('"') == -1 && $.trim($("#txt_Category_" + s).val()).indexOf('\\') == -1) {
                var disJson = jsonPath(categoryJson_g, "$[?(@.label==\"" + $.trim($("#txt_Category_" + s).val()).toUpperCase() + "\")]");
                var id = $("#txt_Category_" + s);
                if (disJson != false) {
                    if (disJson != undefined) {
                        $("#hdnCategory_" + s).val(disJson[0].value);
                    }
                    else {
                        $("#txt_Category_" + s).addClass("errorIndicator");
                        $("#txt_Category_" + s).attr('title', 'Please validate category.');
                        fnIndicateError(id);
                        return false;
                    }
                }
                else {
                    $("#txt_Category_" + s).addClass("errorIndicator");
                    $("#txt_Category_" + s).attr('title', 'Please validate category.');
                    fnIndicateError(id);
                    return false;
                }
            }
            else {
                $("#txt_Category_" + s).addClass("errorIndicator");
                $("#txt_Category_" + s).attr('title', 'Please validate category.');
                fnIndicateError(id);
                return false;
            }
        }
    }
    return true;
}

function fnCheckduplicatevalidationOnkeycolumn() {
    var customerdetails_arr = new Array();
    var customerdetails = {};
    var regionCode = $("#Region_Code").val();;
    var duplicatecheckcolumn = jsonCheckDuplicate_g;
    customerdetails.Doctor_Region_Code = regionCode;
    customerdetails_arr.push(customerdetails);
    try {
        ShowModalPopup('dvLoading');
        $.ajax({
            url: '../../HiDoctor_Activity/DCRV4KYD/DuplicateValidationOnKYD',
            type: "POST",
            aysnc: false,
            data: "KYDDoctordetails_arr=" + JSON.stringify(customerdetails_arr) + '&duplicateKeycolumn=' + duplicatecheckcolumn,
            success: function (jsData) {
                if (jsData.length > 0) {
                    duplicatecheckcolumn = 0;
                }
                else {
                    duplicatecountonkeycolumn = jsData.length;
                }
                HideModalPopup('dvLoading');
            },
            error: function (e) {
                fnMsgAlert('info', '', 'Error.' + e.Message);
                HideModalPopup('dvLoading');
            }
        });
    }
    catch (e) {
        fnMsgAlert('info', '', 'Error.' + e.Message);
        HideModalPopup('dvLoading');
    }
}


/**************************END - CUSTOMER VALIDATION BASED ON CONFIGURATION*********************************/

/****************************START - GET DOCTOR CATEGORY BASED ON SELECTED REGION*****************************/
function fnGetDoctorCategoryBasedonselectedRegion() {
    var selectedRegioncode = $('#Region_Code').val();
    if (selectedRegioncode != null && selectedRegioncode != '') {
        $.ajax({
            url: '/DoctorMaster/GetDoctorCategoryBasedonDivisions/',
            type: "POST",
            data: "selectedRegionCode=" + selectedRegioncode,
            async: false,
            success: function (jsData) {
                jsData = eval('(' + jsData + ')');
                if (jsData.length > 0) {
                    var category = "[";
                    for (var i = 0; i < jsData.length; i++) {
                        category += "{label:" + '"' + "" + jsData[i].Category_Name + "" + '",' + "value:" + '"' + "" + jsData[i].Category_Code + "" + '"' + "}";
                        if (i < jsData.length - 1) {
                            category += ",";
                        }
                    }
                    category += "];";
                    categoryJson_g = eval(category);

                    $('#txt_Category').unautocomplete();
                    autoComplete(categoryJson_g, "Category", "CategoryCode", "autoCategory");
                }
                else {

                    categoryJson_g = "";
                }
            }
        });
    }
}
/****************************END - GET DOCTOR CATEGORY BASED ON SELECTED REGION*****************************/

