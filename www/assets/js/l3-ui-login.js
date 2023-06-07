let s_onAuthenticated;

function _l3LoginSend(email,pass) {
	const loginEl      = document.getElementById('l3-login');
	const loginImgEl   = document.getElementById('l3-login-image');
	const loginBtnEl   = document.getElementById('l3-login-btn');
	const inputDivEl   = document.getElementById('l3-login-input-div');
	const inputEmailEl = document.getElementById('l3-login-email-input');
	const inputPassEl  = document.getElementById('l3-login-pass-input');
	
	l3AuthAuthenticate(email, pass,
		(busy) => {
			if (busy) {
				loginImgEl.classList.add('l3-anim-pulse');
				loginEl.classList.add('l3-anim-login-trim');
				loginBtnEl.disabled = true;
				inputDivEl.style.display = 'none';
			} else {
				loginEl.classList.remove('l3-anim-login-trim');
				inputDivEl.style.display = null;
				loginBtnEl.disabled = false;
				loginImgEl.classList.remove('l3-anim-pulse');
			}
		},
		() => {
			inputEmailEl.value = "";
			inputPassEl.value = "";
			const loginEl = document.getElementById('l3-login');
			loginEl.style.visibility = 'hidden';
			
			s_onAuthenticated();
		},
		() => {
		});
}

function l3LoginInit() {
	const formEl = document.getElementById('l3-login-form');
	formEl.addEventListener('submit', function(e) {
		e.preventDefault();
		const jsonFormData = {};
		for (const pair of new FormData(this))
			jsonFormData[pair[0]] = pair[1];
		
		_l3LoginSend(jsonFormData['email'], jsonFormData['password']);
	});
}

function l3LoginAccessToken(onAuthenticated, needsLogin) {
	l3AuthVerifyAccessToken(
		(access) => {
			onAuthenticated();		
		},
		() => {
			needsLogin();
		});
}

function l3Login(onAuthenticated) {
	s_onAuthenticated = onAuthenticated;
	const loginEl = document.getElementById('l3-login');
	loginEl.style.visibility = 'visible';
}