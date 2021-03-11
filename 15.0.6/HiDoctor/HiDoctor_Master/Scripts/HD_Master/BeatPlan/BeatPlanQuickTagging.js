

var userCode = ""; userDetails = "";
var b_beatdata = "";
var regionDetails = ""; beatCode_g = "-1";
var mappedDoctorDetails = ""; mappedChemistDetails = ""; mappedStockistDetails = "";
var doctorSourceFilter = false; chemistSourceFilter = false; stockistSourceFilter = false; doctorDestinationFilter = false; chemistDestinationFilter = false; stockistDestinationFilter = false;
var privValueBeatToDoctorTag = "";
var BeatPlanQuickTagging = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        UserTypeCode: "",
        lstSourceDoctors: [],
        lstSourceChemists: [],
        lstSourceStockists: [],
        lstDestinationDoctors: [],
        lstDestinationChemists: [],
        lstDestinationStockists: [],
    },
    Init: function () {

        BeatPlanQuickTagging.fnGetRegionDetails();
        // BeatPlanQuickTagging.fnGetUserDetails();
    },
    fnGetRegionDetails: function () {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = BeatPlanQuickTagging.defaults.RegionCode;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetRegionDetails', arrDetails, "POST", BeatPlanQuickTagging.fnRegionDetailsSuccessCallback, BeatPlanQuickTagging.fnRegionDetailsFailureCallback, null);
    },
    fnRegionDetailsSuccessCallback: function (response) {
        debugger;
        var lstRegions = [];
        for (var i = 0; i < response.length; i++) {
            _objData = {};
            _objData.value = response[i].Region_Code;
            _objData.label = response[i].Region_Name + ' (' + response[i].Region_Type_Name + ')';
            lstRegions.push(_objData);
        }
        if (lstRegions.length > 0) {
            regionDetails = lstRegions;
            var valueArr = [];
            valueArr.push(lstRegions[0].label);
            var atcObj = new ej.dropdowns.AutoComplete({
                //set the data to dataSource property
                placeholder: 'Select a Region',

                filterBarPlaceholder: 'Search',

                dataSource: lstRegions,

                fields: { text: 'label' },

                popupHeight: '250px',

                allowFiltering: true,
                value: valueArr,
                filtering: function (e) {
                    var dropdown_query = new ej.data.Query();
                    // frame the query based on search string with filter type.
                    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                    // pass the filter data source, filter query to updateData method.
                    e.updateData(lstRegions, dropdown_query);
                }
                //change: CUSTOMER.change,
            });
            atcObj.appendTo('#txtRegion');
            $('#txtRegion').html(lstRegions[0].label);
            $('#hdnRegionCode').val(lstRegions[0].value);
        }
    },
    fnRegionDetailsFailureCallback: function (error) {

    },
    fnValidateRegionAutoFill: function (Id) {
        debugger;
        var regionName = $('#' + Id.id).val();
        if (regionName != "" && regionDetails.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < regionDetails.length; o++) {
                if (regionDetails[o].label == regionName) {
                    i = true;
                    s = regionDetails[o].value;
                }
            }
            if (!i) {
                $("#hdnRegionCode").val(0);
            }
            else {
                $("#hdnRegionCode").val(s);
            }
        } else {
            $("#hdnRegionCode").val(0);
        }
    },
    fnGetUserDetails: function () {
        debugger;
        var arrDetails = new Array();
        var regionCode = $('#hdnRegionCode').val();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetUserDetails', arrDetails, "POST", BeatPlanQuickTagging.fnUserDetailsSuccessCallback, BeatPlanQuickTagging.fnUserDetailsFailureCallback, null);
    },
    fnUserDetailsSuccessCallback: function (response) {
        debugger;
        if (response.length == 0) {

        } else if (response != null && response.length == 1) {
            userCode = response[0].User_Code;
            userDetails = response;
            BeatPlanQuickTagging.fnGetUserPrivileges(response[0].User_Code, "LOAD");
        }
        else if (response != null && response.length > 1) {
            userCode = response[0].User_Code;
            userDetails = response;
            //BeatPlanQuickTagging.fnGetUserPrivileges(response[0].User_Code, "LOAD");
            privValueBeatToDoctorTag = "MULTIPLE";
            BeatPlanQuickTagging.fnGetAllPieCharts();

        }
    },
    fnUserDetailsFailureCallback: function (error) {

    },
    fnGetUserPrivileges: function (userCode, typeofLoad) {
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = BeatPlanQuickTagging.defaults.SelectedRegionCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userCode";
        _obj.value = userCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userTypeCode";
        _obj.value = userDetails[0].User_Type_Code;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetUserTypePrivileges', arrDetails, "POST", BeatPlanQuickTagging.fnUserTypePrivilegesSuccessCallback, BeatPlanQuickTagging.fnUserTypePrivilegesFailureCallback, null);
    },
    fnUserTypePrivilegesSuccessCallback: function (response) {
        debugger;
        if (response != null && response.length > 0) {
            var disjson = $.grep(response, function (ele, index) {
                return ele.Privilege_Name == "CCM_BEAT_TO_DOCTOR_TAG";
            });
            if (disjson.length > 0) {
                privValueBeatToDoctorTag = disjson[0].Privilege_Value_Name;
            } else {
                privValueBeatToDoctorTag = "MULTIPLE";
            }
        }
        BeatPlanQuickTagging.fnGetAllPieCharts();

    },
    fnUserTypePrivilegesFailureCallback: function (error) {

    },
    fnValidateRegionSelection: function () {
        debugger;
        var isValid = true;
        if ($('#txtRegion').val() == "" || $('#txtRegion').val() == undefined || $('#txtRegion').val() == null) {
            swal('Info', 'Please select Region for Beat/Patch Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        if ($('#hdnRegionCode').val() == 0) {
            swal('Info', 'Please select Region for Beat/Patch Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    fnGetAllBeatRelatedActivity: function () {
        debugger;
        var result = BeatPlanQuickTagging.fnValidateRegionSelection();
        if (result) {
            $.blockUI();
            beatCode_g = "";
            $('.dvSourChkAll').hide();
            $('.dvSearchGridDest').hide();
            $('#dvBeatDestinationBody').empty();
            $('#dvDoctorDestinationBody').empty();
            $('#dvChemistDestinationBody').empty();
            $('#dvStockistDestinationBody').empty();
            $('#pie_container1').empty();
            $('#pie_container2').empty();
            $('#pie_container3').empty();
            $('#pie_container4').empty();
            $('#pie_container5').empty();
            BeatPlanQuickTagging.fnGetUserDetails();
            $('#idShowhidelink').show();
            $('.dvSearchGridDest').removeClass('d-flex');
            BeatPlanQuickTagging.defaults.lstSourceDoctors = [];
            BeatPlanQuickTagging.defaults.lstSourceChemists = [];
            BeatPlanQuickTagging.defaults.lstSourceStockists = [];
            BeatPlanQuickTagging.defaults.lstDestinationDoctors = [];
            BeatPlanQuickTagging.defaults.lstDestinationChemists = [];
            BeatPlanQuickTagging.defaults.lstDestinationStockists = [];
            $('#dvDoctorsSearchGrid').hide();
            $('#dvChemistsSearchGrid').hide();
            $('#dvStockistsSearchGrid').hide();
            BeatPlanQuickTagging.fnGetCount('#dvBeatDestinationBody .draggableClass', 'bdgBeat', '', '', 'BEAT');
            BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
            BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');
            BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
            BeatPlanQuickTagging.fnGetAllApprovedBeats();
            $('#pieChart').show();
            $('#dvWebGrid').show();
            $('#MainDivBeat_S #CommonCollapse').html('<i class="fa fa-minus" aria-hidden="true"></i>');
            $('#dvBeatsDest #CommonCollapse').html('<i class="fa fa-minus" aria-hidden="true"></i>');
            $('#dvBeatsDataBody').show();
            $('#dvBeatDestinationBody').show();
            $('#dvCommonFunctions').show();
            $('#dvActions').show();
            //BeatPlanQuickTagging.fnViewBeatSummaryDetails('0');
        }
    },

    fnGetBadgeName: function (status) {
        var badgeName = "";
        switch (status) {
            case "2":
                badgeName = "badge-primary";
                break;
            case "1":
                badgeName = "badge-success";
                break;
            case "0":
                badgeName = "badge-danger";
                break;
            default:
                badgeName = "badge-info";
                break;
        }
        return badgeName;
    },
    fnGetCount: function (fromId, toId, approvedId, unApprovedId, type) {
        var count = "";
        var ApprovedCount = "";
        var unApprovedCount = "";
        var approvedAppendId = "";
        var unapprovedAppendId = "";
        if (type.toUpperCase() == "BEAT") {
            count = $(fromId).length;
            $('#' + toId).html(count);
        } else if (type.toUpperCase() == "DOCTOR" || type.toUpperCase() == "CHEMIST" || type.toUpperCase() == "STOCKIEST") {
            count = $(fromId).length;
            $('#' + toId).html(count);
            approvedAppendId = fromId + ".Approved";
            ApprovedCount = $(approvedAppendId).length;
            unapprovedAppendId = fromId + ".UnApproved";
            unApprovedCount = $(unapprovedAppendId).length;
            $('#' + approvedId).html(ApprovedCount);
            $('#' + unApprovedId).html(unApprovedCount);

        }
        //else if (type.toUpperCase() == "CHEMIST") {
        //    count = $(fromId).length;
        //    $('#' + toId).html(count);
        //} else if (type.toUpperCase() == "STOCKIEST") {
        //    count = $(fromId).length;
        //    $('#' + toId).html(count);
        //}

    },
    fnGetAllPieCharts: function () {
        debugger;
        var regionCode = $('#hdnRegionCode').val();
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";

        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode;
        arrDetails.push(_obj);
        _obj = {};
        _obj.name = "onceormultiplePriv";
        _obj.value = privValueBeatToDoctorTag;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllPieChartDetails', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllPieChartsSuccessCallback, BeatPlanQuickTagging.fnGetAllPieChartsFailureCallback, null);
    },

    //Pie Charts
    fnGetAllPieChartsSuccessCallback: function (response) {
        debugger;
        if (response != null) {

            if (response.lstBeats != null && response.lstBeats.length > 0) {
                //For Beats
                BeatPlanQuickTagging.fnBindPieChart(response.lstBeats, response.lstBeats[0].name, 'pie_container1', response.lstBeats[0].name);
            }
            else {
                $('#pie_container1').empty();
            }
            if (response.lstDoctorsTaggedOrNotTagged != null && response.lstDoctorsTaggedOrNotTagged.length > 0) {
                //For Tagged & Not Tagged Doctors
                BeatPlanQuickTagging.fnBindPieChartnew(response.lstDoctorsTaggedOrNotTagged, response.lstDoctorsTaggedOrNotTagged[0].name, 'pie_container2', response.lstDoctorsTaggedOrNotTagged[0].name);
            }
            else {
                $('#pie_container2').empty();
            }
            if (response.lstBeatsToDoctors != null && response.lstBeatsToDoctors.length > 0) {
                //For Beats To Doctors
                BeatPlanQuickTagging.fnBindPieChart(response.lstBeatsToDoctors, response.lstBeatsToDoctors[0].name, 'pie_container3', response.lstBeatsToDoctors[0].name);
            }
            else {
                $('#pie_container3').empty();
            }
            if (response.lstBeatsToChemists != null && response.lstBeatsToChemists.length > 0) {
                //For Beats To Chemists
                BeatPlanQuickTagging.fnBindPieChart(response.lstBeatsToChemists, response.lstBeatsToChemists[0].name, 'pie_container4', response.lstBeatsToChemists[0].name);
            }
            else {
                $('#pie_container4').empty();
            }
            if (response.lstBeatsToStockists != null && response.lstBeatsToStockists.length > 0) {
                //For Beats To Stockists
                BeatPlanQuickTagging.fnBindPieChart(response.lstBeatsToStockists, response.lstBeatsToStockists[0].name, 'pie_container5', response.lstBeatsToStockists[0].name);
            }
            else {
                $('#pie_container5').empty();
            }
        }
    },
    fnBindPieChart(arr, titleName, bindingdivId, bindname) {
        var pie = new ej.charts.AccumulationChart({
            //Initializing Series
            series: [
                {
                    dataSource: arr,
                    dataLabel: {
                        visible: true,
                        position: 'Inside', name: 'text',
                        font: {
                            fontWeight: '600'
                        }
                    },
                    radius: '100%',
                    xName: 'x',
                    yName: 'y',
                    startAngle: 0,
                    endAngle: 0,
                    innerRadius: '0%',
                    explode: true,
                    explodeOffset: '5%',
                    explodeIndex: 0,
                    name: 'Browser',

                }
            ],
            center: { x: '50%', y: '50%' },
            enableSmartLabels: true,
            enableAnimation: true,
            //pointClick: BeatPlanQuickTagging.fndocdetails,
            legendSettings: {
                visible: true,
            },
            //Initializing Tooltip
            tooltip: { enable: true, header: bindname, format: '${point.x}:<b> ${point.y}<b>' },
            //Initializing Title
            title: titleName,
            load: function (args) {
                var selectedTheme = location.hash.split('/')[1];
                selectedTheme = selectedTheme ? selectedTheme : 'Material';
                args.accumulation.theme = (selectedTheme.charAt(0).toUpperCase() +
                    selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
            },
            name: bindname,
        });
        $("#" + bindingdivId).html('');
        pie.appendTo('#' + bindingdivId);
        //function onClick(e) {
        //    debugger;
        //    alert(1)
        //}
        //$("#bindname").click(
        //   alert(1)
        //);
    },
    fnBindPieChartnew(arr, titleName, bindingdivId, bindname) {
        var pie = new ej.charts.AccumulationChart({
            //Initializing Series
            series: [
                {
                    dataSource: arr,
                    dataLabel: {
                        visible: true,
                        position: 'Inside', name: 'text',
                        font: {
                            fontWeight: '600'
                        }
                    },
                    radius: '100%',
                    xName: 'x',
                    yName: 'y',
                    startAngle: 0,
                    endAngle: 0,
                    innerRadius: '0%',
                    explode: true,
                    explodeOffset: '5%',
                    explodeIndex: 0,
                    name: 'Browser',

                }
            ],
            center: { x: '50%', y: '50%' },
            enableSmartLabels: true,
            enableAnimation: true,
            pointClick: BeatPlanQuickTagging.fndocdetails,
            legendSettings: {
                visible: true,
            },
            //Initializing Tooltip
            tooltip: { enable: true, header: bindname, format: '${point.x}:<b> ${point.y}<b>' },
            //Initializing Title
            title: titleName,
            load: function (args) {
                var selectedTheme = location.hash.split('/')[1];
                selectedTheme = selectedTheme ? selectedTheme : 'Material';
                args.accumulation.theme = (selectedTheme.charAt(0).toUpperCase() +
                    selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
            },
            name: bindname,
        });
        $("#" + bindingdivId).html('');
        pie.appendTo('#' + bindingdivId);
        //function onClick(e) {
        //    debugger;
        //    alert(1)
        //}
        //$("#bindname").click(
        //   alert(1)
        //);
    },
    fndocdetails: function (args) {
        debugger;
        var regionCode = $('#hdnRegionCode').val();
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";

        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode;
        arrDetails.push(_obj);
        _obj = {};
        _obj.name = "Type";
        _obj.value = args.point.label.replace(/ /g, '_');
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetDoctordetails', arrDetails, "POST", BeatPlanQuickTagging.fnGetdocdetailsSuccessCallback, BeatPlanQuickTagging.fnGetdocdetailsFailureCallback, null);
    },
    fnGetdocdetailsSuccessCallback: function (response) {
        debugger;
        BeatPlanQuickTagging.onClickopenPos(response);
    },
    fnGetdocdetailsFailureCallback: function () {

    },
    onClickopenPos: function (response) {
        debugger;
        var content = "";
        $("#detailsbody").html('');
        content += '<table class="table table-bordered">';
        content += ' <thead>';
        content += ' <tr>';
        content += ' <th scope="col">Doctor Name</th>';
        content += ' <th scope="col">Speciality</th>';
        content += '<th scope="col">Category</th>';
        content += '<th scope="col">Local Area</th>';
        content += '<th scope="col">MDL No</th>';
        content += '</tr>';
        content += '</thead>';
        for (var i = 0; i < response.length; i++) {
            content += ' <tbody>';
            content += '<tr>';
            content += ' <th scope="row">' + response[i].Customer_Name + '</th>';
            content += ' <td>' + response[i].Speciality_Name + '</td>';
            content += '<td>' + response[i].Category_Name + '</td>';
            content += '<td>' + response[i].Local_Area + '</td>';
            content += '<td>' + response[i].MDL_Number + '</td>';
            content += '</tr>';
            content += '</tbody>';
        }

        content += '</table>';
        $("#detailsbody").append(content);
        $("#detailmodal").modal('show');

    },
    //Beats
    fnGetAllApprovedBeats: function () {
        debugger;
        var regionCode = $('#hdnRegionCode').val();
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode;
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetApprovedBeatsByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllApprovedBeatsSuccessCallback, BeatPlanQuickTagging.fnGetAllApprovedBeatsFailureCallback, null);
    },
    fnGetAllApprovedBeatsSuccessCallback: function (response) {
        debugger;
        var content = '';
        if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                content += '<div class="col-sm-12 li draggableClass" id="dvdragbeat_' + i + '">';
                content += '<div class="" id="dvBeatsBody">';
                content += '<div class="mb-2" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex beatheaderColor">';
                content += '<div class="bg-higlight" style="float:left;">';
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewBeatDetails(\'' + response[i].Beat_Code + '\',\'' + response[i].Region_Code + '\');">' + response[i].Beat_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Beat Name to View Details." id="test_' + i + '"></i>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Status);
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-eye px-1" aria-hidden="true" id="singleEdit" style="cursor: pointer;" onclick="BeatPlanQuickTagging.fnViewBeatSummaryDetails(\'' + i + '\');"></i>';
                content += '<i class="fa fa-times" aria-hidden="true" style="display:none;" id="ifontremove_' + i + '"onclick="BeatPlanQuickTagging.fnRemoveBeatTagging(this);"></i>';
                content += '</div>';
                content += '</div>';
                if (i == 0) {
                    content += '<div class="p-2 col-sm-12 col-md-12"  id="dvBeatDescrBody_' + i + '">';

                } else {
                    content += '<div class="p-2 col-sm-12 col-md-12" style="display:none;" id="dvBeatDescrBody_' + i + '">';

                }
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">SFC Count :</label>';
                content += '<span class="badge badge-pill btn-info" id="tooltipFromPlace">' + response[i].SFC_Details_Count + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">No. of Doctor(s) Tagged :</label>';
                content += '<span class="badge badge-pill btn-info" id="tooltipFromPlace">' + response[i].Doctor_Details_Count + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Approved Doctor(s) Count :</label>';
                content += '<span class="badge badge-pill btn-success" id="tooltipFromPlace">' + response[i].Approved_Doctors_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">UnApproved Doctor(s) Count :</label>';
                content += '<span class="badge badge-pill btn-danger" id="tooltipFromPlace">' + response[i].UnApproved_Doctors_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">No. Of Chemist(s) Tagged :</label>';
                content += '<span class="badge badge-pill btn-success" id="tooltipFromPlace">' + response[i].Chemist_Details_Count + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Approved Chemist(s) Count :</label>';
                content += '<span class="badge badge-pill btn-success" id="tooltipFromPlace">' + response[i].Approved_Chemists_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">UnApproved Chemists(s) Count :</label>';
                content += '<span class="badge badge-pill btn-danger" id="tooltipFromPlace">' + response[i].UnApproved_Chemists_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">No. Of Stockist(s) Tagged :</label>';
                content += '<span class="badge badge-pill btn-success" id="tooltipFromPlace">' + response[i].Stockist_Details_Count + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Approved Stockist(s) Count :</label>';
                content += '<span class="badge badge-pill btn-success" id="tooltipFromPlace">' + response[i].Approved_Stockists_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">UnApproved Stockist(s) Count :</label>';
                content += '<span class="badge badge-pill btn-danger" id="tooltipFromPlace">' + response[i].UnApproved_Stockists_In_Tagged + '</span>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-2 flex-fill bd-highlight flex">';
                content += '<div class="form-group row no-gutters m-0">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Beat Status :</label>';
                content += '<span class="badge badge-pill ' + badgedetails + '">' + response[i].Beat_Status + '</span>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden"  id="beat_' + i + '" value="' + response[i].Beat_Code + '"/>';
                content += '</div>';
                content += '</div>';
            }
        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
        }
        $('#dvBeatsDataBody').html(content);
        var beatsource = $("#dvBeatsDataBody"); beatdestination = $("#dvBeatDestinationBody");
        $(function () {
            $(".draggableClass", beatsource).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
            });

            beatdestination.droppable({
                accept: "#dvBeatsDataBody .li",
                classes: {
                },
                drop: function (event, ui) {
                    debugger;
                    $.blockUI();
                    BeatPlanQuickTagging.fnDelteBeatCard(ui.draggable);

                },
            });
        });

        BeatPlanQuickTagging.fnGetAllApprovedDoctors("");

    },
    fnViewBeatSummaryDetails: function (CardId) {
        debugger;
        if ($('#dvBeatDescrBody_' + CardId).is(':visible')) {
            $('#dvBeatDescrBody_' + CardId).hide();
        } else {
            $('#dvBeatDescrBody_' + CardId).show();
        }
    },
    fnDelteBeatCard: function (item) {
        debugger;
        var beatsource = $("#dvBeatsDataBody"); beatdestination = $("#dvBeatDestinationBody");
        item.fadeOut(function () {
            debugger;
            item.appendTo(beatdestination).fadeIn(function () {
                item
                  .find("img")
                    .animate({ height: "36px" });
            });
            $("#dvBeatsDataBody").find(".draggableClass").draggable({
                disabled: true
            });
            var showremoveOption = item[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1];
            //item[0].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[3];
            $('#' + showremoveOption.id).show();
            var cardNo = showremoveOption.id.split('_')[1];
            BeatPlanQuickTagging.fnGetCount('#dvBeatDestinationBody .draggableClass', 'bdgBeat', '', '', 'BEAT');
            var beatcode = "";
            //beatcode = $('#beat_' + cardNo).val();
            beatcode = $('#dvBeatDestinationBody  #dvdragbeat_' + cardNo + ' #beat_' + cardNo).val()//$('#dvBeatDestinationBody  #dvdragbeat_' + cardNo).children()[1].value//$('#dvBeatDestinationBody #beat_' + cardNo)[1].value;

            beatCode_g = beatcode;
            BeatPlanQuickTagging.fnGetAllApprovedDoctors(beatcode);
            //BeatPlanQuickTagging.fnGetAllChemists(beatcode);
            //BeatPlanQuickTagging.fnGetAllStockists(beatcode);

            $('.dvSourChkAll').show();
            //$('.dvSearchGridDest').show();
            //$('.dvSearchGridDest').addClass('d-flex');
        });

    },
    fnRemoveBeatTagging: function (Id) {
        debugger;
        beatCode_g = "-1"
        var dvParent = $(Id).parent().parent().parent().parent().parent().parent();
        $('#' + dvParent[0].id).remove();
        //BeatPlanQuickTagging.fnGetAllApprovedBeats();
        BeatPlanQuickTagging.fnGetAllBeatRelatedActivity();
    },


    //Source Doctors
    fnGetAllApprovedDoctors: function (beatcode) {
        debugger;
        var regionCode = $('#hdnRegionCode').val();
        doctorSourceFilter = true;
        var beatCode = "";
        var mappedonot = "";
        var beatType = "LOAD";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "NO"
            beatType = "BEAT";
        } else {
            beatCode = '-1'
            mappedonot = "-1";
            beatType = "LOAD";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "DOCTOR",
            Data_Load_Type: beatType,
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback, BeatPlanQuickTagging.fnGetAllApprovedDoctorsFailureCallback, null);
    },
    fnGetAllApprovedDoctorsSuccessCallback: function (response) {
        debugger;
        //b_beatdata = response.list;
        var content = "";
        var customerEntityType = "DOCTOR";
        var requestType = "SOURCE";
        var dvId = "divDoctorsDataBody";
        var checkBoxName = "doctorsourcemuliselect";
        if (doctorSourceFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstSourceDoctors = response;
        }
        $("#doctorchkAll").text('Select All');
        if (response != null && response != "" && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                var taggByPrivilClass = "multiple";
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                        if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                            if (parseInt(response[i].Tagged_Count) < 1) {
                                taggByPrivilClass = "once"
                            } else {
                                taggByPrivilClass = "maxed";
                            }
                        } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                            if (parseInt(response[i].Tagged_Count) < parseInt(response[i].Visit_Count)) {
                                taggByPrivilClass = "multiple"
                            } else {
                                taggByPrivilClass = "maxed";
                            }
                        }
                    }
                }
                var docdetail = "-1";

                content += '<div class="col-sm-12 li draggableDoctorClass ' + response[i].Mapping_Status + ' ' + response[i].Customer_Status_Text + ' ' + taggByPrivilClass + '" id="dvMainDoctorCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="DoctorCard_' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">'
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="doctorsourcemuliselect" checked="checked" class="custom-control-input align-top"  id="doctorcheckboxAutosizing_' + i + '" >'
                    } else {
                        content += '<input type="checkbox" name="doctorsourcemuliselect" class="custom-control-input align-top"  id="doctorcheckboxAutosizing_' + i + '">'
                    }
                    content += '<label class="custom-control-label" for="doctorcheckboxAutosizing_' + i + '" onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + docdetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Doctor Name to View Details." id="testDocNotTagged_' + i + '"></i>';
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-times p-2" aria-hidden="true" style="display:none" id="ifontdoctorremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveDoctorFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                if (response[i].Tagged_SFCs_Count > 0) {
                    content += '<span class="dot colorcls" tooltip="Doctor Tagged to SFC"></span>';
                }
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Speciality :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Speciality_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Category :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Category_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">MDL Number :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].MDL_Number + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdndoctorDetails_' + i + '"/>';
                content += '</div>';


            }
        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
        }
        $('#divDoctorsDataBody').html(content);

        if (doctorSourceFilter) {
            $('#txtDoctorName').val('');
            $('#dvSourceDocSearch').html('');
            $('#dvSourceDocSearch').html('<input type="text" class="form-control form-control-sm" id="txtDoctorName" placeholder="Enter Doctor Name..">');
            var lstDocName = [];
            for (var i = 0; i < response.length; i++) {
                _objData = {};
                _objData.label = response[i].First_Name;

                lstDocName.push(_objData);
            }
            if (lstDocName.length > 0) {
                //regionDetails = lstDocName;
                var valueArr = [];
                //valueArr.push(lstDocName[0].label);
                var atcObj = new ej.dropdowns.AutoComplete({
                    //set the data to dataSource property
                    dataSource: lstDocName,
                    fields: { text: 'label' },
                    placeholder: 'Search by Doctor Name',
                    //value: valueArr

                });
                atcObj.appendTo('#txtDoctorName');

            }
        }
        if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
            var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
            $(function () {
                // Let the gallery items be draggable
                $(".draggableDoctorClass", Doctorsource).draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                });
                var acceptfromClass = "";
                if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                    if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                        acceptfromClass = "#divDoctorsDataBody .li.once";
                    } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                        acceptfromClass = "#divDoctorsDataBody .li.multiple";
                    }
                }
                // Let the trash be droppable, accepting the gallery items
                Doctordestination.droppable({
                    accept: acceptfromClass,
                    classes: {
                    },
                    drop: function (event, ui) {
                        debugger;
                        BeatPlanQuickTagging.fnDeleteDoctorCard(ui.draggable);

                    },
                });
            });
            if (doctorSourceFilter) {
                BeatPlanQuickTagging.fnGetAllChemists(beatCode_g);
            }
            // BeatPlanQuickTagging.fnEventBinderselectAll("doctorchkAll", "SOURCE", "DOCTOR", "doctorsourcemuliselect");
        }
        else {
            BeatPlanQuickTagging.fnGetAllChemists("");
        }
    },
    fnGetAllApprovedDoctorsFailureCallback: function (error) {

    },
    fnDeleteDoctorCard: function (item) {
        var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
        var Values = "";
        var ValuesArr = [];
        var disjson = "";
        if ($("#dvDoctorDestinationBody .li").length == 0) {
            $('#dvDoctorDestinationBody').empty();
        }
        item.fadeOut(function () {
            debugger;
            item.appendTo(Doctordestination).fadeIn(function () {
                item
                  .find("img")
                    .animate({ height: "36px" });
                BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
                var count = 0;
                $("#dvDoctorDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');

                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    //$(this).find('input').attr('id', 'hdndoctorDetails_' + count);
                    //$(this).children().find('input').attr('id', 'hdndoctorDetails_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'doctorDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorDestcheckboxAutosizing_' + count);
                    $('input[name="doctorDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });
                var count = 0;
                $("#divDoctorsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    //  $(this).find('input').attr('id', 'hdndoctorDetails_' + count);
                    //$(this).children().find('input').attr('id', 'hdndoctorDetails_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });
                $("#doctorchkAll").text('Select All');
                //$('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                //$('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('UnMap');
                var details = $('#' + item.children()[1].id).val();
                var fltrddoctorCode = details.split('|')[1];
                var fltrdregionCode = details.split('|')[0];
                var fltrdcustomerEntityType = details.split('|')[2];
                var disjsonDocMapped = $.grep(mappedDoctorDetails, function (ele, index) {
                    return ele.Customer_Code == fltrddoctorCode && ele.Customer_Entity_Type == fltrdcustomerEntityType && ele.Region_Code == fltrdregionCode;
                });


                var crossIconId = item.children().children().children().children().children().find('i')
                $('#dvDoctorDestinationBody #' + crossIconId[1].id).show();
                //if (BeatPlanQuickTagging.defaults.lstSourceDoctors.length > 0) {
                //}
                Values = item.children()[1].value;
                ValuesArr = Values.split('|');

                disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceDoctors, function (ele, index) {
                    return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                });
                if ($('#dvDoctorDestinationBody #' + item.attr('id')).hasClass('UnMap')) {
                    $('#dvDoctorDestinationBody #' + item.attr('id')).addClass('Mapped');
                    $('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('UnMap');
                    disjson[0].Mapping_Status = "Mapped";
                } else if ($('#dvDoctorDestinationBody #' + item.attr('id')).hasClass('NotMapped')) {
                    $('#dvDoctorDestinationBody #' + item.attr('id')).addClass('Map');
                    $('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                    disjson[0].Mapping_Status = "Map";
                }
                disjson[0].Is_Selected = 0;
                if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                    if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                        disjson[0].Tagged_Count = 1;
                        $('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('once');
                        $('#dvDoctorDestinationBody #' + item.attr('id')).addClass('maxed');
                    } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                        disjson[0].Tagged_Count = parseInt(disjson[0].Tagged_Count) + 1;
                        if (parseInt(disjson[0].Tagged_Count) == parseInt(disjson[0].Visit_Count)) {
                            $('#dvDoctorDestinationBody #' + item.attr('id')).removeClass('multiple');
                            $('#dvDoctorDestinationBody #' + item.attr('id')).addClass('maxed');
                        }
                    }
                }
                BeatPlanQuickTagging.defaults.lstDestinationDoctors.push(disjson[0]);
                var filtered = BeatPlanQuickTagging.defaults.lstSourceDoctors.filter(function (item) {
                    return item.Customer_Code !== ValuesArr[1];
                });
                BeatPlanQuickTagging.defaults.lstSourceDoctors = filtered;
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceDocSearch", "txtDoctorName", BeatPlanQuickTagging.defaults.lstSourceDoctors, "Doctor");
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestDocSearch", "textDestDoctorName", BeatPlanQuickTagging.defaults.lstDestinationDoctors, "Doctor");
                doctorSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceDoctors);

                $('#dvDoctorsSearchGrid').show();
                $('#dvDoctorsSearchGrid').addClass('d-flex');
            });


        });


    },


    //Source Chemists
    fnGetAllChemists: function (beatcode) {
        debugger;
        chemistSourceFilter = true;
        var regionCode = $('#hdnRegionCode').val();
        var beatCode = "";
        var mappedonot = "";
        var beatType = "LOAD";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "NO"
            beatType = "BEAT";
        } else {
            beatCode = '-1'
            mappedonot = "-1";
            beatType = "LOAD";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "CHEMIST",
            Data_Load_Type: beatType,
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback, BeatPlanQuickTagging.fnGetAllChemistsFailureCallback, null);
    },
    fnGetAllChemistsSuccessCallback: function (response) {
        debugger;
        var content = "";
        var customerEntityType = "CHEMIST";
        var requestType = "SOURCE";
        var dvId = "dvChemistsDataBody";
        var checkBoxName = "chemistsourcemultiselect";
        if (chemistSourceFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstSourceChemists = response;
        }
        $("#chemistchkAll").text('Select All');
        if (response != null && response != "" && response.length > 0) {
            var Chemdetail = "-1";
            for (var i = 0; i < response.length; i++) {

                content += '<div class="col-sm-12 li draggableChemistClass  ' + response[i].Mapping_Status + ' ' + response[i].Customer_Status_Text + '" id="dvMainChemistCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="ChemistCard_' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">'
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="chemistsourcemultiselect" checked="checked" class="custom-control-input align-top"  id="chemistcheckboxAutosizing_' + i + '">'

                    } else {
                        content += '<input type="checkbox" name="chemistsourcemultiselect" class="custom-control-input align-top"  id="chemistcheckboxAutosizing_' + i + '">'
                    }
                    content += '<label class="custom-control-label" for="chemistcheckboxAutosizing_' + i + '"onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + Chemdetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Chemist Name to View Details." id="testChemNotTagged_' + i + '"></i>';
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';

                content += '<i class="fa fa-times p-2" aria-hidden="true" style="display:none" id="ifontchemistremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveChemistFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug License No. :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Drug_License_Number + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Local Area :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Local_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Ref_Key1 + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdnchemistDetails_' + i + '"/>';
                content += '</div>';
            }

        } else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
        }

        $('#dvChemistsDataBody').html(content);

        debugger;
        if (chemistSourceFilter) {
            $('#txtChemistName').val('');
            $('#dvSourceChemSearch').html('');
            $('#dvSourceChemSearch').html('<input type="text" class="form-control form-control-sm" id="txtChemistName" placeholder="Enter Chemist Name..">');
            var lstChemistName = [];
            for (var i = 0; i < response.length; i++) {
                _objData = {};
                _objData.label = response[i].First_Name;

                lstChemistName.push(_objData);
            }
            if (lstChemistName.length > 0) {
                //regionDetails = lstChemistName;
                var valueArr = [];
                //valueArr.push(lstChemistName[0].label);
                var atcObj = new ej.dropdowns.AutoComplete({
                    //set the data to dataSource property
                    dataSource: lstChemistName,
                    fields: { text: 'label' },
                    placeholder: 'Search by Chemist Name',
                    //value: valueArr

                });
                atcObj.appendTo('#txtChemistName');
            }
        }
        $('#dvChemistsDataBody').html(content);
        if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
            var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
            $(function () {
                // Let the gallery items be draggable
                $(".draggableChemistClass", Chemistsource).draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                });

                // Let the trash be droppable, accepting the gallery items
                Chemistdestination.droppable({
                    accept: "#dvChemistsDataBody .li",
                    classes: {
                    },
                    drop: function (event, ui) {
                        debugger;
                        BeatPlanQuickTagging.fnDeleteChemistCard(ui.draggable);

                    },
                });
            });
            if (chemistSourceFilter) {
                BeatPlanQuickTagging.fnGetAllStockists(beatCode_g);
            }
            // BeatPlanQuickTagging.fnEventBinderselectAll("chemistchkAll", "SOURCE", "CHEMIST", "chemistsourcemultiselect");

        } else {
            BeatPlanQuickTagging.fnGetAllStockists("");

        }

    },
    fnGetAllChemistsFailureCallback: function (error) {

    },
    fnDeleteChemistCard: function (item) {
        var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
        if ($("#dvChemistDestinationBody .li").length == 0) {
            $('#dvChemistDestinationBody').empty();
        }
        var Values = "";
        var ValuesArr = [];
        var disjson = "";
        item.fadeOut(function () {
            debugger;
            item.appendTo(Chemistdestination).fadeIn(function () {
                item
                  .find("img")
                    .animate({ height: "36px" });
                BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');
                var count = 0;
                $("#dvChemistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'chemistDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistDestcheckboxAutosizing_' + count);
                    $('input[name="chemistDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                var count = 0;
                $("#dvChemistsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                $("#chemistchkAll").text('Select All');
                //$('#dvChemistDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                //$('#dvChemistDestinationBody #' + item.attr('id')).removeClass('UnMap');
                var details = $('#' + item.children()[1].id).val();
                var fltrdchemistCode = details.split('|')[1];
                var fltrdregionCode = details.split('|')[0];
                var fltrdcustomerEntityType = details.split('|')[2];
                var disjsonChemMapped = $.grep(mappedChemistDetails, function (ele, index) {
                    return ele.Customer_Code == fltrdchemistCode && ele.Customer_Entity_Type == fltrdcustomerEntityType && ele.Region_Code == fltrdregionCode;
                });

                // $('#dvChemistDestinationBody #' + item.children().children().children().children().children().find('i').attr('id')).show();
                var crossIconId = item.children().children().children().children().children().find('i')
                $('#dvChemistDestinationBody #' + crossIconId[1].id).show();
                //if (BeatPlanQuickTagging.defaults.lstSourceChemists.length > 0) {
                //}

                Values = item.children()[1].value;
                ValuesArr = Values.split('|');

                disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceChemists, function (ele, index) {
                    return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                });
                if ($('#dvChemistDestinationBody #' + item.attr('id')).hasClass('UnMap')) {
                    $('#dvChemistDestinationBody #' + item.attr('id')).addClass('Mapped');
                    $('#dvChemistDestinationBody #' + item.attr('id')).removeClass('UnMap');

                    disjson[0].Mapping_Status = "Mapped";
                } else if ($('#dvChemistDestinationBody #' + item.attr('id')).hasClass('NotMapped')) {
                    $('#dvChemistDestinationBody #' + item.attr('id')).addClass('Map');
                    $('#dvChemistDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                    disjson[0].Mapping_Status = "Map";
                }
                disjson[0].Is_Selected = 0;
                BeatPlanQuickTagging.defaults.lstDestinationChemists.push(disjson[0]);
                var filtered = BeatPlanQuickTagging.defaults.lstSourceChemists.filter(function (item) {
                    return item.Customer_Code !== ValuesArr[1];
                });
                BeatPlanQuickTagging.defaults.lstSourceChemists = filtered;
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceChemSearch", "txtChemistName", BeatPlanQuickTagging.defaults.lstSourceChemists, "Chemist");
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestChemSearch", "textDestChemistName", BeatPlanQuickTagging.defaults.lstDestinationChemists, "Chemist");
                chemistSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceChemists);

                $('#dvChemistsSearchGrid').show();
                $('#dvChemistsSearchGrid').addClass('d-flex');
            });

        });

    },



    //Source Stockists
    fnGetAllStockists: function (beatcode) {
        debugger;
        stockistSourceFilter = true;
        var regionCode = $('#hdnRegionCode').val();
        var beatCode = "";
        var mappedonot = "";
        var beatType = "LOAD";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "NO"
            beatType = "BEAT";
        } else {
            beatCode = '-1'
            mappedonot = "-1";
            beatType = "LOAD";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "STOCKIEST",
            Data_Load_Type: beatType,
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback, BeatPlanQuickTagging.fnGetAllStockistsFailureCallback, null);
    },
    fnGetAllStockistsSuccessCallback: function (response) {
        debugger;
        var content = "";
        var customerEntityType = "STOCKIST";
        var requestType = "SOURCE";
        var dvId = "dvStockistDataBody";
        var checkBoxName = "chemistsourcemultiselect";
        if (stockistSourceFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstSourceStockists = response;
        }
        $("#stockistchkAll").text('Select All');
        if (response != null && response != "" && response.length > 0) {
            var Stockistdetail = "-1";
            for (var i = 0; i < response.length; i++) {
                content += '<div class="col-sm-12 li draggableStockistClass ' + response[i].Mapping_Status + ' ' + response[i].Customer_Status_Text + '" id="dvMainStockistCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="StockistCard_' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">'
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="stockistsourcemultiselect"checked="checked" class="custom-control-input align-top"  id="stockistcheckboxAutosizing_' + i + '">'

                    } else {
                        content += '<input type="checkbox" name="stockistsourcemultiselect" class="custom-control-input align-top"  id="stockistcheckboxAutosizing_' + i + '">'

                    }
                    content += '<label class="custom-control-label" for="stockistcheckboxAutosizing_' + i + '" onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + Stockistdetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Stockist Name to View Details." id="testStockistNotTagged_' + i + '"></i>'; s
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-times p-2" aria-hidden="true" style="display:none" id="ifontstockistremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveStockistFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug License No. :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Drug_License_Number + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Local Area :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Local_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Ref_Key1 + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdnstockistDetails_' + i + '"/>';
                content += '</div>';
            }
            //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';


        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
        }
        $('#dvStockistDataBody').html(content);

        //Result = data;
        debugger;
        if (stockistSourceFilter) {
            $('#txtStockistName').val('');
            $('#dvSourceStockSearch').html('');
            $('#dvSourceStockSearch').html('  <input type="text" class="form-control form-control-sm" id="txtStockistName" placeholder="Enter Doctor Name..">');
            var lstStockistName = [];
            for (var i = 0; i < response.length; i++) {
                _objData = {};
                _objData.label = response[i].First_Name;

                lstStockistName.push(_objData);
            }
            if (lstStockistName.length > 0) {
                //regionDetails = lstStockistName;
                var valueArr = [];
                //valueArr.push(lstStockistName[0].label);
                var atcObj = new ej.dropdowns.AutoComplete({
                    //set the data to dataSource property
                    dataSource: lstStockistName,
                    fields: { text: 'label' },
                    placeholder: 'Search Stockist Name',
                    //value: valueArr

                });
                atcObj.appendTo('#txtStockistName');

            }
        }
        $('#dvStockistDataBody').html(content);
        if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
            var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
            $(function () {
                // Let the gallery items be draggable
                $(".draggableStockistClass", Stockistsource).draggable({
                    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                    revert: "invalid", // when not dropped, the item will revert back to its initial position
                    containment: "document",
                    helper: "clone",
                    cursor: "move"
                });

                // Let the trash be droppable, accepting the gallery items
                Stockistdestination.droppable({
                    accept: "#dvStockistDataBody .li",
                    classes: {
                    },
                    drop: function (event, ui) {
                        debugger;
                        BeatPlanQuickTagging.fnDeleteStockistCard(ui.draggable);

                    },
                });
            });
            if (stockistSourceFilter) {
                BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctors(beatCode_g);
            }

            // BeatPlanQuickTagging.fnEventBinderselectAll("stockistchkAll", "SOURCE", "STOCKIST", "stockistsourcemultiselect");
        } else {
            $.unblockUI();
        }

    },
    fnGetAllStockistsFailureCallback: function (error) {

    },
    fnDeleteStockistCard: function (item) {
        var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
        if ($("#dvStockistDestinationBody .li").length == 0) {
            $('#dvStockistDestinationBody').empty();
        }
        var Values = "";
        var ValuesArr = [];
        var disjson = "";
        item.fadeOut(function () {
            debugger;
            item.appendTo(Stockistdestination).fadeIn(function () {
                item
                  .find("img")
                    .animate({ height: "36px" });
                BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
                var count = 0;
                $("#dvStockistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'stockistDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistDestcheckboxAutosizing_' + count);
                    $('input[name="stockistDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                var count = 0;
                $("#dvStockistDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                $("#stockistchkAll").text('Select All');
                //$('#dvStockistDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                //$('#dvStockistDestinationBody #' + item.attr('id')).addClass('Map');
                var details = $('#' + item.children()[1].id).val();
                var fltrdstockistCode = details.split('|')[1];
                var fltrdregionCode = details.split('|')[0];
                var fltrdcustomerEntityType = details.split('|')[2];
                var disjsonStockistMapped = $.grep(mappedStockistDetails, function (ele, index) {
                    return ele.Customer_Code == fltrdstockistCode && ele.Customer_Entity_Type == fltrdcustomerEntityType && ele.Region_Code == fltrdregionCode;
                });

                // $('#dvStockistDestinationBody #' + item.children().children().children().children().children().find('i').attr('id')).show();
                var crossIconId = item.children().children().children().children().children().find('i')
                $('#dvStockistDestinationBody #' + crossIconId[1].id).show();
                //if (BeatPlanQuickTagging.defaults.lstSourceStockists.length > 0) {
                //}

                Values = item.children()[1].value;
                ValuesArr = Values.split('|');

                disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceStockists, function (ele, index) {
                    return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                });
                if ($('#dvStockistDestinationBody #' + item.attr('id')).hasClass('UnMap')) {
                    $('#dvStockistDestinationBody #' + item.attr('id')).addClass('Mapped');
                    $('#dvStockistDestinationBody #' + item.attr('id')).removeClass('UnMap');
                    disjson[0].Mapping_Status = "Mapped";
                } else if ($('#dvStockistDestinationBody #' + item.attr('id')).hasClass('NotMapped')) {
                    $('#dvStockistDestinationBody #' + item.attr('id')).addClass('Map');
                    $('#dvStockistDestinationBody #' + item.attr('id')).removeClass('NotMapped');
                    disjson[0].Mapping_Status = "Map";
                }
                disjson[0].Is_Selected = 0;
                BeatPlanQuickTagging.defaults.lstDestinationStockists.push(disjson[0]);
                var filtered = BeatPlanQuickTagging.defaults.lstSourceStockists.filter(function (item) {
                    return item.Customer_Code !== ValuesArr[1];
                });
                BeatPlanQuickTagging.defaults.lstSourceStockists = filtered;
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceStockSearch", "txtStockistName", BeatPlanQuickTagging.defaults.lstSourceStockists, "Stockist");
                BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestStocSearch", "textDestStockistName", BeatPlanQuickTagging.defaults.lstDestinationStockists, "Stockist");
                stockistSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceStockists);
                $('#dvStockistsSearchGrid').show();
                $('#dvStockistsSearchGrid').addClass('d-flex');
            });
        });


    },



    //Destination Doctors
    fnGetAllTaggedApprovedDoctors: function (beatcode) {
        debugger;
        doctorDestinationFilter = true;
        var regionCode = $('#hdnRegionCode').val();
        var beatCode = "";
        var mappedonot = "";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "Yes"
        } else {
            beatCode = '-1'
            mappedonot = "No";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "DOCTOR",
            Data_Load_Type: "BEAT",
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback, BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsFailureCallback, null);
    },
    fnGetAllTaggedApprovedDoctorsSuccessCallback: function (response) {
        debugger;
        var content = "";
        var customerEntityType = "DOCTOR";
        var dvId = "dvDoctorDestinationBody";
        var requestType = "DESTINATION";
        var checkBoxName = "doctorDestmultiselect"
        if (doctorDestinationFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstDestinationDoctors = response;
        }
        $("#DoctorDestchkAll").text('Select All');
        if (response != null && response.length > 0) {
            mappedDoctorDetails = response;
            for (var i = 0; i < response.length; i++) {
                var customerStatus = response[i].Customer_Status;
                var classMappedorNot = "";
                if (customerStatus != "" && customerStatus != null && customerStatus != undefined) {
                    if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAPPED") {
                        classMappedorNot = "Mapped"
                    }
                    else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "NOTMAPPED") {
                        classMappedorNot = "NotMapped"
                    }
                    else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAP") {
                        classMappedorNot = "Map"
                    }
                    else {
                        classMappedorNot = "UnMap";
                    }
                }

                var taggByPrivilClass = "multiple";
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                        if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                            if (parseInt(response[i].Tagged_Count) < 1) {
                                taggByPrivilClass = "once"
                            } else {
                                taggByPrivilClass = "maxed";
                            }
                        } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                            if (parseInt(response[i].Tagged_Count) < parseInt(response[i].Visit_Count)) {
                                taggByPrivilClass = "multiple"
                            } else {
                                taggByPrivilClass = "maxed";
                            }
                        }
                    }
                }

                var docDetail = "-1";
                content += '<div class="col-sm-12 li draggableDoctorClass ' + classMappedorNot + ' ' + response[i].Customer_Status_Text + ' ' + taggByPrivilClass + '" id="dvMainDoctorCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="DoctorCard_' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">'
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="doctorDestmultiselect" checked="checked" class="custom-control-input align-top"  id="doctorDestcheckboxAutosizing_' + i + '">'

                    } else {
                        content += '<input type="checkbox" name="doctorDestmultiselect" class="custom-control-input align-top"  id="doctorDestcheckboxAutosizing_' + i + '">'
                    }
                    content += '<label class="custom-control-label" for="doctorDestcheckboxAutosizing_' + i + '" onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + docDetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Doctor Name to View Details." id="testDocTagged_' + i + '"></i>';
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-times p-2" aria-hidden="true" id="ifontdoctorremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveDoctorFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                if (response[i].Tagged_SFCs_Count > 0) {
                    content += '<span class="dot colorcls" tooltip="Doctor Tagged to SFC"></span>';
                }
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Speciality :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Speciality_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Category :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Category_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">MDL Number :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].MDL_Number + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdndoctorDetails_' + i + '"/>';
                content += '</div>';
            }


            if (doctorDestinationFilter) {
                $('#textDoctorName').val('');
                $('#dvDestDocSearch').html('');
                $('#dvDestDocSearch').html('<input type="text" class="form-control form-control-sm" id="textDestDoctorName" placeholder="Enter Doctor Name..">');
                var lstTagDocName = [];
                for (var i = 0; i < response.length; i++) {
                    _objData = {};
                    _objData.label = response[i].First_Name;

                    lstTagDocName.push(_objData);
                }
                if (lstTagDocName.length > 0) {
                    //regionDetails = lstTagDocName;
                    var valueArr = [];
                    //valueArr.push(lstDocName[0].label);
                    var atcObj = new ej.dropdowns.AutoComplete({
                        //set the data to dataSource property
                        dataSource: lstTagDocName,
                        fields: { text: 'label' },
                        placeholder: 'Search by Doctor Name',
                        //value: valueArr

                    });
                    atcObj.appendTo('#textDestDoctorName');
                }
            }
            //BeatPlanQuickTagging.fnEventBinderselectAll("DoctorDestchkAll", "DESTINATION", "DOCTOR", "doctorDestmultiselect");


            $('#dvDoctorsSearchGrid').show();
            $('#dvDoctorsSearchGrid').addClass('d-flex');
        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
            if (BeatPlanQuickTagging.defaults.lstDestinationDoctors.length == 0) {
                $('#dvDoctorsSearchGrid').hide();
                $('#dvDoctorsSearchGrid').removeClass('d-flex');
            }
        }
        $('#dvDoctorDestinationBody').html(content);
        BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
        if (doctorDestinationFilter) {
            BeatPlanQuickTagging.fnGetAllTaggedChemists(beatCode_g);
        }
    },
    fnGetAllTaggedApprovedDoctorsFailureCallback: function (error) {

    },
    fnRemoveDoctorFromTagging: function (Id, customerStatus, customerCode, regionCode, MappingStatus) {
        debugger;

        if (customerStatus == 0) {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            $('#dvDoctorDestinationBody #' + item.id).hide();
        }
        else {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            BeatPlanQuickTagging.fnAddBackDoctorCard(item);
        }
    },
    fnAddBackDoctorCard: function (item) {
        var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
        if ($("#divDoctorsDataBody .li").length == 0) {
            $('#divDoctorsDataBody').empty();
        }
        Doctorsource.append(item);
        //if (BeatPlanQuickTagging.defaults.lstDestinationDoctors.length > 0) {
        //}
        //item.appendTo(Doctorsource);
        $('#dvDoctorDestinationBody #' + item.id).remove();
        var count = 0;
        $("#dvDoctorDestinationBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainDoctorCard_' + count);
            $(this).children().children().attr('id', 'DoctorCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdndoctorDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorDestcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorDestcheckboxAutosizing_' + count);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontdoctorremove_' + count;
            count = count + 1;
        });
        var count = 0;
        $("#divDoctorsDataBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainDoctorCard_' + count);
            $(this).children().children().attr('id', 'DoctorCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdndoctorDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('input').attr('name', 'doctorsourcemuliselect');
            $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorcheckboxAutosizing_' + count);
            $('input[name="doctorsourcemuliselect"]').prop('checked', false);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontdoctorremove_' + count;
            count = count + 1;
        });
        var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
        $(function () {
            // Let the gallery items be draggable
            $(".draggableDoctorClass", Doctorsource).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
            });
            var acceptfromClass = "";
            if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                    acceptfromClass = "#divDoctorsDataBody .li.once";
                } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                    acceptfromClass = "#divDoctorsDataBody .li.multiple";
                }
            }
            // Let the trash be droppable, accepting the gallery items
            Doctordestination.droppable({
                accept: acceptfromClass,
                classes: {
                },
                drop: function (event, ui) {
                    debugger;
                    BeatPlanQuickTagging.fnDeleteDoctorCard(ui.draggable);

                },
            });
        });
        $("#DoctorDestchkAll").text('Select All');
        if ($('#divDoctorsDataBody #' + item.id).hasClass('Map')) {
            $('#divDoctorsDataBody #' + item.id).removeClass('Map');
            $('#divDoctorsDataBody #' + item.id).addClass('NotMapped');
        } else if ($('#divDoctorsDataBody #' + item.id).hasClass('Mapped')) {
            $('#divDoctorsDataBody #' + item.id).removeClass('Mapped');
            $('#divDoctorsDataBody #' + item.id).addClass('UnMap');
        }
        $('#divDoctorsDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        //var crossIconId = item.children().children().children().children().children().find('i')
        //$('#divDoctorsDataBody #' + crossIconId[1].id).hide();
        BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
        var Values = "";
        var ValuesArr = [];
        var disjson = "";

        Values = item.childNodes[1].value;
        ValuesArr = Values.split('|');

        disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationDoctors, function (ele, index) {
            return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
        });
        if ($('#divDoctorsDataBody  #' + item.id).hasClass('Mapped')) {
            disjson[0].Mapping_Status = "UnMap";
        } else if ($('#divDoctorsDataBody  #' + item.id).hasClass('Map')) {
            disjson[0].Mapping_Status = "NotMapped";
        }
        disjson[0].Is_Selected = 0;
        if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
            if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                disjson[0].Tagged_Count = 0;
                $('#divDoctorsDataBody #' + item.id).addClass('once');
                $('#divDoctorsDataBody #' + item.id).removeClass('maxed');
            } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                disjson[0].Tagged_Count = parseInt(disjson[0].Tagged_Count) - 1;
                $('#divDoctorsDataBody #' + item.id).removeClass('maxed');
                $('#divDoctorsDataBody #' + item.id).addClass('multiple');
            }
        }
        BeatPlanQuickTagging.defaults.lstSourceDoctors.push(disjson[0]);
        var filtered = BeatPlanQuickTagging.defaults.lstDestinationDoctors.filter(function (item) {
            return item.Customer_Code !== ValuesArr[1];
        });
        BeatPlanQuickTagging.defaults.lstDestinationDoctors = filtered;
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceDocSearch", "txtDoctorName", BeatPlanQuickTagging.defaults.lstSourceDoctors, "Doctor");
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestDocSearch", "textDestDoctorName", BeatPlanQuickTagging.defaults.lstDestinationDoctors, "Doctor");
        doctorDestinationFilter = false;
        BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationDoctors);
        if (BeatPlanQuickTagging.defaults.lstDestinationDoctors.length > 0) {
            $('#dvDoctorsSearchGrid').show();
            $('#dvDoctorsSearchGrid').addClass('d-flex');
        } else {
            $('#dvDoctorsSearchGrid').hide();
            $('#dvDoctorsSearchGrid').removeClass('d-flex');
        }
    },


    //Destination Chemists
    fnGetAllTaggedChemists: function (beatcode) {
        debugger
        chemistDestinationFilter = true;
        var regionCode = $('#hdnRegionCode').val();
        var beatCode = "";
        var mappedonot = "";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "Yes"
        } else {
            beatCode = '-1'
            mappedonot = "No";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "CHEMIST",
            Data_Load_Type: "BEAT",
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback, BeatPlanQuickTagging.fnGetAllTaggedChemistsFailureCallback, null);
    },
    fnGetAllTaggedChemistsSuccessCallback: function (response) {
        debugger;
        var content = "";
        var customerEntityType = "CHEMIST";
        var dvId = "dvChemistDestinationBody";
        var requestType = "DESTINATION";
        var checkBoxName = "chemistDestmultiselect"
        if (chemistDestinationFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstDestinationChemists = response;
        }
        $("#ChemistDestchkAll").text('Select All');
        if (response != null && response != "" && response.length > 0) {
            mappedChemistDetails = response;
            var ChemDetail = "-1";
            for (var i = 0; i < response.length; i++) {
                var customerStatus = response[i].Customer_Status;
                var classMappedorNot = "";
                if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAPPED") {
                    classMappedorNot = "Mapped"
                }
                else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "NOTMAPPED") {
                    classMappedorNot = "NotMapped"
                }
                else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAP") {
                    classMappedorNot = "Map"
                }
                else {
                    classMappedorNot = "UnMap";
                }
                content += '<div class="col-sm-12 li draggableChemistClass ' + classMappedorNot + ' ' + response[i].Customer_Status_Text + '" id="dvMainChemistCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="ChemistCard_' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">';
                    //stockistDestcheckboxAutosizing_
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="chemistDestmultiselect" checked="checked" class="custom-control-input align-top"  id="chemistDestcheckboxAutosizing_' + i + '">'

                    } else {
                        content += '<input type="checkbox" name="chemistDestmultiselect" class="custom-control-input align-top"  id="chemistDestcheckboxAutosizing_' + i + '">'

                    }
                    content += '<label class="custom-control-label" for="chemistDestcheckboxAutosizing_' + i + '" onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + ChemDetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Chemist Name to View Details." id="testChemTagged_' + i + '"></i>';
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-times p-2" aria-hidden="true" id="ifontchemistremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveChemistFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug License No. :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Drug_License_Number + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Local Area :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Local_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Ref_Key1 + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdnchemistDetails_' + i + '"/>';
                content += '</div>';
            }

            if (chemistDestinationFilter) {
                $('#textDestChemistName').val('');
                $('#dvDestChemSearch').html('');
                $('#dvDestChemSearch').html('<input type="text" class="form-control form-control-sm" id="textDestChemistName" placeholder="Enter chemist Name..">');

                var lstTagchemName = [];
                for (var i = 0; i < response.length; i++) {
                    _objData = {};
                    _objData.label = response[i].First_Name;

                    lstTagchemName.push(_objData);
                }
                if (lstTagchemName.length > 0) {
                    //regionDetails = lstTagchemName;
                    var valueArr = [];
                    //valueArr.push(lstDocName[0].label);
                    var atcObj = new ej.dropdowns.AutoComplete({
                        //set the data to dataSource property
                        dataSource: lstTagchemName,
                        fields: { text: 'label' },
                        placeholder: 'Search by Chemist Name',
                        //value: valueArr

                    });
                    atcObj.appendTo('#textDestChemistName');
                }
            }
            //BeatPlanQuickTagging.fnEventBinderselectAll("ChemistDestchkAll", "DESTINATION", "CHEMIST", "chemistDestmultiselect");

            $('#dvChemistsSearchGrid').show();
            $('#dvChemistsSearchGrid').addClass('d-flex');
        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
            if (BeatPlanQuickTagging.defaults.lstDestinationChemists.length == 0) {
                $('#dvChemistsSearchGrid').hide();
                $('#dvChemistsSearchGrid').removeClass('d-flex');
            }
        }
        $('#dvChemistDestinationBody').html(content);
        BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');

        if (chemistDestinationFilter) {
            BeatPlanQuickTagging.fnGetAllTaggedStockists(beatCode_g);
        }

    },
    fnGetAllTaggedChemistsFailureCallback: function (error) {

    },
    fnRemoveChemistFromTagging: function (Id, customerStatus, customerCode, regionCode, MappingStatus) {
        debugger;
        if (customerStatus == 0) {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            $('#dvChemistDestinationBody #' + item.id).hide();
        }
        else {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            BeatPlanQuickTagging.fnAddBackChemistCard(item);
        }
    },
    fnAddBackChemistCard: function (item) {
        var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
        if ($("#dvChemistsDataBody .li").length == 0) {
            $('#dvChemistsDataBody').empty();
        }
        Chemistsource.append(item);
        //if (BeatPlanQuickTagging.defaults.lstDestinationChemists.length > 0) {
        //}
        //item.appendTo(Doctorsource);
        $('#dvChemistDestinationBody #' + item.id).remove();

        var count = 0;
        $("#dvChemistDestinationBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainChemistCard_' + count);
            $(this).children().children().attr('id', 'ChemistCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdnchemistDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistDestcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistDestcheckboxAutosizing_' + count);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontchemistremove_' + count;
            count = count + 1;
        });
        var count = 0;
        $("#dvChemistsDataBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainChemistCard_' + count);
            $(this).children().children().attr('id', 'ChemistCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdnchemistDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('input').attr('name', 'chemistsourcemultiselect');
            $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistcheckboxAutosizing_' + count);
            $('input[name="chemistsourcemultiselect"]').prop('checked', false);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontchemistremove_' + count;
            count = count + 1;
        });
        $("#ChemistDestchkAll").text('Select All');
        if ($('#dvChemistsDataBody #' + item.id).hasClass('Map')) {
            $('#dvChemistsDataBody #' + item.id).removeClass('Map');
            $('#dvChemistsDataBody #' + item.id).addClass('NotMapped');
        }
        else if ($('#dvChemistsDataBody #' + item.id).hasClass('Mapped')) {
            $('#dvChemistsDataBody #' + item.id).removeClass('Mapped');
            $('#dvChemistsDataBody #' + item.id).addClass('UnMap');
        }
        $(function () {
            // Let the gallery items be draggable
            $(".draggableChemistClass", Chemistsource).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
            });

            // Let the trash be droppable, accepting the gallery items
            Chemistdestination.droppable({
                accept: "#dvChemistsDataBody .li",
                classes: {
                },
                drop: function (event, ui) {
                    debugger;
                    BeatPlanQuickTagging.fnDeleteChemistCard(ui.draggable);

                },
            });
        });
        $('#dvChemistsDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');
        var Values = "";
        var ValuesArr = [];
        var disjson = "";

        Values = item.childNodes[1].value;
        ValuesArr = Values.split('|');

        disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationChemists, function (ele, index) {
            return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
        });
        if ($('#dvChemistsDataBody  #' + item.id).hasClass('Mapped')) {
            disjson[0].Mapping_Status = "UnMap";
        } else if ($('#dvChemistsDataBody  #' + item.id).hasClass('Map')) {
            disjson[0].Mapping_Status = "NotMapped";
        }
        disjson[0].Is_Selected = 0;
        BeatPlanQuickTagging.defaults.lstSourceChemists.push(disjson[0]);
        var filtered = BeatPlanQuickTagging.defaults.lstDestinationChemists.filter(function (item) {
            return item.Customer_Code !== ValuesArr[1];
        });
        BeatPlanQuickTagging.defaults.lstDestinationChemists = filtered;
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceChemSearch", "txtChemistName", BeatPlanQuickTagging.defaults.lstSourceChemists, "Chemist");
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestChemSearch", "textDestChemistName", BeatPlanQuickTagging.defaults.lstDestinationChemists, "Chemist");
        chemistDestinationFilter = false;
        BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationChemists);

        if (BeatPlanQuickTagging.defaults.lstDestinationChemists.length > 0) {
            $('#dvChemistsSearchGrid').show();
            $('#dvChemistsSearchGrid').addClass('d-flex');
        } else {
            $('#dvChemistsSearchGrid').hide();
            $('#dvChemistsSearchGrid').removeClass('d-flex');
        }
    },

    //Destination Stockists
    fnGetAllTaggedStockists: function (beatcode) {
        debugger
        stockistDestinationFilter = true;
        var regionCode = $('#hdnRegionCode').val();
        var beatCode = "";
        var mappedonot = "";
        if (beatcode != "" && beatcode != null && beatcode != undefined) {
            beatCode = beatcode;
            mappedonot = "Yes"
        } else {
            beatCode = '-1'
            mappedonot = "No";
        }
        var _ObjData = {
            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
            Region_Code: regionCode,
            Beat_Code: beatCode,
            Customer_Entity_Type: "STOCKIEST",
            Data_Load_Type: "BEAT",
            Data_Mapped_Or_Not: mappedonot,
            OnceOrMultiple: privValueBeatToDoctorTag
        };
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "_ObjParamData";
        _obj.value = JSON.stringify(_ObjData);
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetAllMasterandMappedDataByRegion', arrDetails, "POST", BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback, BeatPlanQuickTagging.fnGetAllTaggedStockistsFailureCallback, null);
    },
    fnGetAllTaggedStockistsSuccessCallback: function (response) {
        debugger;
        var content = "";
        var customerEntityType = "STOCKIST";
        var dvId = "dvStockistDestinationBody";
        var requestType = "DESTINATION";
        var checkBoxName = "stockistDestmultiselect"
        if (stockistDestinationFilter) {
            response = JSON.parse(response);
            BeatPlanQuickTagging.defaults.lstDestinationStockists = response;
        }
        $("#StocksitDestchkAll").text('Select All');
        if (response != null && response.length > 0) {
            mappedStockistDetails = response;
            var StockistDetail = "-1";
            for (var i = 0; i < response.length; i++) {
                var customerStatus = response[i].Customer_Status;
                var classMappedorNot = "";
                if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAPPED") {
                    classMappedorNot = "Mapped"
                }
                else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "NOTMAPPED") {
                    classMappedorNot = "NotMapped"
                }
                else if (customerStatus == 1 && response[i].Mapping_Status.toUpperCase() == "MAP") {
                    classMappedorNot = "Map"
                }
                else {
                    classMappedorNot = "UnMap";
                }

                content += '<div class="col-sm-12 li draggableStockistClass ' + classMappedorNot + ' ' + response[i].Customer_Status_Text + '" id="dvMainStockistCard_' + i + '">';
                content += '<div class="">';
                content += '<div class="mb-2" id="StockistCard' + i + '" value="">';
                content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                content += '<div class="p-2 col-sm-12 border-bottom border-dark justify-content-between d-flex commonheadercolor">';
                content += '<div class="bg-higlight row no-gutters" style="float:left;">';
                if (beatCode_g != "-1" && beatCode_g != "" && beatCode_g != null && beatCode_g != undefined) {
                    content += '<div class="custom-control custom-checkbox align-top">';
                    if (response[i].Is_Selected == 1) {
                        content += '<input type="checkbox" name="stockistDestmultiselect" checked="checked" class="custom-control-input align-top"  id="stockistDestcheckboxAutosizing_' + i + '">'

                    } else {
                        content += '<input type="checkbox" name="stockistDestmultiselect" class="custom-control-input align-top"  id="stockistDestcheckboxAutosizing_' + i + '">'
                    }
                    content += '<label class="custom-control-label" for="stockistDestcheckboxAutosizing_' + i + '" onclick="BeatPlanQuickTagging.fnFillIsSelectedValue(this,\'' + dvId + '\',\'' + checkBoxName + '\',\'' + requestType + '\',\'' + customerEntityType + '\');"></label></div>'
                }
                content += '<label for="staticEmail" class="col-form-label p-0 datalabel1 btn-link show_Data" onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response[i].Region_Code + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Customer_Entity_Type + '\',\'' + StockistDetail + '\');">' + response[i].First_Name + ' ' + response[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Stockist Name to View Details." id="testStockistTagged_' + i + '"></i>';
                //content += '<p class="mb-0" style="font-size:12px;">Effective From Date : ' + response[i].Effective_From + '</p>';
                content += '</div>';
                content += '<div class="bg-higlight" style="float:right;">';
                content += '<i class="fa fa-times p-2" aria-hidden="true" id="ifontstockistremove_' + i + '" onclick="BeatPlanQuickTagging.fnRemoveStockistFromTagging(this,\'' + response[i].Customer_Status + '\',\'' + response[i].Customer_Code + '\',\'' + response[i].Region_Code + '\',\'' + response[i].Mapping_Status + '\');"></i>';
                content += '</div>';
                content += '</div>';
                content += '<div class="d-flex flex-wrap col-sm-12 col-md-12">';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug License No. :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Drug_License_Number + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Local Area :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Local_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Ref_Key1 + '</label>';
                content += '</div>';
                content += '</div>';
                content += '<div class="p-1 flex-fill">';
                content += '<div class="form-group mb-1  row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Mobile :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Mobile + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Email :</label>';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response[i].Email + '</label>';
                content += '</div>';
                content += '<div class="form-group mb-1 row no-gutters">';
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                var badgedetails = BeatPlanQuickTagging.fnGetBadgeName(response[i].Customer_Status);
                content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgedetails + '" style="font-size:12px;">' + response[i].Customer_Status_Text + '</span></label>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '<input type="hidden" value="' + response[i].Region_Code + '|' + response[i].Customer_Code + '|' + response[i].Customer_Entity_Type + '" id="hdnstockistDetails_' + i + '"/>';
                content += '</div>';
            }


            if (stockistDestinationFilter) {
                $('#textDestStockistName').val('');
                $('#dvDestStocSearch').html('');
                $('#dvDestStocSearch').html('<input type="text" class="form-control form-control-sm" id="textDestStockistName" placeholder="Enter chemist Name..">');

                var lstTagstockName = [];
                for (var i = 0; i < response.length; i++) {
                    _objData = {};
                    _objData.label = response[i].First_Name;

                    lstTagstockName.push(_objData);
                }
                if (lstTagstockName.length > 0) {
                    //regionDetails = lstTagstockName;
                    var valueArr = [];
                    //valueArr.push(lstDocName[0].label);
                    var atcObj = new ej.dropdowns.AutoComplete({
                        //set the data to dataSource property
                        dataSource: lstTagstockName,
                        fields: { text: 'label' },
                        placeholder: 'Search by Stockist Name',
                        //value: valueArr

                    });
                    atcObj.appendTo('#textDestStockistName');
                }
            }
            //$('#dvStockistDestinationBody').html(content);
            //BeatPlanQuickTagging.fnEventBinderselectAll("StocksitDestchkAll", "DESTINATION", "STOCKIST", "stockistDestmultiselect");

            $.unblockUI();
            $('#dvStockistsSearchGrid').show();
            $('#dvStockistsSearchGrid').addClass('d-flex');
        }
        else {
            content = '<div class="alert alert-success text-center" role="alert">No Records Found.</div>';
            if (BeatPlanQuickTagging.defaults.lstDestinationStockists.length == 0) {
                $('#dvStockistsSearchGrid').hide();
                $('#dvStockistsSearchGrid').removeClass('d-flex');
            }
        }
        $('#dvStockistDestinationBody').html(content);
        BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
        $.unblockUI();
    },
    fnGetAllTaggedStockistsFailureCallback: function (error) {

    },
    fnRemoveStockistFromTagging: function (Id, customerStatus, customerCode, regionCode, MappingStatus) {
        debugger;
        if (customerStatus == 0) {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            $('#dvStockistDestinationBody #' + item.id).hide();
        }
        else {
            var item = $(Id).parent().parent().parent().parent().parent().parent()[0];
            BeatPlanQuickTagging.fnAddBackStockistCard(item);
        }
    },
    fnAddBackStockistCard: function (item) {
        var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
        if ($("#dvStockistDataBody .li").length == 0) {
            $('#dvStockistDataBody').empty();
        }
        Stockistsource.append(item);
        //if (BeatPlanQuickTagging.defaults.lstDestinationStockists.length > 0) {
        //}
        //item.appendTo(Doctorsource);
        $('#dvStockistDestinationBody #' + item.id).remove();
        var count = 0;
        $("#dvStockistDestinationBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainStockistCard_' + count);
            $(this).children().children().attr('id', 'StockistCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdnstockistDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistDestcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistDestcheckboxAutosizing_' + count);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontstockistremove_' + count;
            count = count + 1;
        });
        var count = 0;
        $("#dvStockistDataBody .li").map(function () {
            var currentid = $(this).attr('id');
            $(this).attr('id', 'dvMainStockistCard_' + count);
            $(this).children().children().attr('id', 'StockistCard_' + count);
            var changeid = $(this).children()[1];
            changeid.id = 'hdnstockistDetails_' + count;
            //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
            //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
            //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
            //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
            //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
            $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistcheckboxAutosizing_' + count);
            $(this).children().children().children().children().children().children().find('input').attr('name', 'stockistsourcemultiselect');
            $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistcheckboxAutosizing_' + count);
            $('input[name="stockistsourcemultiselect"]').prop('checked', false);
            var crossIconId = $(this).children().children().children().children().children().find('i');
            crossIconId[1].id = 'ifontstockistremove_' + count;
            count = count + 1;
        });
        $("#StocksitDestchkAll").text('Select All');
        if ($('#dvStockistDataBody #' + item.id).hasClass('Map')) {
            $('#dvStockistDataBody #' + item.id).removeClass('Map');
            $('#dvStockistDataBody #' + item.id).addClass('NotMapped');
        } else if ($('#dvStockistDataBody #' + item.id).hasClass('Mapped')) {
            $('#dvStockistDataBody #' + item.id).removeClass('Mapped');
            $('#dvStockistDataBody #' + item.id).addClass('UnMap');
        }
        var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
        $(function () {
            // Let the gallery items be draggable
            $(".draggableStockistClass", Stockistsource).draggable({
                cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                revert: "invalid", // when not dropped, the item will revert back to its initial position
                containment: "document",
                helper: "clone",
                cursor: "move"
            });

            // Let the trash be droppable, accepting the gallery items
            Stockistdestination.droppable({
                accept: "#dvStockistDataBody .li",
                classes: {
                },
                drop: function (event, ui) {
                    debugger;
                    BeatPlanQuickTagging.fnDeleteStockistCard(ui.draggable);

                },
            });
        });
        $('#dvStockistDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
        var Values = "";
        var ValuesArr = [];
        var disjson = "";

        Values = item.childNodes[1].value;
        ValuesArr = Values.split('|');

        disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationStockists, function (ele, index) {
            return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
        });
        if ($('#dvStockistDataBody  #' + item.id).hasClass('Mapped')) {
            disjson[0].Mapping_Status = "UnMap";
        } else if ($('#dvStockistDataBody  #' + item.id).hasClass('Map')) {
            disjson[0].Mapping_Status = "NotMapped";
        }
        disjson[0].Is_Selected = 0;
        BeatPlanQuickTagging.defaults.lstSourceStockists.push(disjson[0]);
        var filtered = BeatPlanQuickTagging.defaults.lstDestinationStockists.filter(function (item) {
            return item.Customer_Code !== ValuesArr[1];
        });
        BeatPlanQuickTagging.defaults.lstDestinationStockists = filtered;
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceStockSearch", "txtStockistName", BeatPlanQuickTagging.defaults.lstSourceStockists, "Stockist");
        BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestStocSearch", "textDestStockistName", BeatPlanQuickTagging.defaults.lstDestinationStockists, "Stockist");
        stockistDestinationFilter = false;
        BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationStockists);
        if (BeatPlanQuickTagging.defaults.lstDestinationStockists.length > 0) {
            $('#dvStockistsSearchGrid').show();
            $('#dvStockistsSearchGrid').addClass('d-flex');
        } else {
            $('#dvStockistsSearchGrid').hide();
            $('#dvStockistsSearchGrid').removeClass('d-flex');
        }
    },


    //Save Tagging
    fnValidateBeatToQuickTagging: function () {
        debugger;
        var isValid = true;
        if ($('#txtRegion').val() == "" || $('#txtRegion').val() == undefined || $('#txtRegion').val() == null) {
            swal('Info', 'Please select Region for Beat/Patch Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        if ($('#hdnRegionCode').val() == 0) {
            swal('Info', 'Please select Region for Beat/Patch Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        if ($('#dvBeatDestinationBody .li').length == 0) {
            swal('Info', 'Please Drag & Drop a Beat/Patch Plan Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        if ($('#dvBeatDestinationBody .li').length != 0 && $('#dvDoctorDestinationBody .li').length == 0) {
            swal('Info', 'Please Drag & Drop atleast one Doctor for Beat/Patch Plan Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        if ($('#dvBeatDestinationBody .li').length != 0 && $('#dvDoctorDestinationBody .li.Approved').length == 0 && $('#dvDoctorDestinationBody .li.UnApproved').length > 0) {
            swal('Info', 'Please Drag & Drop atleast one Approved Doctor for Beat/Patch Plan Tagging.', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    fnSaveBeatMapping: function () {
        debugger;
        var result = BeatPlanQuickTagging.fnValidateBeatToQuickTagging();
        if (result) {
            var agree = true;
            var message = "";
            if ($('#dvDoctorDestinationBody .li.UnApproved').length > 0 && $('#dvChemistDestinationBody .li.UnApproved').length == 0 && $('#dvStockistDestinationBody .li.UnApproved').length == 0) {
                message = "Doctor(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length == 0 && $('#dvChemistDestinationBody .li.UnApproved').length > 0 && $('#dvStockistDestinationBody .li.UnApproved').length == 0) {
                message = "Chemist(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length == 0 && $('#dvChemistDestinationBody .li.UnApproved').length == 0 && $('#dvStockistDestinationBody .li.UnApproved').length > 0) {
                message = "Stockist(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length > 0 && $('#dvChemistDestinationBody .li.UnApproved').length > 0 && $('#dvStockistDestinationBody .li.UnApproved').length == 0) {
                message = "Doctor(s) & Chemists(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length > 0 && $('#dvChemistDestinationBody .li.UnApproved').length == 0 && $('#dvStockistDestinationBody .li.UnApproved').length > 0) {
                message = "Doctor(s) & Stockist(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length == 0 && $('#dvChemistDestinationBody .li.UnApproved').length > 0 && $('#dvStockistDestinationBody .li.UnApproved').length > 0) {
                message = "Chemist(s) & Stockist(s)";
            }
            else if ($('#dvDoctorDestinationBody .li.UnApproved').length > 0 && $('#dvChemistDestinationBody .li.UnApproved').length > 0 && $('#dvStockistDestinationBody .li.UnApproved').length > 0) {
                message = "Doctor(s) & Chemist(s) & Stockist(s)";
            }
            if (message != "") {
                agree = false;
                swal({
                    title: "Info",
                    text: 'The UnApproved "' + message + '" will be Un-Tagged.',
                    buttons: ["Cancel", "Ok"],
                }).then((stayorleave) => {
                    if (stayorleave) {
                        agree = true;
                        BeatPlanQuickTagging.fnFinalSubmit(agree);
                    }
                    else {
                        agree = false;
                    }
                });
                if (!agree) {
                    return false;
                }
            } else {
                BeatPlanQuickTagging.fnFinalSubmit(agree);
            }
        }
    },
    fnFinalSubmit: function (agree) {
        if (agree) {
            $.blockUI();
            var lstTaggingDataDetails = [];

            var BeatDestBody = $('#dvBeatDestinationBody .li');
            var DoctorDestBody = $('#dvDoctorDestinationBody .li');
            var ChemistDestBody = $('#dvChemistDestinationBody .li');
            var StockistDestBody = $('#dvStockistDestinationBody .li');
            var DoctorSourBody = $('#divDoctorsDataBody .li');
            var ChemistSourBody = $('#dvChemistsDataBody .li');
            var StockistSourBody = $('#dvStockistDataBody .li');

            if (BeatDestBody.length > 0) {
                var selectedbeatId = $('#dvBeatDestinationBody .li')[0].id.split('_')[1];
                var beatCode = $('#dvBeatDestinationBody  #dvdragbeat_' + selectedbeatId + ' #beat_' + selectedbeatId).val()
                // beatCode = BeatDestBody.children()[1].value;
                if (DoctorDestBody.length > 0) {
                    for (var i = 0; i < DoctorDestBody.length; i++) {
                        var details = DoctorDestBody[i].children[1].value// DoctorDestBody.find('input')[i].value;//$('#dvDoctorDestinationBody input').val();
                        var regionCode = details.split('|')[0];
                        var customerCode = details.split('|')[1];
                        var customerEntityType = details.split('|')[2];
                        var mappingStatus = ""; mappingStatusInt = 0;
                        var DoctorName = DoctorDestBody[i].children[0].children[0].children[0].children[0].children[0].children[1].textContent;
                        // DoctorDestBody[i].children[0].children[0].children[0].children[0].children[0].children[0].textContent;
                        if ($('#dvDoctorDestinationBody #' + DoctorDestBody[i].id + '').hasClass('Mapped')) {
                            mappingStatus = "Mapped";
                            mappingStatusInt = 1;
                        }
                        else if ($('#dvDoctorDestinationBody #' + DoctorDestBody[i].id + '').hasClass('Map')) {
                            mappingStatus = "Map";
                            mappingStatusInt = 2;
                        } else if ($('#dvDoctorDestinationBody #' + DoctorDestBody[i].id + '').hasClass('UnMap')) {
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                        }
                        var _objData = {
                            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                            Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                            Region_Code: regionCode,
                            Beat_Code: beatCode,
                            Customer_Entity_Type: customerEntityType,
                            Customer_Code: customerCode,
                            Created_By: BeatPlanQuickTagging.defaults.UserCode,
                            Mapping_Status: mappingStatus,
                            MappedStatus: mappingStatusInt,
                            Doctor_Name: DoctorName
                        }
                        lstTaggingDataDetails.push(_objData);
                    }
                }
                if (DoctorSourBody.length > 0) {
                    for (var i = 0; i < DoctorSourBody.length; i++) {
                        var mappingStatus = ""; mappingStatusInt = 0;
                        if ($('#divDoctorsDataBody #' + DoctorSourBody[i].id + '').hasClass('UnMap')) {
                            var details = DoctorSourBody[i].children[1].value// DoctorSourBody.find('input')[i].value;//$('#dvDoctorDestinationBody input').val();
                            var regionCode = details.split('|')[0];
                            var customerCode = details.split('|')[1];
                            var customerEntityType = details.split('|')[2];
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                            var DoctorName = DoctorSourBody[i].children[0].children[0].children[0].children[0].children[0].children[1].textContent;
                            //DoctorDestBody[i].children[0].children[0].children[0].children[0].children[0].children[1].textContentDoctorSourBody[i].children[0].children[0].children[0].children[0].children[0].children[0].textContent;//DoctorSourBody.children().children().children().children().find('.card-title').text();
                            var _objData = {
                                Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                                Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                                Region_Code: regionCode,
                                Beat_Code: beatCode,
                                Customer_Entity_Type: customerEntityType,
                                Customer_Code: customerCode,
                                Created_By: BeatPlanQuickTagging.defaults.UserCode,
                                Mapping_Status: mappingStatus,
                                MappedStatus: mappingStatusInt,
                                Doctor_Name: DoctorName
                            }
                            lstTaggingDataDetails.push(_objData);
                        }
                    }
                }
                if (ChemistDestBody.length > 0) {
                    for (var i = 0; i < ChemistDestBody.length; i++) {
                        var details = ChemistDestBody[i].children[1].value;//ChemistDestBody.find('input')[i].value;//$('#dvChemistDestinationBody input').val();
                        var regionCode = details.split('|')[0];
                        var customerCode = details.split('|')[1];
                        var customerEntityType = details.split('|')[2];
                        var mappingStatus = ""; mappingStatusInt = 0;
                        if ($('#dvChemistDestinationBody #' + ChemistDestBody[i].id + '').hasClass('Mapped')) {
                            mappingStatus = "Mapped";
                            mappingStatusInt = 1;
                        }
                        else if ($('#dvChemistDestinationBody #' + ChemistDestBody[i].id + '').hasClass('Map')) {
                            mappingStatus = "Map";
                            mappingStatusInt = 2;
                        }
                        else if ($('#dvChemistDestinationBody #' + ChemistDestBody[i].id + '').hasClass('UnMap')) {
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                        }
                        var _objData = {
                            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                            Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                            Region_Code: regionCode,
                            Beat_Code: beatCode,
                            Customer_Entity_Type: customerEntityType,
                            Customer_Code: customerCode,
                            Created_By: BeatPlanQuickTagging.defaults.UserCode,
                            Mapping_Status: mappingStatus,
                            MappedStatus: mappingStatusInt,
                            Chemist_Name: ""
                        }
                        lstTaggingDataDetails.push(_objData);
                    }
                }
                if (ChemistSourBody.length > 0) {
                    for (var i = 0; i < ChemistSourBody.length; i++) {
                        var mappingStatus = ""; mappingStatusInt = 0;
                        if ($('#dvChemistsDataBody #' + ChemistSourBody[i].id + '').hasClass('UnMap')) {
                            var details = ChemistSourBody[i].children[1].value;// ChemistSourBody.find('input')[i].value;//$('#dvChemistDestinationBody input').val();
                            var regionCode = details.split('|')[0];
                            var customerCode = details.split('|')[1];
                            var customerEntityType = details.split('|')[2];
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                            var _objData = {
                                Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                                Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                                Region_Code: regionCode,
                                Beat_Code: beatCode,
                                Customer_Entity_Type: customerEntityType,
                                Customer_Code: customerCode,
                                Created_By: BeatPlanQuickTagging.defaults.UserCode,
                                Mapping_Status: mappingStatus,
                                MappedStatus: mappingStatusInt,
                                Chemist_Name: ""
                            }
                            lstTaggingDataDetails.push(_objData);
                        }
                    }
                }
                if (StockistDestBody.length > 0) {
                    for (var i = 0; i < StockistDestBody.length; i++) {
                        var details = StockistDestBody[i].children[1].value;//StockistDestBody.find('input')[i].value;//$('#dvStockistDestinationBody input').val();
                        var regionCode = details.split('|')[0];
                        var customerCode = details.split('|')[1];
                        var customerEntityType = details.split('|')[2];
                        var mappingStatus = ""; mappingStatusInt = 0;
                        if ($('#dvStockistDestinationBody #' + StockistDestBody[i].id + '').hasClass('Mapped')) {
                            mappingStatus = "Mapped";
                            mappingStatusInt = 1;
                        }
                        else if ($('#dvStockistDestinationBody #' + StockistDestBody[i].id + '').hasClass('Map')) {
                            mappingStatus = "Map";
                            mappingStatusInt = 2;
                        }
                        else if ($('#dvStockistDestinationBody #' + StockistDestBody[i].id + '').hasClass('UnMap')) {
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                        }
                        var _objData = {
                            Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                            Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                            Region_Code: regionCode,
                            Beat_Code: beatCode,
                            Customer_Entity_Type: customerEntityType,
                            Customer_Code: customerCode,
                            Created_By: BeatPlanQuickTagging.defaults.UserCode,
                            Mapping_Status: mappingStatus,
                            MappedStatus: mappingStatusInt,
                            Stockist_Name: ""
                        }
                        lstTaggingDataDetails.push(_objData);
                    }
                }
                if (StockistSourBody.length > 0) {
                    for (var i = 0; i < StockistSourBody.length; i++) {
                        var mappingStatus = ""; mappingStatusInt = 0;
                        if ($('#dvStockistDataBody #' + StockistSourBody[i].id + '').hasClass('UnMap')) {
                            var details = StockistSourBody[i].children[1].value;//StockistSourBody.find('input')[i].value;//$('#dvStockistDestinationBody input').val();
                            var regionCode = details.split('|')[0];
                            var customerCode = details.split('|')[1];
                            var customerEntityType = details.split('|')[2];
                            mappingStatus = "UnMap";
                            mappingStatusInt = 0;
                            var _objData = {
                                Company_Code: BeatPlanQuickTagging.defaults.CompanyCode,
                                Company_Id: BeatPlanQuickTagging.defaults.CompanyId,
                                Region_Code: regionCode,
                                Beat_Code: beatCode,
                                Customer_Entity_Type: customerEntityType,
                                Customer_Code: customerCode,
                                Created_By: BeatPlanQuickTagging.defaults.UserCode,
                                Mapping_Status: mappingStatus,
                                MappedStatus: mappingStatusInt,
                                Stockist_Name: ""
                            }
                            lstTaggingDataDetails.push(_objData);
                        }
                    }
                }
                if (lstTaggingDataDetails.length > 0) {
                    var arrDetails = new Array();
                    var _obj = {};
                    _obj.name = "companyCode";
                    _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
                    arrDetails.push(_obj);

                    _obj = {};
                    _obj.name = "_lstTaggingDataDetails";
                    _obj.value = JSON.stringify(lstTaggingDataDetails);
                    arrDetails.push(_obj);
                    HDAjax.requestInvoke('BeatPlan', 'InsertBeatToMasterDataTagging', arrDetails, "POST", BeatPlanQuickTagging.fnSaveBeatMappingSuccessCallback, BeatPlanQuickTagging.fnSaveBeatMappingFailureCallback, null);
                }
            }
        }
    },
    fnSaveBeatMappingSuccessCallback: function (response) {
        debugger;
        if (response.Status_Message) {
            swal('Success', 'Successufully Tagged Doctor(s)/Chemist(s)/Stockist(s) to the Selected Beat/Patch Plan.', 'success');
            BeatPlanQuickTagging.fnGetAllBeatRelatedActivity();
            $.unblockUI();
        } else {
            swal('Error', '' + response.Message.split(':')[1] + '', 'error');
        }
    },
    fnSaveBeatMappingFailureCallback: function (error) {

    },


    //View Pop for Beat
    fnViewBeatDetails: function (beatCode, regionCode) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatCode";
        _obj.value = beatCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatType";
        _obj.value = "BEAT"
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetBeatWiseDetails', arrDetails, "POST", BeatPlanQuickTagging.fnViewBeatDetailsSuccessCallback, BeatPlanQuickTagging.fnViewBeatDetailsFailureCallback, null);
    },
    fnViewBeatDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null) {
            if (response.lstHeader.length > 0) {
                content += '<div class="" id="data">';
                content += '<div class="card mb-3">';
                content += '<div class="card-header bg-info text-white">Beat / Patch Info</div>';
                content += '<div class="card-body">';
                content += ' <div class="row">';
                content += '<div class="col-sm-12 row">';
                content += '<div class="col-sm-6">';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Name :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Beat_Name + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category Name :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Work_Category_Name + '</label></div>';
                content += '<div class="form-group row no-gutters">';
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Area :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Work_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Status :</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname">' + response.lstHeader[0].Beat_Status + ' </label></div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';
                content += '</div>';

                if (response.lstSFC.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">SFC Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="card-columns1">';
                    for (var i = 0; i < response.lstSFC.length; i++) {
                        content += '<div class="card mt-3">';
                        content += '<div class="card-body p-0">';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">From Place : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].From_Place + ' </label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">To Place : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].To_Place + ' </label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Travel Mode :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Travel_Mode + ' </label>';
                        content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Category : </label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Work_Category_Name + ' </label>';
                        //content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Distance :</label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Distance + '(Km.)</label>';
                        //content += '</div>';
                        //content += '<div class="form-group row no-gutters">';
                        //content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fare Amount :(expected) </label>';
                        //content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstSFC[i].Fare_Amount + '(Rs.) </label>';
                        //content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                        content += '</div>';

                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';



                }
                //Doctors
                if (response.lstDoctors.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Doctor(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstDoctors.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response.lstDoctors[i].Region_Code + '\',\'' + response.lstDoctors[i].Customer_Code + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstDoctors[i].First_Name + '  ' + response.lstDoctors[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Doctor Name to View Details." id="testDocPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        //content += '<div class="p-2 flex-fill bd-highlight flex border-right">';
                        //content += '<div class="form-group row no-gutters m-0">';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Last Name :</label>';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Last_Name + '</label>';
                        //content += '</div></div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Speciality :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Speciality_Name + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Category :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Category_Name + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstDoctors[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstDoctors[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1" id="dvhideDoctbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true"  id="ifadochide_' + i + '" onclick="BeatPlanQuickTagging.fnHidetheDiv(\'' + i + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnDoctDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }

                //Chemists
                if (response.lstChemists.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Chemist(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstChemists.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response.lstChemists[i].Region_Code + '\',\'' + response.lstChemists[i].Customer_Code + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstChemists[i].First_Name + '  ' + response.lstChemists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Chemist Name to View Details." id="testChemPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        //content += '<div class="p-2 flex-fill bd-highlight flex border-right">';
                        //content += '<div class="form-group row no-gutters m-0">';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Last Name :</label>';
                        //content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstDoctors[i].Last_Name + '</label>';
                        //content += '</div></div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug Licence Number :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstChemists[i].Drug_License_Number + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstChemists[i].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstChemists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstChemists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1"  id="dvhideChembutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaChemhide_' + i + '" onclick="BeatPlanQuickTagging.fnHidetheDiv(\'' + i + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnChemDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }

                //Stockists
                if (response.lstStockists.length > 0) {
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Tagged Stockist(s) Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="">';
                    for (var i = 0; i < response.lstStockists.length; i++) {
                        content += '<div class="mb-2">';
                        content += '<div class="d-flex flex-wrap bd-highlight align-items-center border rounded shadow-sm">';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">First Name :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="BeatPlanQuickTagging.fnViewDetails(\'' + response.lstStockists[i].Region_Code + '\',\'' + response.lstStockists[i].Customer_Code + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstStockists[i].First_Name + '  ' + response.lstStockists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Stockist Name to View Details." id="testStockistPop_' + i + '"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Drug Licence Number :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstStockists[i].Drug_License_Number + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-3">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Ref Key1 :</label>';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1">' + response.lstStockists[i].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += ' <div class="p-2 flex-fill bd-highlight flex border-right col-2">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel">Status :</label>';
                        var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstStockists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstStockists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-righ col-1" id="dvhideStockistbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaStochide_' + i + '" onclick="BeatPlanQuickTagging.fnHidetheDiv(\'' + i + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\');"></i>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="col-sm-12 col-md-12 p-3" id=dvHdnStocDetails_' + i + ' style="display:none;"></div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }
                content += '</div>';
                $('#beatPopBody').html(content);
                $.blockUI();
                $('#beatModal').modal('show');
            }
        }
    },
    fnViewBeatDetailsFailureCallback: function (error) {

    },
    fnCloseBeatModal: function () {
        $('#beatModal').modal('hide');
        $.unblockUI();

    },
    fnClosedetailsModal: function () {
        $('#detailmodal').modal('hide');
        $.unblockUI();

    },
    //View Details for Doctor,Chemist,Stockist-Beat Pop & Individual 
    fnViewDetails: function (regionCode, customerCode, customerEntityType, divId) {
        debugger;
        var bindGrid = "";
        if (divId == "-1") {
            bindGrid = "-1";
        } else {
            bindGrid = divId;
        }
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = BeatPlanQuickTagging.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "customerCode";
        _obj.value = customerCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "customerEntityType";
        _obj.value = customerEntityType;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "gridId";
        _obj.value = bindGrid
        arrDetails.push(_obj);
        HDAjax.requestInvoke('BeatPlan', 'GetEntityWiseDetails', arrDetails, "POST", BeatPlanQuickTagging.fnViewDetailsSuccessCallback, BeatPlanQuickTagging.fnViewDetailsFailureCallback, null);
    },
    fnViewDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null) {
            if (response.Customer_Entity_Type.toUpperCase() == "DOCTOR") {
                if (response.lstDoctor.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += '<div class="col-sm-4">';
                    content += '<img src="' + response.lstDoctor[0].Doctor_Photo + '" style="height:150px;width :240px;">';
                    content += '</div>';
                    content += ' <div class="col-sm-8 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Last_Name + '</label>';
                    content += '</div><div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Category_Name + '</label>';
                    content += '</div><div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Speciality </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Speciality_Name + ' </label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstDoctor[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstDoctor[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">MDL Number </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].MDL_Number + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Qualification </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Qualification + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';


                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card mt-3">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }


                    if (response.lstHospital.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Organisation Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstHospital.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Hospital Name : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHospital[i].Hospital_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Hospital Classification Name : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHospital[i].Hospital_Classification_Name + ' </label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';
                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }

                    if (response.lstDoctor.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Personal Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">DOB : </label>';
                        if (response.lstDoctor[0].DOB != "01/01/1900") {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].DOB + '</label>';

                        } else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';

                        }
                        content += '</div>';
                        content += '</div><div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Anniversary Date : </label>';
                        if (response.lstDoctor[0].Anniversary_Date != "01/01/1900") {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Anniversary_Date + '</label>';

                        } else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">-</label>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">RegistrationNo : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Registration_No + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Gender : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Gender + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';



                        content += '<div class="card">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Doctor');
                }
                else {
                    $('#dvHdnDoctDetails_' + response.GridId).html(content);
                    $('#dvHdnDoctDetails_' + response.GridId).show();
                    $('#dvhideDoctbutton_' + response.GridId).show();
                    $('#ifadochide_' + response.GridId).show();
                }
            }
            else if (response.Customer_Entity_Type.toUpperCase() == "CHEMIST") {
                if (response.lstChemist.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += ' <div class="col-sm-12 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Last_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number1 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Drug_License_Number1 + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number2 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Drug_License_Number2 + ' </label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstChemist[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstChemist[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';


                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                            content += '</div>';
                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';

                    }
                    if (response.lstChemist.length > 0) {

                        content += '<div class="card">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstChemist[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Chemist');
                } else {
                    $('#dvHdnChemDetails_' + response.GridId).html(content);
                    $('#dvHdnChemDetails_' + response.GridId).show();
                    $('#dvhideChembutton_' + response.GridId).show();
                    $('#ifaChemhide_' + response.GridId).show();
                }
            }
            else if (response.Customer_Entity_Type.toUpperCase() == "STOCKIEST") {
                if (response.lstStockist.length > 0) {
                    content += '<div class="" id="data">';
                    content += '<div class="card mb-3">';
                    content += '<div class="card-header bg-info text-white">Business Info</div>';
                    content += '<div class="card-body">';
                    content += '<div class="row">';
                    content += ' <div class="col-sm-12 row">';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].First_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Last_Name + '</label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number1 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Drug_License_Number1 + '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="col-sm-6">';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Drug Licence Number2 :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Drug_License_Number2 + ' </label>';
                    content += '</div>';
                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = BeatPlanQuickTagging.fnGetBadgeName(response.lstStockist[0].Customer_Status);
                    content += '<span class="badge ' + badgeDetails + '">' + response.lstStockist[0].Customer_Status_Text + '</span>';
                    content += '</label>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';


                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card">';
                            content += '<div class="card-body p-0">';
                            content += '<ul class="list-group list-group-flush">';
                            content += '<li class="list-group-item">';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address1 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address1 + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Address2 : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Address2 + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">State :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].State_Name + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">City :</label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].City_Name + ' </label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Pincode : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Pincode + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Local Area : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Local_Area + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Mobile : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Mobile + '</label>';
                            content += '</div>';
                            content += '<div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Phone : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Phone + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Fax : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Fax + '</label>';
                            content += '</div><div class="form-group row no-gutters">';
                            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Email : </label>';
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstAddress[i].Email + '</label>';
                            content += '</div>';
                            content += '</li> ';
                            content += '</ul> ';
                            content += '</div>';
                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';

                    }
                    if (response.lstStockist.length > 0) {

                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Other Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="d-flex">';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key1 : </label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="flex-fill">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Ref Key2 : </label>';
                        content += ' <label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstStockist[0].Ref_Key2 + ' </label>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                    }
                    content += '</div>';
                }

                if (response.GridId == "-1") {
                    $('#EntityPopBody').html(content);
                    $.blockUI();
                    $('#EntityModal').modal('show');
                    $('#spanEntity').html('Stockist');
                } else {
                    $('#dvHdnStocDetails_' + response.GridId).html(content);
                    $('#dvHdnStocDetails_' + response.GridId).show();
                    $('#dvhideStockistbutton_' + response.GridId).show();
                    $('#ifaStochide_' + response.GridId).show();
                }
            }
        }
    },
    fnViewBeatDetailsFailureCallback: function (error) {
        debugger;
    },
    fnCloseEntityModal: function () {
        debugger;
        $.unblockUI();
        $('#EntityModal').modal('hide');
    },

    fnHidetheDiv: function (griId, customerEntityType) {
        debugger;
        if (customerEntityType.toUpperCase() == "DOCTOR") {
            $('#dvHdnDoctDetails_' + griId).hide();
            $('#ifadochide_' + griId).hide();
            $('#dvhideDoctbutton_' + response.GridId).hide();
        } else if (customerEntityType.toUpperCase() == "CHEMIST") {
            $('#dvHdnChemDetails_' + griId).hide();
            $('#ifaChemhide_' + griId).hide();
            $('#dvhideChembutton_' + response.GridId).hide();
        } else if (customerEntityType = "STOCKIEST") {
            $('#dvHdnStocDetails_' + griId).hide();
            $('#ifaStochide_' + griId).hide();
            $('#dvhideStockistbutton_' + response.GridId).hide();
        }
    },

    //General Search

    fnEventBinderselectAll: function (id, typofrequest, customerentityType, checkboxname) {
        debugger;
        $(document).on('click', '#' + id, function () {
            debugger;
            $("input[type=checkbox][name='" + checkboxname + "']").prop('checked', ($(this).text() == 'Select All' ? true : false));
            var check = $(this).text() == 'Select All' ? true : false;
            if (check) {
                $("#" + id).text('UnSelect All');
            }
            else {
                $("#" + id).text('Select All');
            }

        });

    },


    fnTagOrUnTagCustomerEntityCards: function (dvMainBodyId, dvDatabodyId, typeofRequest, customerentityType, checkboxName) {
        debugger;
        var result = BeatPlanQuickTagging.fnValidateCheckBoxSelection(checkboxName, typeofRequest, customerentityType);
        if (result) {

            var Values = "";
            var ValuesArr = [];
            var disjson = "";
            var index = 0;
            $('#' + dvDatabodyId + ' input[name="' + checkboxName + '"]:checked').each(function () {
                debugger;
                $.blockUI();
                Values = "";
                ValuesArr = [];
                disjson = "";
                var item = $(this).parent().parent().parent().parent().parent().parent().parent()[0];
                if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "DOCTOR") {
                    if ($("#dvDoctorDestinationBody .li").length == 0) {
                        $('#dvDoctorDestinationBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');

                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceDoctors, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#divDoctorsDataBody  #' + item.id).hasClass('UnMap')) {
                        disjson[0].Mapping_Status = "Mapped";
                    } else if ($('#divDoctorsDataBody  #' + item.id).hasClass('NotMapped')) {
                        disjson[0].Mapping_Status = "Map";
                    }

                    disjson[0].Is_Selected = 0;

                    BeatPlanQuickTagging.defaults.lstDestinationDoctors.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstSourceDoctors.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                        if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                            disjson[0].Tagged_Count = 1;
                            $('#dvDoctorDestinationBody #' + item.id).removeClass('once');
                            $('#dvDoctorDestinationBody #' + item.id).addClass('maxed');
                        } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                            disjson[0].Tagged_Count = parseInt(disjson[0].Tagged_Count) + 1;
                            if (parseInt(disjson[0].Tagged_Count) == parseInt(disjson[0].Visit_Count)) {
                                $('#dvDoctorDestinationBody #' + item.id).removeClass('multiple');
                                $('#dvDoctorDestinationBody #' + item.id).addClass('maxed');
                            }
                        }
                    }
                    BeatPlanQuickTagging.defaults.lstSourceDoctors = filtered;
                    BeatPlanQuickTagging.fnAddTagDoctorCard(item);

                    //if ($('#' + item.id).hasClass('NotMapped')) {
                    //    $('#dvDoctorsDataBody #' + item.id).removeClass('NotMapped');
                    //    $('#dvDoctorsDataBody #' + item.id).addClass('Map');
                    //}
                    //else if ($('#' + item.id).hasClass('UnMap')) {
                    //    $('#dvDoctorsDataBody #' + item.id).removeClass('UnMap');
                    //    $('#dvDoctorsDataBody #' + item.id).addClass('Mapped');
                    //}
                    $('#dvDoctorsSearchGrid').show();
                    $('#dvDoctorsSearchGrid').addClass('d-flex');
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceDocSearch", "txtDoctorName", BeatPlanQuickTagging.defaults.lstSourceDoctors, "Doctor");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestDocSearch", "textDestDoctorName", BeatPlanQuickTagging.defaults.lstDestinationDoctors, "Doctor");
                }
                else if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "CHEMIST") {
                    if ($("#dvChemistDestinationBody .li").length == 0) {
                        $('#dvChemistDestinationBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');

                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceChemists, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#dvChemistsDataBody  #' + item.id).hasClass('UnMap')) {
                        disjson[0].Mapping_Status = "Mapped";
                    } else if ($('#dvChemistsDataBody  #' + item.id).hasClass('NotMapped')) {
                        disjson[0].Mapping_Status = "Map";
                    }
                    disjson[0].Is_Selected = 0;
                    BeatPlanQuickTagging.defaults.lstDestinationChemists.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstSourceChemists.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    BeatPlanQuickTagging.defaults.lstSourceChemists = filtered;
                    BeatPlanQuickTagging.fnAddTagChemistCard(item);
                    //if ($('#' + item.id).hasClass('NotMapped')) {
                    //    $('#dvChemistsDataBody #' + item.id).removeClass('NotMapped');
                    //    $('#dvChemistsDataBody #' + item.id).addClass('Map');
                    //}
                    //else if ($('#' + item.id).hasClass('UnMap')) {
                    //    $('#dvChemistsDataBody #' + item.id).removeClass('UnMap');
                    //    $('#dvChemistsDataBody #' + item.id).addClass('Mapped');
                    //}
                    $('#dvChemistsSearchGrid').show();
                    $('#dvChemistsSearchGrid').addClass('d-flex');
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceChemSearch", "txtChemistName", BeatPlanQuickTagging.defaults.lstSourceChemists, "Chemist");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestChemSearch", "textDestChemistName", BeatPlanQuickTagging.defaults.lstDestinationChemists, "Chemist");
                }
                else if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "STOCKIST") {
                    if ($("#dvStockistDestinationBody .li").length == 0) {
                        $('#dvStockistDestinationBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');

                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstSourceStockists, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#dvStockistDataBody  #' + item.id).hasClass('UnMap')) {
                        disjson[0].Mapping_Status = "Mapped";
                    } else if ($('#dvStockistDataBody  #' + item.id).hasClass('NotMapped')) {
                        disjson[0].Mapping_Status = "Map";
                    }
                    disjson[0].Is_Selected = 0;
                    BeatPlanQuickTagging.defaults.lstDestinationStockists.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstSourceStockists.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    BeatPlanQuickTagging.defaults.lstSourceStockists = filtered;
                    BeatPlanQuickTagging.fnAddTagStockistCard(item);
                    //if ($('#' + item.id).hasClass('NotMapped')) {
                    //    $('#dvStockistDataBody #' + item.id).removeClass('NotMapped');
                    //    $('#dvStockistDataBody #' + item.id).addClass('Map');
                    //}
                    //else if ($('#' + item.id).hasClass('UnMap')) {
                    //    $('#dvStockistDataBody #' + item.id).removeClass('UnMap');
                    //    $('#dvStockistDataBody #' + item.id).addClass('Mapped');
                    //}
                    $('#dvStockistsSearchGrid').show();
                    $('#dvStockistsSearchGrid').addClass('d-flex');
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceStockSearch", "txtStockistName", BeatPlanQuickTagging.defaults.lstSourceStockists, "Stockist");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestStocSearch", "textDestStockistName", BeatPlanQuickTagging.defaults.lstDestinationStockists, "Stockist");
                }
                else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "DOCTOR") {
                    if ($("#divDoctorsDataBody .li").length == 0) {
                        $('#divDoctorsDataBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');

                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationDoctors, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#dvDoctorDestinationBody  #' + item.id).hasClass('Mapped')) {
                        disjson[0].Mapping_Status = "UnMap";
                    } else if ($('#dvDoctorDestinationBody  #' + item.id).hasClass('Map')) {
                        disjson[0].Mapping_Status = "NotMapped";
                    }

                    if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                        if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                            disjson[0].Tagged_Count = 0;
                            $('#dvDoctorDestinationBody #' + item.id).removeClass('maxed');
                            $('#dvDoctorDestinationBody #' + item.id).addClass('once');
                        } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                            disjson[0].Tagged_Count = parseInt(disjson[0].Tagged_Count) - 1;
                            if (parseInt(disjson[0].Tagged_Count) == parseInt(disjson[0].Visit_Count)) {
                                $('#dvDoctorDestinationBody #' + item.id).removeClass('maxed');
                                $('#dvDoctorDestinationBody #' + item.id).addClass('multiple');
                            }
                        }
                    }
                    disjson[0].Is_Selected = 0;
                    BeatPlanQuickTagging.defaults.lstSourceDoctors.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstDestinationDoctors.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    BeatPlanQuickTagging.defaults.lstDestinationDoctors = filtered;
                    BeatPlanQuickTagging.fnAddBackTagDoctorCard(item);
                    //if ($('#' + item.id).hasClass('Mapped')) {
                    //    $('#dvDoctorDestinationBody #' + item.id).removeClass('Mapped');
                    //    $('#dvDoctorDestinationBody #' + item.id).addClass('UnMap');
                    //}
                    //else if ($('#' + item.id).hasClass('Map')) {
                    //    $('#dvDoctorDestinationBody #' + item.id).removeClass('Map');
                    //    $('#dvDoctorDestinationBody #' + item.id).addClass('NotMapped');
                    //}
                    if (BeatPlanQuickTagging.defaults.lstDestinationDoctors.length == 0) {
                        $('#dvDoctorsSearchGrid').hide();
                        $('#dvDoctorsSearchGrid').removeClass('d-flex');
                    }
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceDocSearch", "txtDoctorName", BeatPlanQuickTagging.defaults.lstSourceDoctors, "Doctor");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestDocSearch", "textDestDoctorName", BeatPlanQuickTagging.defaults.lstDestinationDoctors, "Doctor");
                }
                else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "CHEMIST") {
                    if ($("#dvChemistsDataBody .li").length == 0) {
                        $('#dvChemistsDataBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');

                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationChemists, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#dvChemistDestinationBody  #' + item.id).hasClass('Mapped')) {
                        disjson[0].Mapping_Status = "UnMap";
                    } else if ($('#dvChemistDestinationBody  #' + item.id).hasClass('Map')) {
                        disjson[0].Mapping_Status = "NotMapped";
                    }
                    disjson[0].Is_Selected = 0;
                    BeatPlanQuickTagging.defaults.lstSourceChemists.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstDestinationChemists.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    BeatPlanQuickTagging.defaults.lstDestinationChemists = filtered;
                    BeatPlanQuickTagging.fnAddBackTagChemistCard(item);
                    //if ($('#' + item.id).hasClass('Mapped')) {
                    //    $('#dvChemistDestinationBody #' + item.id).removeClass('Mapped');
                    //    $('#dvChemistDestinationBody #' + item.id).addClass('UnMap');
                    //}
                    //else if ($('#' + item.id).hasClass('Map')) {
                    //    $('#dvChemistDestinationBody #' + item.id).removeClass('Map');
                    //    $('#dvChemistDestinationBody #' + item.id).addClass('NotMapped');
                    //}
                    if (BeatPlanQuickTagging.defaults.lstDestinationChemists.length == 0) {
                        $('#dvChemistsSearchGrid').hide();
                        $('#dvChemistsSearchGrid').removeClass('d-flex');
                    }
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceChemSearch", "txtChemistName", BeatPlanQuickTagging.defaults.lstSourceChemists, "Chemist");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestChemSearch", "textDestChemistName", BeatPlanQuickTagging.defaults.lstDestinationChemists, "Chemist");
                }
                else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "STOCKIST") {
                    if ($("#dvStockistDataBody .li").length == 0) {
                        $('#dvStockistDataBody').empty();
                    }
                    Values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                    ValuesArr = Values.split('|');
                    //
                    disjson = $.grep(BeatPlanQuickTagging.defaults.lstDestinationStockists, function (ele, index) {
                        return ele.Region_Code == ValuesArr[0] && ele.Customer_Code == ValuesArr[1] && ele.Customer_Entity_Type == ValuesArr[2];
                    });
                    if ($('#dvWebDestination  #' + item.id).hasClass('Mapped')) {
                        disjson[0].Mapping_Status = "UnMap";
                    } else if ($('#dvWebDestination  #' + item.id).hasClass('Map')) {
                        disjson[0].Mapping_Status = "NotMapped";
                    }
                    disjson[0].Is_Selected = 0;
                    BeatPlanQuickTagging.defaults.lstSourceStockists.push(disjson[0]);
                    var filtered = BeatPlanQuickTagging.defaults.lstDestinationStockists.filter(function (item) {
                        return item.Customer_Code !== ValuesArr[1];
                    });
                    BeatPlanQuickTagging.defaults.lstDestinationStockists = filtered;
                    BeatPlanQuickTagging.fnAddBackTagStockistCard(item);
                    //if ($('#' + item.id).hasClass('Mapped')) {
                    //    $('#dvStockistDestinationBody #' + item.id).removeClass('Mapped');
                    //    $('#dvStockistDestinationBody #' + item.id).addClass('UnMap');
                    //}
                    //else if ($('#' + item.id).hasClass('Map')) {
                    //    $('#dvStockistDestinationBody #' + item.id).removeClass('Map');
                    //    $('#dvStockistDestinationBody #' + item.id).addClass('NotMapped');
                    //}
                    if (BeatPlanQuickTagging.defaults.lstDestinationStockists.length == 0) {
                        $('#dvStockistsSearchGrid').hide();
                        $('#dvStockistsSearchGrid').removeClass('d-flex');
                    }

                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvSourceStockSearch", "txtStockistName", BeatPlanQuickTagging.defaults.lstSourceStockists, "Stockist");
                    BeatPlanQuickTagging.fnEventBinderForSyncFusionSearch("dvDestStocSearch", "textDestStockistName", BeatPlanQuickTagging.defaults.lstDestinationStockists, "Stockist");
                }
            });
            $.unblockUI();
            var count = 0;
            if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "DOCTOR") {
                count = 0;

                $("#dvDoctorDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'doctorDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorDestcheckboxAutosizing_' + count);
                    $('input[name="doctorDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#divDoctorsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });

                $("#doctorchkAll").text('Select All');
                // if (BeatPlanQuickTagging.defaults.lstSourceDoctors.length > 0) {
                doctorSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceDoctors);

                //}
            }
            else if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "CHEMIST") {
                count = 0;
                $("#dvChemistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'chemistDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistDestcheckboxAutosizing_' + count);
                    $('input[name="chemistDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#dvChemistsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                $("#chemistchkAll").text('Select All');
                //if (BeatPlanQuickTagging.defaults.lstSourceChemists.length > 0) {
                chemistSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceChemists);

                //}
            }
            else if (typeofRequest.toUpperCase() == "SOURCE" && customerentityType.toUpperCase() == "STOCKIST") {
                count = 0;
                $("#dvStockistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'stockistDestmultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistDestcheckboxAutosizing_' + count);
                    $('input[name="stockistDestmultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#dvStockistDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                $("#stockistchkAll").text('Select All');
                //if (BeatPlanQuickTagging.defaults.lstSourceStockists.length > 0) {
                stockistSourceFilter = false;
                BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback(BeatPlanQuickTagging.defaults.lstSourceStockists);
                //}
            }
            else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "DOCTOR") {
                count = 0;
                $("#dvDoctorDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorDestcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#divDoctorsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainDoctorCard_' + count);
                    $(this).children().children().attr('id', 'DoctorCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdndoctorDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'doctorsourcemuliselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'doctorcheckboxAutosizing_' + count);
                    $('input[name="doctorsourcemuliselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontdoctorremove_' + count;
                    count = count + 1;
                });
                $("#DoctorDestchkAll").text('Select All');
                //if (BeatPlanQuickTagging.defaults.lstDestinationDoctors.length > 0) {
                doctorDestinationFilter = false;
                BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationDoctors);
                var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
                $(function () {
                    // Let the gallery items be draggable
                    $(".draggableDoctorClass", Doctorsource).draggable({
                        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                        revert: "invalid", // when not dropped, the item will revert back to its initial position
                        containment: "document",
                        helper: "clone",
                        cursor: "move"
                    });
                    var acceptfromClass = "";
                    if (privValueBeatToDoctorTag != "" && privValueBeatToDoctorTag != null && privValueBeatToDoctorTag != undefined) {
                        if (privValueBeatToDoctorTag.toUpperCase() == "ONCE") {
                            acceptfromClass = "#divDoctorsDataBody .li.once";
                        } else if (privValueBeatToDoctorTag.toUpperCase() == "MULTIPLE") {
                            acceptfromClass = "#divDoctorsDataBody .li.multiple";
                        }
                    }
                    // Let the trash be droppable, accepting the gallery items
                    Doctordestination.droppable({
                        accept: acceptfromClass,
                        classes: {
                        },
                        drop: function (event, ui) {
                            debugger;
                            BeatPlanQuickTagging.fnDeleteDoctorCard(ui.draggable);

                        },
                    });
                });
                //}
            }
            else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "CHEMIST") {
                count = 0;
                $("#dvChemistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistDestcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#dvChemistsDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainChemistCard_' + count);
                    $(this).children().children().attr('id', 'ChemistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnchemistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'chemistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'chemistsourcemultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'chemistcheckboxAutosizing_' + count);
                    $('input[name="chemistsourcemultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontchemistremove_' + count;
                    count = count + 1;
                });
                $("#ChemistDestchkAll").text('Select All');
                chemistDestinationFilter = false;
                BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationChemists);
                var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
                $(function () {
                    // Let the gallery items be draggable
                    $(".draggableChemistClass", Chemistsource).draggable({
                        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                        revert: "invalid", // when not dropped, the item will revert back to its initial position
                        containment: "document",
                        helper: "clone",
                        cursor: "move"
                    });

                    // Let the trash be droppable, accepting the gallery items
                    Chemistdestination.droppable({
                        accept: "#dvChemistsDataBody .li",
                        classes: {
                        },
                        drop: function (event, ui) {
                            debugger;
                            BeatPlanQuickTagging.fnDeleteChemistCard(ui.draggable);

                        },
                    });
                });
            }
            else if (typeofRequest.toUpperCase() == "DESTINATION" && customerentityType.toUpperCase() == "STOCKIST") {
                count = 0;
                $("#dvStockistDestinationBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistDestcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistDestcheckboxAutosizing_' + count);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                count = 0;
                $("#dvStockistDataBody .li").map(function () {
                    var currentid = $(this).attr('id');
                    $(this).attr('id', 'dvMainStockistCard_' + count);
                    $(this).children().children().attr('id', 'StockistCard_' + count);
                    var changeid = $(this).children()[1];
                    changeid.id = 'hdnstockistDetails_' + count;
                    //$(this).children().children().children().children().children().children().find('input').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //$(this).children().children().children().children().children().children().find('label').attr('id', 'doctorcheckboxAutosizing_' + count);
                    //var checkboxIdchange = $(this).children().children().children().children().children().children()[0];
                    //checkboxIdchange.childNodes[0].id = 'doctorDestcheckboxAutosizing_' + count;
                    //checkboxIdchange.childNodes[1].htmlfor = 'doctorDestcheckboxAutosizing_' + count;
                    $(this).children().children().children().children().children().children().find('input').attr('id', 'stockistcheckboxAutosizing_' + count);
                    $(this).children().children().children().children().children().children().find('input').attr('name', 'stockistsourcemultiselect');
                    $(this).children().children().children().children().children().children().find('label').attr('for', 'stockistcheckboxAutosizing_' + count);
                    $('input[name="stockistsourcemultiselect"]').prop('checked', false);
                    var crossIconId = $(this).children().children().children().children().children().find('i');
                    crossIconId[1].id = 'ifontstockistremove_' + count;
                    count = count + 1;
                });
                $("#StocksitDestchkAll").text('Select All');
                stockistDestinationFilter = false;
                BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback(BeatPlanQuickTagging.defaults.lstDestinationStockists);
                var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
                $(function () {
                    // Let the gallery items be draggable
                    $(".draggableStockistClass", Stockistsource).draggable({
                        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
                        revert: "invalid", // when not dropped, the item will revert back to its initial position
                        containment: "document",
                        helper: "clone",
                        cursor: "move"
                    });

                    // Let the trash be droppable, accepting the gallery items
                    Stockistdestination.droppable({
                        accept: "#dvStockistDataBody .li",
                        classes: {
                        },
                        drop: function (event, ui) {
                            debugger;
                            BeatPlanQuickTagging.fnDeleteStockistCard(ui.draggable);

                        },
                    });
                });
            }
        }
    },
    fnEventBinderForSyncFusionSearch: function (dvId, inputtextId, data, customerEntityType) {
        debugger;
        var content = "";
        content = '<input type="text" class="form-control form-control-sm" id="' + inputtextId + '"/>';
        $('#' + dvId).empty();
        $('#' + dvId).html(content);
        var lstNames = [];
        for (var i = 0; i < data.length; i++) {
            _objData = {};
            _objData.label = data[i].First_Name;
            lstNames.push(_objData);
        }
        if (lstNames.length > 0) {
            var atcObj = new ej.dropdowns.AutoComplete({
                //set the data to dataSource property
                dataSource: lstNames,
                fields: { text: 'label' },
                placeholder: 'Search by ' + customerEntityType + ' Name',
                //value: valueArr

            });
            atcObj.appendTo('#' + inputtextId);
        }
    },
    fnValidateCheckBoxSelection: function (checkboxName, typeofRequest, customerentityType) {
        debugger;
        var isValid = true;
        var customerEntityType = "";
        if (customerentityType.toUpperCase() == "DOCTOR") {
            customerEntityType = "Doctor";
        } else if (customerentityType.toUpperCase() == "CHEMIST") {
            customerEntityType = "Chemist";
        } else if (customerentityType.toUpperCase() == "STOCKIST") {
            customerEntityType = "Stockist";
        }
        var messagerequest = "";
        if (typeofRequest.toUpperCase() == "SOURCE") {
            messagerequest = "Tag";
        }
        else {
            messagerequest = "Un-Tag";
        }
        if ($("input[type=checkbox][name='" + checkboxName + "']:checked").length == 0) {
            swal('Info', 'Please select atleast one ' + customerEntityType + ' to ' + messagerequest + '', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    fnAddTagDoctorCard: function (item) {
        debugger;
        var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
        if ($('#divDoctorsDataBody #' + item.id).hasClass('NotMapped')) {
            $('#divDoctorsDataBody #' + item.id).removeClass('NotMapped');
            $('#divDoctorsDataBody #' + item.id).addClass('Map');
        } else if ($('#divDoctorsDataBody #' + item.id).hasClass('UnMap')) {
            $('#divDoctorsDataBody #' + item.id).removeClass('UnMap');
            $('#divDoctorsDataBody #' + item.id).addClass('Mapped');
        }
        Doctordestination.append(item);
        $('#divDoctorsDataBody #' + item.id).remove();

        $('#dvDoctorDestinationBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).show(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
    },
    fnAddTagChemistCard: function (item) {
        debugger;
        var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
        //item.appendTo(Doctorsource);

        if ($('#dvChemistsDataBody #' + item.id).hasClass('NotMapped')) {
            $('#dvChemistsDataBody #' + item.id).removeClass('NotMapped');
            $('#dvChemistsDataBody #' + item.id).addClass('Map');
        }
        else if ($('#dvChemistsDataBody #' + item.id).hasClass('UnMap')) {
            $('#dvChemistsDataBody #' + item.id).removeClass('UnMap');
            $('#dvChemistsDataBody #' + item.id).addClass('Mapped');
        }

        Chemistdestination.append(item);
        $('#dvChemistsDataBody #' + item.id).remove();

        $('#dvChemistDestinationBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).show(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');
    },
    fnAddTagStockistCard: function (item) {
        debugger;
        var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");
        //item.appendTo(Doctorsource);

        if ($('#dvStockistDataBody #' + item.id).hasClass('NotMapped')) {
            $('#dvStockistDataBody #' + item.id).removeClass('NotMapped');
            $('#dvStockistDataBody #' + item.id).addClass('Map');
        } else if ($('#dvStockistDataBody #' + item.id).hasClass('UnMap')) {
            $('#dvStockistDataBody #' + item.id).removeClass('UnMap');
            $('#dvStockistDataBody #' + item.id).addClass('Mapped');
        }

        Stockistdestination.append(item);
        $('#dvStockistDataBody #' + item.id).remove();

        $('#dvStockistDestinationBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).show(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
    },
    fnAddBackTagDoctorCard: function (item) {
        debugger;
        var Doctorsource = $("#divDoctorsDataBody"); Doctordestination = $("#dvDoctorDestinationBody");
        if ($('#dvDoctorDestinationBody #' + item.id).hasClass('Mapped')) {
            $('#dvDoctorDestinationBody #' + item.id).removeClass('Mapped');
            $('#dvDoctorDestinationBody #' + item.id).addClass('UnMap');
        } else if ($('#dvDoctorDestinationBody #' + item.id).hasClass('Map')) {
            $('#dvDoctorDestinationBody #' + item.id).removeClass('Map');
            $('#dvDoctorDestinationBody #' + item.id).addClass('NotMapped');
        }
        $('#dvDoctorDestinationBody #' + item.id).remove();
        Doctorsource.append(item);


        $('#divDoctorsDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvDoctorDestinationBody .draggableDoctorClass', 'bdgDoctorsTagd', 'bdgDoctorsTagdAppr', 'bdgDoctorsTagdUnAppr', 'DOCTOR');
    },
    fnAddBackTagChemistCard: function (item) {
        debugger;
        var Chemistsource = $("#dvChemistsDataBody"); Chemistdestination = $("#dvChemistDestinationBody");
        //item.appendTo(Doctorsource);

        if ($('#dvChemistDestinationBody #' + item.id).hasClass('Mapped')) {
            $('#dvChemistDestinationBody #' + item.id).removeClass('Mapped');
            $('#dvChemistDestinationBody #' + item.id).addClass('UnMap');
        } else if ($('#dvChemistDestinationBody #' + item.id).hasClass('Map')) {
            $('#dvChemistDestinationBody #' + item.id).removeClass('Map');
            $('#dvChemistDestinationBody #' + item.id).addClass('NotMapped');
        }
        Chemistsource.append(item);
        $('#dvChemistDestinationBody #' + item.id).remove();

        $('#dvChemistsDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvChemistDestinationBody .draggableChemistClass', 'bdgChemistsTagd', 'bdgChemistsTagdAppr', 'bdgChemistsTagdUnAppr', 'CHEMIST');
    },
    fnAddBackTagStockistCard: function (item) {
        debugger;
        var Stockistsource = $("#dvStockistDataBody"); Stockistdestination = $("#dvStockistDestinationBody");

        if ($('#dvStockistDestinationBody #' + item.id).hasClass('Mapped')) {
            $('#dvStockistDestinationBody #' + item.id).removeClass('Mapped');
            $('#dvStockistDestinationBody #' + item.id).addClass('UnMap');
        } else if ($('#dvStockistDestinationBody #' + item.id).hasClass('Map')) {
            $('#dvStockistDestinationBody #' + item.id).removeClass('Map');
            $('#dvStockistDestinationBody #' + item.id).addClass('NotMapped');
        }
        Stockistsource.append(item);
        //item.appendTo(Doctorsource);
        $('#dvStockistDestinationBody #' + item.id).remove();

        $('#dvStockistDataBody #' + item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].id).hide(); //item.children().children().children().children().children().find('i').attr('id')).hide();
        BeatPlanQuickTagging.fnGetCount('#dvStockistDestinationBody .draggableStockistClass', 'bdgStockistsTagd', 'bdgStockistsTagdAppr', 'bdgStockistsTagdUnAppr', 'STOCKIEST');
    },
    fnSearch: function (Id, entityType, typeofRequest) {
        debugger;
        var searchVal = $("#" + Id).val();
        var filteringList = [];
        if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "SOURCE") {
            doctorSourceFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstSourceDoctors;
        } else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "SOURCE") {
            chemistSourceFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstSourceChemists;
        }
        else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "SOURCE") {
            stockistSourceFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstSourceStockists;
        }
        else if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "DESTINATION") {
            doctorDestinationFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationDoctors;
        }
        else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "DESTINATION") {
            chemistDestinationFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationChemists;
        }
        else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "DESTINATION") {
            stockistDestinationFilter = false;
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationStockists;
        }
        if (searchVal != "") {
            var data = $.grep(filteringList, function (v) {
                return v.First_Name == searchVal;
            });
            if (data != null && data.length > 0) {
                //if (searchVal == "") {
                //    if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "SOURCE") {
                //        BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback(filteringList);
                //    }
                //    else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "SOURCE") {
                //        BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback(filteringList);
                //    }
                //    else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "SOURCE") {
                //        BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback(filteringList);
                //    }
                //    else if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "DESTINATION") {
                //        BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback(filteringList);
                //    }
                //    else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                //        BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback(filteringList);
                //    }
                //    else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                //        BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback(filteringList);
                //    }
                //}
                //else {


                //This is to Filter the exact value searched for
                if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#divDoctorsDataBody input[type="checkbox"][name="doctorsourcemuliselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceDoctors = BeatPlanQuickTagging.defaults.lstSourceDoctors;
                    for (var i = 0; i < lstSourceDoctors.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceDoctors[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback(data);
                }
                else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvChemistsDataBody input[type="checkbox"][name="chemistsourcemultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceChemists = BeatPlanQuickTagging.defaults.lstSourceChemists;
                    for (var i = 0; i < lstSourceChemists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceChemists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback(data);
                }
                else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvStockistDataBody input[type="checkbox"][name="stockistsourcemultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceStockists = BeatPlanQuickTagging.defaults.lstSourceStockists;
                    for (var i = 0; i < lstSourceStockists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceStockists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback(data);
                }
                else if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvDoctorDestinationBody input[type="checkbox"][name="doctorDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceDoctors = BeatPlanQuickTagging.defaults.lstDestinationDoctors;
                    for (var i = 0; i < lstDestSourceDoctors.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationDoctors[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback(data);
                }
                else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvChemistDestinationBody input[type="checkbox"][name="chemistDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceChemists = BeatPlanQuickTagging.defaults.lstDestinationChemists;
                    for (var i = 0; i < lstDestSourceChemists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationChemists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback(data);
                }
                else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvStockistDestinationBody input[type="checkbox"][name="stockistDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceStockists = BeatPlanQuickTagging.defaults.lstDestinationStockists
                    for (var i = 0; i < lstDestSourceStockists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationStockists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback(data);
                }
                // }
            }
            else {
                //If there is no such value for the searched value for Tag(Left) & UnTag(Right) the "No Records Found" will be displayed.
                if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#divDoctorsDataBody input[type="checkbox"][name="doctorsourcemuliselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceDoctors = BeatPlanQuickTagging.defaults.lstSourceDoctors;
                    for (var i = 0; i < lstSourceDoctors.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceDoctors[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback("");
                }
                else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvChemistsDataBody input[type="checkbox"][name="chemistsourcemultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceChemists = BeatPlanQuickTagging.defaults.lstSourceChemists;
                    for (var i = 0; i < lstSourceChemists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceChemists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback("");
                }
                else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "SOURCE") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvStockistDataBody input[type="checkbox"][name="stockistsourcemultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstSourceStockists = BeatPlanQuickTagging.defaults.lstSourceStockists;
                    for (var i = 0; i < lstSourceStockists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstSourceStockists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback("");
                }
                else if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvDoctorDestinationBody input[type="checkbox"][name="doctorDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceDoctors = BeatPlanQuickTagging.defaults.lstDestinationDoctors;
                    for (var i = 0; i < lstDestSourceDoctors.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationDoctors[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback("");
                }
                else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvChemistDestinationBody input[type="checkbox"][name="chemistDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceChemists = BeatPlanQuickTagging.defaults.lstDestinationChemists;
                    for (var i = 0; i < lstDestSourceChemists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationChemists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback("");
                }
                else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                    var values = "";
                    var valuesArr = [];
                    var lstArrselected = [];
                    $('#dvStockistDestinationBody input[type="checkbox"][name="stockistDestmultiselect"]:checked').each(function () {
                        if ($(this).is(':checked')) {
                            values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                            valuesArr = values.split('|');
                            var _obj = {
                                Customer_Code: valuesArr[1],
                                Region_Code: valuesArr[0],
                                Customer_Entity_Type: valuesArr[2]
                            };
                            lstArrselected.push(_obj);
                        }
                    });
                    var lstDestSourceStockists = BeatPlanQuickTagging.defaults.lstDestinationStockists
                    for (var i = 0; i < lstDestSourceStockists.length; i++) {
                        for (var k = 0; k < lstArrselected.length; k++) {
                            if (lstDestSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                                BeatPlanQuickTagging.defaults.lstDestinationStockists[i].Is_Selected = 1;
                            }
                        }
                    }
                    BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback("");
                }
            }
        }
        else {
            //This is to Load all the Data when there is no value in the search filter for Tag(Left) & UnTag(Right)
            if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "SOURCE") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#divDoctorsDataBody input[type="checkbox"][name="doctorsourcemuliselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstSourceDoctors = BeatPlanQuickTagging.defaults.lstSourceDoctors;
                for (var i = 0; i < lstSourceDoctors.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstSourceDoctors[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllApprovedDoctorsSuccessCallback(filteringList);
            }
            else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "SOURCE") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#dvChemistsDataBody input[type="checkbox"][name="chemistsourcemultiselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstSourceChemists = BeatPlanQuickTagging.defaults.lstSourceChemists;
                for (var i = 0; i < lstSourceChemists.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstSourceChemists[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllChemistsSuccessCallback(filteringList);
            }
            else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "SOURCE") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#dvStockistDataBody input[type="checkbox"][name="stockistsourcemultiselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstSourceStockists = BeatPlanQuickTagging.defaults.lstSourceStockists;
                for (var i = 0; i < lstSourceStockists.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstSourceStockists[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllStockistsSuccessCallback(filteringList);
            }
            else if (entityType == "DOCTOR" & typeofRequest.toUpperCase() == "DESTINATION") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#dvDoctorDestinationBody input[type="checkbox"][name="doctorDestmultiselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstDestSourceDoctors = BeatPlanQuickTagging.defaults.lstDestinationDoctors;
                for (var i = 0; i < lstDestSourceDoctors.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstDestSourceDoctors[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstDestinationDoctors[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllTaggedApprovedDoctorsSuccessCallback(filteringList);
            }
            else if (entityType == "CHEMIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#dvChemistDestinationBody input[type="checkbox"][name="chemistDestmultiselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstDestSourceChemists = BeatPlanQuickTagging.defaults.lstDestinationChemists;
                for (var i = 0; i < lstDestSourceChemists.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstDestSourceChemists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstDestinationChemists[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllTaggedChemistsSuccessCallback(filteringList);
            }
            else if (entityType == "STOCKIST" & typeofRequest.toUpperCase() == "DESTINATION") {
                var values = "";
                var valuesArr = [];
                var lstArrselected = [];
                $('#dvStockistDestinationBody input[type="checkbox"][name="stockistDestmultiselect"]:checked').each(function () {
                    if ($(this).is(':checked')) {
                        values = $(this).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
                        valuesArr = values.split('|');
                        var _obj = {
                            Customer_Code: valuesArr[1],
                            Region_Code: valuesArr[0],
                            Customer_Entity_Type: valuesArr[2]
                        };
                        lstArrselected.push(_obj);
                    }
                });
                var lstDestSourceStockists = BeatPlanQuickTagging.defaults.lstDestinationStockists
                for (var i = 0; i < lstDestSourceStockists.length; i++) {
                    for (var k = 0; k < lstArrselected.length; k++) {
                        if (lstDestSourceStockists[i].Customer_Code == lstArrselected[k].Customer_Code) {
                            BeatPlanQuickTagging.defaults.lstDestinationStockists[i].Is_Selected = 1;
                        }
                    }
                }
                BeatPlanQuickTagging.fnGetAllTaggedStockistsSuccessCallback(filteringList);
            }
        }

    },
    fnFillIsSelectedValue: function (Id, dvId, checkboxName, typeofRequest, customerEntityType) {
        debugger;
        var filteringList = "";
        var values = "";
        var valuesArr = [];
        if (typeofRequest == "SOURCE" && customerEntityType.toUpperCase() == "DOCTOR") {
            filteringList = BeatPlanQuickTagging.defaults.lstSourceDoctors;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceDoctors[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceDoctors[i].Is_Selected = 1;
                    }
                }
            }
        }
        else if (typeofRequest == "SOURCE" && customerEntityType.toUpperCase() == "CHEMIST") {
            filteringList = BeatPlanQuickTagging.defaults.lstSourceChemists;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceChemists[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceChemists[i].Is_Selected = 1;
                    }
                }
            }
        }
        else if (typeofRequest == "SOURCE" && customerEntityType.toUpperCase() == "STOCKIST") {
            filteringList = BeatPlanQuickTagging.defaults.lstSourceStockists;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceStockists[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstSourceStockists[i].Is_Selected = 1;
                    }
                }
            }
        }
        else if (typeofRequest == "DESTINATION" && customerEntityType.toUpperCase() == "DOCTOR") {
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationDoctors;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationDoctors[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationDoctors[i].Is_Selected = 1;
                    }
                }
            }
        }
        else if (typeofRequest == "DESTINATION" && customerEntityType.toUpperCase() == "CHEMIST") {
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationChemists;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationChemists[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationChemists[i].Is_Selected = 1;
                    }
                }
            }
        }
        else if (typeofRequest == "DESTINATION" && customerEntityType.toUpperCase() == "STOCKIST") {
            filteringList = BeatPlanQuickTagging.defaults.lstDestinationStockists;
            values = $('#' + Id.htmlFor).parent().parent().parent().parent().parent().parent().parent().children()[1].value;
            valuesArr = values.split('|');
            if ($('#' + Id.htmlFor).is(':checked')) {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationStockists[i].Is_Selected = 0;
                    }
                }
            }
            else {
                for (var i = 0; i < filteringList.length; i++) {
                    if (filteringList[i].Customer_Code == valuesArr[1]) {
                        BeatPlanQuickTagging.defaults.lstDestinationStockists[i].Is_Selected = 1;
                    }
                }
            }
        }
    }
}