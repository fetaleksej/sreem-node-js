var CChart3D = function(id,  title){
  if( google.visualization == undefined )
    throw new Error("PieChart unload");
  this.chart = new google.visualization.PieChart(id);

  this.title = title;
  this.draw3D = function(data){
    var arData = [["",""]];
    arData = google.visualization.arrayToDataTable(arData.concat(data));
    
    var options = {
      title: this.title,
      legend: "none",
      backgroundColor: "none",
      titleTextStyle:{
        color: "#70A1C9",
        fontName : "MyriadPro",
        fontSize : 14
      },
      is3D: true,
    };

    this.chart.draw(arData, options);
  }
}
//------------------------------------------------------------------------------------------------------
var CSwitcher = function(){
  this.arType = ["5", "A", "%"];
  this.serverType = [5, 16, 100];
  this.curPos = 0;
  this.scrollTimerHandel = null;
  this.startAnimateSwitcher = function(idClick, idSlide){
    this.idClick = idClick;
    this.idSlide = idSlide;
    this.pixelOnTop = parseInt($(idClick).css("top"));
    var self = this;
    $(idClick).click(function(){
      self.onClick.call(self);
    });
    $(document).scroll(function(obj){
      self.onScroll.call(self, obj);
    });
  }
  this.onScroll = function(obj){
    if(this.scrollTimerHandel)
      clearTimeout(this.scrollTimerHandel);
    var self = this;
    this.scrollTimerHandel = setTimeout(function(){
      $(self.idClick).animate({top: self.pixelOnTop + window.pageYOffset},300);
    },100);
  };
  this.onClick = function(){
    this.curPos = ++this.curPos % this.arType.length;
    var str = this.arType[this.curPos];
    $(this.idSlide).hide('slide', {direction: 'left'}, 300,function(){
      $(this).html(str);
      $(this).show('slide', {direction: 'left'}, 300);
    });
    this.changeTypePiont(this.serverType[this.curPos]);
  }
  this.changeTypePiont = function(d){};
}
//------------------------------------------------------------------------------------------------------
var CMain = function(){
  CSwitcher.call(this);
  this.countLoaded = 0;
  this.timestampList = 0;
  this.timestampStat = 0;
  this.point = 5;
  this.timeDelay = 2000;
  this.ajaxListTimeHendle = null;
  this.ajaxStatTimeHendle = null;
  this.onLoad = function(){
    if(++this.countLoaded < 2) 
      return;
    document.PieChart1 = new CChart3D(document.getElementById("chart1"), "Оценки за тесты");
    document.PieChart2 = new CChart3D(document.getElementById("chart2"), "Прохождение теста");
    this.startChartAjax();
    this.startListAjax();
    this.startAnimateSwitcher($(".switch"), $(".switch").find("div"));
  }
  this.startChartAjax = function(){
    var self = this;
    $.ajax({
      url: "/ajax/?method=statistic&pointType=" + this.point + "&timestamp=" + this.timestampStat,
    }).done(function(data){
      if(!data){
        self.updataChart(data);
        return;
      }
      data = JSON.parse(data);
      self.timestampStat = data.date;
      self.updataChart.call(self, data.data);
    });  
  }
  this.updataChart = function(data){
    if(data){
      var arChartTheme = Array();
      var arChartPoint = Array();
      for(key in data.theme ){
        arChartTheme.push(["Тест '" + key + "' прошли",data.theme[key]]);
      }
      for(key in data.point ){
        arChartPoint.push(["Оценка " + key,data.point[key]]);
      }
      document.PieChart1.draw3D(arChartPoint);
      document.PieChart2.draw3D(arChartTheme);
    }
    var self = this;
    this.ajaxStatTimeHendle = setTimeout(function(){
      self.startChartAjax.call(self);
    },this.timeDelay);
  }
  this.startListAjax = function(){
    var self = this;
    $.ajax({
      url: "/ajax/?method=list&pointType=" + this.point + "&timestamp=" + this.timestampList,
    }).done(function(data){
      if(!data){
        self.updataList(data);
        return;
      }
      data = JSON.parse(data);
      self.timestampList = data.date;
      self.updataList.call(self, data.data);
    });  
  }
  this.updataList = function(data){
    var dataInput = data;
    if(data){
      $(".user-name, .point").hide('slide', {direction: 'down'}, 300,function(){
        var i = $(this).parent().parent().index();
        if(!dataInput[i])
          return;
        if($(this).attr("class") == "user-name")
          $(this).html(dataInput[i].name);
        if($(this).attr("class") == "point")
          $(this).html(dataInput[i].point);
        $(this).show('slide', {direction: 'down'}, 300);
      })
    }
    var self = this;
    this.ajaxListTimeHendle = setTimeout(function(){
      self.startListAjax.call(self);
    },this.timeDelay);
  }
  this.changeTypePiont = function(type){
    if( this.ajaxListTimeHendle )
      clearTimeout(this.ajaxListTimeHendle);
    this.timestampList = 0;
    this.point = type;
    this.startListAjax();

    if( this.ajaxStatTimeHendle )
      clearTimeout(this.ajaxStatTimeHendle);
    this.timestampStat = 0;
    this.startChartAjax();
  }
  var self = this;
  (function(){
      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(function(){
        self.onLoad.call(self);
      });
      $(function(){
        self.onLoad.call(self);
      });
  })();
}
//------------------------------------------------------------------------------------------------------
var application = new CMain();