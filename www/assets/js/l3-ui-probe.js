let s_l3ProbeIndicatorList = new Array();

class ProbeIndicator {
	constructor(canvasId) {
		this.canvasId = canvasId;
		this.enabled = false;
		this.draw(this.enabled);
	}
	
	enable(enabled) {
		if (this.enabled == enabled)
			return;
		this.enabled = enabled;
		this.draw(this.enabled);
	}
	
	draw(enabled) {
		const canvas  = document.getElementById(this.canvasId);
		const context = canvas.getContext('2d');
		const posX    = canvas.width/2;
		const posY    = canvas.height/2;
		const radius1 = canvas.width/2.5;
		const radius2 = canvas.width/3.5;
		const radius3 = canvas.width/12;
		
		context.rect(0,0, canvas.width, canvas.height);
		context.fillStyle = 'white';
		context.fill();
		
		context.beginPath();
		context.arc(posX, posY, radius1, 0, 2 * Math.PI, false);
		context.fillStyle = enabled ? '#00ff00' : '#0B9CA230';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#39709090';
		context.stroke();
		
		context.beginPath();
		context.arc(posX, posY, radius2, 0, 2 * Math.PI, false);
		context.fillStyle = '#0B9CA2F6';
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = '#39709040';
		context.stroke();
		
		context.beginPath();
		context.arc(posX, posY, radius3, 0, 2 * Math.PI, false);
		context.fillStyle = '#397090';
		context.fill();
	}
}

function l3ProbeIndicatorInit() {	
	s_l3ProbeIndicatorList.push(new ProbeIndicator('l3-probe1-canvas'));
	s_l3ProbeIndicatorList.push(new ProbeIndicator('l3-probe2-canvas'));
	s_l3ProbeIndicatorList.push(new ProbeIndicator('l3-probe3-canvas'));
	s_l3ProbeIndicatorList.push(new ProbeIndicator('l3-probe4-canvas'));
}

function l3ProbeIndicatorEnable(num) {
	console.log("Probe num: " + num);
	let i = 0;
	for (const j of s_l3ProbeIndicatorList) {
		if (++i == num)
			j.enable(true);
		else
			j.enable(false);
	}
}
