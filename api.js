(function mitosAPI() {
    'use strict';

    window.MITOS = window.MITOS || {};
    MITOS.api = MITOS.api || {};

    //
	const now = new Date();
	const dateTime = now.toLocaleString('en-GB');
	console.log(`🧩 ${dateTime} [INFO] [GitHub] API module loaded`);

    function apiRequest({ method = "GET", url, data = null}) {
        return new Promise((resolve, reject) => {
            
            try {
                // Fetch Authorization token
                const token = localStorage.getItem('ls.token')?.replace(/^"|"$/g, '');

                if (!token) {
                    MITOS.log.error("Could not fetch authorization token");
                    return reject(new Error("Could not fetch authorization token"));
                }

                GM_xmlhttpRequest({
                    method,
                    url,
                    headers: {
                        "Authorization": "Bearer " + token, 
                        "Content-Type": "application/json"
                    },
                    // Payload
                    data: data ? JSON.stringify(data) : null,
                    // Request
                    onload: res => {
                        MITOS.log.info("MITOS API [" + method + "] <" + url + "> | Completed " + res.status);
                        try {
                            resolve(JSON.parse(res.responseText));
                        } 
                        catch (err) {
                            MITOS.log.warn("MITOS API [" + method + "] <" + url + "> | Could not parse response data: " + err);
                            reject(err);
                        }
                    },
                    onerror: err => {
                        MITOS.log.error("MITOS API [" + method + "] <" + url + "> | Failed: " + err);
                        reject(err);
                    }
                });

            } 
            catch (err) {
                MITOS.log.error("MITOS API request error:" + err);
                reject(err);
            }
        });
    }

    MITOS.api.get = function mitosAPI_GET(url) {

        return apiRequest({ method: "GET", url });
    }

    MITOS.api.post = function mitosAPI_POST(url) {
        
        return apiRequest({ method: "POST", url, data });
    }
})();
