function calendarPlot(target) {

	if(this instanceof calendarPlot) {
		
		this.target = d3.select(target);
		
		this.Months = ["January", "February", "March", "April", "May", "June",
					   "July", "August", "September", "October", "November",
					   "December"];
		this.weekDays = ["S","M","T","W","Th","F","Sa"];
	
		this.dims = new Object;
		this.dims.margin = {top: 10, right: 10, bottom: 40, left: 10};
		this.dims.width = 700 - this.dims.margin.left - this.dims.margin.right;
		this.dims.columns = 4;
		this.dims.mon = new Object();
		this.dims.cal = new Object();
		this.dims.day = new Object();
		this.dims.mon.width = this.dims.width / this.dims.columns;
		this.dims.cal.width = this.dims.mon.width - (this.dims.mon.width / 8);
		this.dims.day.width = this.dims.cal.width / 7;


		this.dims.day.height = this.dims.day.width * 0.75;
		this.dims.cal.height = this.dims.day.height * 8;
		this.dims.mon.height = this.dims.day.height * 9;
		
		this.style = new Object();
		this.style.font = new Object();
				
		this.style.font.family = "sans-serif";
		this.style.font.ratio = 0.75;
		this.style.font.size = parseInt(this.dims.day.height * this.style.font.ratio, 10) + "px";
		this.style.fill = "#FFF";
		this.style.stroke = "#303030";
		this.style.width = "2px";
		this.style.precision = 2;
	
		return this;
		
	} else {
		
		return new calendarPlot(target);
	
	}

}

calendarPlot.prototype.data = function(data) {

	this.data = data;
	this.dims.height = Math.ceil(this.data.length / this.dims.columns) * this.dims.mon.height;
	
	return this;

}

calendarPlot.prototype.render = function() {
		var colorScale = d3.scale.linear().domain([0,65,3000]).range(["green", "yellow", "red"]);

	var cp = this;
	var plot = cp.target
		.attr("width", cp.dims.width + cp.dims.margin.left + cp.dims.margin.right)
		.attr("height", cp.dims.height + cp.dims.margin.top + cp.dims.margin.bottom)
		.append("g")
			.attr("class", "plot")
			.attr("transform", "translate(" + cp.dims.margin.left + ", " + cp.dims.margin.top + ")")

	var day_data = function(d, i) {
		var op = new Array();
		
		for(var i = 0; i < d.data.day.length; i++) {
			var day = new Object();
			var dt = new Date(d.year, d.month-1, d.data.day[i]);
			day.date = dt;
			day.day = dt.getDay();
			day.week = Math.ceil((dt.getDate() - 1 - dt.getDay()) / 7);
			day.value = d.data.value[i];
			op.push(day);
		}
		return op;
	
	}
	
	var month_data = function(d, i) {
	
		var md = new Array();
				
		var f = new Date(d.year, d.month - 1, 1); // First of Month
		var s = new Date(d.year, d.month - 1, 1 - f.getDay()); // Start of Calendar
		var l = new Date(d.year, d.month, 0); // Last of Month
		var e = new Date(d.year, d.month, 42 - (l.getDate() + f.getDay())); // End of Calendar

		for(var i = 0; i < 42; i++) {
		
			var day = new Object();
			var dt = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i)
			day.date = dt;
			day.day = dt.getDay();
			day.week = Math.floor(i / 7);
			day.value = (dt.getMonth() + 1) == d.month;
			md.push(day);
		}
		
		return md;
		
	}
	
	var months = plot.selectAll("g.month").data(data).enter().append("g")
		.attr("class", "month")
		.attr("transform", function(d, i) {
			var x = (i % cp.dims.columns) * cp.dims.mon.width + (cp.dims.day.width / 2);
			var y = Math.floor(i / cp.dims.columns) * cp.dims.mon.height + (cp.dims.day.height / 2);
			return "translate(" + Math.floor(x) + ", " + Math.floor(y) + ")";
		})
		
	months.append("text")
		.attr("class", "month label")
		.attr("x", Math.floor(cp.dims.cal.width /2))
		.attr("y", Math.floor(cp.dims.day.height / 2))
		.attr("dy", "0.35em")
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", "0.8em")
		.attr("font-weight", "bold")
		.text(function(d) {return cp.Months[d.month -1] + " " + d.year})
		
	months.selectAll("rect.weekday").data(cp.weekDays).enter().append("rect")
		.attr("class", "weekday")
		.attr("x", function(d, i) {return Math.floor(i * cp.dims.day.width)})
		.attr("y", Math.floor(cp.dims.day.height))
		.attr("width", cp.dims.day.width)
		.attr("height", cp.dims.day.height)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", "2px")
		
	months.selectAll("text.weekday").data(cp.weekDays).enter().append("text")
		.attr("class", "weekday")
		.attr("x", function(d, i) {return Math.floor((i + 0.5) * cp.dims.day.width)})
		.attr("y", Math.floor(cp.dims.day.height * 1.5))
		.attr("dy", "0.35em")
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", "0.7em")
		.attr("font-weight", "bold")
		.text(function(d) {return d})
		
		
	months.append("g")
		.attr("class", "grid")
		.attr("transform", "translate(0, " + (cp.dims.day.height * 2) + ")")
		.selectAll("rect.day").data(month_data, function(d) {return d.week + "_" + d.day}).enter().append("rect")
			.attr("class", "day")
			.attr("x", function(d, i) {return d.day * cp.dims.day.width})
			.attr("y", function(d, i) {return d.week * cp.dims.day.height})
			.attr("width", cp.dims.day.width)
			.attr("height", cp.dims.day.height)
			.attr("fill", function(d) {if(d.value) {return "#666"} else {return "#DDD"}})
			.attr("stroke", "black")
			.attr("stroke-width", "2px")
	
	months.selectAll("rect.day").data(day_data, function(d) {return d.week + "_" + d.day})
		.attr("fill", function(d) {return colorScale(d.value)})
}