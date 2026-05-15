(function mitosSPA() {
    'use strict';

    window.MITOS = window.MITOS || {};
    MITOS.spa = MITOS.spa || {};

    function hasQueryParams(hash) {
        return hash.includes('?');
    }

    function stripQueryParams(hash) {
        return hash.split('?')[0];
    }

    MITOS.spa.listener = function(routes) {
        MITOS.log.info("Registering SPA listener . . .");
        let lastRouteId = null;

        function processRoute() {
            const  hash = location.hash;

            routes.forEach((route, index) => {
                // Normalize hash
                const normalizedHash = route.ignoreParams
                    ? stripQueryParams(hash)
                    : hash;

                // Check match method
                let match = null;

                if(route.method === "regex") {
                    const regex = route.match instanceof RegExp
                        ? route.match
                        : new RegExp(route.match);

                    match = normalizedHash.match(regex);
                }
                else {
                    if(route.exact) {
                        // Exact match
                        if (normalizedHash === route.match) {
                            match = [normalizedHash];
                        }
                    }
                    else {
                        // Includes match
                        (normalizedHash.includes(route.match));
                        match = [normalizedHash];
                    }
                }

                if(!match) {
                   // Skip
                    return
                }

                // Filter navigation 'noise'
                const routeId = index + "|" + normalizedHash;

                if (routeId === lastRouteId) {
                    return;
                }

                lastRouteId = routeId;

                MITOS.log.info("Matched SPA route: <" + normalizedHash + ">");
                route.onEnter(match, hash);
            });
        }

        // Hook History API
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(this, arguments);
            processRoute('pushState');
        };

        const replaceState = history.replaceState;
        history.replaceState = function() {
            replaceState.apply(this, arguments);
            processRoute('replaceState');
        };

        // Back/forward & hash changes
        window.addEventListener('popstate', () => processRoute('popstate'));
        window.addEventListener('hashchange', () => processRoute('hashchange'));

        // Initial
        processRoute();
    };

    MITOS.spa.ping = function(caller = "Unknown") {
		const now = new Date();
		const dateTime = now.toLocaleString('en-GB');
		console.log(`🧩 ${dateTime} [INFO] [${caller}] SPA module loaded`);
	}
})();
