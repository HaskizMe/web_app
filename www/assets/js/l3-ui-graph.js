let s_graphChart;
let s_graphOnComplete;

const s_controlState = {
	CONTROL_STATE_RESET_START           : 0,
    CONTROL_STATE_RESET                 : 1,
    CONTROL_STATE_READING_START         : 2,
    CONTROL_STATE_PWM_ADVANCE           : 3,
    CONTROL_STATE_PWM_CHECK_REST        : 4,
    CONTROL_STATE_VOLL_CHECK_THRESHOLD  : 5,	
    CONTROL_STATE_VOLL_CHECK_REST       : 6,
    CONTROL_STATE_PWM_CHECK_MAX         : 7,
    CONTROL_STATE_VOLL_REST             : 8,
    CONTROL_STATE_FLAT_LINE_CHECK       : 9,
    CONTROL_STATE_HOLD                  : 10,
    CONTROL_STATE_READING_COMPLETE      : 11,
    CONTROL_STATE_MANUAL_MODE_START     : 12,
    CONTROL_STATE_MANUAL_MODE           : 13
};

function l3GraphInit() {
	const canvas = document.getElementById('l3-graph-canvas');
	const context = canvas.getContext('2d');
	
	s_graphChart = new Chart(context, {
		type: 'line',
		data: {
			datasets: [{
				label: 'Voll',
				backgroundColor: '#ff0000',
				borderColor: '#397090b0',
				fill: false
			}]
		},
		options: {
			responsive: true,
			maintainAspectRation: false,
			legend: {
				display: false
			},
			elements: {
				point: {
					radius: 0
				}
			},
			title: {
				display: false
			},
			scales: {
				xAxes: [{
                type: 'linear',
                position: 'bottom',
                ticks: {
                    min: 0,
                    suggestedMax: 4.5
                }
				}],
				yAxes: [{
					ticks: {
						min: 0,
						max: 100
					}  
				}]
			}
		}
	});
}

function l3GraphSetOnCompleteListener(onComplete) {
	s_graphOnComplete = onComplete;
}

function l3GraphClear() {
	s_graphChart.data.datasets[0].data.length = 0;
	s_graphChart.update();
}

let s_graphState = {
	drawBuf: new Array(),
	track: false,
	draw: false,
	complete: false
};

function l3GraphData(packet) {
	switch (packet.s)
	{
	case s_controlState.CONTROL_STATE_READING_START:
		s_graphChart.data.datasets[0].data.length = 0;
		s_graphState.drawBuf.length = 0;
		s_graphState.track = true;
		s_graphState.draw = false;
		s_graphState.complete = false;
		break;
		
	case s_controlState.CONTROL_STATE_READING_COMPLETE:
		if (!s_graphState.complete) {
			s_graphState.complete = true;
			if (s_graphOnComplete !== undefined)
				s_graphOnComplete();
		}
		break;
	
	case s_controlState.CONTROL_STATE_RESET_START:		
	case s_controlState.CONTROL_STATE_RESET:		
	case s_controlState.CONTROL_STATE_VOLL_REST:		
		s_graphState.track = false;
		s_graphState.draw = false;
		return;
	}
	
	if (s_graphState.track) {
		s_graphState.drawBuf.push({x: packet.t, y: packet.v});
		if (packet.v > 5) {
			s_graphState.track = false;
			s_graphState.draw = true;
			Array.prototype.push.apply(s_graphChart.data.datasets[0].data, s_graphState.drawBuf);
			s_graphState.drawBuf.length = 0;
			s_graphChart.update(0);
		}
	}	
	if (s_graphState.draw) {
		s_graphChart.data.datasets[0].data.push({x: packet.t, y: packet.v});
		s_graphChart.update();
	}
}