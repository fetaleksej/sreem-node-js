var Class = function(){
	this.arPoints = [];
	this.stat5Points = {};
	this.stat16Points = {};
	this.stat100Points = {};
	this.statWPoints = {};
	this.push = function(point){
		if( typeof(point) != "number" )
			return;
		this.arPoints.push(point);
		this.stat5Points[this.get5PointBy100(point)]? this.stat5Points[this.get5PointBy100(point)]++ : this.stat5Points[this.get5PointBy100(point)] = 1;
		this.stat16Points[this.get16PointBy100(point)]? this.stat16Points[this.get16PointBy100(point)]++ : this.stat16Points[this.get16PointBy100(point)] = 1;
		this.statWPoints[this.getWPointBy100(point)]? this.statWPoints[this.getWPointBy100(point)]++ : this.statWPoints[this.getWPointBy100(point)] = 1;
		this.stat100Points[point]? this.stat100Points[point]++: this.stat100Points[point] = 1;
	}
	this.getWPointBy100 = function(point){
		var arW = ["Неудов.", "Удов.", "Хор.", "Отл."];
		return arW[this.get5PointBy100(point) - 2];
	}
	this.get5PointBy100 = function(point){
		point =  parseInt(point);
		if(point >= 90)
			return 5;
		if(point <= 89 && point >= 75)
			return 4;
		if(point <= 74 && point >= 50)
			return 3;
		if(point <= 50 )
			return 2;
	}
	this.get16PointBy100 = function(point){
		point =  parseInt(point);
		if(point >= 95)
			return "A";
		if(point <= 94 && point >= 90)
			return "A-";
		if(point <= 89 && point >= 85)
			return "B+";
		if(point <= 84 && point >= 80)
			return "B";
		if(point <= 79 && point >= 75)
			return "B-";
		if(point <= 74 && point >= 70)
			return "C+";
		if(point <= 69 && point >= 65)
			return "C";
		if(point <= 64 && point >= 60)
			return "C-";
		if(point <= 59 && point >= 55)
			return "D+";
		if(point <= 54 && point >= 50)
			return "D-";
		if(point <= 49 )
			return "F";
	}
}
module.exports = Class;