Math.prototype.median = function(values) {
	values.sort(function(a,b) {return a - b;});
	var half = Math.floor(values.length / 2)'
	if(values.length % 2)
		return values[half];
	else
		return (values[half-1] + values[half]) / 2.0;
}

Math.prototype.mean = function(values) {

	var m = 0;
	for(var i = 0; i < values.length; i++) {
		m = m + values[i]
	}
	
	return m / values.length;

}

Math.prototype.percentile = function(values, percentiles) {

	values.sort(function(a,b) {return a - b;});
	var percs = new Array();
	
	for(var i = 0; i < percentiles.length; i++) {
		var R = percentiles[i] * (values.length + 1)
		var IR = Math.floor(R);
		if(R == IR) {
			percs.push(values[R - 1]);
		else {
			var FR = R - IR;
			percs.push(values[IR - 1] + ((values[IR - 1] - values[IR]) * FR));
		}
	}
	return percs;
}