d3.selection.prototype.appendHTML = function(HTMLString) {
	return this.select(function() {
		return this.appendChild(
			document.importNode(
				new DOMParser().parseFromString(HTMLString, "text/html").body
					.childNodes[0],
				true
			)
		);
	});
};