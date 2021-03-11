var doctorJSON_g = [{ id: 0 }];
var userCode = "";
var usertypePrivilege_g = "";
var userDetails = "";
var lstSFCDetails = "";
var beatPlan_interPriv_g = ""; beatPlan_SFCValidatPriv_g = "";
var gridNo = 0;
var uniqueSFCDetails_g = ""; uniqueTravelModeDetails_g = "";
var uniqueBeatName_g = ""; uniqueCategoryDetails_g = "";
var workareas_g = "";
var CreateBeatPlan = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserCode: "",
        SelectedRegionCode: "",
    },
    Init: function () {
    },
    fnGetWorkCategories: function (value) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetAllWorkCategories', arrDetails, "POST", CreateBeatPlan.fnWorkCategoriesSuccessCallback, CreateBeatPlan.fnWorkCategoriesFailureCallback, null)

    },
    fnWorkCategoriesSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.length > 0) {
            content += '<select class="form-control" id="ddlWorkCategory" onchange="CreateBeatPlan.fnOnWorkCategoryChangeLoadSFC(this.value);">';
            content += '<option value="-1" selected disabled>Select Category</option>'

            for (var i = 0; i < response.length; i++) {
                content += '<option value="' + response[i].Work_Category_Code + '">' + response[i].Work_Category_Name + '</option>'
            }
            content += '</select>';
            $('#dvWorkCategory').html(content);
            $("#ddlWorkCategory option").each(function () {
                if ($(this).text() == "HQ") {
                    $(this).attr('selected', 'selected');
                }
            });
            CreateBeatPlan.fnGetSFCDetails();


        }
    },
    fnWorkCategoriesFailureCallback: function (error) {

    },
    fnGetWorkAreas: function (value) {
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = CreateBeatPlan.defaults.SelectedRegionCode;
        arrDetails.push(_obj);
        _obj = {};
        _obj.name = "workCategoryCode";
        _obj.value = value;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "sfcValidation";
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        if (beatPlan_SFCValidatPriv_g != "" && beatPlan_SFCValidatPriv_g != undefined && beatPlan_interPriv_g != null && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
            _obj.value = 1;
        } else {
            _obj.value = 0;
        }
        arrDetails.push(_obj);
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetAllWorAreas', arrDetails, "POST", CreateBeatPlan.fnWorkAreasSuccessCallback, CreateBeatPlan.fnWorkAreasFailureCallback, null);
    },
    fnWorkAreasSuccessCallback: function (response) {
        debugger;
        var lstWorkAreas = [];
        var data1 = new Array();
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        var isFlexiAllowed = true;
        if (beatPlan_SFCValidatPriv_g != "" && beatPlan_SFCValidatPriv_g != undefined && beatPlan_interPriv_g != null && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
            isFlexiAllowed = false;
        } else {
            isFlexiAllowed = true;
        }
        if (response != null && response.length > 0) {

            if (response.length == 0) {
                content = "[]";
            } else {
                content = "[";
                var mdlNumber;
                for (var i = 0; i < response.length; i++) {

                    //mdlNumber = response[i].MDL_Number;
                    _obj = {
                        id: $.trim(response[i].Work_Area),
                        name: $.trim(response[i].Work_Area)
                    };
                    data1.push(_obj);
                    //content += "{id:\"" + response[i].Work_Area + "\",name:\"" + response[i].Work_Area + "\"},";
                }
                //content = content.slice(0, -1) + "]";
            }
            workareas_g = data1;
            //data1 = eval('(' + content + ')');
            // $("#txtWorkArea").prev().detach();
            // // $('#txtWorkArea').tokenInput('clear');
            // $("#txtWorkArea").tokenInput(
            //[data1], {
            //    preventDuplicates: true,
            //    theme: "facebook",
            //    onAdd: function (item) {
            //        debugger;
            //        doctorJSON_g.push(eval({ "id": item.id }));
            //    },
            //    //onDelete: function (item) {
            //    //    doctorJSON_g.remove("id", item.id);
            //    //},
            //    noResultsText: 'No Results, Press Enter to commit tag.',
            //    allowFreeTagging: true,
            //    tokenLimit: 100,
            //    searchingText: 'Please press enter to accept the tag...',
            //});

            $('#dvtxtWorkArea').empty();
            $('#dvtxtWorkArea').html('<input type="text" id="txtWorkArea" name="workarea" class="form-control" maxlength="" />');
            var WorkAreas = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Work Area(s)',
                // set true to enable the custom value support.
                allowCustomValue: isFlexiAllowed,
                maximumSelectionLength: 100,
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'
            });
            WorkAreas.appendTo('#txtWorkArea');
        } else {
            $('#dvtxtWorkArea').empty();
            $('#dvtxtWorkArea').html('<input type="text" id="txtWorkArea" name="workarea" class="form-control" maxlength="" />');
            var WorkAreas = new ej.dropdowns.MultiSelect({
                // set the countries data to dataSource property
                dataSource: data1,
                // map the appropriate columns to fields property
                fields: { text: 'name', value: 'id' },
                // set the placeholder to MultiSelect input element
                placeholder: 'Select Work Area(s)',
                // set true to enable the custom value support.
                allowCustomValue: isFlexiAllowed,
                maximumSelectionLength: 100,
                // set the type of mode for how to visualized the selected items in input element.
                mode: 'Box'
            });
            WorkAreas.appendTo('#txtWorkArea');
        }
    },
    fnWorkAreasFailureCallback: function () {

    },

    fnGetUserDetails: function (regionCode) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = CreateBeatPlan.defaults.SelectedRegionCode;
        arrDetails.push(_obj);
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetUserDetails', arrDetails, "POST", CreateBeatPlan.fnUserDetailsSuccessCallback, CreateBeatPlan.fnUserDetailsFailureCallback, null);
    },
    fnUserDetailsSuccessCallback: function (response) {
        debugger;
        if (response.length > 0) {
            CreateBeatPlan.fnGetUserPrivileges(response[0].User_Code, "LOAD");
            if (response != null && response.length == 1) {
                userCode = response[0].User_Code;
                userDetails = response;
                $('#showhide').html('Show');
                $("#dvTree").css('display', 'none');
                $('#dvCreate').css('float', 'left');
                $('#dvCreate').removeClass('col-sm-9');
                $('#dvCreate').removeClass('col-md-9');
                $('#dvCreate').addClass('col-sm-12');
                $('#dvCreate').addClass('col-md-12');
                CreateBeatPlan.fnGetUserPrivileges(response[0].User_Code, "LOAD");
            } else if (response != null && response.length > 1) {
                userCode = response[0].User_Code;
                userDetails = response;
                beatPlan_interPriv_g = "";
                beatPlan_SFCValidatPriv_g = [];
                $('#showhide').html('Show');
                $("#dvTree").css('display', 'none');
                $('#dvCreate').css('float', 'left');
                $('#dvCreate').removeClass('col-sm-9');
                $('#dvCreate').removeClass('col-md-9');
                $('#dvCreate').addClass('col-sm-12');
                $('#dvCreate').addClass('col-md-12');
                CreateBeatPlan.fnGetWorkCategories();
                // CreateBeatPlan.fnGetUserPrivileges(response[0].User_Code, "LOAD");
                //CreateBeatPlan.fnGetSFCDetails();

            }
        }

        else {
            beatPlan_interPriv_g = "";
            beatPlan_SFCValidatPriv_g = [];
            $('#showhide').html('Show');
            $("#dvTree").css('display', 'none');
            $('#dvCreate').css('float', 'left');
            $('#dvCreate').removeClass('col-sm-9');
            $('#dvCreate').removeClass('col-md-9');
            $('#dvCreate').addClass('col-sm-12');
            $('#dvCreate').addClass('col-md-12');
            CreateBeatPlan.fnGetWorkCategories();
            //$('#dvCreate').hide();
            //$("#dvTree").css('display', 'block');
            //$('#dvCreate').removeClass('col-sm-12');
            //$('#dvCreate').removeClass('col-md-12');
            //$('#dvCreate').addClass('col-sm-9');
            //$('#dvCreate').addClass('col-md-9');
            //swal('Info', 'The selected Region is Vaccant/Not Assigned.Please select a Region having User to Create Beat Plan Or Assign a User to the Region Selected.', 'info');
            //return false;
        }


    },
    fnUserDetailsFailureCallback: function (error) {

    },
    fnGetUserPrivileges: function (userCode, typeofLoad) {
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = CreateBeatPlan.defaults.SelectedRegionCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userCode";
        _obj.value = userCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "userTypeCode";
        _obj.value = CreateBeatPlan.defaults.UserTypeCode;
        arrDetails.push(_obj);
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetUserTypePrivileges', arrDetails, "POST", CreateBeatPlan.fnUserTypePrivilegesSuccessCallback, CreateBeatPlan.fnUserTypePrivilegesFailureCallback, null);
    },
    fnUserTypePrivilegesSuccessCallback: function (response) {
        debugger;
        usertypePrivilege_g = response;
        beatPlan_interPriv_g = "";
        beatPlan_SFCValidatPriv_g = "";
        var InterMediatePlaces_lcl = $.grep(usertypePrivilege_g, function (ele, index) {
            return ele.Privilege_Name == 'INTERMEDIATE_PLACES';
        });
        if (InterMediatePlaces_lcl.length > 0) {
            beatPlan_interPriv_g = InterMediatePlaces_lcl[0].Privilege_Value_Name;
        }

        var sfcValidation = $.grep(usertypePrivilege_g, function (ele, index) {
            return ele.Privilege_Name.toUpperCase() == 'SFC_VALIDATION';
        });
        var PrivilValue = [];
        if (sfcValidation.length > 0) {
            if (sfcValidation[0].Privilege_Value_Name.lastIndexOf(',') == -1) {
                PrivilValue.push(sfcValidation[0].Privilege_Value_Name);
            } else {
                PrivilValue = sfcValidation[0].Privilege_Value_Name.split(',');
            }
        }
        if (PrivilValue.length > 0) {
            beatPlan_SFCValidatPriv_g = PrivilValue;
        }
        CreateBeatPlan.fnGetWorkCategories();

    },
    fnUserTypePrivilegesFailureCallback: function (error) {

    },
    fnGetSFCDetails: function () {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = CreateBeatPlan.defaults.SelectedRegionCode;
        arrDetails.push(_obj);
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetSFCDetails', arrDetails, "POST", CreateBeatPlan.fnSFCDetailsSuccessCallback, CreateBeatPlan.fnSFCDetailsFailureCallback, null);
    },
    fnSFCDetailsSuccessCallback: function (response) {
        debugger;
        var uniqueSFCDetails = [];
        var uniqueSFCDetailsContent = [];
        var uniqueBeatName = [];
        var uniqueBeatNameDetails = [];
        var uniqueTravelMode = [];
        var uniqueTravelModeContent = [];
        var workCategoryCode = $('#ddlWorkCategory option:selected').val();
        var workCategoryName = $('#ddlWorkCategory option:selected').text();

        if (response != null && response.length > 0) {
            lstSFCDetails = response;
            var disjson = "";
            if (beatPlan_SFCValidatPriv_g != "" && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
                disjson = $.grep(lstSFCDetails, function (ele, index) {
                    return ele.Work_Category_Code == workCategoryCode;
                });
            } else {
                disjson = lstSFCDetails;
            }

            for (var i = 0; i < disjson.length; i++) {
                if ($.inArray(disjson[i].From_Region_Name, uniqueSFCDetails) == -1) {
                    uniqueSFCDetails.push(disjson[i].From_Region_Name);
                    var _obj = {
                        label: disjson[i].From_Region_Name,
                        value: disjson[i].From_Region_Name
                    };
                    uniqueSFCDetailsContent.push(_obj);
                }
                if ($.inArray(disjson[i].To_Region_Name, uniqueSFCDetails) == -1) {
                    uniqueSFCDetails.push(disjson[i].To_Region_Name);
                    var _obj = {
                        label: disjson[i].To_Region_Name,
                        value: disjson[i].To_Region_Name
                    };
                    uniqueSFCDetailsContent.push(_obj);
                }


                if ($.inArray(disjson[i].Travel_Mode, uniqueTravelMode) == -1) {
                    uniqueTravelMode.push(disjson[i].Travel_Mode);
                    var _obj = {
                        label: disjson[i].Travel_Mode,
                        value: disjson[i].Travel_Mode
                    };
                    uniqueTravelModeContent.push(_obj);
                }
            }
            for (var i = 0; i < disjson.length; i++) {
                //if ($.inArray(disjson[i].From_Region_Name, uniqueBeatName) == -1) {
                //    uniqueBeatName.push(disjson[i].From_Region_Name);
                //    var _obj = {
                //        label: disjson[i].From_Region_Name,
                //        value: disjson[i].From_Region_Name
                //    };
                //    uniqueBeatNameDetails.push(_obj);
                //}
                if ($.inArray(disjson[i].To_Region_Name, uniqueBeatName) == -1) {
                    uniqueBeatName.push(disjson[i].To_Region_Name);
                    var _obj = {
                        label: disjson[i].To_Region_Name,
                        value: disjson[i].To_Region_Name
                    };
                    uniqueBeatNameDetails.push(_obj);
                }
            }
        }
        //  if (uniqueSFCDetailsContent.length > 0) {
        uniqueSFCDetails_g = ""; uniqueTravelModeDetails_g = "";
        uniqueSFCDetails_g = uniqueSFCDetailsContent;

        uniqueBeatName_g = ""; uniqueCategoryDetails_g = "";
        uniqueBeatName_g = uniqueBeatName;

        uniqueTravelModeDetails_g = uniqueTravelModeContent;
        CreateBeatPlan.fnGetWorkAreas($("#ddlWorkCategory option:selected").val());
        CreateBeatPlan.fnSFCGrid(uniqueSFCDetailsContent, uniqueTravelModeContent, 'LOAD');

        //}

    },
    fnSFCDetailsFailureCallback: function () {

    },
    fnSFCGrid: function (SFCdata, TMdata, typeofLoad) {
        debugger;
        var content = '';
        if (typeofLoad == "LOAD") {
            gridNo = 1;
        }
        //if (SFCdata.length > 0) {
        $('#tbodySFC').empty();
        content += '<tr id="rowData_' + gridNo + '"><input type="hidden" id="hdnSFCCode_' + gridNo + '" class="form-control" />';
        content += '<td id="fromPlace_' + gridNo + '"><input type="text" id="txtFromPlace_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateAutoFillFromPlaceId(this);" /><input type="hidden" id="hdnFromPlace_' + gridNo + '" class="form-control" /><span class="badge badge-pill btn-danger" id="tooltipFromPlace_' + gridNo + '" style="display:none;" data-toggle="tooltip" data-placement="top" title="InValid From Place of the SFC.Please enter Valid From Place.">i</span></td>';
        content += '<td id="toPlace_' + gridNo + '"><input type="text" id="txtToPlace_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateAutoFillToPlaceId(this);CreateBeatPlan.fnValidateBeatPlanEntered(this);"  /><input type="hidden" id="hdnToPlace_' + gridNo + '" class="form-control"/><span class="badge badge-pill btn-danger" id="tooltipToPlace_' + gridNo + '" style="display:none;" data-toggle="tooltip" data-placement="top" title="InValid To Place of the SFC.Please enter Valid To Place.">i</span></td>';
        content += '<td id="travelMode_' + gridNo + '"><input type="text" id="txtTravelMode_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateBeatPlanEnteredAfterTravelMode(this);" /><input type="hidden" id="hdnTravelMode_' + gridNo + '" class="form-control" /><input type="hidden" id="hdnRouteWay_' + gridNo + '" /></td>';
        content += '</tr>'
        //$('#fromPlace_1').html('');
        //$('#toPlace_1').html('');
        $('#tbodySFC').html(content);
        // }

        var lstBeatNameSelected = [];
        $('#dbbeatname').empty();
        $('#dbbeatname').html(' <input type="text" id="txtBeatName" class="form-control" maxlength=""  />');
        var atcObj = new ej.dropdowns.MultiSelect({
            //set the data to dataSource property
            dataSource: uniqueBeatName_g,
            fields: { text: 'label', value: 'label' },
            //change: CUSTOMER.change,
            // set the placeholder to MultiSelect input element
            placeholder: 'Select Beat Name(s)',
            // set true to enable the custom value support.
            allowCustomValue: true,
            maximumSelectionLength: 50,
            // set the type of mode for how to visualized the selected items in input element.
            mode: 'Box',
            value: lstBeatNameSelected
        });
        atcObj.appendTo('#txtBeatName');


        var atcObj = new ej.dropdowns.ComboBox({
            //set the data to dataSource property
            dataSource: eval(SFCdata),
            fields: { text: 'label' },
            //change: CUSTOMER.change,
        });
        atcObj.appendTo('#txtFromPlace_' + gridNo + '');

        var atcObj = new ej.dropdowns.ComboBox({
            //set the data to dataSource property
            dataSource: eval(SFCdata),
            fields: { text: 'label' },
            //change: CUSTOMER.change,
        });
        atcObj.appendTo('#txtToPlace_' + gridNo + '');
        var atcObj = new ej.dropdowns.ComboBox({
            //set the data to dataSource property
            dataSource: eval(TMdata),
            fields: { text: 'label' },
            //filterBarPlaceholder: 'Search',
            //showClearButton: true,
            //allowFiltering: true,
            //placeholder: 'Select a Travel Mode',
            //filtering: function (e) {
            //    var dropdown_query = new ej.data.Query();
            //    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
            //    e.updateData(eval(TMdata), dropdown_query);
            //},
            //change: CUSTOMER.change,
        });
        atcObj.appendTo('#txtTravelMode_' + gridNo + '');
    },



    fnOnWorkCategoryChangeLoadSFC: function (value) {
        debugger;
        //var workCategoryCode = $('#ddlWorkCategory option:selected').val();
        var uniqueSFCDetails = [];
        var uniqueBeatNameDetails = [];
        var uniqueBeatname = [];
        var uniqueSFCDetailsContent = [];
        var uniqueTravelMode = [];
        var uniqueTravelModeContent = [];
        if (lstSFCDetails != "" && lstSFCDetails != null) {
            var disjson = "";
            var workCategoryName = $('#ddlWorkCategory option:selected').text();
            if (beatPlan_SFCValidatPriv_g != "" && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
                disjson = $.grep(lstSFCDetails, function (ele, index) {
                    return ele.Work_Category_Code == value;
                });
            } else {
                disjson = lstSFCDetails;
            }

            for (var i = 0; i < disjson.length; i++) {
                if ($.inArray(disjson[i].From_Region_Name, uniqueSFCDetails) == -1) {
                    uniqueSFCDetails.push(disjson[i].From_Region_Name);
                    var _obj = {
                        label: disjson[i].From_Region_Name,
                        value: disjson[i].From_Region_Name
                    };
                    uniqueSFCDetailsContent.push(_obj);
                }
                if ($.inArray(disjson[i].To_Region_Name, uniqueSFCDetails) == -1) {
                    uniqueSFCDetails.push(disjson[i].To_Region_Name);
                    var _obj = {
                        label: disjson[i].To_Region_Name,
                        value: disjson[i].To_Region_Name
                    };
                    uniqueSFCDetailsContent.push(_obj);
                }
                if ($.inArray(disjson[i].Travel_Mode, uniqueTravelMode) == -1) {
                    uniqueTravelMode.push(disjson[i].Travel_Mode);
                    var _obj = {
                        label: disjson[i].Travel_Mode,
                        value: disjson[i].Travel_Mode
                    };
                    uniqueTravelModeContent.push(_obj);
                }
            }

            for (var i = 0; i < disjson.length; i++) {
                //if ($.inArray(disjson[i].From_Region_Name, uniqueBeatNameDetails) == -1) {
                //    uniqueBeatNameDetails.push(disjson[i].From_Region_Name);
                //    var _obj = {
                //        label: disjson[i].From_Region_Name,
                //        value: disjson[i].From_Region_Name
                //    };
                //    uniqueBeatNameDetails.push(_obj);
                //}
                if ($.inArray(disjson[i].To_Region_Name, uniqueBeatNameDetails) == -1) {
                    uniqueBeatname.push(disjson[i].To_Region_Name);
                    var _obj = {
                        label: disjson[i].To_Region_Name,
                        value: disjson[i].To_Region_Name
                    };
                    uniqueBeatNameDetails.push(_obj);
                }
            }


        }
        //if (uniqueSFCDetailsContent.length > 0) {
        uniqueSFCDetails_g = ""; uniqueTravelModeDetails_g = "";
        uniqueSFCDetails_g = uniqueSFCDetailsContent;

        uniqueBeatName_g = ""; uniqueCategoryDetails_g = "";
        uniqueBeatName_g = uniqueBeatNameDetails;
        uniqueTravelModeDetails_g = uniqueTravelModeContent;
        CreateBeatPlan.fnSFCGrid(uniqueSFCDetailsContent, uniqueTravelModeContent, 'LOAD');
        //}
        CreateBeatPlan.fnGetWorkAreas(value);
    },

    fnaddCustomBeatName: function (tmpBeatName) {
        debugger;
        var BtName =
            {
                label: tmpBeatName[0],
                value: tmpBeatName[0]
            }

        var arr = [];

        var BtNameList = $.grep(uniqueBeatName_g, function (ele) {
            return ele.label != BtName;
        });
        for (var i = 0; i < BtNameList.length; i++) {
            var _obj = {
                label: BtNameList[i].label,
                value: BtNameList[i].value
            }

            arr.push(_obj);
        }
        arr.push(BtName);
        uniqueBeatName_g = arr;
    },


    fnValidateAutoFillFromPlaceId: function (Id) {
        debugger;
        var fromPlaceName = $('#' + Id.id).val();
        var rowId = Id.id.split('_')[1];
        if (fromPlaceName != "" && uniqueSFCDetails_g.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < uniqueSFCDetails_g.length; o++) {
                if (uniqueSFCDetails_g[o].label == fromPlaceName) {
                    i = true;
                    s = uniqueSFCDetails_g[o].value;
                }
            }
            if (!i) {
                $("#hdnFromPlace_" + rowId).val(0);
            }
            else {
                $("#hdnFromPlace_" + rowId).val(s);
            }
            var disjson = "";
            disjson = $.grep(lstSFCDetails, function (ele, index) {
                return ele.From_Region_Name == fromPlaceName;
            });
            if (disjson.length == 0) {
                disjson = $.grep(lstSFCDetails, function (ele, index) {
                    return ele.To_Region_Name == fromPlaceName;
                });
            }
            if (disjson.length == 0) {
                $('#tooltipFromPlace_' + rowId).hide();
            }
            else {
                $("#hdnFromPlace_" + rowId).val(0);
                $('#tooltipFromPlace_' + rowId).hide();
            }
        } else {
            $("#hdnFromPlace_" + rowId).val(0);
            $('#tooltipFromPlace_' + rowId).hide();
        }
    },
    fnValidateAutoFillToPlaceId: function (Id) {
        var toPlaceName = $('#' + Id.id).val();
        var rowId = Id.id.split('_')[1];
        if (toPlaceName != "" && uniqueSFCDetails_g.length > 0) {
            var i = false;
            var s = "";

            for (var o = 0; o < uniqueSFCDetails_g.length; o++) {
                if (uniqueSFCDetails_g[o].label == toPlaceName) {
                    i = true;
                    s = uniqueSFCDetails_g[o].value;
                }
            }
            if (!i) {
                $("#hdnToPlace_" + rowId).val(0);
            }
            else {
                $("#hdnToPlace_" + rowId).val(s);
            }
            var disjson = "";
            disjson = $.grep(lstSFCDetails, function (ele, index) {
                return ele.From_Region_Name == toPlaceName;
            });
            if (disjson.length == 0) {
                disjson = $.grep(lstSFCDetails, function (ele, index) {
                    return ele.To_Region_Name == toPlaceName;
                });
            }
            if (disjson.length == 0) {
                $('#tooltipToPlace_' + rowId).hide();
            }
            else {
                $("#hdnToPlace_" + rowId).val(0);
                $('#tooltipToPlace_' + rowId).hide();
            }
        } else {
            $("#hdnToPlace_" + rowId).val(0);
            $('#tooltipToPlace_' + rowId).hide();
        }
    },
    fnValidateBeatPlanEnteredAfterTravelMode: function (Id) {
        var rowId = Id.id.split('_')[1];
        var fromPlace = $('#txtFromPlace_' + rowId).val();
        var toPlace = $('#txtToPlace_' + rowId).val();
        var workCategoryCode = $('#ddlWorkCategory option:selected').val();
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        var disjson = "";

        var travelMode = $('#hdnRouteWay_' + rowId).val()
        disjson = $.grep(lstSFCDetails, function (ele, index) {
            return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace && ele.Travel_Mode == travelMode && ele.Work_Category_Code == workCategoryCode;
        });
        if (fromPlace != null && fromPlace != "" && toPlace != "" && toPlace != null) {
            if (disjson != null && disjson.length > 0) {
                $('#hdnSFCCode_' + rowId).val(disjson[0].Distance_Fare_Code);
                $('#hdnRouteWay_' + rowId).val(isDirectorReturn);
                CreateBeatPlan.fnAddSFCGrid(Id);
            }
            else {
                $('#hdnSFCCode_' + rowId).val(0);
            }
        }

    },
    fnValidateBeatPlanEntered: function (Id) {
        debugger;
        var rowId = Id.id.split('_')[1];
        var fromPlace = $('#txtFromPlace_' + rowId).val();
        var toPlace = $('#txtToPlace_' + rowId).val();
        var workCategoryCode = $('#ddlWorkCategory option:selected').val();
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        var disjson = "";

        var isDirectorReturn = "";
        disjson = $.grep(lstSFCDetails, function (ele, index) {
            return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace;
        });
        isDirectorReturn = "D";
        if (disjson.length == 0) {
            disjson = $.grep(lstSFCDetails, function (ele, index) {
                return ele.From_Region_Name == toPlace && ele.To_Region_Name == fromPlace;
            });
            if (disjson.length == 0) {
                isDirectorReturn = "D";

            } else {
                isDirectorReturn = "R";
            }
        }


        if (fromPlace != null && fromPlace != "" && toPlace != "" && toPlace != null) {
            if (disjson != null && disjson.length > 0) {

                var TMdisjson = $.grep(uniqueTravelModeDetails_g, function (ele, index) {
                    return ele.label == disjson[0].Travel_Mode;
                });

                $('#txtTravelMode_' + rowId).val(TMdisjson[0].label);
                $('#hdnSFCCode_' + rowId).val(disjson[0].Distance_Fare_Code);
                $('#hdnRouteWay_' + rowId).val(isDirectorReturn);
                CreateBeatPlan.fnAddSFCGrid(Id);
            }
            else {
                $('#hdnSFCCode_' + rowId).val(0);
                $('#txtTravelMode_' + rowId).val('');
            }
        }
        var intermediatePlacearr = [];
        if (beatPlan_interPriv_g.lastIndexOf(',') > -1) {
            intermediatePlacearr = beatPlan_interPriv_g.split(',');
        } else {
            intermediatePlacearr.push(beatPlan_interPriv_g);
        }
        if ($.inArray(workCategoryName, intermediatePlacearr) > -1 && workCategoryName.toUpperCase() != "HQ") {
            $('#txtFromPlace_' + (parseInt(rowId) + parseInt(1))).val(toPlace);
        }
    },
    fnAddSFCGrid: function (Id) {
        var content = '';
        var rowId = Id.id.split('_')[1];
        var toPlacePrevious = $('#txtToPlace_' + rowId).val();
        var intermediatePlacearr = [];
        if (beatPlan_interPriv_g.lastIndexOf(',') > -1) {
            intermediatePlacearr = beatPlan_interPriv_g.split(',');
        } else {
            intermediatePlacearr.push(beatPlan_interPriv_g);
        }
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        if ($.inArray(workCategoryName, intermediatePlacearr) > -1 && workCategoryName.toUpperCase() != "HQ") {
            if (rowId == gridNo) {
                gridNo = gridNo + 1;
                if (toPlacePrevious != "" && toPlacePrevious != null && toPlacePrevious != undefined) {
                    content += '<tr id="rowData_' + gridNo + '"><input type="hidden" id="hdnSFCCode_' + gridNo + '" class="form-control" />';
                    content += '<td id="fromPlace_' + gridNo + '"><input type="text" id="txtFromPlace_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateAutoFillFromPlaceId(this);" /><input type="hidden" id="hdnFromPlace_' + gridNo + '" class="form-control" /><span class="badge badge-pill btn-danger" id="tooltipFromPlace_' + gridNo + '" style="display:none;" data-toggle="tooltip" data-placement="top" title="InValid From Place of the SFC.Please enter Valid From Place.">i</span></td>';
                    content += '<td id="toPlace_' + gridNo + '"><input type="text" id="txtToPlace_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateAutoFillToPlaceId(this);CreateBeatPlan.fnValidateBeatPlanEntered(this);" /><input type="hidden" id="hdnToPlace_' + gridNo + '" class="form-control"/><span class="badge badge-pill btn-danger" id="tooltipToPlace_' + gridNo + '" style="display:none;" data-toggle="tooltip" data-placement="top" title="InValid To Place of the SFC.Please enter Valid To Place.">i</span></td>';
                    content += '<td id="travelMode_' + gridNo + '"><input type="text" id="txtTravelMode_' + gridNo + '" class="form-control" onblur="CreateBeatPlan.fnValidateBeatPlanEnteredAfterTravelMode(this);" /><input type="hidden" id="hdnTravelMode_' + gridNo + '" class="form-control" /><input type="hidden" id="hdnRouteWay_' + gridNo + '" /></td>';
                    content += '</tr>';
                    $('#tbodySFC').append(content);
                    //var atcObj = new ej.dropdowns.ComboBox({
                    //    //set the data to dataSource property
                    //    dataSource: eval(uniqueSFCDetails_g),
                    //    fields: { text: 'label' },
                    //    //change: CUSTOMER.change,
                    //});
                    //atcObj.appendTo('#beatname');




                    var atcObj = new ej.dropdowns.ComboBox({
                        //set the data to dataSource property
                        dataSource: eval(uniqueSFCDetails_g),
                        fields: { text: 'label' },
                        //change: CUSTOMER.change,
                    });
                    atcObj.appendTo('#txtFromPlace_' + gridNo + '');

                    var atcObj = new ej.dropdowns.ComboBox({
                        //set the data to dataSource property
                        dataSource: eval(uniqueSFCDetails_g),
                        fields: { text: 'label' },
                        //change: CUSTOMER.change,
                    });
                    atcObj.appendTo('#txtToPlace_' + gridNo + '');

                    var atcObj = new ej.dropdowns.ComboBox({
                        //set the data to dataSource property
                        dataSource: eval(uniqueTravelModeDetails_g),
                        fields: { text: 'label' },
                        //filterBarPlaceholder: 'Search',
                        //showClearButton: true,
                        //allowFiltering: true,
                        //placeholder: 'Select a Travel Mode',
                        //filtering: function (e) {
                        //    var dropdown_query = new ej.data.Query();
                        //    dropdown_query = (e.text !== '') ? dropdown_query.where('label', 'contains', e.text, true) : dropdown_query;
                        //    e.updateData(eval(uniqueTravelModeDetails_g), dropdown_query);
                        //},
                        //change: CUSTOMER.change,
                    });
                    atcObj.appendTo('#txtTravelMode_' + gridNo + '');

                    $('#txtFromPlace_' + gridNo).val(toPlacePrevious);
                }
            }
            else {
                $('#txtFromPlace_' + (rowId + 1)).val(toPlacePrevious);
            }

        }

    },
    fnClearControls: function () {
        debugger;
        $.blockUI();
        //$('#txtWorkArea').tokenInput('clear');
        $("#txtWorkArea").prev().detach();
        $('#txtBeatName').val('');
        $('#ddlWorkCategory').val(-1)
        $("#ddlWorkCategory option").each(function () {
            if ($(this).text() == "HQ") {
                $(this).attr('selected', 'selected');
            }
        });
        //  CreateBeatPlan.fnGetWorkAreas($("#ddlWorkCategory option:selected").val());
        $('#hdnHeaderId_1').attr('checked', true);
        $('#hdnHeaderId_1').attr('disabled', false);
        $('#hdnHeaderId_2').attr('disabled', false);
        $('#hdnHeaderId_0').attr('disabled', false);
        $('#tbodySFC').empty();
        $('#hdnMode').val('INSERT');
        $('#txtBeatName').attr('disabled', false);
        $('#hdnbeatCode').val(0);
        $("#txtWeeknumber").val(-1);
        $("#txtWeekday").val(-1);
        $('input[name="BeatPlansStatus"]').attr('checked', false);
        $('input[name="BeatPlansStatus"][value="1"]').attr('checked', true);
        var beatStatus = "";
        $('input[name="BeatPlansStatus"]:checked').each(function () {
            beatStatus += $(this).next().text() + ',';
        });
        beatStatus = beatStatus.slice(0, -1);
        $('#spanStatus').html(beatStatus);
        CreateBeatPlan.fnGetSFCDetails();
        CreateBeatPlan.fnGetBeatPlanDetails('S');
        $.unblockUI();
    },
    fnValidateBeatCreation: function () {
        debugger;
        var isValid = true;
        if ($("select[name='txtBeatName']").val() == "" || $("select[name='txtBeatName']").val() == null || $("select[name='txtBeatName']").val() == undefined) {
            swal('Info', 'Please enter Beat/Patch Plan Name.', 'info');
            isValid = false;
            return isValid;
        }
        if ($("select[name='txtBeatName']").val() != "" || $("select[name='txtBeatName']").val() != null || $("select[name='txtBeatName']").val() != undefined) {
            if ($("select[name='txtBeatName']").val().length > 50) {
                swal('Info', 'Please enter Beat/Patch Plan Name less than 50 Characters.', 'info');
                isValid = false;
                return isValid;
            }
            var isNotHavingSplChar = CreateBeatPlan.fnValidateSpecialCharacter($("select[name='txtBeatName']").val());
            if (!isNotHavingSplChar) {
                swal('Info', 'Only (a-z A-Z 0-9 (){}@[]\/.,-_:;!?) Special Character(s) are allowed in the field Beat/Patch Plan Name.', 'info');
                isValid = false;
                return isValid;
            }
        }
        if ($('#ddlWorkCategory option:selected').val() == 0) {
            swal('Info', 'Please select Work Category.', 'info');
            isValid = false;
            return isValid;
        }
        var workareaArr = $('select[name="workarea"]').val();
        if (workareaArr == null || workareaArr.length == 0) {
            swal('Info', 'Please enter atleast one Work Area.', 'info');
            isValid = false;
            return isValid;
        }
        //if ($('select[name="weeknumber"]').val() == "") {
        //    swal('Info', 'Please select week number.', 'info');
        //    isValid = false;
        //    return isValid;
        //}
        //if ($('select[name="weekday"]').val() == "") {
        //    swal('Info', 'Please select week day.', 'info');
        //    isValid = false;
        //    return isValid;
        //}
        debugger;
        var beatname = $("select[name='txtBeatName']").val();
        var workCategoryCode = $('#ddlWorkCategory option:selected').val();
        var workCategoryName = $('#ddlWorkCategory option:selected').text();
        if (beatPlan_SFCValidatPriv_g != "" && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {

            disbeatplan = $.grep(uniqueBeatName_g, function (ele, index) {
                return ele == beatname;
            });
            disbeatplan_g = $.grep(uniqueBeatName_g, function (ele, index) {
                return ele.label == beatname;
            });
            if (disbeatplan.length == 0 && disbeatplan_g.length == 0) {
                swal('Info', 'Please enter Valid Beat Name.', 'info');
                isValid = false;
                return isValid;
            }
        }

        var SFCDetails = $('#tbodySFC tr');
        var lstSFCDetails_lcl = [];
        for (var i = 0; i < SFCDetails.length; i++) {
            var rowId = SFCDetails[i].id.split('_')[1];
            var fromPlace = $('#txtFromPlace_' + rowId).val();
            var toPlace = $('#txtToPlace_' + rowId).val();
            var travelMode = $('#txtTravelMode_' + rowId).val();
            if (fromPlace != null && fromPlace != "" && fromPlace != undefined && toPlace != "" && toPlace != null && toPlace != undefined) {
                var disjson = "";
                if (beatPlan_SFCValidatPriv_g != "" && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
                    disjson = $.grep(lstSFCDetails, function (ele, index) {
                        return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace && ele.Work_Category_Code == workCategoryCode && ele.Travel_Mode == travelMode;
                    });
                    if (disjson.length == 0) {
                        disjson = $.grep(lstSFCDetails, function (ele, index) {
                            return ele.To_Region_Name == fromPlace && ele.From_Region_Name == toPlace && ele.Work_Category_Code == workCategoryCode && ele.Travel_Mode == travelMode;
                        });
                    }
                    if (disjson.length == 0) {
                        swal('Info', 'Please enter Valid SFC Route.', 'info');
                        isValid = false;
                        return isValid;
                    } else {
                        var _Obj = {};
                        _Obj.From_Place = fromPlace;
                        _Obj.To_Place = toPlace;
                        _Obj.SFC_Code = disjson[0].Distance_Fare_Code;
                        _Obj.Travel_Mode = disjson[0].Travel_Mode;
                        _Obj.Work_Category_Code = workCategoryCode;
                        lstSFCDetails_lcl.push(_Obj);
                    }
                } else {
                    disjson = $.grep(lstSFCDetails, function (ele, index) {
                        return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace && ele.Travel_Mode == travelMode;
                    });
                    if (disjson.length == 0) {
                        disjson = $.grep(lstSFCDetails, function (ele, index) {
                            return ele.To_Region_Name == fromPlace && ele.From_Region_Name == toPlace && ele.Travel_Mode == travelMode;
                        });
                    }
                    if (disjson.length == 0) {
                        swal('Info', 'Please enter Valid SFC Route.', 'info');
                        isValid = false;
                        return isValid;
                    } else {
                        var _Obj = {};
                        _Obj.From_Place = fromPlace;
                        _Obj.To_Place = toPlace;
                        _Obj.SFC_Code = disjson[0].Distance_Fare_Code;
                        _Obj.Travel_Mode = disjson[0].Travel_Mode;
                        _Obj.Work_Category_Code = workCategoryCode;
                        lstSFCDetails_lcl.push(_Obj);
                    }
                    //var _Obj = {};
                    //_Obj.From_Place = fromPlace;
                    //_Obj.To_Place = toPlace;
                    //_Obj.SFC_Code = 0;
                    //_Obj.Travel_Mode = travelMode;
                    //_Obj.Work_Category_Code = workCategoryCode;
                    //lstSFCDetails_lcl.push(_Obj);
                }
                //else {
                //    disjson = $.grep(lstSFCDetails, function (ele, index) {
                //        return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace;
                //    });
                //    if (disjson.length == 0) {
                //        disjson = $.grep(lstSFCDetails, function (ele, index) {
                //            return ele.To_Region_Name == fromPlace && ele.From_Region_Name == toPlace;
                //        });
                //    }
                //}

                if (!isValid) {
                    isValid = false;
                    return isValid;
                }
            }
        }
        if (lstSFCDetails_lcl.length == 0) {
            swal('Info', 'Please enter atleast one SFC Route.', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },



    fnSaveBeat: function () {
        debugger;
        var BeatName = $("select[name='txtBeatName']").val();
        CreateBeatPlan.fnaddCustomBeatName(BeatName);
        var result = CreateBeatPlan.fnValidateBeatCreation();
        if (result) {
            $.blockUI();
            //var BeatName = $("select[name='txtBeatName']").val();
            var workCategoryCode = $('#ddlWorkCategory option:selected').val();
            var workCategoryName = $('#ddlWorkCategory option:selected').text();
            var workArea = "";
            var lstworkAreas = $('select[name="workarea"]').val();
            var lstWorkArea = [];
            for (var i = 0; i < lstworkAreas.length; i++) {
                var _Obj = {
                    Company_Code: CreateBeatPlan.defaults.CompanyCode,
                    Company_Id: CreateBeatPlan.defaults.CompanyId,
                    Region_Code: CreateBeatPlan.defaults.SelectedRegionCode,
                    Work_Area: lstworkAreas[i],
                    Created_By: CreateBeatPlan.defaults.UserCode
                };
                lstWorkArea.push(_Obj);
                workArea += lstworkAreas[i];
                if (i < lstworkAreas.length - 1) {
                    workArea += ',';
                }
            }
            var lstSFCDetails_lcl = [];
            var SFCDetails = $('#tbodySFC tr');
            var workCategoryCode = $('#ddlWorkCategory option:selected').val();
            for (var i = 0; i < SFCDetails.length; i++) {
                var rowId = SFCDetails[i].id.split('_')[1];
                var fromPlace = $('#txtFromPlace_' + rowId).val();
                var toPlace = $('#txtToPlace_' + rowId).val();
                var travelMode = $('#txtTravelMode_' + rowId).val();
                if (fromPlace != null && fromPlace != "" && fromPlace != undefined && toPlace != "" && toPlace != null && toPlace != undefined) {
                    var disjson = "";
                    if (beatPlan_SFCValidatPriv_g != "" && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
                        disjson = $.grep(lstSFCDetails, function (ele, index) {
                            return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace && ele.Work_Category_Code == workCategoryCode && ele.Travel_Mode == travelMode;
                        });
                        if (disjson.length == 0) {
                            disjson = $.grep(lstSFCDetails, function (ele, index) {
                                return ele.To_Region_Name == fromPlace && ele.From_Region_Name == toPlace && ele.Work_Category_Code == workCategoryCode && ele.Travel_Mode == travelMode;
                            });
                        }
                    }
                    else {
                        disjson = $.grep(lstSFCDetails, function (ele, index) {
                            return ele.From_Region_Name == fromPlace && ele.To_Region_Name == toPlace && ele.Travel_Mode == travelMode;
                        });
                        if (disjson.length == 0) {
                            disjson = $.grep(lstSFCDetails, function (ele, index) {
                                return ele.To_Region_Name == fromPlace && ele.From_Region_Name == toPlace && ele.Travel_Mode == travelMode;
                            });
                        }
                    }

                    var distanceFareCode = "";
                    if (disjson.length > 0) {
                        distanceFareCode = disjson[0].Distance_Fare_Code;
                    } else {
                        distanceFareCode = 0
                    }
                    // distanceFareCode = $('#hdnSFCCode_' + rowId).val();
                    var _Obj = {};
                    if ($('#hdnRouteWay_' + rowId).val() == "D") {
                        _Obj.From_Region_Name = fromPlace;
                        _Obj.To_Region_Name = toPlace;
                    }
                    else if ($('#hdnRouteWay_' + rowId).val() == "R") {
                        _Obj.From_Region_Name = fromPlace;
                        _Obj.From_Region_Name = toPlace;
                        _Obj.To_Region_Name = fromPlace;
                    } else {
                        _Obj.From_Region_Name = fromPlace;
                        _Obj.To_Region_Name = toPlace;
                    }
                    _Obj.Distance_Fare_Code = distanceFareCode;
                    _Obj.Travel_Mode = travelMode;
                    _Obj.Route_Way = $('#hdnRouteWay_' + rowId).val()
                    _Obj.Work_Category_Code = workCategoryCode;
                    _Obj.Region_Code = CreateBeatPlan.defaults.SelectedRegionCode;
                    _Obj.Company_Code = CreateBeatPlan.defaults.CompanyCode;
                    _Obj.Company_Id = CreateBeatPlan.defaults.CompanyId;
                    _Obj.Created_By = CreateBeatPlan.defaults.UserCode;
                    lstSFCDetails_lcl.push(_Obj);
                }
            }
            var _ObjBeat = {
                Beat_Name: BeatName[0],
                Work_Category_Code: workCategoryCode,
                Work_Category_Name: workCategoryName,
                Work_Area: workArea,
                Mode: $('#hdnMode').val(),
                Beat_Code: $('#hdnbeatCode').val(),
                Region_Code: CreateBeatPlan.defaults.SelectedRegionCode,
                Company_Code: CreateBeatPlan.defaults.CompanyCode,
                Company_Id: CreateBeatPlan.defaults.CompanyId,
                Created_By: CreateBeatPlan.defaults.UserCode,
                lst_SFCDetails: lstSFCDetails_lcl,
                lst_WorkArea: lstWorkArea
                //Weeknumber: $('select[name="weeknumber"]').val(),
                //Weekday: $('select[name="weekday"]').val()
            };
            var arrDetails = new Array();
            var _objData = {};
            _objData.name = "companyCode";
            _objData.value = CreateBeatPlan.defaults.CompanyCode;
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "regionCode";
            _objData.value = CreateBeatPlan.defaults.SelectedRegionCode;
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "Weeknumber";
            _objData.value = $("#txtWeeknumber").val();
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "Weekday";
            _objData.value = $("#txtWeekday").val();
            arrDetails.push(_objData);



            _objData = {};
            _objData.name = "_ObjBeatData";
            _objData.value = JSON.stringify(_ObjBeat);
            arrDetails.push(_objData);
            HDAjaxAysnc.requestInvoke('BeatPlan', 'InsertBeatPlanDetails', arrDetails, "POST", CreateBeatPlan.fnInsertBeatPlanDetailsSuccessCallback, CreateBeatPlan.fnInsertBeatPlanFailureCallback, null);
        }
    },
    fnInsertBeatPlanDetailsSuccessCallback: function (response) {
        debugger;
        if (response != null) {
            if (response.Status_Message) {
                swal('Success', '' + response.Message.split(':')[1] + '', 'success');
                CreateBeatPlan.fnClearControls();
            } else {
                swal('Info', '' + response.Message.split(':')[1] + '', 'info');
            }
        }
        $.unblockUI();
    },
    fnInsertBeatPlanFailureCallback: function (error) {
        $.unblockUI();
    },
    fnValidateSpecialCharacter: function (value) {
        var specialCharregex = new RegExp("^[a-zA-Z0-9-_.,/ ]+$");
        if (!specialCharregex.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },


    //Beat Or Patch Plan Summary

    fnLoadDates: function () {
        debugger;
        var today = new Date();
        var cdd = today.getDay();
        var cmm = today.getMonth() + 1;
        var cyy = today.getFullYear();
        var curr_date = cdd + '/' + cmm + '/' + cyy;

        var previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 90);
        var pdd = previousDate.getDate();
        var pmm = previousDate.getMonth() + 1;
        var pyy = previousDate.getFullYear();
        var PreviousDate = pdd + '/' + pmm + '/' + pyy;
        $('#txtFrom').val(curr_date);
        $('#txtTo').val(PreviousDate);
    },
    fnValidateGetBeatPlanDetailsInputs: function () {
        debugger;
        var isValid = true;
        if ($('input[name="BeatPlansStatus"]:checked').length == 0) {
            swal('Info', 'Please select Status to List Beat/Patch Plan Data.', 'info');
            isValid = false;
            return isValid;
        }
        return isValid;
    },
    fnGetBeatPlanDetails: function (value) {
        debugger;
        var result = CreateBeatPlan.fnValidateGetBeatPlanDetailsInputs();
        if (result) {
            var beatStatus = "";
            $('input[name="BeatPlansStatus"]:checked').each(function () {
                beatStatus += $(this).val() + ',';
            });
            var arrDetails = new Array();
            var _objData = {};
            _objData.name = "companyCode";
            _objData.value = CreateBeatPlan.defaults.CompanyCode;
            arrDetails.push(_objData);

            _objData = {};
            _objData.name = "regionCode";
            _objData.value = CreateBeatPlan.defaults.SelectedRegionCode;
            arrDetails.push(_objData);


            _objData = {};
            _objData.name = "beatStatus";
            _objData.value = beatStatus;
            arrDetails.push(_objData);
            $.blockUI();
            HDAjaxAysnc.requestInvoke('BeatPlan', 'GetBeatPlanDetails', arrDetails, "POST", CreateBeatPlan.fnGetBeatPlanDetailsSuccessCallback, CreateBeatPlan.fnGetBeatPlanDetailsFailureCallback, null);
        }
    },
    fnGetBeatPlanDetailsSuccessCallback: function (response) {
        debugger;
        if (response != null && response.length > 0) {
            $('#divReport').html("");
            var data = response;
            var grid = new ej.grids.Grid({
                dataSource: data,
                toolbar: ['Search'],
                showColumnChooser: true,
                allowTextWrap: true,
                allowResizing: true,
                //allowFiltering: true,
                allowSorting: true,
                allowPaging: true,
                allowGrouping: true,
                allowScrolling: true,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 30, 40, 50], pageCount: 10 },
                height: 400,
                columns: [
                    { headerText: 'Edit', template: "<a herf=#;>Edit</a>", width: 150, textAlign: 'center' },
                    { field: 'Beat_Name', headerText: 'Beat/Patch Name', textAlign: 'center' },
                    { field: 'Work_Category_Name', headerText: 'Work Category Name', textAlign: 'center' },
                    { headerText: 'View Details', template: "<a herf=#;>View Details</a>", width: 150, textAlign: 'center' },
                    { field: 'Beat_Status', headerText: 'Status', textAlign: 'center' },
                    { field: 'Created_By', headerText: 'Created By', textAlign: 'center' },
                    { field: 'Created_DateTime', headerText: 'Created Date', format: 'yMd', textAlign: 'center' },
                    { headerText: 'History Details', template: "<a herf=#;>History Details</a>", width: 150, textAlign: 'center' },
                ],
                queryCellInfo: CreateBeatPlan.fnQueryCellInfo,
            });
            grid.appendTo('#divReport');
        } else {
            var content = '<div id="norecordAlert"><div class="alert alert-info text-center" role="alert">No Records Found.</div></div>';
            $('#divReport').html(content);
        }
        $('#divReport').show();
        $.unblockUI();
    },
    fnGetBeatPlanDetailsFailureCallback: function (error) {

    },
    fnQueryCellInfo: function (args) {
        if (args.column.headerText == "Edit") {
            if (args.data.Status != "2") {
                args.cell.style.cursor = "pointer";
                args.cell.style.textDecoration = "underline";
                args.cell.style.color = "blue";
                args.cell.textAlign = 'center';
                args.cell.innerHTML = "<a href='#' onclick='CreateBeatPlan.fnEditBeat(\"" + args.data.Beat_Code + "\",\"" + args.data.Region_Code + "\");'>Edit</a>"
            } else {
                args.cell.innerHTML = "<a></a>"
            }
        }
        if (args.column.headerText == "View Details") {
            // if (args.data.SFC_Details_Count > 0) {
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.style.color = "blue";
            args.cell.textAlign = 'center';
            args.cell.innerHTML = "<a href='#' onclick='CreateBeatPlan.fnViewBeatDetails(\"" + args.data.Beat_Code + "\",\"" + args.data.Region_Code + "\");'>View Details</a>"
            //} else {
            //    args.cell.innerHTML = "<a></a>"
            //}
        }
        if (args.column.headerText == "History Details") {
            args.cell.style.cursor = "pointer";
            args.cell.style.textDecoration = "underline";
            args.cell.style.color = "blue";
            args.cell.textAlign = 'center';
            args.cell.innerHTML = "<a href='#' onclick='CreateBeatPlan.fnViewHistoryDetails(\"" + args.data.Beat_Code + "\",\"" + args.data.Region_Code + "\");'>View Details</a>"
        }
        if (args.column.headerText == "Status") {
            var status = args.data.Status;
            var colorcode = CreateBeatPlan.fnGetColorCode(status);
            args.cell.style.backgroundColor = colorcode;
        }
    },
    fnGetColorCode: function (status) {
        var style = "";
        debugger;
        switch (status) {
            case "1":
                style = "#85b385";
                break;
            case "2":
                style = "#6495ed";
                break;
            case "0":
                style = "#e55045";
                break;
            default:
                style = "#fff";
                break;
        }
        return style;
    },


    fnViewBeatDetails: function (beatCode, regionCode) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
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
        $.blockUI();
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetBeatWiseDetails', arrDetails, "POST", CreateBeatPlan.fnViewBeatDetailsSuccessCallback, CreateBeatPlan.fnViewBeatDetailsFailureCallback, null);
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
                content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Area</label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstHeader[0].Work_Area + '</label>';
                content += '</div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Status </label>';
                content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname">' + response.lstHeader[0].Beat_Status + ' </label></div>';
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Week Number </label>';
                if (response.lstHeader[0].WeekNumber != 0) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname">' + response.lstHeader[0].WeekNumber + ' </label></div>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname"> - </label></div>';
                }
                content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Week Day </label>';
                if (response.lstHeader[0].Weekday != null) {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname">' + response.lstHeader[0].Weekday + ' </label></div>';
                }
                else {
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname " id="localareaname"> - </label></div>';
                }
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
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="CreateBeatPlan.fnViewDetails(\'' + response.lstDoctors[i].Region_Code + '\',\'' + response.lstDoctors[i].Customer_Code + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstDoctors[i].First_Name + '  ' + response.lstDoctors[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Doctor Name to View Details." id="testDocPop_' + i + '"></i>';
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
                        var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstDoctors[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstDoctors[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1" id="dvhideDoctbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true"  id="ifadochide_' + i + '" onclick="CreateBeatPlan.fnHidetheDiv(\'' + i + '\',\'' + response.lstDoctors[i].Customer_Entity_Type + '\');"></i>';
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
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="CreateBeatPlan.fnViewDetails(\'' + response.lstChemists[i].Region_Code + '\',\'' + response.lstChemists[i].Customer_Code + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstChemists[i].First_Name + '  ' + response.lstChemists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Chemist Name to View Details." id="testChemPop_' + i + '"></i>';
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
                        var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstChemists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstChemists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-right col-1"  id="dvhideChembutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaChemhide_' + i + '" onclick="CreateBeatPlan.fnHidetheDiv(\'' + i + '\',\'' + response.lstChemists[i].Customer_Entity_Type + '\');"></i>';
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
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1 btn-link show_Data"onclick="CreateBeatPlan.fnViewDetails(\'' + response.lstStockists[i].Region_Code + '\',\'' + response.lstStockists[i].Customer_Code + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\',\'' + i + '\');" >' + response.lstStockists[i].First_Name + '  ' + response.lstStockists[i].Last_Name + '</label><i class="fa fa-info-circle testB px-2" data-toggle="tooltip" data-placement="top" title="Please click Stockist Name to View Details." id="testStockistPop_' + i + '"></i>';
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
                        var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstStockists[i].Customer_Status);
                        content += '<label for="staticEmail" class="col-sm-6 col-6 col-form-label p-0 datalabel1"><span class="badge ' + badgeDetails + '">' + response.lstStockists[i].Customer_Status_Text + '</span></label>';
                        content += '</div>';
                        content += '</div>';
                        content += '<div class="p-2 flex-fill bd-highlight flex border-righ col-1" id="dvhideStockistbutton_' + i + '" style="display:none;">';
                        content += '<div class="form-group row no-gutters m-0">';
                        content += '<i class="fa fa-minus" aria-hidden="true" id="ifaStochide_' + i + '" onclick="CreateBeatPlan.fnHidetheDiv(\'' + i + '\',\'' + response.lstStockists[i].Customer_Entity_Type + '\');"></i>';
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
        $.unblockUI();
        $('#beatModal').modal('hide');

    },
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
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
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
        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetEntityWiseDetails', arrDetails, "POST", CreateBeatPlan.fnViewDetailsSuccessCallback, CreateBeatPlan.fnViewDetailsFailureCallback, null);
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
                    content += '<div class="col-sm-8 row">';

                    content += '<div class="col-sm-6">';

                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">First Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].First_Name + '</label>';
                    content += '</div>';

                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Last Name :</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Last_Name + '</label>';
                    content += '</div>';

                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category</label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Category_Name + '</label>';
                    content += '</div>';


                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Speciality </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response.lstDoctor[0].Speciality_Name + ' </label>';
                    content += '</div>';

                    content += '</div>';

                    content += '<div class="col-sm-6">';

                    content += '<div class="form-group row no-gutters">';
                    content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Status </label>';
                    content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">';
                    var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstDoctor[0].Customer_Status);
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
                    content += '</div>';

                    if (response.lstAddress.length > 0) {
                        content += '<div class="card mb-3">';
                        content += '<div class="card-header bg-info text-white">Communication Info</div>';
                        content += '<div class="card-body">';
                        content += '<div class="card-columns1">';
                        for (var i = 0; i < response.lstAddress.length; i++) {
                            content += '<div class="card  mt-3">';
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
                            content += '<div class="card  mt-3">';
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



                        content += '<div class="card mb-3">';
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
                    var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstChemist[0].Customer_Status);
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
                            content += '</div>';

                        }
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';

                    }
                    if (response.lstChemist.length > 0) {

                        content += '<div class="card mb-3">';
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
                    var badgeDetails = CreateBeatPlan.fnGetBadgeName(response.lstStockist[0].Customer_Status);
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
    fnEditBeat: function (beatCode, regionCode) {
        debugger;
        $.blockUI();
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatCode";
        _obj.value = beatCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatType";
        _obj.value = "BEAT";
        arrDetails.push(_obj);

        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetBeatWiseDetails', arrDetails, "POST", CreateBeatPlan.fnEditBeatDetailsSuccessCallback, CreateBeatPlan.fnEditBeatFailureCallback, null);
    },
    fnEditBeatDetailsSuccessCallback: function (response) {
        debugger;

        if (response != null) {
            if (response.lstHeader.length > 0) {
                CreateBeatPlan.fnOnWorkCategoryChangeLoadSFC(response.lstHeader[0].Work_Category_Code);
                $('#txtBeatName').val(response.lstHeader[0].Beat_Name);
                $('#txtBeatName').attr('disabled', 'disabled');
                $('#hdnbeatCode').val(response.lstHeader[0].Beat_Code);
                $('#hdnMode').val('EDIT');
                $('#ddlWorkCategory').val(response.lstHeader[0].Work_Category_Code);
                $("#txtWeeknumber").val(response.lstHeader[0].WeekNumber);
                $("#txtWeekday").val(response.lstHeader[0].Weekday);
                var sno = 0;
                for (var i = 0; i < response.lstSFC.length; i++) {
                    sno++;
                    var Id = {
                        id: "test_" + sno + ""
                    };
                    $('#txtFromPlace_' + sno).val(response.lstSFC[i].From_Place);
                    $('#txtToPlace_' + sno).val(response.lstSFC[i].To_Place);
                    $('#txtTravelMode_' + sno).val(response.lstSFC[i].Travel_Mode);
                    $('#hdnFromPlace_' + sno).val(response.lstSFC[i].From_Place);
                    $('#hdnToPlace_' + sno).val(response.lstSFC[i].To_Place);
                    $('#hdnTravelMode_' + sno).val(response.lstSFC[i].Travel_Mode);
                    $('#hdnRouteWay_' + sno).val(response.lstSFC[i].Route_Way);
                    $('#hdnSFCCode_' + sno).val(response.lstSFC[i].Distance_Fare_Code);
                    CreateBeatPlan.fnAddSFCGrid(Id);
                }
                var lstbeatplan = [];
                if (response.lstHeader[0].Beat_Name.lastIndexOf(',') > -1) {
                    lstbeatplan = response.lstHeader[0].Beat_Name.split(',');
                } else {
                    lstbeatplan.push(response.lstHeader[0].Beat_Name);
                }
                $('#dbbeatname').empty();
                $('#dbbeatname').html(' <input type="text" id="txtBeatName" class="form-control" maxlength=""  />');
                var atcObj = new ej.dropdowns.MultiSelect({
                    //set the data to dataSource property
                    dataSource: uniqueBeatName_g,
                    fields: { text: 'label', value: 'label' },
                    //change: CUSTOMER.change,
                    // set the placeholder to MultiSelect input element
                    placeholder: 'Select Beat Name(s)',
                    // set true to enable the custom value support.
                    allowCustomValue: true,
                    maximumSelectionLength: 50,
                    // set the type of mode for how to visualized the selected items in input element.
                    mode: 'Box',
                    value: lstbeatplan
                });
                atcObj.appendTo('#txtBeatName');

                var lstWorkAreaSelected = [];
                if (response.lstHeader[0].Work_Area.lastIndexOf(',') > -1) {
                    lstWorkAreaSelected = response.lstHeader[0].Work_Area.split(',');
                } else {
                    lstWorkAreaSelected.push(response.lstHeader[0].Work_Area);
                }
                //for (var i = 0; i < lstWorkAreaSelected.length; i++) {
                //    $("#txtWorkArea").tokenInput("add", { id: lstWorkAreaSelected[i], name: lstWorkAreaSelected[i] });

                //}
                var isFlexiAllowed = true;
                var workCategoryName = $('#ddlWorkCategory option:selected').text();
                if (beatPlan_SFCValidatPriv_g != "" && beatPlan_SFCValidatPriv_g != undefined && beatPlan_interPriv_g != null && $.inArray(workCategoryName, beatPlan_SFCValidatPriv_g) > -1) {
                    isFlexiAllowed = false;
                } else {
                    isFlexiAllowed = true;
                }
                $('#dvtxtWorkArea').empty();
                $('#dvtxtWorkArea').html('<input type="text" id="txtWorkArea" name="workarea" class="form-control" maxlength="" />');
                var WorkAreas = new ej.dropdowns.MultiSelect({
                    // set the countries data to dataSource property
                    dataSource: workareas_g,
                    // map the appropriate columns to fields property
                    fields: { text: 'name', value: 'id' },
                    // set the placeholder to MultiSelect input element
                    placeholder: 'Select Work Area(s)',
                    // set true to enable the custom value support.
                    allowCustomValue: isFlexiAllowed,
                    maximumSelectionLength: 100,
                    // set the type of mode for how to visualized the selected items in input element.
                    mode: 'Box',
                    value: lstWorkAreaSelected
                });
                WorkAreas.appendTo('#txtWorkArea');


            }
        }
        $('#nav-home').addClass('active');
        $('#nav-home').addClass('show');
        $('#nav-profile').removeClass('active');
        $('#nav-profile').removeClass('show');
        $('#nav-profile-tab').removeClass('active');
        $('#nav-home-tab').addClass('active');
        $('#nav-profile').hide();
        $('#nav-home').show();
        $.unblockUI();
    },
    fnEditBeatFailureCallback: function (error) {

    },
    fnViewHistoryDetails: function (beatCode, regionCode) {
        debugger;
        var arrDetails = new Array();
        var _obj = {};
        _obj.name = "companyCode";
        _obj.value = CreateBeatPlan.defaults.CompanyCode;
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "regionCode";
        _obj.value = regionCode
        arrDetails.push(_obj);

        _obj = {};
        _obj.name = "beatCode";
        _obj.value = beatCode
        arrDetails.push(_obj);

        HDAjaxAysnc.requestInvoke('BeatPlan', 'GetBeatHistoryDetails', arrDetails, "POST", CreateBeatPlan.fnViewHistoryDetailsSuccessCallback, CreateBeatPlan.fnViewHistoryDetailsFailureCallback, null);
    },
    fnViewHistoryDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.length > 0) {
            content += '<div class="card mb-3">';
            content += '<div class="card-header bg-info text-white">Beat / Patch Info</div>';
            content += '<div class="card-body">';
            content += ' <div class="row">';
            content += '<div class="col-sm-12 row">';
            content += '<div class="col-sm-6">';
            content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Name :</label>';
            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response[0].Beat_Name + '</label>';
            content += '</div>';
            content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Category Name :</label>';
            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response[0].Work_Category_Name + '</label></div>';
            content += '<div class="form-group row no-gutters">';
            content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Work Area :</label>';
            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response[0].Work_Area + '</label>';
            content += '</div> ';
            content += '<div class="form-group row no-gutters"><label class="col-6 col-sm-6 col-form-label" style="font-weight:600;font-size:14px;">Beat Status :</label>';
            content += '<label class="col-6 col-sm-6 col-form-label localArea_label localareaname" id="localareaname">' + response[0].Status + ' </label></div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
            content += '</div>';


            content += '<table class="table table-bordered mt-3">';
            content += '<thead>';
            content += '<tr class="bg-info text-white" style="font-size: 12px;">';
            content += '<th>S.No</th>';
            content += '<th>Action</th>';
            content += '<th>Action By</th>';
            content += '<th>Date of Action</th>';
            content += '<th>Remarks</th>';
            content += '</tr>';
            content += '</thead>';
            content += '<tbody style="font-size: 12px;">';
            var sno = 0;
            for (var i = 0; i < response.length; i++) {
                sno++;
                content += '<tr>';
                content += '<td>' + sno + '</td>';
                if (response[i].Record_Status == 1) {
                    content += '<td>Approved</td>';
                }
                else if (response[i].Record_Status == 2) {
                    content += '<td>Applied</td>';
                } else if (response[i].Record_Status == 0) {
                    content += '<td>UnApproved</td>';
                }
                if (response[i].Record_Status == 2) {
                    if (response[i].Created_By != null) {
                        content += '<td>' + response[i].Created_By + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].Created_Date != null) {
                        content += '<td>' + response[i].Created_Date + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].Remarks != null) {
                        content += '<td>' + response[i].Remarks + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                } else if (response[i].Record_Status == 1) {
                    if (response[i].Approved_By != null) {
                        content += '<td>' + response[i].Approved_By + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].Approved_Date != null) {
                        content += '<td>' + response[i].Approved_Date + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].Remarks != null) {
                        content += '<td>' + response[i].Remarks + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                } else {
                    if (response[i].UnApproved_By != null) {
                        content += '<td>' + response[i].UnApproved_By + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].UnApproved_Date != null) {
                        content += '<td>' + response[i].UnApproved_Date + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                    if (response[i].Remarks != null) {
                        content += '<td>' + response[i].Remarks + '</td>';
                    } else {
                        content += '<td></td>';
                    }
                }
            }
            content += '</tbody></table>';

        } else {
            content = '';
            content += "<div class='form-group' style='font-style:italic;'>No Remarks History.</div>";
        }
        $('#HistoryPopBody').html(content);
        $.blockUI();
        $('#HistoryModal').modal('show');

    },
    fnViewHistoryDetailsFailureCallback: function (error) {

    },
    fnCloseHistoryModal: function () {
        $.unblockUI();
        $('#HistoryModal').modal('hide');
    },
    fnweeknumber: function () {
        debugger;
        var content = "";
        content += '<select class="form-control" id="txtWeeknumber" >';
        content += '<option value="-1" selected disabled>Select Week Number</option>'

        content += '<option value="1">1</option>';
        content += '<option value="2">2</option>';
        content += '<option value="3">3</option>';
        content += '<option value="4">4</option>';
        content += '<option value="5">5</option>';
        content += '<option value="6">6</option>';
        content += '<option value="7">7</option>';
        content += '</select>';
        $('#dvtxtWeeknum').html(content);


        //var isFlexiAllowed = false;
        //var lstweekday = [];
        //var data1 = new Array();
        //for (var i = 1; i < 7; i++) {
        //    _obj = {
        //        id: $.trim(i),
        //        name: $.trim(i)
        //    };
        //    data1.push(_obj);
        //}
        //$('#dvtxtWeeknum').empty();
        //$('#dvtxtWeeknum').html('<input type="text" id="txtWeeknumber" name="weeknumber" class="form-control" maxlength="" />');
        //var weeknum = new ej.dropdowns.ComboBox({
        //    // set the countries data to dataSource property
        //    dataSource: data1,
        //    // map the appropriate columns to fields property
        //    fields: { text: 'name', value: 'id' },
        //    // set the placeholder to MultiSelect input element
        //    placeholder: 'Select Week Number',
        //    // set true to enable the custom value support.
        //    allowCustomValue: isFlexiAllowed,

        //    maximumSelectionLength: 100,
        //    // set the type of mode for how to visualized the selected items in input element.
        //    mode: 'Box'
        //});
        //weeknum.appendTo('#txtWeeknumber');

    },
    fnweekday: function () {
        debugger;
        var content = "";
        content += '<select class="form-control" id="txtWeekday" >';
        content += '<option value="-1" selected disabled>Select Week Day</option>'

        content += '<option value="Sunday">Sunday</option>';
        content += '<option value="Monday">Monday</option>';
        content += '<option value="Tuesday">Tuesday</option>';
        content += '<option value="Wednesday">Wednesday</option>';
        content += '<option value="Thursday">Thursday</option>';
        content += '<option value="Friday">Friday</option>';
        content += '<option value="Saturday">Saturday</option>';
        content += '</select>';
        $('#dvtxtWeekday').html(content);
        //var isFlexiAllowed = false;
        //var lstweekday = [];
        //var data1 = new Array();
        //var weekday = new Array(
        //           "Sunday",
        //           "Monday",
        //           "Tuesday",
        //           "Wednesday",
        //           "Thursday",
        //           "Friday",
        //           "Saturday"
        //         );
        //for (var i = 1; i < weekday.length; i++) {
        //    _obj = {
        //        id: $.trim(i),
        //        name: $.trim(i)
        //    };
        //    data1.push(_obj);
        //}
        //$('#dvtxtWeekday').empty();
        //$('#dvtxtWeekday').html('<input type="text" id="txtWeekday" name="weekday" class="form-control" maxlength="" />');
        //var weeknum = new ej.dropdowns.ComboBox({
        //    // set the countries data to dataSource property
        //    dataSource: weekday,
        //    // map the appropriate columns to fields property
        //    fields: { text: 'name', value: 'id' },
        //    // set the placeholder to MultiSelect input element
        //    placeholder: 'Select Week Day',
        //    // set true to enable the custom value support.
        //    allowCustomValue: isFlexiAllowed,

        //    maximumSelectionLength: 100,
        //    // set the type of mode for how to visualized the selected items in input element.
        //    mode: 'Box'
        //});
        //weeknum.appendTo('#txtWeekday');

    },
}