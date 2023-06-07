let s_pointNavCurrentListIndex = 0;
let s_pointNavOnPoint;

function l3PointNavInit() {
}

function l3PointNavSetOnPointListener(onPoint) {
	s_pointNavOnPoint = onPoint;
}

function l3PointNavGetCurrent() {
	return s_listPoints.at(s_pointNavCurrentListIndex);
}

function l3PointNavCurrent(onFinished) {
	const point = l3PointNavGetCurrent();
	if (s_pointNavOnPoint !== undefined)
		s_pointNavOnPoint(point, onFinished);
	else
		onFinished();
}

function l3PointNavNextWrap(onFinished) {
	if (++s_pointNavCurrentListIndex == s_listPoints.length)
		s_pointNavCurrentListIndex = 0;
		
	l3PointNavCurrent(onFinished);
}

function l3PointNavBackWrap(onFinished) {
	if (--s_pointNavCurrentListIndex < 0)
		s_pointNavCurrentListIndex = s_listPoints.length-1;
	
	l3PointNavCurrent(onFinished);
}

function l3PointNavFirst(onFinished) {
	if (s_pointNavCurrentListIndex != 0) {
		s_pointNavCurrentListIndex = 0;
		
		l3PointNavCurrent(onFinished);
		return;
	}
	onFinished();
}

function l3PointNavLast(onFinished) {
	if (s_pointNavCurrentListIndex != s_listPoints.length-1) {
		s_pointNavCurrentListIndex = s_listPoints.length-1;
		
		l3PointNavCurrent(onFinished);
		return;
	}
	onFinished();
}

function l3PointNavNext(onFinished) {
	if (s_pointNavCurrentListIndex + 1 < s_listPoints.length) {
		++s_pointNavCurrentListIndex;
		
		l3PointNavCurrent(onFinished);
		return;
	}
	onFinished();
}

function l3PointNavBack(onFinished) {
	if (s_pointNavCurrentListIndex - 1 >= 0) {
		--s_pointNavCurrentListIndex;
		
		l3PointNavCurrent(onFinished);
		return;
	}
	onFinished();
}
