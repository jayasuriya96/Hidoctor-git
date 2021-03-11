/*
Created By      : Chakkaravarthi C
Created Date    : 07-07-2017
For             : Hourly In Jio Report
*/


var HourlyInJio = {
    defaults: {
        "MapList": [],
        "cur_User_Code": "",
        "Company_Code": "",
        "selectUserCode":"",
    },
    initialize: function () {

        //Overlay Pop Modal
        $("#dvMoreInfoModal").overlay({
            onBeforeLoad: function () {
            },
            onLoad: function () {
            }
        });

        $("#txtFromDate").datepicker({
            dateFormat: 'dd-mm-yy'
        });
        $("#txtToDate").datepicker({
            dateFormat: 'dd-mm-yy'
        });

        fnTreePosiition("tree");
        
        //fnGetUserTreeByUser(HourlyInJio.defaults.User_Code, "dvUserTree", "dvFilteredNode");
        fnShowFullTree(HourlyInJio.defaults.cur_User_Code, "tree", filterNodeId, "No")
        //fnDCRConsolidatedReport();
        //$('#dvPreviousNode').click(function () { fnBindUsersWithOneLevelParent(); });
        $('#txtSearchNode').bind("keypress", function (e) {
            if (e.keyCode == 13) {                       
                fnSearchUsers();
                return false;
            }
        });

      
        $(".btnGo").click(function () {
            HourlyInJio.GetHourlyReport();
        });


    },
    blockUI: function (dvId) {
        $('#' + dvId).block({
            message: '<img src="../../Content/images/loader1.gif" width="40px" height="40px"  />',
            css: {
                padding: 0,
                margin: 0,
                width: '30%',
                top: '40%',
                left: '35%',
                textAlign: 'center',
                color: '#000',
                border: 'none',
                backgroundColor: 'rgba(0,0,0,0)',
                //opacity: 0.6,
                cursor: 'wait'
            },

            // minimal style set used when themes are used 
            themedCSS: {
                width: '30%',
                top: '40%',
                left: '35%'
            },

            // styles for the overlay 
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.6,
                cursor: 'wait'
            },

            // style to replace wait cursor before unblocking to correct issue 
            // of lingering wait cursor 
            cursorReset: 'default',
        })
    },
    UnblockUI: function (dvId) {
        $('#' + dvId).unblock();
    },
    GetHourlyReport: function ()
    {
        var startDate = $("#txtFromDate").val();
        var toDate = $("#txtToDate").val();
        $.ajax({
            start: HourlyInJio.blockUI("dvContainerHourly"),
            type: 'GET',
            url: "HDReports/HourlyRptDetails/" + HourlyInJio.defaults.Company_Code + "/"+HourlyInJio.defaults.selectUserCode+"/" + startDate + "/"+toDate+"",
            dataType: 'json',
            success: function (jsonData) {
                if (jsonData != undefined && jsonData != null) {
                    HourlyInJio.BindHourlyReport(jsonData);
                }
            },
            error: function (e) {
                HourlyInJio.UnblockUI("dvContainerHourly");
            },
            complete: function () {
                HourlyInJio.UnblockUI("dvContainerHourly");
            }
        });
    }, BindHourlyReport: function (jsonData)
    {
        strTable += "<table class='data display datatable dataTable table' id='tblHourlyReportJio'><thead><tr><th>DCR Date</th><th>Doctor Name</th><th>MDL Number</th><th>Specility</th></tr></thead><tbody>";
        for (var i = 0; i < jsonData.length; i++) {
            strTable += "<tr><td>" + jsonData[i].DCR_Date + "</td><td>" + jsonData[i].Doctor_Name + "</td><td>" + jsonData[i].MDL_Number + "</td><td>" + jsonData[i].Speciality + "</td>";
        }
        strTable += "</tbody></table>";
        $("#dvHourlyReport").html(strTable);

    }
}