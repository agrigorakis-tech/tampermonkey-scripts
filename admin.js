(function mitosADMIN() {
    'use strict';

    window.MITOS = window.MITOS || {};
    MITOS.admin = MITOS.admin || {};
    MITOS.admin.toolbar = MITOS.admin.toolbar || {};

    /*** Configuration ***/
    function getFavoritesConfiguration() {
        return [
            { 
                text: '⚡ Instances', 
                href: MITOS.config.InstancesHash,
                external: false,
                action: () => { MITOS.admin.viewFaultedInstances(); }
            },
            { 
                text: '⚡ Folder Full', 
                href: MITOS.config.FolderFullHash,
                external: true 
            },
            { 
                text: '⚡ Users', 
                href: MITOS.config.UsersHash, 
                external: true 
            },
            { 
                text: '⚡ Views', 
                href: MITOS.config.ViewHash, 
                external: true 
            }
        ];
    }

    /*** HTML ***/
    function favoritesToolbarHTML() {
        const favoritesConfiguration = getFavoritesConfiguration();

        return `
            <div id="mitos-admin-favorites-toolbar">
                ${favoritesConfiguration.map((link, index) => {
                    const attrs = [
                        `id="mitos-admin-toolbar-item-${index + 1}"`,
                        `href="${link.href}"`,
                        `class="mitos-admin-toolbar-link"`,
                        link.external ? `target="_blank"` : ''
                    ].filter(Boolean).join(' ');

                    return `<a ${attrs}>${link.text}</a>`;
                }).join('')}
            </div>`;
    }

    function instanceFolderHTML(folderID) {
        const url = `${MITOS.config.ErbFolderURL}/${folderID}/preview`

        return `
        <li id="mitos-admin-instance-folder-id" class="sparks-info">
            <h5>
                <i translate="ch_Id" class="ng-scope">Folder</i>
                <a href="${url}" target="_blank">
                    <span>
                        <i class="fa fa-folder"></i>&nbsp; ${folderID}
                    </span>
                </a>
            </h5>
        </li>`;
    }

    function instanceActivityHTML(activityDetails) {
        const url = `${MITOS.config.InstanceHistoryURL}/${activityDetails.id}/history/diagram?isAdHoc=0`;

        return `
        <ul id="sparks" class="mitos-admin-instance-details-toolbar">
            <li class="sparks-info">
                <h5>
                    <i class="ng-scope">Activity ID</i>
                    <span>
                        <i class="fa fa-archive"></i>
                        <span class="mitos-admin-instance-detail-text">
                            ${
                                activityDetails.type === "SubProcess"
                                ? `<a href="${url}" 
                                    target="_blank" 
                                    id="mitos-admin-instance-step-in" class="mitos-admin-instance-detail-link">${activityDetails.id}</a>`
                                : activityDetails.id
                            }
                        </span>
                    </span>
                </h5>
            </li>

            <li class="sparks-info">
                <h5>
                    <i class="ng-scope">Description</i>
                    <span>
                        <i class="fa fa-info-circle"></i>
                        <span class="mitos-admin-instance-detail-text">${activityDetails.desc}</span>
                    </span>
                </h5>
            </li>

            <li class="sparks-info">
                <h5>
                    <i class="ng-scope">Type</i>
                    <span>
                        <i class="fa fa-wrench"></i>
                        <span class="mitos-admin-instance-detail-text">${activityDetails.type}</span>
                    </span>
                </h5>
            </li>

            <li class="sparks-info">
                <h5>
                    <i class="ng-scope">State</i>
                    <span>
                        <i class="fa fa-cog"></i>
                        <span 
                            class="mitos-admin-instance-detail-text state-${activityDetails.status}" 
                            style="color:SteelBlue; ${activityDetails.status === "Faulted" ? "cursor:pointer;" : ""}"
                            ${activityDetails.status === "Faulted" ? 'id="mitos-admin-instance-error-trigger"' : ''}
                        >
                            ${activityDetails.status}
                        </span>
                    </span>
                </h5>
            </li>

            <li class="sparks-info" id="mitos-admin-instance-history" style="display:none; cursor:pointer;">
                <h5>
                    <i class="ng-scope mitos-admin-hidden-label">Action 1</i>
                    <span>
                        <i class="fa fa-history"></i>
                        <span class="mitos-admin-instance-detail-text">History</span>
                    </span>
                </h5>
            </li>

            ${activityDetails.status === "Faulted" ? `
                <li class="sparks-info" id="mitos-admin-activity-tree" style="cursor:pointer;">
                    <h5>
                        <i class="ng-scope">Trace</i>
                        <i class="ng-scope mitos-admin-hidden-label">Action 2</i>
                        <span>
                            <i class="fa fa-bug"></i>
                            <span class="mitos-admin-instance-detail-text">Tree</span>
                        </span>
                    </h5>
                </li>

                <li class="sparks-info" id="mitos-admin-instance-error" style="display:none; cursor:pointer;">
                    <h5>
                        <i class="ng-scope mitos-admin-hidden-label">Action 3</i>
                        <span>
                            <i class="fa fa-exclamation-circle" style="color:orange;"></i>
                            <span class="mitos-admin-instance-detail-text">Error</span>
                        </span>
                    </h5>
                </li>
                ` : ''
            }

        </ul>
        `;
    }

    function instanceModalHistoryHTML(title = "", content) {
        return `
            <div id="mitos-admin-instance-modal-history">
                <div class="modal-title-wrapper">
                    <div class="modal-title">${title}</div>
                    <div class="modal-close-btn"><i class="fa fa-times-circle"></i></div>
                </div>
                <div class="modal-message">${content}</div>
            </div>
        `;
    }

    function instanceModalErrorHTML(title = "", content) {
        return `
            <div id="mitos-admin-instance-modal-error">
                <div class="modal-title-wrapper">
                    <div class="modal-title">${title}</div>
                    <div class="modal-close-btn"><i class="fa fa-times-circle"></i></div>
                </div>
                <div class="modal-message">${content}</div>
            </div>
        `;
    }

    function activityTreeModalHTML(title = "Activity List", content) {
        return `
            <div id="mitos-admin-activity-tree-modal">
                <div class="modal-title-wrapper">
                    <div class="modal-title">${title}</div>
                    <div class="modal-close-btn"><i class="fa fa-times-circle"></i></div>
                </div>
                <div id="mitos-admin-activity-tree-body">
                    ${content}
                </div>
            </div>
        `;
    }

    /*** CSS ***/
    function activityTreeModalCSS() {
        return `
            /* Tree container */
            #mitos-admin-activity-tree-body {
                padding: 6px 12px;
                overflow: visible;
            }

            /* Lists */
            #mitos-admin-activity-tree-body ul {
                list-style: none;
                margin: 0;
                padding-left: 16px;
            }

            /* Root list */
            #mitos-admin-activity-tree-body > ul {
                padding-left: 0;
            }

            /* Tree items */
            #mitos-admin-activity-tree-body li {
                margin: 4px 0;
                line-height: 1.5;
                position: relative;
            }

            /* Nested branches */
            #mitos-admin-activity-tree-body li > ul {
                margin-top: 4px;
                padding-left: 16px;
                border-left: 1px solid #666;
            }

            /* Labels (SubProcess, etc.) */
            #mitos-admin-activity-tree-body span {
                display: inline-block;
                white-space: normal;
                word-break: break-word;
            }

            /* Activity links */
            #mitos-admin-activity-tree-body a {
                color: Crimson;
                text-decoration: none;
                display: inline-block;
                white-space: normal;
                word-break: break-word;
            }

            #mitos-admin-activity-tree-body a:hover {
                text-decoration: underline;
            }
        `;
    }

    function favoritesToolbarCSS() {
        return `
            #mitos-admin-favorites-toolbar {
                display: grid !important;
                grid-auto-flow: column;
                align-items: center;
            }

            #mitos-admin-favorites-toolbar a {
                margin-right: 6px;
                font-weight: 600;
                color: #333;
                text-decoration: none;
                border: 1px solid #4646;
                border-radius: 12px;
                padding: 2px 24px 2px 12px;
                box-shadow: 2px 2px 8px lightgray;
                transition: all 0.15s ease;
            }

            #mitos-admin-favorites-toolbar a:hover {
                background-color: #f5f7fa;
                border-color: dodgerblue;
                color: dodgerblue;
                box-shadow: 0 0 4px rgba(30,144,255,0.35);
            }`;
    }

    function instanceToolbarCSS() {
        return `
            #instanceCaseHistory {
                margin-left:1px;
            }

            #instanceCaseHistory > div:nth-child(1) {
                width:fit-content;
            }

            #instanceCaseHistory > div:nth-child(2) {
                width:fit-content;
                margin-bottom:8px;
            }

            .mitos-admin-instance-detail-text {
                padding-left:4px; 
                display:inline !important; 
                font-size:0.90em !important;
            }

            .state-Faulted {
                color: #a90329 !important;
            }

            .state-Completed {
                 color: #356e35 !important;
            }

            .mitos-admin-hidden-label {
                color: transparent;
            }

            @media (min-width: 1701px) {
                #instanceCaseHistory div:nth-child(2) {
                    float:right;
                    }
                }
            `;
    }

    function instanceModalCSS() {
        return `
            #mitos-admin-activity-tree-modal,
            #mitos-admin-instance-modal-history,
            #mitos-admin-instance-modal-error {
                position: absolute;
                min-width: 380px;
                min-height: 200px;
                border: 1px solid grey;
                background: rgba(0, 0, 0, 0.85);
                border-radius: 5px;
                color: white;
                text-align: left;
                z-index: 9;
                display:none;
            }

            #mitos-admin-instance-modal-error {
                left: 186px;
                top: 55px;
                width: 600px;
                max-height: 600px;
                overflow-y: scroll;
            }

            #mitos-admin-activity-tree-modal {
                min-height: 400px;
                left: 472px;
                top: 54px;
                width: 400px;
                max-height: 600px;
                overflow-y: scroll;
            }

            .modal-title-wrapper {
                display: grid;
                padding: 1px 12px;
                grid-template-columns: 1fr 1fr;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                align-items: center;
                color: lightgrey;
            }

            .modal-close-btn {
                font-size: 1.5em;
                justify-self: right;
                color: rgb(225, 83, 109);
                cursor: pointer;
            }

            .modal-message {
                padding: 12px;
                text-align: left;
                line-height: 1.7;
                font-style: italic;
                width: 100%;
            }
        `;
    }

    function activityTreeModalCSS() {
        return `
        div#mitos-admin-activity-tree-body {
            padding: 6px 12px;
        }
        `;
    }

    /*** Events ***/
    function favoritesToolbarEvents() {
        const favoritesConfiguration = getFavoritesConfiguration();

        favoritesConfiguration.forEach((link, index) => {
            const el = document.getElementById(`mitos-admin-toolbar-item-${index + 1}`);

            if (!el) {
                return;
            }

            el.addEventListener('click', (e) => {
                if (link.action) {
                    // Add callback action if configured
                    link.action();
                }
            });
        });
    }

    function instanceToolbarEvents() {
        const mitosHistoryBtn = document.getElementById("mitos-admin-instance-history");
        const mitosHistoryModal = document.getElementById("mitos-admin-instance-modal-history");
        const mitosErrorBtn = document.getElementById("mitos-admin-instance-error-trigger");
        const mitosErrorModal = document.getElementById("mitos-admin-instance-modal-error");
        

        mitosHistoryBtn.addEventListener("click", function() {
            mitosHistoryModal.style.display = "block";
        });

        mitosErrorBtn.addEventListener("click", function() {
            mitosErrorModal.style.display = "block";
        });
    }

    function instanceModalHistoryEvents() {
        const mitosErrorModal = document.getElementById("mitos-admin-instance-modal-history");
        const mitosErrorCloseBtn = document.querySelector("#mitos-admin-instance-modal-history .modal-close-btn");


        mitosErrorCloseBtn.addEventListener("click", function() {
            mitosErrorModal.style.display = "none";
        });
    }

    function instanceModalErrorEvents() {
        const mitosErrorModal = document.getElementById("mitos-admin-instance-modal-error");
        const mitosErrorCloseBtn = document.querySelector("#mitos-admin-instance-modal-error .modal-close-btn");


        mitosErrorCloseBtn.addEventListener("click", function() {
            mitosErrorModal.style.display = "none";
        });
    }

    function activityTreeModalEvents() {
        const mitosActivityTreeBtn = document.getElementById("mitos-admin-activity-tree");
        const mitosActivityTreeModal = document.getElementById("mitos-admin-activity-tree-modal");
        const mitosActivityTreeCloseBtn = document.querySelector("#mitos-admin-activity-tree-modal .modal-close-btn");

        mitosActivityTreeBtn.addEventListener("click", function () {
            mitosActivityTreeModal.style.display = "block";
        });

        mitosActivityTreeCloseBtn.addEventListener("click", function() {
            mitosActivityTreeModal.style.display = "none";
        });
    }

    /*** Helpers ***/
    function fetchInstanceFolderID(instanceID) {
        const url = `${MITOS.config.InstancePropsURL}/${instanceID}/properties`;

        MITOS.api.get(url)
        .then(function (data) {
            const folderID = data?.FolderId ?? "N/A";
            const folderURL = data?.MyFolder.Get ?? "N/A";
            
            if(folderID && folderID !== "") {
                MITOS.admin.toolbar.addInstanceFolder(folderID);
                MITOS.log.info(`Instance <${instanceID}> properties: FolderID: <${folderID}>`);
            }
            else if (folderURL) {
                const match = folderURL.match(/Folder\/(\d+)/);
                const urlFolderID = match ? match[1] : "N/A";

                MITOS.admin.toolbar.addInstanceFolder(urlFolderID);
                MITOS.log.info(`Instance <${instanceID}> properties (URL): FolderID: <${folderID}>`);
            }
            else {
                MITOS.log.warn(`Instance <${instanceID}> properties: FolderID could not be retrieved`);
            }
        })
        .catch(function (err) {
            MITOS.log.error(`Failed to probe properties for instance ${instanceID}: ${err}`);
        });
    }

    function fetchInstanceActivity(instanceID) {
        const url = `${MITOS.config.InstancePropsURL}/${instanceID}/history?pageSize=1000`;

        MITOS.api.get(url)
        .then(function (data) {
            const activitiesTotal = data?.Total ?? 0;

            if(activitiesTotal === 0) {
            
                const lastActivityDetails = {
                    id       : '-',
                    parentId : '-',
                    desc     : '-',
                    type     : '-',
                    status   : 'No activities found',
                    uri      : '-',
                    log      : "",
                    error    : ""
                };
                MITOS.log.info(`Instance <${instanceID}> history: No activities found`);
                MITOS.admin.toolbar.addInstanceActivity(lastActivityDetails);
                return;
            }

            const instanceHistory = data?.Items;
            const activitiesCount = instanceHistory.length;
            const lastActivity = instanceHistory[activitiesCount - 1];

            //Check Items

            const lastActivityDetails = {
                id       : lastActivity?.ActivityId ?? 'N/A',
                parentId : lastActivity?.ParentId ?? 'N/A',
                desc     : lastActivity?.Description ?? 'N/A',
                type     : lastActivity?.ActivityType ?? 'N/A',
                status   : lastActivity?.State ?? 'N/A',
                uri      : lastActivity?.ActivityUri ?? 'N/A',
                log      : lastActivity?.ActivityLog ?? "",
                error    : lastActivity?.ErrorMessage ?? ""
            };
            MITOS.log.info(`Instance <${instanceID}> history: <${instanceHistory.length}> activities`);
            MITOS.admin.toolbar.addInstanceActivity(lastActivityDetails);
        })
        .catch(function (err) {
            MITOS.log.error(`Failed to probe history for instance ${instanceID}: ${err}`);
        });
    }

    async function fetchActivityTree_DEPRECATED(activityId, depth = 0, maxDepth = 9) {
        if (depth > maxDepth) {
            return { id: activityId, truncated: true, children: [] };
        }

        try {
            const url = `${MITOS.config.InstancePropsURL}/${activityId}/history?pageSize=1000`;
            const data = await MITOS.api.get(url);
            const activities = data?.Items || [];

            const treeNodes = [];
          
            for (const act of activities) {
                const node = {
                    id: act.ActivityId,
                    desc: act.Description,
                    type: act.ActivityType,
                    status: act.State,
                };

                // Recurse if SubProcess
                if (act.ActivityType === "SubProcess" && act.State === "Faulted") {

                    const children = await fetchActivityTree(act.ActivityId, depth + 1, maxDepth);

                    // If children is an array, push all into node.children
                    if (Array.isArray(children)) {
                        node.children.push(...children);
                    } else {
                        node.children.push(children);
                    }
                }

                treeNodes.push(node);
            }

            MITOS.log.info(`Instance <${activityId}> activities tree: <${treeNodes.length}> activities`);

            // update modal once per fetch
            if (depth === 0) {
                updateActivityTreeModal(treeNodes);
            }

            return treeNodes;
        } 
        catch (err) {
            console.error(`Failed to fetch activity tree (last activity ID: ${activityId}):`, err);
            return [];
        }
    }

    async function fetchActivityTree(activityId, depth = 0, maxDepth = 9) {
        if (depth >= maxDepth) {
            return { id: activityId, truncated: true, children: [] };
        }

        try {
            const url = `${MITOS.config.InstancePropsURL}/${activityId}/history?pageSize=1000`;
            const data = await MITOS.api.get(url);
            const activities = data?.Items || [];

            const treeNodes = [];

            for (const act of activities) {
                if (act.State !== "Faulted") continue;

                const node = {
                    id: act.ActivityId,
                    desc: act.Description,
                    type: act.ActivityType,
                    status: act.State,
                    children: []
                };

                //  Recurse  for subproccess
                if (act.ActivityType === "SubProcess") {
                    const children = await fetchActivityTree(act.ActivityId, depth + 1, maxDepth);
                    node.children = children;
                }

                treeNodes.push(node);
            }

             // update modal once per fetch
             if (depth === 0) {
                updateActivityTreeModal(treeNodes);
            }
            return treeNodes;
        } 
        catch (err) {
            console.error(`Failed to fetch activity tree (last activity ID: ${activityId}):`, err);
            return [];
        }
    }

    function clearEscapeSequences(str) {
        if (!str) return "";
        return str
            .replace(/\\r/g, '')
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '    ')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
    }

    function sanitizeInstanceErrorMessage(errorMessage) {
        if (!errorMessage) {
            return "No available error message";
        }

        // Clear escaped sequences
        const unescaped = clearEscapeSequences(errorMessage);

        // Normalize sequences
        const normalized = unescaped.replace(/\r\n/g, "\n");

        // Remove call stack
        const firstLine = normalized.split("\n")[0].trim();

        // Split main message and reason
        const [message, reason] = normalized.split("Reason:");

        let reasonDescription = "";
        if (reason) {
            reasonDescription = reason.split("\n")[0].trim();
        }

        return `${message.trim()}<br>${reasonDescription}`;
    }

    function renderActivityTree_DEPRECATED(nodes, level = 0) {
        if (!nodes || !nodes.length) return "";

        // Recursive function to find paths that contain a faulted node
        function includeFaultedPath(node) {
            if (!node) return null;

            // Recursively check children
            const childrenWithFault = (node.children || [])
                .map(includeFaultedPath)
                .filter(Boolean);

            // Include this node if it is faulted or any child is included
            if (node.status === "Faulted" || childrenWithFault.length) {
                return { ...node, children: childrenWithFault };
            }

            return null;
        }

        const faultedPaths = nodes.map(includeFaultedPath).filter(Boolean);

        // Render nodes recursively
        function renderNodes(nodesArray, indent = 0) {
            return `
                <ul style="list-style:none; padding-left:${indent}px;">
                    ${nodesArray.map(node => {
                        const prefix = "⚬ ";
                        const color = node.status === "Faulted" ? "red" : "white";

                        const content = node.type === "SubProcess"
                            ? `<a href="${MITOS.config.InstanceHistoryURL}}/${node.id}/history/diagram?isAdHoc=0" 
                                target="_blank"
                                style="color:${color}; text-decoration:none;">
                                ${node.desc} (${node.type})
                            </a>`
                            : `<span style="color:${color}">${node.desc} (${node.type})</span>`;

                        return `
                            <li>
                                ${prefix}${content}
                                ${node.children && node.children.length ? renderNodes(node.children, indent + 4) : ""}
                            </li>
                        `;
                    }).join("")}
                </ul>
            `;
        }

        return renderNodes(faultedPaths, level * 16);
    }

    function renderActivityTree(nodes, level = 0) {
        if (!nodes || !nodes.length) return "";

        function includeFaultedPath(node) {
            if (!node) return null;

            const childrenWithFault = (node.children || [])
                .map(includeFaultedPath)
                .filter(Boolean);

            if (node.status === "Faulted" || childrenWithFault.length) {
                return { ...node, children: childrenWithFault };
            }

            return null;
        }

        const faultedPaths = nodes.map(includeFaultedPath).filter(Boolean);

        // previousNode is the parent/previous activity
        function renderNodes(nodesArray, indent = 0, previousNode = null) {
            return `
                <ul style="list-style:none; padding-left:${indent}px;">
                    ${nodesArray.map(node => {
                        const prefix = "";
                        const color = node.status === "Faulted" ? "Crimson" : "WhiteSmoke";

                        // Current node link if offered from the previous node
                        const link =
                            previousNode?.type === "SubProcess"
                                ? `${MITOS.config.InstanceHistoryURL}/${previousNode.id}/history/diagram?isAdHoc=0`
                                : null;

                        const content = link
                            ? `
                                <a href="${link}"
                                target="_blank"
                                style="color:${color}; text-decoration:none; border-bottom:1px dotted gray;">
                                    ${node.desc} (${node.type})
                                </a>
                            `
                            : `
                                <span style="color:${color}">
                                    ${node.desc} (${node.type})
                                </span>
                            `;

                        return `
                            <li>
                                ${prefix}${content}
                                ${
                                    node.children && node.children.length
                                        ? renderNodes(node.children, indent + 4, node)
                                        : ""
                                }
                            </li>
                        `;
                    }).join("")}
                </ul>
            `;
        }

        return renderNodes(faultedPaths, level * 16, null);
    }
    
    function updateActivityTreeModal(treeNodes) {
        const body = document.getElementById("mitos-admin-activity-tree");

        MITOS.dom.observer.element("#mitos-admin-activity-tree-body", () => {
            const body = document.getElementById("mitos-admin-activity-tree-body");
            
            body.innerHTML = renderActivityTree(treeNodes);
            MITOS.log.info("Activity list has been updated");
        });
    }

    function updateFaultedInstancesCount(instanceCount) {
        const el = document.getElementById("mitos-admin-toolbar-item-1");

        var faultedinstancesColor = "cadetblue";

        if(instanceCount > 4) {
            faultedinstancesColor = "orangered";
        }
        else if(instanceCount > 8) {
            faultedinstancesColor = "Crimson";
        }

        if (el) {
            el.innerHTML = `⚡ Instances | <span style="font-weight:500; color:${faultedinstancesColor};">${instanceCount}</span>`;
        }

        // Flash effect
        el.style.transition = "background-color 0.3s ease";
        el.style.backgroundColor = "lightgoldenrodyellow";
            setTimeout(() => {
                el.style.backgroundColor = "";
        }, 500);
    }

    /*** Methods ***/
    MITOS.admin.refreshInstances = function refreshInstances() {
        MITOS.dom.observer.element('button[ng-click="instanceCasesCtrl.refreshList()"]', function(el) {
            el.click();
        });
    }

    MITOS.admin.viewFaultedInstances = function viewFaultedInstances() {
        MITOS.dom.observer.element('select[ng-model="instanceCasesCtrl.filterState.selectedStates"]', function(el) {
            /*for (const option of el.options) {
                option.selected = option.value === 'Faulted';
            }*/

            el.value = "Faulted";
            el.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
                MITOS.admin.refreshInstances();
            }, 500);
        });
    }

    MITOS.admin.probeFaultedInstances = function probeFaultedInstances(intervalMs = 60000) {
        var url = MITOS.config.InstancesFaulted;

        function pollFaultedInstances() {
            MITOS.api.get(url)
            .then(function (data) {
                const faultedInstancesCount = data?.Total;
                MITOS.log.info("Updating faulted instances count: " + faultedInstancesCount);
                updateFaultedInstancesCount(faultedInstancesCount);
            })
            .catch(function (err) {
                MITOS.log.error("Failed to probe faulted instances count: " + err);
            });
        }

        pollFaultedInstances();

        if(!intervalMs) {
            // Skip interval
            return;
        }

        // Run interval
        return setInterval(pollFaultedInstances, intervalMs);
    }

    MITOS.admin.toolbar.addFavorites = function renderFavoritesToolbar() {
        MITOS.log.info("Admin Toolbar | Adding Favorites . . .");

        if(MITOS.dom.elementExists(".mitos-admin-toolbar")) {
            MITOS.log.info("Favorites Toolbar is already available");
            return;
        }

        // Inject CSS
        MITOS.dom.css(favoritesToolbarCSS(), "mitos-admin-favorites-css");
        // Inject HTML
        MITOS.dom.html("#logo-group", "afterend", favoritesToolbarHTML());
        // Events
        MITOS.dom.observer.element("#mitos-admin-favorites-toolbar", favoritesToolbarEvents);
    }

    MITOS.admin.toolbar.addInstanceDetails = async function renderInstanceToolbar(match) {
        const instanceID = match[1];

        // API request -> Calls addInstanceFolder()
        fetchInstanceFolderID(instanceID); 
        // API request -> Calls addInstanceActivity()
        fetchInstanceActivity(instanceID); 
        // API request -> addInstanceActivityTree()
        let activityTree = await fetchActivityTree(instanceID);
        let activityTreeHTML = renderActivityTree(activityTree);
        // Render
        MITOS.admin.toolbar.addInstanceActivityTree(activityTreeHTML);
    }

    MITOS.admin.toolbar.addInstanceFolder = function renderInstanceFolderID(folderID) {
        MITOS.log.info("Instance Toolbar | Addding Instance Folder . . .");

        if(MITOS.dom.elementExists("#mitos-admin-instance-folder-id")) {
            MITOS.log.info("Instance Folder is already available");
            return;
        }

        // Inject HTML
        MITOS.dom.html("#sparks", "afterbegin", instanceFolderHTML(folderID));
    }

    MITOS.admin.toolbar.addInstanceActivity = function renderInstanceActivity(activityDetails) {
        MITOS.log.info("Admin Toolbar | Adding Instance Details . . .");

        if(MITOS.dom.elementExists(".mitos-admin-instance-details-toolbar")) {
            MITOS.log.info("Instance Details are already available");
            return;
        }

        // Inject CSS
        MITOS.dom.css(instanceToolbarCSS(), "mitos-admin-instance-details-css");
        MITOS.dom.css(instanceModalCSS(), "mitos-admin-instance-modal-css");
        // Inject HTML
        const errorMessage = sanitizeInstanceErrorMessage(activityDetails.error);
        MITOS.dom.html("#instanceCaseHistory > div", "replace", instanceActivityHTML(activityDetails));
        MITOS.dom.html("#mitos-admin-instance-history", "afterend", instanceModalHistoryHTML("History Log", activityDetails.log));
        MITOS.dom.html("#mitos-admin-instance-error", "afterend", instanceModalErrorHTML("Error Details", errorMessage));
        // Events
        MITOS.dom.observer.element(".mitos-admin-instance-details-toolbar", instanceToolbarEvents);
        MITOS.dom.observer.element("#mitos-admin-instance-history", instanceModalHistoryEvents);
        MITOS.dom.observer.element("#mitos-admin-instance-error", instanceModalErrorEvents);
    }

    MITOS.admin.toolbar.addInstanceActivityTree = function renderInstanceActivityTree(activityTreeHTML) {
        MITOS.log.info("Admin Toolbar | Adding Instance activity tree . . .");

        if(MITOS.dom.elementExists("#mitos-admin-activity-tree-modal")) {
            MITOS.log.info("Instance activity tree is already available");
            return;
        }

        // Inject CSS
        MITOS.dom.css(activityTreeModalCSS(), "mitos-admin-activity-tree-modal-css");
        // Inject HTML
        MITOS.dom.html("#mitos-admin-activity-tree", "afterend", activityTreeModalHTML("Activity List", activityTreeHTML));
        // Events
        MITOS.dom.observer.element("#mitos-admin-activity-tree", activityTreeModalEvents);


        
    }
})();