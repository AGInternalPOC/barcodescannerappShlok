sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
    ],
    function(Controller,MessageToast,MessageBox) {
      "use strict";
  
      return Controller.extend("barcodescanner.controller.Update", {
        onInit: function() {
            debugger;
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //   oRouter.getRoute("Routedestination").attachPatternMatched(this._onObjectMatched, this);
          oRouter.getRoute("Routedestination2").attachPatternMatched(this._onObjectMatched2, this);
      },

    // _onObjectMatched: function () {
    //     var oModel = this.getView().getModel("employeeData"); // Get JSON model
    //     var oData = oModel.getData();
    
    //     if (oData) {
    //         this.getView().byId("Id").setValue(oData.Id || "");
    //         this.getView().byId("Name").setValue(oData.Name || "");
    //         this.getView().byId("Department").setValue(oData.Department || "");
    //         this.getView().byId("Dob").setValue(oData.Dob || "");
    //         this.getView().byId("Salary").setValue(oData.Salary || "");
    //         this.getView().byId("MobNo").setValue(oData.MobNo || "");
    //     } else {
    //         sap.m.MessageToast.show("No employee data found!");
    //     }
    // },
    
    _onObjectMatched2: function(oEvent) {
        debugger;
        var oModel = this.getView().getModel("employeeData"); // Get JSON model
        var oData = oModel.getData();
    
        if (oData) {
            this.getView().byId("Id").setValue(oData.Id || "");
            this.getView().byId("Name").setValue(oData.Name || "");
            this.getView().byId("Department").setValue(oData.Department || "");
            this.getView().byId("Dob").setValue(oData.Dob || "");
            this.getView().byId("Salary").setValue(oData.Salary || "");
            this.getView().byId("MobNo").setValue(oData.MobNo || "");
        } else {
            sap.m.MessageToast.show("No employee data found!");
        }
        
    },
    
    onSave: function() {
        var oModel = this.getView().getModel(); // Ensure OData model exists
    
        var sId = this.getView().byId("Id").getValue();
        var sName = this.getView().byId("Name").getValue();
        var sDepartment = this.getView().byId("Department").getValue();
        var sDob = this.getView().byId("Dob").getValue();
        var sSalary = this.getView().byId("Salary").getValue();
        var sMobNo = this.getView().byId("MobNo").getValue();
    
        console.log("Input Data: ", sId, sName, sDepartment, sDob, sSalary, sMobNo);

        // Verify the correct OData entity key format
        var sPath = "/EMPSet(Id='" + sId + "',Name='" + sName + "')";
    
        console.log("OData Path: ", sPath);
    
        //Format date in .NET Edm.DateTime format
        var sDobFormatted = "/Date(" + new Date(sDob).getTime() + ")/";
    
        //Ensure salary is a number
        var sSalaryFormatted = parseFloat(sSalary) || 0;
    
        //Create updated data object
        var oUpdatedData = {
            Id: sId,
            Name: sName,
            Department: sDepartment,
            Dob: sDobFormatted,  
            Salary: sSalaryFormatted,  
            MobNo: sMobNo
        };

        console.log("Final OData Payload: ", JSON.stringify(oUpdatedData));
        this.getOwnerComponent().getRouter().navTo("RouteScanner");

        oModel.update( sPath , oUpdatedData, {
            success: function() {
                sap.m.MessageToast.show("Record updated successfully!");
                oModel.refresh(true);
            },
            error: function(oError) {
                console.error("Update Error Details:", oError);
                sap.m.MessageBox.error("Error updating record: " + JSON.stringify(oError.responseText));
            }
        });
    },

    onBack : function() {
        this.getOwnerComponent().getRouter().navTo("RouteScanner");
      }
      });
    }
  );

  
  