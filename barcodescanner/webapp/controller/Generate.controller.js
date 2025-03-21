sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
    ],
    function(Controller,MessageBox, MessageToast, JSONModel) {
      "use strict";
  
      return Controller.extend("barcodescanner.controller.Generate", {
        onInit: function() {
          // $.getScript("https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js")
            
        },

        GenerateQRCode: function () {
          
          var baseURL = "https://quickchart.io/qr?text=";
          var gId = this.getView().byId("GIId").getValue();
          var gName = this.getView().byId("GIName").getValue();
          var gDepartment = this.getView().byId("GIDepartment").getValue();
          var gDob = this.getView().byId("GIDob").getValue();
          var gSalary = this.getView().byId("GISalary").getValue();
          var gMobNo = this.getView().byId("GIMobNo").getValue();

          var dateInMillis = new Date(gDob).getTime(); // Convert date to timestamp
          var formattedDate = "/Date(" + dateInMillis + ")/";

          var finalObject = {
              "Id": gId,
              "Name": gName,
              "Dob": formattedDate,
              "MobNo": gMobNo,
              "Department": gDepartment,
              "Salary": Number(gSalary)
          };

          console.log(finalObject);

          this.finalString = JSON.stringify(finalObject);

          console.log(this.finalString);

          var url = baseURL + this.finalString;
          this.byId("imgId").setSrc(url);
        },

        // GenerateBarCode: function () {
        //   var oImage = this.getView().byId("imgId2");

        //     // Generate Barcode
        //     JsBarcode(oImage.getDomRef(),this.finalString, {
        //         format: "CODE128", // Barcode format
        //         lineColor: "#000",
        //         width: 2,
        //         height: 50,
        //         displayValue: true
        //     });
        // }

      });
    }
  );
  