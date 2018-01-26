const clog = (a, b = "") => {
	let c = "",
		d = "";
	"err" === b ? (c = "red", d = "[x]") :
		"warn" === b ? (c = "darkorange", d = "[!]") :
		"info" === b ? (c = "dodgerblue", d = "[i]") :
		"ok" === b ? (c = "forestgreen", d = "[+]") :
		c = "black";
	console.log("%c" + d + " " + a, "color:" + c);
};
