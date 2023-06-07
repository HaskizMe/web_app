let s_onPair;

function l3ConnectInit() {
	const pairBtnEl = document.getElementById('l3-pair-btn');
	pairBtnEl.onclick = () => {
		pairBtnEl.style.display = 'none';
		if (s_onPair !== undefined)
			s_onPair();
	}
}

function l3ConnectSetOnPairListener(onPair) {
	s_onPair = onPair;
}

function l3ConnectPairShow() {
	const pairEl = document.getElementById('l3-ble-pair');
	const pairBtnEl = document.getElementById('l3-pair-btn');
	const pairDivEl = document.getElementById('l3-pair-div');
	const connDivEl = document.getElementById('l3-conn-div');
	pairBtnEl.style.display = null;
	connDivEl.style.display = 'none';
	pairDivEl.style.display = null;
	pairEl.classList.remove('l3-ble-pair-trim');
	pairEl.style.visibility = 'visible';
}

function l3ConnectConnectingShow() {
	const pairEl = document.getElementById('l3-ble-pair');
	const pairBtnEl = document.getElementById('l3-pair-btn');
	const pairDivEl = document.getElementById('l3-pair-div');
	const connDivEl = document.getElementById('l3-conn-div');
	pairBtnEl.style.display = 'none';
	connDivEl.style.display = null;
	pairDivEl.style.display = 'none';
	pairEl.classList.add('l3-ble-pair-trim');
	pairEl.style.visibility = 'visible';
}

function l3ConnectHide() {
	const pairEl = document.getElementById('l3-ble-pair');
	pairEl.style.visibility = 'hidden';
}

function l3ConnectBleErrorShow(bleStatus) {
	l3ConnectHide();
	const dlgEl = document.getElementById('l3-dialog-ble-e1');
	dlgEl.style.visibility = 'visible';
}
