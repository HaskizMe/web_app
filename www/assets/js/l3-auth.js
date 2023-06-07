function l3ErrorMessage(){
	const errorMessage = "Incorrect username or password";
	document.getElementById("error-message").innerHTML = errorMessage;
	document.getElementById("error-message").classList.remove("hidden");
}

function _l3AuthMockAuth(email, password, onSuccess, onFailure) {
	setTimeout(()=>{
		if (password !== 'Cancer') {
			l3ErrorMessage();
			onFailure();
			return;
		}
		const account = l3AccountCheck(email);
		if (account === undefined) {
			l3ErrorMessage();
			onFailure();
			return;
		}
		onSuccess(account);
	}, 3000);
}

function _l3AuthMockVerifyAccess(access, onSuccess, onFailure) {
	setTimeout(()=> {
		onSuccess(access);
	}, 2000);
}

function l3AuthClear() {
	window.sessionStorage.removeItem('access');
}

function l3AuthGetAccessToken(onSuccess, onFailure) {
	const onFailed = () => {
		l3AuthClear();
		onFailure();
	}
	const json = window.sessionStorage.getItem('access');	
	if (!json) {
		onFailed();
		return;
	}
	try {
		const access = JSON.parse(json);
		let ok = true;
		if (typeof access.key !== 'string')
			ok = false;
		if (typeof access.name !== 'string')
			ok = false;
		if (typeof access.role !== 'string')
			ok = false;
		
		ok ? onSuccess(access) : onFailed();
	}
	catch (_) {
		onFailed();
	}
}

function l3AuthVerifyAccessToken(onSuccess, onFailure) {
	l3AuthGetAccessToken(
		(access) => {
			_l3AuthMockVerifyAccess(access,
				(verifiedAccess)=> {
					onSuccess(verifiedAccess);
				},
				() => {
					onFailure();
				});
		},
		() => {
			onFailure();
		});
}

function l3AuthAuthenticate(email, password, onBusy, onSuccess, onFailure) {	
	onBusy(true);
	_l3AuthMockAuth(email, password,
		(resp) => {
			const access = {
				key: resp.key,
				name: resp.name,
				role: resp.role
			};
			window.sessionStorage.setItem('access', JSON.stringify(access));
			onBusy(false);
			onSuccess();
		},
		() => {			
			onBusy(false);
			onFailure();
		});
}