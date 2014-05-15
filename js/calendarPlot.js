function calendarPlot(target) {

	if(this instanceof calendarPlot) {

		this.data = [];
	
		this.calculateDims = function(t) {
		
			var dim = new Object();
			dim.margin = t.dims.margin
			dim.totalWidth = t.dims.totalWidth;
			dim.width = dim.totalWidth - dim.margin.left - dim.margin.right;;
			dim.columns = t.dims.columns;
			dim.mon = new Object();
			dim.cal = new Object();
			dim.day = new Object();
					
			dim.day.width = dim.width / (dim.columns * 8);
			dim.mon.width = dim.day.width * 8
			dim.cal.width = dim.day.width * 7;

			dim.day.height = (dim.day.width * 0.75);
			dim.cal.height = dim.day.height * 8;
			dim.mon.height = dim.day.height * 9;
			
			dim.height = Math.ceil(t.data.length / dim.columns) * dim.mon.height;

			return dim;
			
		}
	
		this.target = d3.select(target);
		
		this.Months = ["January", "February", "March", "April", "May", "June",
					   "July", "August", "September", "October", "November",
					   "December"];
		this.weekDays = ["S","M","T","W","Th","F","Sa"];
	
		this.dims = new Object;
		this.dims.margin = {top: 10, right: 10, bottom: 40, left: 10};
		this.dims.totalWidth = 700;
		this.dims.columns = 4;
		this.dims = this.calculateDims(this);
			
		return this;
		
	} else {
		
		return new calendarPlot(target);
	
	}

}

calendarPlot.prototype.addData = function(data) {

	this.data = data;
	this.dims = this.calculateDims(this);
	return this;

}

calendarPlot.prototype.columns = function(columns) {
	this.dims.columns = columns;
	this.dims = this.calculateDims(this);
	return this;
}

calendarPlot.prototype.width = function(width) {
	this.dims.totalWidth = width;
	this.dims = this.calculateDims(this);
	return this;
}

calendarPlot.prototype.margin = function(margins) {
	if(margins.length === undefined) {
		this.dims.margin = {top: margins, right: margins, bottom: margins, left: margins};
	} else if(margins.length == 1) {
		this.dims.margin = {top: margins[0], right: margins[0], bottom: margins[0], left: margins[0]};	
	} else if(margins.length == 2) {
		this.dims.margin = {top: margins[0], right: margins[1], bottom: margins[0], left: margins[1]};
	} else if(margins.length == 3) {
		this.dims.margin = {top: margins[0], right: margins[1], bottom: margins[2], left: margins[1]};
	} else {
		this.dims.margin = {top: margins[0], right: margins[1], bottom: margins[2], left: margins[3]};
	}
	this.dims = this.calculateDims(this);
	return this;
}

calendarPlot.prototype.standard = function(standard) {
	this.standard = standard
	return this;
}

calendarPlot.prototype.colorScale = function(min, standard, max) {
	this.colorScale = [min, standard, max];
	return this;
}

calendarPlot.prototype.render = function() {
	
	var colorScale = d3.scale.linear().domain([0,65,3000]).range(["green", "yellow", "red"]);
	var textScale = d3.scale.linear().domain([0, 65, 3000]).range(["white", "#333", "white"])
	
	var cp = this;
	var plot = cp.target
		.attr("width", cp.dims.width + cp.dims.margin.left + cp.dims.margin.right)
		.attr("height", cp.dims.height + cp.dims.margin.top + cp.dims.margin.bottom)
		.append("g")
			.attr("class", "plot")
			.attr("transform", "translate(" + cp.dims.margin.left + ", " + cp.dims.margin.top + ")")

	var showData = function(d, i, t, obj) {
	
		var hide = function(sel) {
		
			sel.selectAll("rect.popup")
				.transition()
					.delay(0)
					.duration(0)
					.attr("x", t.attr("x"))
					.attr("y", t.attr("y"))
					.attr("width", t.attr("width"))
					.attr("height", t.attr("height"))
					.remove()
			sel.selectAll("text.popup")
				.transition()
					.delay(0)
					.duration(0)
					.attr("opacity", 1e-6)
					.remove()
			sel.transition().delay(0).duration(0).remove();
		}
				
		var p = d3.select(t.parentNode);
		var t = d3.select(t);
		
		hide(d3.selectAll("g.popup"))
		
		var pop = p.append("g")
			.attr("class", "popup")
			.on("mouseout", function() {hide(pop)})
		
		pop.append("rect")
			.attr("class", "popup")
			.attr("x", t.attr("x"))
			.attr("y", t.attr("y"))
			.attr("width", obj.dims.day.width)
			.attr("height", obj.dims.day.height)
			.attr("stroke-width", "2px")
			.attr("stroke", "#333")
			.attr("fill", t.attr("fill"))
			.transition()
				.delay(0)
				.duration(20)
				.attr("x", t.attr("x") - obj.dims.day.width / 2)
				.attr("y", t.attr("y") - obj.dims.day.height / 2)
				.attr("width", obj.dims.day.width * 2)
				.attr("height", obj.dims.day.height * 2)
		
		pop.append("text")
			.attr("class", "popup")
			.attr("x", parseInt(t.attr("x"), 10) + (obj.dims.day.width / 2))
			.attr("y", parseInt(t.attr("y"), 10) + (obj.dims.day.height / 2))
			.attr("fill", function() {
				if(d3.hsl(t.attr("fill")).l > 0.25) {
					return "white";
				} else {
					return "#303030";
				}
			})
			.attr("dy", "0.35em")
			.attr("text-anchor", "middle")
			.attr("font-weight", "bold")
			.attr("font-size", function() {
				var fs = (cp.dims.day.height * 1.1);
				var dvl = d.value.toString().length
				if(dvl > 4) {fs = fs * 4 / dvl};
				fs = parseInt(fs, 10) + "px";
				return fs + "px"
			})
			.attr("opacity", 1e-6)
			.text(d.value)
			.transition()
				.delay(5)
				.duration(20)
				.attr("opacity", 1);
	
		var blah = "blah";
	
	}
			
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
		.attr("opacity", 0)
			
	months
		.transition()
			.delay(function(d, i) {return (100 + Math.floor(i / cp.dims.columns) * 50)})
			.duration(200)
			.attr("opacity", 1)

		
	months.append("text")
		.attr("class", "month label")
		.attr("x", Math.floor(cp.dims.cal.width /2))
		.attr("y", Math.floor(cp.dims.day.height / 2))
		.attr("dy", "0.35em")
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", (cp.dims.day.height * 0.75) + "px")
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
		.attr("font-size", (cp.dims.day.height * 0.75) + "px")
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
		.on("mouseover", function(d, i) {showData(d, i, this, cp)})
}