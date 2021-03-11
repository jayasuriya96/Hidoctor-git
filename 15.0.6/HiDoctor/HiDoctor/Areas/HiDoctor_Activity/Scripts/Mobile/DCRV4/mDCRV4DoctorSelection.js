var doctors_g;
var speciality_g;
function fnGetDoctors() {
    $.ajax({
        type: 'POST',
        data: 'accRegions=' + accUsers_g + "&accChemist=" + accChemistPri_g + "&dcrActualDate=" + dcrDate_g,
        url: '/HiDoctor_Activity/DCRV4ChooseDoctorsSelection/GetDoctors',
        async: false,
        success: function (response) {
            // we have the response
            var result = response;

            if (result.length == 0) {

            }
            else {
                doctors_g = result[0].Data;
                speciality_g = result[1].Data;
                fnBindGrid();
            }
        },
        error: function (e) {
            alert("Eror" + e);
        }
    });
}

function fnBindGrid() {
    for (var s = 0; s < speciality_g.length; s++) {
        $('#selectSpeciality').append('<option value="' + speciality_g[s].value + '" >' + speciality_g[s].label + '</option>')
    }
    $('#selectSpeciality')[0].selectedIndex = -1;
}

function fnRedirectToDoctorVisit(ctl) {

    var doctorName = ctl.innerHTML.split('<br')[0];
    //Add * for end of the name
    var arrdoctorName = ctl.innerHTML.split('<br>');
    if (arrdoctorName.length > 1) {
        var cityname = arrdoctorName[1];
        var index = cityname.indexOf('*');
        if (index > 0)
            for (var i = index; i < arrdoctorName[1].length; i++) {
                if (doctorName === '')
                    doctorName = cityname[i];
                else
                    doctorName += cityname[i];
            }
    }
    //
    var speciality = $('#selectSpeciality').text() + '_' + $('#selectSpeciality').val();
    $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=''&flagRCPA=" + flagRCPA + "&accUsers=" + accUsers_g + "&cp=''&tp=''&dcrActualDate=" + dcrDate_g + "&category=''&travelledkms=" + distance_g + "&source=DOCTORADD&flag=''&codes=" + escape(dcodes_g) + '&doctorname=' + doctorName + '&speciality=' + speciality, {
        type: "post",
        reverse: false,
        changeHash: false
    });

}

function fnShowDoctors() {
    var doctorsHTML = "";
    if ($('#txtDocName1').val().length == 0 && $('#txtMDL').val().length == 0) {
        fnMsgAlert('info', 'Choose Doctors Selection', 'Please enter ' + doctor_header + ' name or MDL number.');
        return;
    }
    if ($('#txtDocName1').val().length > 2) {
        // var pattern = new RegExp("^[A-Za-z0-9] .' '+$");
        var pattern = new RegExp(/^[a-zA-Z0-9' '.]+$/);
        if (!pattern.test($('#txtDocName1').val())) {
            fnMsgAlert('info', 'Choose Doctors Selection', 'Please remove the special character.');
            return false;

        }

        for (var i = 0; i < doctors_g.length; i++) {
            if (doctors_g[i].label.toUpperCase().indexOf($('#txtDocName1').val().toUpperCase()) == 0) {
                doctorsHTML += ' <li data-theme="c"><a href="#" data-transition="slide" id="doctorname_' + i + '" onclick="fnRedirectToDoctorVisit(this)">' + doctors_g[i].label.split('*')[0] + '<br />@' + doctors_g[i].label.split('_')[3] + '</a></li>';
            }
        }
    }
    else if ($('#txtMDL').val().length > 0) {
        //var pattern = new RegExp("^[A-Za-z0-9]+$");
        var pattern = new RegExp(/^[a-zA-Z0-9]+$/);
        if (!pattern.test($('#txtMDL').val())) {
            fnMsgAlert('info', 'Choose Doctors Selection', 'Please remove the special character.');
            return false;
        }

        for (var i = 0; i < doctors_g.length; i++) {
            if (doctors_g[i].label.toUpperCase().indexOf($('#txtMDL').val().toUpperCase()) > -1) {
                doctorsHTML += ' <li data-theme="c"><a href="#" data-transition="slide" id="doctorname_' + i + '" onclick="fnRedirectToDoctorVisit(this)">' + doctors_g[i].label.split('*')[0] + '<br />@' + doctors_g[i].label.split('_')[3] + '</a></li>';
            }
        }
    } else {
        fnMsgAlert('info', 'Choose Doctors Selection', 'Please enter atlease first 3 characters in the ' + doctor_header + ' name textbox.');
        return false;
    }

    $('#uldoctorlist').html("<li data-role='list-divider' role='heading'>"+doctor_header+"</li>");
    $("#uldoctorlist").listview("refresh");
    if (doctorsHTML.length > 0) {
        $('#uldoctorlist').append(doctorsHTML);
        $("#uldoctorlist").listview("refresh");
    }
    else {
        $('#uldoctorlist').append('<li data-theme="c"><a href="#">No ' + doctor_header + ' Found</a> </li>');
        //fnMsgAlert('info', 'Choose Doctors Selection', 'No Doctors Found.');
    }
}

function fnFlexiDoctors() {
    if ($('#txtFlexi').val().length == 0) {
        fnMsgAlert('info', 'Choose Doctors Selection', 'Please enter ' + doctor_header + ' name.');
        return;
    }
    else {
        //var pattern = new RegExp("^[A-Za-z0-9]+$");
        var pattern = new RegExp(/^[a-zA-Z0-9' '.]+$/);
        if (!DCRAllowedSpecialCharacters.CheckDCRSpecialCharacterGroupFlexi($('#txtFlexi'))) {
            fnMsgAlert('info', 'Choose Doctors Selection', 'Please remove the special character in ' + doctor_header + ' name. The following special characters are only allowed -.|');
            return false;
        }
    }
    if ($('#selectSpeciality')[0].selectedIndex == -1) {
        fnMsgAlert('info', 'Choose Doctors Selection', 'Please select the speciality.');
        return;
    }
    var doctorName = $('#txtFlexi').val();
    var speciality = $("#selectSpeciality option:selected").text();
    var dname = doctorName + '_' + speciality;
    $.mobile.changePage("/HiDoctor_Activity/DCRV4DoctorVisit/Index?Status=''&flagRCPA=" + flagRCPA + "&accUsers=" + accUsers_g + "&cp=''&tp=''&dcrActualDate=" + dcrDate_g + "&category=''&travelledkms=" + distance_g + "&source=''&flag=''&codes=" + escape(dcodes_g) + '&doctorname=' + dname, {
        type: "post",
        reverse: false,
        changeHash: false
    });
}