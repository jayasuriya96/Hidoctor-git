var Third_Party_Storage = {
    default: {
        "GD_developerKey": "AIzaSyDxhJXiufOgCiasjQFPz_IomcKfd_F9UNo",
        "GD_clientId": "85310200494-4v33eh69lorrsgg621vf3ur98vb0aqpn.apps.googleusercontent.com",
        "GD_appId": "85310200494",
        "GD_scope": ['https://www.googleapis.com/auth/drive'],
        "pickerApiLoaded": false,
        "oauthToken": ""
    },
    getFileStorages: function () {
        var _this = Services;
        var context = ['AssetUploadApi', 'GetThirdPartyFileStorageByCompany', compId_g, subDomainName_g];
        CoreREST.post(_this, context, null, this.bindStorages, this.onFail);

        // DPAjax.requestInvoke('AssetUploadApi', 'GetThirdPartyFileStorageByCompany', arData, 'POST', this.bindStorages, this.onFail);
    },
    bindStorages: function (jsonData) {
        if (jsonData != null && jsonData != '' && jsonData != undefined) {
            var content = "";
            content += "<option value=0>Select File Storage</option>";
            for (var i = 0; i < jsonData.length; i++) {
                content += "<option value=" + jsonData[i].Integrator_ID + ">" + jsonData[i].Integrator_Name + "</option>";
            }
            $('#cboStorage').append(content);
        }
        $('#cboStorage').unbind('change').bind('change', function () {
            $('#dvURL').html('');
            Third_Party_Storage.showStorageButton(this);
        });
        $('#btnDownload').unbind('click').bind('click', function () {
            Third_Party_Storage.startDownload();
        });
    },
    onFail: function () {//htp8worvigz6b5k
    },
    showStorageButton: function (obj) {
        var selectedText = $('#cboStorage option:selected').text();
        if (selectedText.toUpperCase() == "BOX") {
            var options = {
                clientId: 'ty3scl7qcs8u1xygq7187eus2g82j62z',
                linkType: 'direct',
                multiselect: true
            };
            var boxSelect = new BoxSelect(options);
            boxSelect.success(function (response) {
                console.log(response);
                Third_Party_Storage.boxResponse(response);
            });
            boxSelect.cancel(function () {
                console.log("The user clicked cancel or closed the popup");
            });
            $('#dvDropBox').hide();
            $('#box-select').show();
            $('#dvGDrive').hide();
        }
        else if (selectedText.toUpperCase() == "DROPBOX") {
            options = {
                success: function (files) {
                    Third_Party_Storage.dropboxResponse(files);
                },
                cancel: function () {
                },
                linkType: "preview", // or "direct"
                multiselect: true, // or true
            };
            $('#dvDropBox').html('');
            var button = Dropbox.createChooseButton(options);
            document.getElementById("dvDropBox").appendChild(button);
            $('#box-select').hide();
            $('#dvDropBox').show();
            $('#dvGDrive').hide();
        }
        else {
            this.loadPicker();
            $('#box-select').hide();
            $('#dvDropBox').hide();
            $('#dvGDrive').show();
        }
    },
    boxResponse: function (files) {
        //debugger;
        //var content = "";
        //for (var i = 0; i < files.length; i++) {
        //    content += "<div class='checkbox checkbox-primary'>";
        //    content += "<input id='checkbox" + i + "' type='checkbox' value=" + files[i].url + " name='chkUrl'>";
        //    content += "<label for='checkbox" + i + "'>" + files[i].url + "</label>";
        //    content += "</div>";
        //}
        //$('#dvURL').html(content);
        //$('#btnDownload').show();
        Third_Party_Storage.createTable(files);
    },
    dropboxResponse: function (files) {
        debugger;
        Third_Party_Storage.createTable(files);
        //var content = "";
        //for (var i = 0; i < files.length; i++) {
        //    content += "<div class='checkbox checkbox-primary'>";
        //    content += "<input id='checkbox" + i + "' type='checkbox' value=" + files[0].link + " name='chkUrl'>";
        //    content += "<label for='checkbox" + i + "'>" + files[0].link + "</label>";
        //    content += "</div>";
        //}
        //$('#dvURL').html(content);
        //$('#btnDownload').show();
    },
    loadPicker: function () {
        gapi.load('auth', { 'callback': Third_Party_Storage.onAuthApiLoad });
        gapi.load('picker', { 'callback': Third_Party_Storage.onPickerApiLoad });
    },
    onAuthApiLoad: function () {
        window.gapi.auth.authorize(
          {
              'client_id': Third_Party_Storage.default.GD_clientId,
              'scope': Third_Party_Storage.default.GD_scope,
              'immediate': false
          },
          Third_Party_Storage.handleAuthResult);
    },
    onPickerApiLoad: function () {
        Third_Party_Storage.default.pickerApiLoaded = true;
        Third_Party_Storage.createPicker();
    },
    handleAuthResult: function (authResult) {
        if (authResult && !authResult.error) {
            Third_Party_Storage.default.oauthToken = authResult.access_token;
            Third_Party_Storage.createPicker();
        }
    },
    createPicker: function () {
        if (Third_Party_Storage.default.pickerApiLoaded && Third_Party_Storage.default.oauthToken) {
            var view = new google.picker.View(google.picker.ViewId.DOCS);
            //  view.setMimeTypes("image/png,image/jpeg,image/jpg");
            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(Third_Party_Storage.default.GD_appId)
                .setOAuthToken(Third_Party_Storage.default.oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(Third_Party_Storage.default.GD_developerKey)
                .setCallback(Third_Party_Storage.pickerCallback)
                .build();
            picker.setVisible(true);
        }
    },
    pickerCallback: function (data) {
        if (data.action == google.picker.Action.PICKED) {
            ////var fileId = data.docs[0].id;
            //var files = data.docs;
            //var content = "";
            //for (var i = 0; i < files.length; i++) {
            //    content += "<div class='checkbox checkbox-primary'>";
            //    content += "<input id='checkbox" + i + "' type='checkbox' value=" + files[i].url + " name='chkUrl'>";
            //    content += "<label for='checkbox" + i + "'>" + files[i].url + "</label>";
            //    content += "</div>";
            //}
            //$('#dvURL').html(content); $('#btnDownload').show();
            ////for (var i = 0; i < data.docs.length; i++) {
            ////    //data.docs[0].url
            ////}
            //////alert('The user selected: ' + fileId);
            Third_Party_Storage.createTable(data.docs);
        }
    },
    createTable: function (files) {
        debugger;
        var content = "";
        content += "<table class='table table-striped cls-tbl-url' id='tblUrl' style='width:100%;   '>";
        content += "<thead><tr><th><input type='checkbox' value=" + url + " name='chkAllUrl'/></th><th>File Name</th><th>File Url</th></tr></thead><tbody>";
        for (var i = 0; i < files.length; i++) {
            var mode = $('#cboStorage option:selected').text().toUpperCase();
            var url = ""; var size = ""; var fileName = "";
            if (mode == "BOX") {
                url = files[i].url;
                fileName = files[i].name;
            }
            else if (mode == "DROPBOX") {
                url = files[i].link
                fileName = files[i].name;
            }
            else {
                url = files[i].url;
                fileName = files[i].name;
            }

            content += "<tr>";
            content += "<td>";
            content += "<input id='checkbox_" + i + "' type='checkbox' value=" + url + " name='chkUrl'/></td>";
            content += "<td><span id='spnFileName_" + i + "'>" + fileName + "</span></td>";
            content += "<td><span>" + url + "</span></td>";
            content += "</tr>";
        }
        content += "</tbody></table>";
        $('#dvURL').html(content); $('#btnDownload').show();
    },
    startDownload: function () {
        if (confirm('are you sure to begin download')) {
            debugger;
            var data = new Array();

            var ar = new Array();
            $('input[type=checkbox][name=chkUrl]:checked').each(function () {
                if (this.checked) {
                    debugger;
                    var file = {};
                    file.Company_Id = compId_g;
                    file.Integrator_ID = $('#cboStorage').val();
                    file.Integrator_Name = $('#cboStorage option:selected').text();
                    file.File_Url = this.value;
                    file.Uploaded_By = currentUserId_g;
                    file.File_Size_In_MB = 0;
                    file.File_Name = $("#" + this.id.replace('checkbox', 'spnFileName')).text();
                    ar.push(file);
                }
            });

            var a = {};
            a.lstFiles = JSON.stringify(ar);
            data.push(a);
            var _this = Services;
            var context = ['AssetUploadApi', 'InsertThirdPartyFileStaging', subDomainName_g];
            CoreREST.postArray(_this, context, a, this.bindStorages, this.onFail);
        }
    }
}