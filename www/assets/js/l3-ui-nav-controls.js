const l3NavButton = {
	First: 0,
	Back:  1,
	Next:  2,
	Last:  3
}

let s_navControlsRef = 0;
let s_navControlsOnButton;
/*
let s_navControlsOnButton = (navButton, onFinished) => {
	switch (navButton)
	{
	case l3NavButton.First:
		console.log("First");
		break;
	case l3NavButton.Back:
		console.log("Back");
		break;
	case l3NavButton.Next:
		console.log("Next");
		break;
	case l3NavButton.Last:
		console.log("Last");
		break;
	}
	setTimeout(onFinished, 2000);
}
*/

function _l3NavControlInstallHandler(el, navButton, onDisable, onEnable) {	
	const onFinished = () => {
		--s_navControlsRef;
		onEnable();
	}
	el.onclick = () => {
		if (s_navControlsOnButton === undefined)
			return;
		if (s_navControlsRef == 0) {
			++s_navControlsRef;
			onDisable();
			s_navControlsOnButton(navButton, onFinished);
		}
	}
}

function l3NavControlsInit() {
	const navFirstEl = document.getElementById('l3-nav-first');
	const navBackEl  = document.getElementById('l3-nav-back');
	const navNextEl  = document.getElementById('l3-nav-next');
	const navLastEl  = document.getElementById('l3-nav-last');
	
	const onDisable = () => {
		navFirstEl.classList.remove('l3-nav-button');
		navBackEl.classList.remove('l3-nav-button');
		navNextEl.classList.remove('l3-nav-button');
		navLastEl.classList.remove('l3-nav-button');
	}
	const onEnable = () => {
		navFirstEl.classList.add('l3-nav-button');
		navBackEl.classList.add('l3-nav-button');
		navNextEl.classList.add('l3-nav-button');
		navLastEl.classList.add('l3-nav-button');
	}
	
	_l3NavControlInstallHandler(navFirstEl, l3NavButton.First, onDisable, onEnable);
	_l3NavControlInstallHandler(navBackEl, l3NavButton.Back, onDisable, onEnable);
	_l3NavControlInstallHandler(navNextEl, l3NavButton.Next, onDisable, onEnable);
	_l3NavControlInstallHandler(navLastEl, l3NavButton.Last, onDisable, onEnable);

}

function l3NavControlsSetNavButtonListener(onNavButton) {
	s_navControlsOnButton = onNavButton;
}