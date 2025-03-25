sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ndc/BarcodeScanner",
],
function (Controller,MessageBox, MessageToast, JSONModel, BarcodeScanner) {
    "use strict";

    return Controller.extend("barcodescanner.controller.Scanner", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel({});
            this.getView().setModel(oModel, "employeeData");
        },
        
        onScan: function () {
            var that = this;
            BarcodeScanner.scan(
                function (mResult) {
                    if (!mResult.cancelled) {
                        try {
                            MessageBox.show("We got a QR code\n" +
                                "Result: " + mResult.text + "\n" +
                                "Format: " + mResult.format + "\n");
        
                            var scannedText = mResult.text.trim(); // Remove extra spaces and parse JSON properly
                            console.log("Raw Scanned Data:", scannedText);

                            that.scannedData = JSON.parse(scannedText); // Convert scanned string into a JSON object
                            console.log("Raw Scanned Data:", scannedText);

                            // Check if JSON has expected properties

                            if (that.scannedData && typeof that.scannedData === "object") {
                                var empId = that.scannedData["Id"] || "N/A";
                                var empName = that.scannedData["Name"] || "Unknown";
        
                                console.log("Extracted ID:", empId);
                                console.log("Extracted Name:", empName);
        
                                // Set values in UI fields
                                that.getView().byId("eid").setValue(empId);
                                that.getView().byId("ename").setValue(empName);
        
                                MessageBox.success("QR Code Scanned Successfully!\n" +
                                    "ID: " + empId + "\n" +
                                    "Name: " + empName);
                            } else {
                                throw new Error("Invalid JSON format.");
                            }
                        } catch (e) {
                            MessageBox.error("Invalid QR Code format. Please try again.");
                            console.error("Parsing error:", e);
                        }
                    }
                },
                function (Error) {
                    alert("Scanning failed: " + Error);
                }
            );
        },
        
        PostData: function () {
            var that = this;
            if (!that.scannedData) {
                MessageToast.show("No data scanned. Please scan QR code first.");
                return;
            }
        
            var oModel = this.getOwnerComponent().getModel(); // Get OData model
        
            oModel.create("/EMPSet", that.scannedData, {
                success: function (oData, response) {
                    MessageToast.show("Data posted successfully!");
                    console.log("POST Success:", oData);
                },
                error: function (oError) {
                    MessageBox.error("Failed to post data. See console for details.");
                    console.error("POST Error:", oError);
                }
            });
        },
        
        onSearch: function(oEvent) {
            console.log(oEvent);
        },
        
        onBeforeRebindTable: function (oEvent) {
            var empId = this.getView().byId("eid").getValue();
            var empName = this.getView().byId("ename").getValue();
            var bindingParams = oEvent.getParameter("bindingParams");

            if (this.applyfilters){
            var aFilters = [
                new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, empId),
                new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.EQ, empName)
            ];
        
            // Combine filters with AND condition
            var oCombinedFilter = new sap.ui.model.Filter({
                filters: aFilters,
                and: true // Ensures both conditions must match
            });
           
            bindingParams.filters.push(oCombinedFilter);
            }
        },
        
        GetData: function () {
            var that = this;
            var empId = this.getView().byId("eid").getValue();
            var empName = this.getView().byId("ename").getValue();
           
            // if (!that.scannedData || !empId || !empName) {     // when we want to go with only scanned datra
            if (!empId || !empName) {                             // when we want to allow mannual search ,check for Input feilds is editable allowed or not
                MessageToast.show("Scanned data is incomplete. Please scan again.");
                return;
            }
            var oTable = that.getView().byId("idSmartTable");
            this.applyfilters = true;
            oTable.rebindTable();
            var oModel = this.getOwnerComponent().getModel(); // Get OData model
        },

        onRowSelection: function(oEvent) {
            var oSelectedItem = oEvent.getSource().getSelectedContexts()[0];
            if (!oSelectedItem) {
                sap.m.MessageToast.show("No row selected!");
                return;
            }
        
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            var oSelectedData = oSelectedItem.getObject(); // Get selected row data

            var oModel = new sap.ui.model.json.JSONModel(oSelectedData);
            this.getOwnerComponent().setModel(oModel, "employeeData");

            // oRouter.navTo("Routedestination");
            oRouter.navTo("Routedestination2"); 

        },

        loadalldata: function () {
            var that = this;
            var oTable = that.getView().byId("idSmartTable"); // Get SmartTable reference
        
            if (!oTable) {
                console.error("SmartTable not found.");
                return;
            }
        
            var oModel = this.getOwnerComponent().getModel(); // Get OData model
        
            oTable.setModel(oModel);      // Ensure the SmartTable is bound to the correct entity set
            this.applyfilters = false ;

            oTable.rebindTable(); // Force data reload
        
            MessageToast.show("All data loaded successfully!");
        },
        
        ToGenerate: function() {
            this.getOwnerComponent().getRouter().navTo("Routegenerate");
        }
    });
});

