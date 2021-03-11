
/// Region Type Master Migration


function fnRegionTypeMigration() {
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: 'Migration/InsertRegionTypeTree',
        data: "A",
        success: function (result) {
            if (result.toUpperCase() == "TRUE") {
                msgAlert('Inserted successfully.', 'info');
                HideModalPopup("dvloading");
            }
            else {
                msgAlert('Insertion Failed.', 'error');
                HideModalPopup("dvloading");
            }
        }
    });
   
}

/// Region Master Migration
function fnRegionMasterMigration() {
   
    ShowModalPopup("dvloading");
    $.ajax({
        type: 'POST',
        url: 'Migration/InsertRegionMasterTree',
        data: "A",
        success: function (result) 
        {
            if (result.toUpperCase() == "TRUE") {
                msgAlert('Inserted successfully.', 'info');               
                HideModalPopup("dvloading");
            }
            else {
                msgAlert('Insertion Failed.', 'error');              
                HideModalPopup("dvloading");
            }
        }
       
    });
   
}