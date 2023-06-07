let s_autoAdvIsChecked = false;

function l3AutoAdvInit() {
	const cb = document.getElementById('l3-auto-adv-cb');
	cb.onchange = function() {
		s_autoAdvIsChecked = this.checked;
	}
}

function l3AutoAdvIsChecked() {
	return s_autoAdvIsChecked;
}