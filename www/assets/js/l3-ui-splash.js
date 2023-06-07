function l3SplashInit() {
	
}

function l3SplashStart(onFinished) {
	const splashEl = document.getElementById('l3-splash-logo');
	const animCls = 'l3-anim-splash';
	if (!splashEl.classList.contains(animCls)) {
		splashEl.classList.add(animCls);
		const animated = document.querySelector('#l3-splash-logo');		
		animated.onanimationend = () => {
			onFinished();
		}
	}
} 