(function jira() {
	'use strict'; 

	// Add MITOS class
	window.JIRA = window.JIRA || {}; 

	//
	const now = new Date();
	const dateTime = now.toLocaleString('en-GB');
	console.log(`🧩 ${dateTime} [INFO] [GitHub] JIRA module loaded`);

  JIRA.isLabelNumeric = function(value) {
    return /^\d+$/.test(value);
  }
  
	JIRA.getTicketLabels = function() {
    const spans = document.querySelectorAll(".labels li a span");
  
    return Array.from(spans).map(span => ({
      text: span.textContent.trim(),
      element: span
    }));
  }

  JIRA.filterTicketLabels = function() {
      const labels = JIRA.getTicketLabels();  
      return labels.filter(label => JIRA.isLabelNumeric(label.text));
  }
();
