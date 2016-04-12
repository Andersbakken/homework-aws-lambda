/*global exports*/

"use strict";

function Homework()
{
}

Homework.prototype = {
    execute: function(event, context, callback) {
        if (event.header.namespace in this.handlers) {
            this.handlers[event.header.namespace].call(this, event, context, callback);
        } else {
            console.error("Unknown execute request", JSON.stringify(event));
        }
    },

    handlers: {
        "Alexa.ConnectedHome.Discovery": function(event, context, callback) {
            const token = event.payload.accessToken;

            const discovery = {
                "DiscoverAppliancesRequest": (response) => {
                    response.payload = {
                        discoveredAppliances: [
                            {
                                actions: [
                                    "incrementTargetTemperature",
                                    "decrementTargetTemperature",
                                    "setTargetTemperature"
                                ],
                                additionalApplianceDetails: {
                                    extraDetail1: "optionalDetailForSkillAdapterToReferenceThisDevice",
                                    extraDetail2: "There can be multiple entries",
                                    extraDetail3: "but they should only be used for reference purposes.",
                                    extraDetail4: "This is not a suitable place to maintain current device state"
                                },
                                applianceId: "uniqueThermostatDeviceId",
                                friendlyDescription: "descriptionThatIsShownToCustomer",
                                friendlyName: "Bedroom Thermostat",
                                isReachable: true,
                                manufacturerName: "yourManufacturerName",
                                modelName: "fancyThermostat",
                                version: "your software version number here."
                            },
                            {
                                actions: [
                                    "incrementPercentage",
                                    "decrementPercentage",
                                    "setPercentage",
                                    "turnOn",
                                    "turnOff"
                                ],
                                additionalApplianceDetails: {},
                                applianceId: "uniqueLightDeviceId",
                                friendlyDescription: "descriptionThatIsShownToCustomer",
                                friendlyName: "Living Room",
                                isReachable: true,
                                manufacturerName: "yourManufacturerName",
                                modelName: "fancyLight",
                                version: "your software version number here."
                            }
                        ]
                    };
                }
            };

            var response = {
                header: {
                    namespace: "Alexa.ConnectedHome.Discovery",
                    name: "DiscoverAppliancesResponse",
                    payloadVersion: "2"
                },
                payload: ""
            };

            if (event.header.name in discovery) {
                discovery[event.header.name](response);
            } else {
                console.error(event.header.name, "is not a valid discovery");
            }

            console.log("about to return", JSON.stringify(response));

            callback(null, response);
        },
        "Alexa.ConnectedHome.Control": function(event, context, callback) {
            const token = event.payload.accessToken;

            const deviceId = event.payload.appliance.applianceId;
            const messageId = event.header.messageId;

            const control = {
                "TurnOnRequest": (response) => {
                    response.payload = { };
                    console.log(`turning on device ${deviceId} with token ${token}`);
                }
            };

            var response = {
                header: {
                    namespace: "Alexa.ConnectedHome.Control",
                    name: "TurnOnConfirmation",
                    payloadVersion: "2",
                    messageId: messageId
                },
                payload: ""
            };

            if (event.header.name in control) {
                control[event.header.name](response);
            } else {
                console.error(event.header.name, "is not a valid control");
            }

            callback(null, response);
        }
    }
};

exports.handler = function(event, context, callback) {
    var homework = new Homework();
    homework.execute(event, context, callback);
};
