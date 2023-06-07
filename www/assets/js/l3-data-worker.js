const s_onData = (data) => {
	postMessage(data);
}
const s_textDecoder = new TextDecoder('utf-8');

function parsePacket(packet) {
	const parts = packet.split(" ");
	if (parts.length < 5)
		return undefined;
	if (parts[0] != 'D')
		return undefined;
	
	return {
		t: parseInt(parts[1], 10)/1000.0,
		v: parts[2],
		p: parts[3],
		s: parseInt(parts[4], 10)
	};
}

onmessage = (event) => {
	processData(event.data, s_onData);
}

function processData(data, onData) {
	const packet = s_textDecoder.decode(data);
	const parsed = parsePacket(packet);
	if (parsed === undefined)
		return;
	
	onData(parsed);
}