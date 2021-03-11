
var attachments = {
    defaults: {

    },

    initializings: function () {
        debugger;
        attachments.fnDeleteRows();
    },

    fnDeleteRows: function () {
        debugger;

        $('#dZUpload_Cv').html('');
        $("#dZUpload_Cv").append("<div class='dz-default dz-message'><span>Drag and drops files to upload (*.png ,*.jpg,*.gif,*.bmp,*.pdf)</span></div> <div id='spFileUpload' style='display:none;' class='fileCont'><b>Uploading....<span id='spFileUploadCount'>(1/1)</span>files</b></div>");
        file_Com_count = 0;
        file_total_count = 0;
        file_Max_Count = 5;

        file_queue_count = 0;
        DoctorAttJSONArray = [];
        var myDropzone = Dropzone.forElement("#dZUpload_Cv");
        try {
            if (myDropzone.files.length > 0) {
                var file_length = myDropzone.files.length;
                for (var K = 0; K < file_length; K++) {
                    try {
                        myDropzone.removeAllFiles(true);
                    }
                    catch (e) {
                    }
                }
            }

        }
        catch (e) {
        }
        try {
            myDropzone.options.maxFiles = 5
        } catch (e) {
        }
    },

    fnRemoveAttachment: function (index, current) {
        current.parentNode.parentNode.style.display = "none"
        try {
            DoctorAttJSONArray[index].Status = '0';
        } catch (e) {
        }
        var myDropzone = Dropzone.forElement("#dZUpload_Cv");
        myDropzone.options.maxFiles = (myDropzone.options.maxFiles + 1);
    },
    fnGetAttachmentlist: function () {
        return DoctorAttJSONArray;
    },

    fnClear: function () {
        debugger;
        attachments.fnDeleteRows();

    },

    fnAttachmentEdit: function (ChemistAttJSONArrays) {
        //debugger;
        //var AttachmentJSON = '';
        //if (rowPosition != 'default') {
        //    $('#hdnbindRowNumber').val(rowPosition);
        //    AttachmentJSON = eval('(' + $('#hdnAttachment' + rowPosition).val() + ')');
        //}
        //else {
        //    $('#hdnbindRowNumber').val('1');
        //}
        attachments.fnDeleteRows();
        DoctorAttJSONArray = [];

        var myDropzone = Dropzone.forElement("#dZUpload_Cv");
        if (ChemistAttJSONArrays != undefined && ChemistAttJSONArrays.length > 0) {

            var imgName = "";
            for (var i = 0; i < ChemistAttJSONArrays.length; i++) {
               
                    var DoctorAttArray = {};
                    DoctorAttArray.Blob_Url = ChemistAttJSONArrays[i].Blob_Url;
                    DoctorAttArray.Uploaded_File_Name = ChemistAttJSONArrays[i].Uploaded_File_Name;
                    DoctorAttArray.Status = "1";
                    DoctorAttJSONArray.push(DoctorAttArray);
                    imgName += '<div class="attachementDisplay"><span class="attachementImgname">' + ChemistAttJSONArrays[i].Uploaded_File_Name + "</span><span class='attachementImgDel'><img src='../Areas/HiDoctor_Activity/Content/images/Web/hd/trash1_16x16.gif' alt='Remove' style='cursor:pointer' onclick=fnRemoveAttachment('" + i + "',this) </span></div>";
      

            }
            //file_Max_Count = 5 - (AttachmentJSON.length);

            myDropzone.options.maxFiles = (5 - ChemistAttJSONArrays.length);
            $("#dZUpload_Cv").append('<div class="fileCont">' + imgName + '</div>');
        }
        else
            myDropzone.options.maxFiles = 5;
    }
}