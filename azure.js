(function mitosAzure() {
    'use strict';

    window.MITOS = window.MITOS || {};
    window.MITOS.azure.api = window.MITOS.azure.api || {};

    function apiRequest({ method, url, data = null, headers = {} }) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                data: data ? JSON.stringify(data) : null,

                onload: (res) => {
                    log(method, url, "->", res.status);

                    try {
                        resolve(JSON.parse(res.responseText));
                    } 
                    catch (e) {
                        resolve(res.responseText);
                    }
                },

                onerror: (err) => {
                    MITOS.log.error("Azure API request error: " + err);
                    reject(err);
                }
            });
        });
    }

    function buildAuthHeader(pat) {
        if (!pat) throw new Error("Azure PAT is missing");

        return {
            Authorization: "Basic " + btoa(":" + pat)
        };
    }

    window.MITOS.azure.api.get = function (url, pat) {
        return apiRequest({ method: "GET", url, headers: buildAuthHeader(pat) });
    };

    window.MITOS.azure.api.post = function (url, data, pat) {
        return apiRequest({ method: "POST", url, data, headers: buildAuthHeader(pat) });
    };
})();
