var Third_Party_Storage = {
    bCreate: true,
    bEnter: true,
    filesSelected: null,
    default: {
        "GD_developerKey": "AIzaSyDxhJXiufOgCiasjQFPz_IomcKfd_F9UNo",
        "GD_clientId": "85310200494-4v33eh69lorrsgg621vf3ur98vb0aqpn.apps.googleusercontent.com",
        "GD_appId": "85310200494",
        "GD_scope": ['https://www.googleapis.com/auth/drive'],
        "pickerApiLoaded": false,
        "oauthToken": ""
    },
    //fnOpen: function (val) {        
    //    var sValue = val.id;
    //    $("#dvURL").html("");
    //    if (sValue == "liComp") {            
    //        $(".dz-default").trigger('click');
    //        $('.notification').show();
    //        $('.cls-disclaim-upload').show();
    //        $('#dvdpBtn').show();
    //        $('#btnDownload').hide();
    //        $("#dvURL").hide();
    //    } else if (sValue == "liBox") {
    //        $("#dvURL").show();
    //        $("#box-select").trigger("click");
    //        $('.notification').hide();
    //        $('.cls-disclaim-upload').hide();
    //        $('#dvdpBtn').hide();
    //    } else if (sValue == "lidpBox") {            
    //        window.location = $('#dvDropBox a').attr('href');
    //        $("#dvURL").show();
    //        $('.notification').hide();
    //        $('.cls-disclaim-upload').hide();
    //        $('#dvdpBtn').hide();
    //    }        
    //},
    getFileStorages: function () {
        var _this = Services;
        options = {
            success: function (files) {
                Third_Party_Storage.dropboxResponse(files);
            },
            cancel: function () {
            },
            linkType: "preview", // or "direct"
            multiselect: true, // or true
        };
        var button = Dropbox.createChooseButton(options);
        document.getElementById("lidpBox").appendChild(button);
        $(".dropbox-dropin-btn").html("Upload from Dropbox");
        $("#lidpBox a").removeClass("dropbox-dropin-btn dropbox-dropin-default");

        Third_Party_Storage.showStorageButton(1, function (success) {
            Third_Party_Storage.showStorageButton(2);
        });
        $('#btnDownload').unbind('click').bind('click', function () {
            Third_Party_Storage.startDownload();
        });
    },
    bindStorages: function (jsonData) {
        //debugger;
        if (jsonData != null && jsonData != '' && jsonData != undefined) {
            //alert("Inserted successfully");
            alert('File(s) uploaded successfully. Please wait another 15 minutes for the files to get viewed in the screen');
            $("#dvURL").html(" ");
            $(".notification").show();
            $('.cls-disclaim-upload').show();
            $("#btnDownload").hide();
            $('.cls-upload-content').show();
            $("#dvbox").show();
            $("#dvdpbox").show();
        }
        else {
            alert('Error while upload');
        }
        $('#btnDownload').unbind('click').bind('click', function () {
            Third_Party_Storage.startDownload();
        });
    },
    onFail: function () {//htp8worvigz6b5k
    },
    showStorageButton: function (val, success) {
        //var selectedText = $('#cboStorage option:selected').text();        
        if (val == 1) {
            var options = {
                clientId: 'ty3scl7qcs8u1xygq7187eus2g82j62z',
                linkType: 'direct',
                multiselect: true
            };
            var boxSelect = new BoxSelect(options);
            boxSelect.success(function (response) {
                //console.log(response);
                Third_Party_Storage.boxResponse(response);
            });
            boxSelect.cancel(function () {
                console.log("The user clicked cancel or closed the popup");
            });
            //$('#dvDropBox').hide();
            $('#box-select').show();
            //$('#dvGDrive').hide();
        }
        else if (val == 2) {
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
            //$('#box-select').hide();
            $('#dvDropBox').show();
            //$('#dvGDrive').hide();
        }
        else {
            this.loadPicker();
            $('#box-select').hide();
            $('#dvDropBox').hide();
            $('#dvGDrive').show();
        }
        if (success) success();
    },
    boxResponse: function (files) {
        Third_Party_Storage.createTable(files, 1);
    },
    dropboxResponse: function (files) {
        Third_Party_Storage.createTable(files, 2);
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
            Third_Party_Storage.createTable(data.docs, 3);
        }
    },
    createTable: function (files, val) {
        //debugger;
        $('#dvURL').html("");
        $(".optTag").hide();
        $(".cls-drop-add").hide();
        $(".cls-upload-asset").hide();
        $('.cls-disclaim-upload').hide();
        $('#hdncboStorageId').val("");
        $('#hdncboStorageName').val("");
        $('.cls-upload-content').hide();
        var content = "";
        content += "<table class='table table-striped cls-tbl-url' id='tblUrl' style='width:100%;   '>";
        content += "<thead><tr><th><input type='checkbox' value=" + url + " name='chkAllUrl'/></th><th>File Name</th></tr></thead><tbody>";
        for (var i = 0; i < files.length; i++) {
            debugger;
            //var mode = $('#cboStorage option:selected').text().toUpperCase();
            var url = ""; var size = ""; var fileName = "";
            debugger;

            if (val == 1) {
                url = files[i].url;
                fileName = files[i].name;
                $('#hdncboStorageId').val(1);
                filesize = files[i].size;
                $('#hdncboStorageName').val("Box");
            }
            else if (val == 2) {
                //url = files[i].link;                
                url = files[i].link.replace("?dl=0", "?dl=1");
                fileName = files[i].name;
                filesize = files[i].bytes;//dropbox
                $('#hdncboStorageId').val(2);
                $('#hdncboStorageName').val("Dropbox");
                $(".dropbox-dropin-btn").addClass("test");
            }
            else {
                url = files[i].url;
                fileName = files[i].name;
                filesize = files[i].bytes;
                //$('#cboStorage').val();
            }
            var fileExt = fileName.split('.').reverse()[0];
            var file_Accepted_Extension = ['BMP', 'JPG', 'JPEG', 'GIF', 'PNG', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'PDF', 'MP4', 'ZIP'];

            content += "<tr>";
            content += "<td>";
            if ($.inArray(fileExt.toUpperCase(), file_Accepted_Extension) > -1) {
                content += "<input id='checkbox_" + i + "' type='checkbox' value=" + url + " name='chkUrl'/>";
            }
            content += "</td>";
            content += "<td><span id='spnFileName_" + i + "'>" + fileName + "</span><span id='spnFileSize_" + i + "'>" + filesize + "</span></td>";
            //content += "<td><span>" + url + "</span></td>";
            content += "</tr>";

        }
        content += "</tbody></table>";
        $('#dvURL').html(content);
        $("#hdnUpload").val("TPY");
        //$('.cls-upload-asset').show();
        $('#btnDownload').show();
        $("#dvbox").hide();
        $("#dvdpbox").hide();
        $("input:checkbox[name=chkAllUrl]").click(function () {
            Third_Party_Storage.fnSelectAllUrl();
        });
        $("input:checkbox[name=chkUrl]").click(function () {
            $("input:checkbox[name=chkAllUrl]").attr("checked", false);
        });
    },
    bindResult: function () {
    },
    onFail: function () {
    },
    startDownload: function () {
        //debugger;
        if ($('input[type=checkbox][name=chkUrl]:checked').length == 0) {
            alert("Please select at-least one file to upload");
            return false;
        }
        if (confirm('Are you sure you want to upload?')) {
            var data = new Array();
            var ar = new Array();

            $('input[type=checkbox][name=chkUrl]:checked').each(function () {
                if (this.checked) {
                    debugger;
                    var file = {};
                    file.Company_Id = compId_g;
                    file.Integrator_ID = $('#hdncboStorageId').val();
                    file.Integrator_Name = $('#hdncboStorageName').val();
                    file.File_Url = this.value;
                    file.Uploaded_By = currentUserId_g;
                    file.File_Size_In_MB = 0;
                    file.File_Name = $("#" + this.id.replace('checkbox', 'spnFileName')).text();
                    file.File_Size_In_MB = $("#" + this.id.replace('checkbox', 'spnFileSize')).text();
                    ar.push(file);
                }
            });
            //debugger;
            var a = {};
            a.lstFiles = JSON.stringify(ar);
            data.push(a);
            var _this = Services;
            var context = ['AssetUploadApi', 'InsertThirdPartyFileStaging', subDomainName_g, currentUserId_g];
            CoreREST.postArray(_this, context, a, this.bindStorages, this.onFail);
        }
    },
    fnSelectAllUrl: function (elem) {
        if ($("input:checkbox[name=chkAllUrl]").attr("checked") == "checked") {
            $("input:checkbox[name=chkUrl]").each(function () {
                this.checked = true;
            });
        }
        else {
            $("input:checkbox[name=chkUrl]").each(function () {
                this.checked = false;
            });
        }
    },

}