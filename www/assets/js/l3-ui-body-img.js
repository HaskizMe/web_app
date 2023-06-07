let s_bodyImg;
let s_bodyImgMap = new Map();

function _l3BodyImgCalcBitmapPosAndSize(canvas, image) {
	const scale = canvas.height/image.height;
	const imageWidth = image.width * scale;
	const imageHeight = image.height * scale;
	const imageX = (canvas.width - imageWidth)/2;
	const imageY = 0;
	return {
		width: imageWidth,
		height:imageHeight,
		ix: imageX,
		iy: imageY
	};
}

function _l3BodyImgDrawBitmapAndPoints(canvas, context, image, pointId, bitmapId, showAllPoints) {
	context.clearRect(0,0, canvas.width, canvas.height);
	
	const pos = _l3BodyImgCalcBitmapPosAndSize(canvas, image);	
	context.drawImage(image, pos.ix, pos.iy, pos.width, pos.height);
	
	const pointArray = s_bodyImgMap.get(bitmapId)
	for (const i of pointArray)	{
		const pointInfo = s_mapPoints.get(i);
		
		const px = pointInfo.maleMarkerX / 100.0;
		const py = pointInfo.maleMarkerY / 100.0;
		
		let radius;
		let fillStyle;
		let lineWidth;
		let strokeStyle;
		
		if (i == pointId) {
			radius = pos.width / 46;
			fillStyle = '#ffff00';//'#32cd32';
			lineWidth = 1.2;
			strokeStyle = '#000000ff';//'#003300';
		}
		else {
			if (!showAllPoints)
				continue;
			
			radius = pos.width / 86;
			fillStyle = '#d3d3d380';
			lineWidth = .8;
			strokeStyle = '#000000ff';
		}
		
		
		const pointX = (pos.height * px) + pos.ix;
		const pointY = (pos.height * py) + pos.iy;
		
		context.beginPath();
		context.arc(pointX, pointY, radius, 0, 2 * Math.PI, false);	
		context.fillStyle = fillStyle;
		context.fill();
		context.lineWidth = lineWidth;
		context.strokeStyle = strokeStyle;
		context.stroke();
	}
}

class BodyImage {
	constructor(canvasId) {
		this.canvasId = canvasId;
		this.image = new Image();
		this.loaded = false;
	}
	
	updateDisplay(pointId, bitmapId, imageUrl, showAllPoints) {
		const canvas = document.getElementById(this.canvasId);
		const context = canvas.getContext('2d');
		
		if (this.image.src != imageUrl) {
			const inst = this;
			this.image.onload = function() {
				inst._loaded = true;
				_l3BodyImgDrawBitmapAndPoints(canvas, context, inst.image, pointId, bitmapId, showAllPoints);
			}			
			this.loaded = false;
			this.image.src = imageUrl;
		}
		else {
			_l3BodyImgDrawBitmapAndPoints(canvas, context, this.image, pointId, bitmapId, showAllPoints);
		}
	}
}

function l3BodyImgInit() {
	s_bodyImg = new BodyImage('l3-bbmp-canvas');
	
	const pointSet = new Set();
	for (const i of s_listPoints)
		pointSet.add(i.pointId);
	
	s_mapPoints.forEach((value, key) => {
		if (!s_bodyImgMap.get(value.bitmapId))
			s_bodyImgMap.set(value.bitmapId, new Array());
	});
	s_mapPoints.forEach((value, key) => {
		if (pointSet.has(key))
			s_bodyImgMap.get(value.bitmapId).push(key);
	});
}

function l3BodyImgUpdateDisplay(pointId, showAllPoints) {
	const pointInfo = s_mapPoints.get(pointId);
	const bitmapInfo = s_mapBbmps.get(pointInfo.bitmapId);
	
	const imgUrl = 'assets/img/bbmps/' + bitmapInfo.img;	
	s_bodyImg.updateDisplay(pointId, pointInfo.bitmapId, imgUrl, showAllPoints);
}