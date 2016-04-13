/*global exports,require*/

"use strict";

const https = require("https");

function request(evt, ctx, cb)
{
    var cbcalled = false, data;
    try {
        data = JSON.stringify(evt);
    } catch (e) {
        console.error("exception stringifying json", evt, e);
        cb(e, null);
        return;
    }
    var opts = {
        hostname: "www.homework.software",
        port: 443,
        path: "/oauth/request",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };
    var req = https.request(opts, (res) => {
        var ret = "";
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            ret += chunk;
        });
        res.on('end', () => {
            try {
                var out = JSON.parse(ret);
                if (!cbcalled) {
                    cb(null, out);
                    cbcalled = true;
                }
            } catch (e) {
                console.error("exception parsing json", ret, e);
                if (!cbcalled) {
                    cb(e, null);
                    cbcalled = true;
                }
            }
        });
    });

    req.on("error", (e) => {
        console.error("error posting request", e);
        if (!cbcalled) {
            cb(e, null);
            cbcalled = true;
        }
    });

    req.write(data);
    req.end();
}

exports.handler = function(event, context, callback) {
    request(event, context, callback);
};
