let s_onTopbarShow;
let s_onTopbarLogout;

function l3TopbarInit() {
	const bkgLogoutLinkEl = document.getElementById('l3-bkg-logout-link');
	bkgLogoutLinkEl.onclick = () => {
		if (s_onTopbarLogout !== undefined)
			s_onTopbarLogout();
	}
}

function l3TopbarSetOnLogoutListener(onLogout) {
	s_onTopbarLogout = onLogout;
}

function l3TopbarSetOnShowListener(onShow) {
	s_onTopbarShow = onShow;
}

function l3TopbarBkgModeShow() {
	const topbarEl = document.getElementById('l3-topbar');
	const logoEl = document.getElementById('l3-topbar-logo');
	const bkgLogoutEl = document.getElementById('l3-bkg-logout');	
	const fadeinCls = 'l3-anim-topbar-fadein'
	const fadeoutCls = 'l3-anim-topbar-fadeout'
	topbarEl.style.display = 'none';
	
	if (!logoEl.classList.contains(fadeinCls)) {
		logoEl.classList.add(fadeinCls);
	}
	if (!bkgLogoutEl.classList.contains(fadeinCls)) {
		bkgLogoutEl.classList.remove(fadeoutCls);
		bkgLogoutEl.classList.add(fadeinCls);
		bkgLogoutEl.style.display = null;
		const bkgLogoutLinkEl = document.getElementById('l3-bkg-logout-link');
		bkgLogoutLinkEl.disabled = false;
	}
}

function l3TopbarActiveModeShow() {
	const topbarEl = document.getElementById('l3-topbar');
	const bkgLogoutEl = document.getElementById('l3-bkg-logout');
	const fadeinCls = 'l3-anim-topbar-fadein'
	const fadeoutCls = 'l3-anim-topbar-fadeout'
	topbarEl.style.display = null;
	bkgLogoutEl.style.display = 'none';
	
	if (topbarEl.classList.contains(fadeinCls))
		return;
	
	topbarEl.classList.add(fadeinCls);
	const animated = document.querySelector('#l3-topbar.l3-anim-topbar-fadein');
	animated.onanimationend = () => {
		if (s_onTopbarShow !== undefined)
			s_onTopbarShow();
	};
}

function l3TopbarBkgLogoutHide() {
	const bkgLogoutEl = document.getElementById('l3-bkg-logout');
	const fadeinCls = 'l3-anim-topbar-fadein'
	const fadeoutCls = 'l3-anim-topbar-fadeout'
	
	if (!bkgLogoutEl.classList.contains(fadeoutCls)) {
		bkgLogoutEl.classList.remove(fadeinCls);
		bkgLogoutEl.classList.add(fadeoutCls);
		const bkgLogoutLinkEl = document.getElementById('l3-bkg-logout-link');
		bkgLogoutLinkEl.disabled = false;
	}
}