(function mitosLOG() {
	'use strict'; 

	// Add MITOS class
	window.MITOS = window.MITOS || {}; 
	// Add MITOS log class
	MITOS.log = MITOS.log || {}; 

	//
	const now = new Date();
	const dateTime = now.toLocaleString('en-GB');
	console.log(`🧩 ${dateTime} [INFO] [GitHub] LOG module loaded`);
	
	const defaultDomain = window.location.host;

	function logStack() {
		const stack = new Error().stack;		
		return stack;
	}

	function formatStack(stack) {
		const formattedStack = stack
			.split('\n')
			.slice(1)                   
			.map(line => line
				.trim()
				.replace(/^at\s+/, '')        // remove "at "
				.replace(/\s*\(.*\)/, '')     // remove "(...url...)"
				.replace(/^Object\./, '')     // remove Object.
				.replace(/\s*\[as.*\]/, '')   // remove [as alias]
				.trim()
			)
			.filter(name =>
				name &&
				name.length > 2 &&             // remove short names
				!/^[a-z]\./.test(name) &&      // remove minified objects
				!name.toLowerCase().includes('anonymous') &&
				!name.toLowerCase().includes('userscript') &&
				!name.toLowerCase().includes('window')
			);

		return formattedStack.reverse().join(' ⤷ ');
	}

	function logger(message, stack=null, domain=defaultDomain, level="INFO", icon="⚙️", style="") {
		const now = new Date();
		const dateTime = now.toLocaleString('en-GB');
		
		// // Get current call stack
		if(stack == null) {
			
			stack = logStack();
		}

		// Format call stack
		stack = formatStack(stack);
		
		const domainStyle = "color: gray; font-weight:normal;";
		const resetStyle = "all: unset; font-weight:normal;";
		
		console.groupCollapsed(`%c${icon} ${dateTime} ${level} %c[${domain}] %c:: ${message}`, style, domainStyle, resetStyle);
		console.log("🕵 Stack Trace: " + stack);
		console.groupEnd();
	}; 

	MITOS.log.info = function(message, stack=null, domain=defaultDomain) {
		logger(message, stack, domain, "[INFO] ", "🔵", "color: SteelBlue; font-weight:normal;");
	}

	MITOS.log.warn = function(message, stack=null, domain=defaultDomain) {
		logger(message, stack, domain, "[WARN] ", "🟡", "color: Orange; font-weight:normal;");
	}

	MITOS.log.error = function(message, stack=null, domain=defaultDomain) {
		logger(message, stack, domain, "[ERROR]", "🔴", "color: Crimson; font-weight:normal;");
	}
})
();
