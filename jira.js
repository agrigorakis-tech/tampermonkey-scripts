(function jira() {
	'use strict'; 

  // Add MITOS class
  window.JIRA = window.JIRA || {}; 

  //
  const now = new Date();
  const dateTime = now.toLocaleString('en-GB');
  console.log(`🧩 ${dateTime} [INFO] [GitHub] JIRA module loaded`);

	function tfsToolbarHTML(status, reason, changeDate, sprint, commentCount, comments, bugKey) {

		const maxVisible = 1;
		const visibleComments = (comments || []).slice(-maxVisible);

		const commentBlocks = visibleComments.map(c => {
			const text = (() => {
				const tmp = document.createElement("div");
				tmp.innerHTML = c.text;
				return tmp.textContent || tmp.innerText || "";
			})();
			const user = c?.revisedBy?.displayName ?? '';

			return `
			<div class="tfs-comment-item">
				<div class="tfs-comment-user">${user}</div>
				<div class="tfs-comment-text">${text}</div>
			</div>
			`;
		}).join("");

		const hasMore = comments.length > maxVisible;

		const readMore = hasMore
			? `<a 
					href="https://tfs.relationalfs.com/IA2_Collection/erb-ib/_workitems/edit/${bugKey}" 
					target="_blank"
					class="tfs-read-more">
					Read more...
			</a>`
			: "";

		return `
		<div id="tfsToolbar">
			<img src="https://www.incredibuild.com/wp-content/uploads/2021/03/Azure-1.png" />
			
			<div class="tfs-item">
				<div class="label">Sprint</div>
				<div class="value">${sprint ?? '-'}</div>
			</div>
			
			<div class="tfs-item">
				<div class="label">Status</div>
				<div class="value status-${status}">${status ?? '-'}</div>
			</div>

			<div class="tfs-item">
				<div class="label">Reason</div>
				<div class="value">${reason ?? '-'}</div>
			</div>

			<div class="tfs-item">
				<div class="label">Date</div>
				<div class="value">${changeDate ?? '-'}</div>
			</div>

			<div class="tfs-item">
				<div class="label">Comments</div>
				<div class="value">${commentCount ?? '-'}</div>
			</div>

			<div class="tfs-item">
				<img id="toggle-tfs-comment" src="https://cdn-icons-png.flaticon.com/512/16799/16799604.png">
			</div>
		</div>

		<div id="tfsComment">
			${commentBlocks}
		</div>
		`;
	}

  	function tfsToolbarCSS() {
	    return `
	        #tfsToolbar {
			    display: flex;
			    gap: 18px;
			    align-items: center;
			    border: 1px solid lightgray;
			    box-shadow: 2px 2px 12px lightgray;
			    margin-left: 12px;
			    margin-top: 12px;
			    padding: 6px 24px 6px 12px;
			    font-family: Arial, sans-serif;
			    font-size: 13px;
			    background: #fff;
			    border-top-left-radius: 4px;
			    border-top-right-radius: 4px;
				width: 70%;
			}
	
	        #tfsToolbar > img {
	            height: 38px;
	            border-radius: 50%;
	        }
	
	        #tfsToolbar .tfs-item {
	            display: flex;
	            flex-direction: column;
	            line-height: 1.2;
	            min-width: 80px;
	        }
	
	        #tfsToolbar .label {
			    padding-bottom: 6px;
	            font-size: 11px;
	            color: #777;
	        }
	
	        #tfsToolbar .value {
	            font-weight: 600;
	            color: #222;
	        }

			.tfs-comment-user {
			 	opacity: 0.75;
				background: lightblue;
				width: fit-content;
				padding-left: 12px;
				padding-right: 12px;
				border-radius: 12px;
			}

			#tfsComment {
			    padding-left: 24px;
			    padding-right: 12px;
			    padding-top: 4px;
			    text-shadow: 2px 2px 4px lightgray;
			    border: 1px solid lightgray;
			    margin: 0px 0px 0px 12px;
			    border-bottom-left-radius: 4px;
			    border-bottom-right-radius: 4px;
			    min-height: 62px;
			    display: none;
			    align-content: center;
				width: 70%;
			}

			#toggle-tfs-comment {
				width: 24px;
				height: 24px;
				border-radius: 0px;
				cursor: pointer;
			}
	    `;
	}
	
	JIRA.isLabelNumeric = function(value) {
		return /^\d+$/.test(value);
	}
  
	JIRA.getTicketLabels = function() {
		const spans = document.querySelectorAll(".labels .lozenge span");
	
		return Array.from(spans).map(span => ({
		text: span.textContent.trim(),
		element: span
		}));
	}

	JIRA.filterTicketLabels = function() {
		const labels = JIRA.getTicketLabels();  
		return labels.filter(label =>/^\d{5}$/.test(label.text?.trim()));
	}

	JIRA.addTfsToolbar = function renderTfsToolbar(bugKey, workItem, commentCount, comments) {

		MITOS.log.info("TFS Toolbar | Ticket Details ...");

		if (MITOS.dom.elementExists("#tfsToolbar")) {
			MITOS.log.info("TFS Toolbar already exists");
			return;
		}

		// Extract values
		const status = workItem.fields["System.State"];
		const reason = workItem.fields["System.Reason"];
		const changeDate = workItem.fields["System.ChangedDate"];
		const sprint = workItem.fields["System.IterationPath"];

		// Inject CSS
		MITOS.dom.css(tfsToolbarCSS(), "tfs-toolbar-css");

		// Inject HTML
		MITOS.dom.html("#issuedetails", "afterend", tfsToolbarHTML(status, reason, changeDate, sprint, commentCount, comments, bugKey));
	};

	JIRA.ping = function(caller = "Unknown") {
			const now = new Date();
			const dateTime = now.toLocaleString('en-GB');
			console.log(`🧩 ${dateTime} [INFO] [${caller}] JIRA module loaded`);
	}
})();
