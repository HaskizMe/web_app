let s_dataWorker = null;
let s_dataOnData;

function l3DataInit() {
	
}

function l3DataSetOnDataListener(onData) {
	s_dataOnData = onData;
}

function l3DataStartWorker() {
	if (s_dataWorker)
		throw new Error("Worker already started");
	
	s_dataWorker = new Worker("assets/js/l3-data-worker.js");
	s_dataWorker.onmessage = (event) => {
		if (s_dataOnData !== undefined)
			s_dataOnData(event.data);
	}
}

function l3DataStopWorker() {
	if (s_dataWorker == null)
		return;
	
	const worker = s_dataWorker;
	s_dataWorker = null;
	s_dataOnData = undefined;
	worker.terminate();
}

function l3DataProcessDataView(dataView) {
	if (s_dataWorker) {
		s_dataWorker.postMessage(dataView);
	}
}