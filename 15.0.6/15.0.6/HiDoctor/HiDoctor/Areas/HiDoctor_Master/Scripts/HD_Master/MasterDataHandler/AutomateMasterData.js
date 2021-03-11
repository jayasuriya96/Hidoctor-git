

var AutomateMasterData = {
    defaults: {
        CompanyCode: "",
        CompanyId: "",
        RegionCode: "",
        UserTypeCode: "",
        UserDetails: "",
        ViewType: "",
        BatchProcessingId: "",
        FileProcessId: "",
        BP_Guid: "",
    },
    Init: function () {
        if (AutomateMasterData.defaults.BatchProcessingId != "" && AutomateMasterData.defaults.BatchProcessingId != 0) {
            //debugger;
            //Ajay Test Build Process
            AutomateMasterData.fnGetUploadDetails();
        }
    },
    fnGetModuleMaster: function () {
        debugger;
        var details = AutomateMasterData.defaults.CompanyCode;
        RPAREST.requestInvoke("AutomateMasterData/ModuleMaster", details, null, "GET", AutomateMasterData.fnGetModuleMasterSuccessCallback, AutomateMasterData.fnGetModuleMasterFailureCallback, null);
    },
    fnGetModuleMasterSuccessCallback: function (response) {
        debugger;
        var content = '<option value="0" selected="selected" disabled="disabled">Choose Module</option>';
        if (response != null && response.list.length > 0) {
            for (var i = 0; i < response.list.length; i++) {
                content += '<option value="' + response.list[i].Module_Id + '">' + response.list[i].Module_Display_Name + '</option>';
            }
        }
        $('#ddlModuleNames').html(content);
    },
    fnGetModuleMasterFailureCallback: function () {
        //debugger;
    },
    fnGetUploadDetails: function () {
        debugger;
        var details = AutomateMasterData.defaults.CompanyCode + '/' + AutomateMasterData.defaults.BatchProcessingId + '/' + AutomateMasterData.defaults.ViewType;
        RPAREST.requestInvoke("AutomateMasterData/GetMasterDataDetails", details, null, "GET", AutomateMasterData.fnGetUploadDetailsSuccessCallback, AutomateMasterData.fnGetUploadDetailsFailureCallback, null);
    },
    fnGetUploadDetailsSuccessCallback: function (response) {
        debugger;
        var content = "";
        if (response != null && response.list.length > 0) {
            var data = response.list[0];
            if (response.list[0].ViewType.toUpperCase() == "MASTERDATA") {
                $('#lblModuleName').html(data.lstUploadDet[0].Module_Name);
                $('#lblUploadedBy').html(data.lstUploadDet[0].Uploaded_By);
                if (data.lstUploadDet[0].Upload_Status.toUpperCase() == "FAILED") {
                    $('#lblUploadStatus').html('<span class="badge badge-danger">' + data.lstUploadDet[0].Upload_Status + '</span>');
                }
                else {
                    $('#lblUploadStatus').html('<span class="badge badge-success">' + data.lstUploadDet[0].Upload_Status + '</span>');
                }
                $('#lblFileName').html(data.lstUploadDet[0].File_Name);
                $('#lblUploadedOn').html(data.lstUploadDet[0].Uploaded_On);
                $('#lblUploadDescription').html(data.lstUploadDet[0].Upload_Description);
                if (data.lstDocument.length > 0) {
                    var disjson = $.grep(data.lstDocument, function (ele, index) {
                        return ele.Record_Status == 1;
                    });
                    content += '<div class="card mb-2" id="dvDocs">';
                    content += '<div class="card-header card-header-primary px-3 py-2 bg-info text-white">';
                    content += '<div class="d-flex">';

                    content += '<div class="bd-highlight">Document Type(s)</div>';

                    content += '<div class="ml-auto bd-highlight">';
                    content += '<span class="mr-3 show_Data" id="3" style="cursor: pointer;text-decoration: underline;">';
                    content += '</span><span id="opencollapse"><i class="fa fa-plus" aria-hidden="true"></i></span>';
                    content += '</div>';

                    content += '</div>';
                    content += '</div>';

                    content += '<div class="card-body" style="display: none;">';
                    if (disjson.length > 0) {
                        content += '<div class="text-primary">';
                        content += '<span id="chkAllDocType" style="font-size:14px;font-weight:600;cursor:pointer;text-decoration:underline;">Select All</span>';
                        content += '</div>';
                    }
                    content += '<div id="dvDocumentDataMain" style="height:500px;overflow-y:auto;">';
                    content += '<div class="text-second card-columns" id="dvDocumentData">';
                    for (var i = 0; i < data.lstDocument.length; i++) {
                        content += '<div class="card" id="cardData_' + i + '">';
                        content += '<div class="card-header p-0 text-white" style="background:#6d50de">';
                        content += '<div class="row no-gutters p-2">';
                        if (data.lstDocument[i].Record_Status == 1) {
                            content += '<div class="col-1 col-sm-1">';
                            content += '<div class="custom-control custom-checkbox align-top">';
                            content += '<input type="checkbox" class="custom-control-input align-top" name="document" value="' + data.lstDocument[i].Document_Type_Code + '" id="newDocType_' + i + '">';
                            content += '<input type="hidden" class="custom-control-input align-top" value="' + data.lstDocument[i].Document_Type_Code + '|' + data.lstDocument[i].BatchProcessingId + '" id="hdnDcoTypeDet_' + i + '">';
                            content += '<label class="custom-control-label" for="newDocType_' + i + '"></label>';
                            content += '</div>';
                            content += '</div>';
                        }
                        content += '<div class="col-10 col-sm-10 pl-2">';
                        content += '<p class="mb-0 card_header_Label" style="font-size:14px;font-weight:600;">' + data.lstDocument[i].Document_Type_Name + '</p>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Status: </label>';
                        if (data.lstDocument[i].Record_Status == 1) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-warning">Pending..</span></label>';
                        }
                        else if (data.lstDocument[i].Record_Status == 2) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">Added</span></label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-danger">Discarded</span></label>';
                        }
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-form-label col-6 col-sm-6" style="font-weight:600;">';
                        content += 'Calci Mode: <span class="text-danger font-weight-bold">*</span>';
                        content += '</label>';
                        if (data.lstDocument[i].Record_Status == 1) {
                            content += '<div class="p-2 col-6 col-sm-6">';
                            content += '<div class="custom-control custom-radio">';
                            content += '<input type="radio" class="custom-control-input" name="customRadioInline_' + i + '" value="1" id="customradioControl1_' + i + '" checked="checked">';
                            content += '<label class="custom-control-label" for="customradioControl1_' + i + '">Plus (+)</label>';
                            content += '</div>';
                            content += '<div class="custom-control custom-radio">';
                            content += '<input type="radio" class="custom-control-input" name="customRadioInline_' + i + '" value="0" id="customradioControl0_' + i + '">';
                            content += '<label class="custom-control-label" for="customradioControl0_' + i + '">Minus (-)</label>';
                            content += '</div>';
                            content += '</div>';
                        }
                        else if (data.lstDocument[i].Record_Status == 2) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstDocument[i].Calc_Mode + '</label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label">-</label>';
                        }
                        content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';

                    if (disjson.length > 0) {
                        content += '<div class="text-third">';
                        content += '<input type="button" style="margin-bottom: 5px;margin-left:24px;" class="btn btn-success btn-xs ml-2" id="btnDocAdd" onclick="AutomateMasterData.fnTakeActionMasterData(\'Add\',\'Document_Type\');" value="Add" />';
                        content += '<input type="button" style="margin-bottom: 5px;margin-left:24px;" class="btn btn-danger btn-xs ml-2" id="btnDocDiscard" onclick="AutomateMasterData.fnTakeActionMasterData(\'Discard\',\'Document_Type\');" value="Discard" />';
                        content += '</div>';
                    }

                    content += '</div>';

                    content += '</div>';

                }
                if (data.lstDepotDet.length > 0) {
                    var disjson = $.grep(data.lstDepotDet, function (ele, index) {
                        return ele.Record_Status == 1;
                    });
                    content += '<div class="card mb-2" id="dvDep">';
                    content += '<div class="card-header card-header-primary px-3 py-2 bg-info text-white">';
                    content += '<div class="d-flex">';
                    content += '<div class="bd-highlight">Depot(s)</div>';
                    content += '<div class="ml-auto bd-highlight">';
                    content += '<span class="mr-3 show_Data" id="3" style="cursor: pointer;text-decoration: underline;">';
                    content += '</span><span id="opencollapse"><i class="fa fa-plus" aria-hidden="true"></i></span>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="card-body" style="display: none;">';
                    if (disjson.length > 0) {
                        content += '<div class="text-primary">';
                        content += '<span id="chkAllDepot" style="font-size:14px;font-weight:600;cursor:pointer;text-decoration:underline;">Select All</span>';
                        content += '</div>';
                    }

                    content += '<div id="dvDepotDataMain" style="height:500px;overflow-y:auto;">';
                    content += '<div class="text-second card-columns" id="dvDepotData">';
                    for (var i = 0; i < data.lstDepotDet.length; i++) {
                        content += '<div class="card" id="cardData_' + i + '">';
                        content += '<div class="card-header p-0 text-white" style="background:#6d50de">';
                        content += '<div class="row no-gutters p-2">';
                        if (data.lstDepotDet[i].Record_Status == 1) {
                            content += '<div class="col-1 col-sm-1">';
                            content += '<div class="custom-control custom-checkbox align-top">';
                            content += '<input type="checkbox" class="custom-control-input align-top" name="depot" value="' + data.lstDepotDet[i].Depot_Id + '" id="newDepot_' + i + '">';
                            content += '<input type="hidden" class="custom-control-input align-top" value="' + data.lstDepotDet[i].Depot_Id + '|' + data.lstDepotDet[i].BatchProcessingId + '" id="hdnDepot_' + i + '">';
                            content += '<label class="custom-control-label" for="newDepot_' + i + '"></label>';
                            content += '</div>';
                            content += '</div>';
                        }
                        content += '<div class="col-10 col-sm-10 pl-2">';
                        content += '<p class="mb-0 card_header_Label" style="font-size:14px;font-weight:600;">' + data.lstDepotDet[i].Depot_Name + '</p>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Region/Location :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstDepotDet[i].Region_Name + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Status: </label>';
                        if (data.lstDepotDet[i].Record_Status == 1) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-warning">Pending..</span></label>';
                        }
                        else if (data.lstDepotDet[i].Record_Status == 2) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">Added</span></label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-danger">Discarded</span></label>';
                        }
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Ref Key1: <span class="text-danger font-weight-bold">*</span></label>';
                        if (data.lstDepotDet[i].Record_Status == 1) {
                            content += '<input type="text" maxLength="50" id="txtRefKey1_' + i + '" class="form-control"/>';
                        }
                        else if (data.lstDepotDet[i].Record_Status == 2) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstDepotDet[i].Depot_Ref_Key1 + '</label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label">-</label>';
                        }
                        content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';


                    if (disjson.length > 0) {
                        content += '<div class="text-third">';
                        content += '<input type="button" style="margin-bottom: 5px;margin-left:24px;" class="btn btn-success btn-xs ml-2" id="btnDepAdd" onclick="AutomateMasterData.fnTakeActionMasterData(\'Add\',\'Depot\');" value="Add" />';
                        content += '<input type="button" style="margin-bottom: 5px;margin-left:24px;" class="btn btn-danger btn-xs ml-2" id="btnDepDiscard" onclick="AutomateMasterData.fnTakeActionMasterData(\'Discard\',\'Depot\');" value="Discard" />';
                        content += '</div>';
                    }

                    content += '</div>';
                    content += '</div>';
                }
                if (data.lstDepotRegDet.length > 0) {
                    content += '<div class="card mb-2" id="dvDepReg">';
                    content += '<div class="card-header card-header-primary px-3 py-2 bg-info text-white">';
                    content += '<div class="d-flex">';
                    content += '<div class="bd-highlight">Depot Region Mapping</div>';
                    content += '<div class="ml-auto bd-highlight">';
                    content += '<span class="mr-3 show_Data" id="3" style="cursor: pointer;text-decoration: underline;">';
                    content += '</span><span id="opencollapse"><i class="fa fa-plus" aria-hidden="true"></i></span>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="card-body" style="display: none;">';

                    content += '<div id="dvDepotRegionMain" style="height:500px;overflow-y:auto;">';
                    content += '<div class="text-second card-columns" id="dvDepotRegion">';
                    for (var i = 0; i < data.lstDepotRegDet.length; i++) {
                        content += '<div class="card" id="cardData_' + i + '">';
                        content += '<div class="card-header p-0 text-white" style="background:#6d50de">';
                        content += '<div class="row no-gutters p-2">';
                        content += '<div class="col-10 col-sm-10 pl-2">';
                        content += '<input type="hidden" class="custom-control-input align-top" value="' + data.lstDepotRegDet[i].Mapping_Id + '|' + data.lstDepotRegDet[i].BatchProcessingId + '" id="hdnDepot_' + i + '">';
                        content += '<p class="mb-0 card_header_Label" style="font-size:14px;font-weight:600;">' + data.lstDepotRegDet[i].Depot_Name + '</p>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Region/Location :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstDepotRegDet[i].Region_Name + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Ref Key1 :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstDepotRegDet[i].Depot_Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Status: </label>';
                        if (data.lstDepotRegDet[i].Record_Status == 2) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">Added</span></label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-danger">Discarded</span></label>';
                        }
                        content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';

                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }
                if (data.lstStockistDet.length > 0) {
                    content += '<div class="card mb-2" id="dvStockistDet">';
                    content += '<div class="card-header card-header-primary px-3 py-2 bg-info text-white">';
                    content += '<div class="d-flex">';
                    content += '<div class="bd-highlight">Stockist Master</div>';
                    content += '<div class="ml-auto bd-highlight">';
                    content += '<span class="mr-3 show_Data" id="3" style="cursor: pointer;text-decoration: underline;">';
                    content += '</span><span id="opencollapse"><i class="fa fa-plus" aria-hidden="true"></i></span>';
                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                    content += '<div class="card-body" style="display: none;">';

                    content += '<div id="dvStockistDetMain" style="height:500px;overflow-y:auto;">';
                    content += '<div class="text-second card-columns" id="dvStockistDet">';
                    for (var i = 0; i < data.lstStockistDet.length; i++) {
                        content += '<div class="card" id="cardData_' + i + '">';
                        content += '<div class="card-header p-0 text-white" style="background:#6d50de">';
                        content += '<div class="row no-gutters p-2">';
                        content += '<div class="col-10 col-sm-10 pl-2">';
                        content += '<input type="hidden" class="custom-control-input align-top" value="' + data.lstStockistDet[i].Mapping_Id + '|' + data.lstStockistDet[i].BatchProcessingId + '" id="hdnStockist_' + i + '">';
                        content += '<p class="mb-0 card_header_Label" style="font-size:14px;font-weight:600;">' + data.lstStockistDet[i].Customer_Name + '</p>';
                        content += '</div>';
                        content += '</div>';
                        content += '</div>';
                        content += '<ul class="list-group list-group-flush">';
                        content += '<li class="list-group-item">';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Region/Location :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstStockistDet[i].Region_Name + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Ref Key1 :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstStockistDet[i].Stockist_Ref_Key1 + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Base Stockist:</label>';
                        if (data.lstStockistDet[i].IsBaseRecord == 1) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">Yes</span></label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">No</span></label>';
                        }
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Type :</label>';
                        content += '<label class="col-6 col-sm-6 col-form-label localArea_label">' + data.lstStockistDet[i].Type + '</label>';
                        content += '</div>';
                        content += '<div class="form-group row no-gutters">';
                        content += '<label class="col-6 col-sm-6 col-form-label" style="font-weight:600;">Status: </label>';
                        if (data.lstStockistDet[i].Record_Status == 2 || data.lstStockistDet[i].Record_Status == 3 || data.lstStockistDet[i].Record_Status == 4) {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-success">Added</span></label>';
                        }
                        else {
                            content += '<label class="col-6 col-sm-6 col-form-label localArea_label"><span class="badge badge-danger">Discarded</span></label>';
                        }
                        content += '</div>';
                        content += '</li>';
                        content += '</ul>';
                        content += '</div>';
                    }
                    content += '</div>';
                    content += '</div>';

                    content += '</div>';
                    content += '</div>';
                    content += '</div>';
                }
            }

        }
        $('#dvBodyDetails').html(content);
        $("#dvBodyDetails #opencollapse").click(function () {
            var togglediv = $(this).parent().parent().parent().parent().find('.card-body');
            if (togglediv.css('display') == 'none') {
                $(this).html('<i class="fa fa-minus" aria-hidden="true"></i>')
            }
            else {
                $(this).html('<i class="fa fa-plus" aria-hidden="true"></i>');
            }
            togglediv.delay(200).toggle();
        });
    },
    fnViewGrid: function (showOrHide, Id) {
        debugger;
        if (showOrHide.toUpperCase() == "SHOW") {
            $('#' + Id).show();
            $('#' + Id + "Minus").show();
            $('#' + Id + "Plus").hide();
        }
        else {
            $('#' + Id).hide();
            $('#' + Id + "Plus").show();
            $('#' + Id + "Minus").hide();
        }
    },
    fnGetUploadDetailsFailureCallback: function () {

    },
    fnTakeActionMasterData: function (actionType, MasterDataType) {
        debugger;
        //if (actionType.toUpperCase() == "ADD") {
        var result = AutomateMasterData.fnValidateData(actionType, MasterDataType);
        if (result) {
            var lstData = [];
            var DivId = "";
            var inputname = "";
            if (MasterDataType.toUpperCase() == "DOCUMENT_TYPE") {
                DivId = "dvDocumentData";
                inputname = "document";
            }
            else if (MasterDataType.toUpperCase() == "DEPOT") {
                DivId = "dvDepotData";
                inputname = "depot";
            }
            $('#' + DivId + ' .card input[name="' + inputname + '"]:checked').map(function () {
                var details = $(this).next()[0].value;
                var rowid = $(this).next()[0].id.split('_')[1];
                var batchProcessingId = details.split('|')[1];
                var actionid = details.split('|')[0];
                var _obj = {
                    Company_Code: AutomateMasterData.defaults.CompanyCode,
                    CompanyId: AutomateMasterData.defaults.CompanyId,
                    BatchProcessingId: batchProcessingId,
                    Action_Id: actionid,
                    Action_Type: MasterDataType,
                    Status_Type: actionType,
                };
                if (MasterDataType.toUpperCase() == "DOCUMENT_TYPE") {
                    if (parseInt($('input[name="customRadioInline_' + rowid + '"]:selected').val()) == 1) {
                        _obj.Action_Value = "Plus";
                    }
                    else {
                        _obj.Action_Value = "Minus";
                    }
                }
                else if (MasterDataType.toUpperCase() == "DEPOT") {
                    _obj.Action_Value = $('#txtRefKey1_' + rowid).val();
                }
                lstData.push(_obj);
            });
            var _objData = {
                lstActionData: lstData
            }
            var details = AutomateMasterData.defaults.CompanyCode + '/' + actionType + '/' + MasterDataType
            RPAREST.requestInvoke("AutomateMasterData/TakeActionMasterData", details, _objData, "POST", AutomateMasterData.fnTakeActionMasterDataSuccessCallback, AutomateMasterData.fnTakeActionMasterDataFailureCallback, null);
        }
    },
    fnTakeActionMasterDataSuccessCallback: function (data) {
        debugger;
        if (data.Count > 0) {
            swal('Success', 'Added/Discarded the Master Data Successfully.', 'success');
        }
        else {
            swal('Info', '' + data.Message + '', 'info');
        }
        AutomateMasterData.fnGetUploadDetails();
    },
    fnTakeActionMasterDataFailureCallback: function (error) {

    },
    fnValidateData: function (actionType, MasterDataType) {
        debugger;
        var isValid = true;
        var DivId = "";
        var inputname = "";
        var displayName = "";
        if (MasterDataType.toUpperCase() == "DOCUMENT_TYPE") {
            DivId = "dvDocumentData";
            inputname = "document";
            displayName = "Document Type";
        }
        else if (MasterDataType.toUpperCase() == "DEPOT") {
            DivId = "dvDepotData";
            inputname = "depot";
            displayName = "Depot";
        }
        if ($('#' + DivId + ' .card input[name="' + inputname + '"]:checked').length == 0) {
            swal('Info', 'Please select atleast one ' + displayName + ' to Add/Discard.', 'info');
            isValid = false;
            return isValid;
        }
        var lstArrDuplcts = [];
        if (actionType.toUpperCase() == "ADD") {
            $('#' + DivId + ' .card input[name="' + inputname + '"]:checked').map(function () {
                debugger;
                var details = $(this).next()[0].value;
                var rowId = $(this).next()[0].id.split('_')[1];
                if (MasterDataType.toUpperCase() == "DOCUMENT_TYPE") {
                    if (!($('input[name="customRadioInline_' + rowId + '"]').is(":checked"))) {
                        swal('Info', 'Please select Calci Mode to Add ' + displayName + '.', 'info');
                        isValid = false;
                        return isValid;
                    }
                }
                else if (MasterDataType.toUpperCase() == "DEPOT") {
                    if ($('#txtRefKey1_' + rowId).val() == "" || $('#txtRefKey1_' + rowId).val() == null || $('#txtRefKey1_' + rowId).val() == undefined) {
                        swal('Info', 'Please enter Ref Key1 to Add ' + displayName + '.', 'info');
                        isValid = false;
                        return isValid;
                    }
                    else if ($('#txtRefKey1_' + rowId).val() != "" && $('#txtRefKey1_' + rowId).val() != null && $('#txtRefKey1_' + rowId).val() != undefined) {
                        if ($('#txtRefKey1_' + rowId).val().length > 50) {
                            swal('Info', 'Please enter Ref Key1 value less than or equal to 50 Character(s).', 'info');
                            isValid = false;
                            return isValid;
                        }
                        var isNotHavingSplChar = AutomateMasterData.fnCheckSpecialCharacters($('#txtRefKey1_' + rowId).val());
                        if (!isNotHavingSplChar) {
                            swal('Info', 'Only (a-z A-Z 0-9) Special Character(s) are allowed in the field Ref Key1.', 'info');
                            isValid = false;
                            return isValid;
                        }
                        var depotRefKey1 = $('#txtRefKey1_' + rowId).val().toUpperCase();
                        if ($.inArray(depotRefKey1, lstArrDuplcts) == -1) {
                            lstArrDuplcts.push(depotRefKey1);
                        }
                        else {
                            swal('Info', 'Ref Key1 should be unique & same Ref Key1 cannot be entered more than once.', 'info');
                            isValid = false;
                            return isValid;
                        }
                    }
                }
                if (!isValid) {
                    return isValid;
                }
            });
        }

        return isValid;
    },
    fnCheckSpecialCharacters: function (value) {
        var specialCharregex = new RegExp("^[a-zA-Z0-9 ]+$");
        if (!specialCharregex.test(value)) {
            return false;
        }
        else {
            return true;
        }
    },
}