var date0="2016-03-01";
var  dateUnit=200;
var map_interval;
var date_count=229;
var date_step=(cssPxToInt($(".map-part1-timeline-line").css("width"))-cssPxToInt($(".map-part1-timeline-pointer").css("width")))/date_count;
if($(window).width()<768){date_step=$(window).width()*0.95/date_count}
//console.log(date_step)
var i=0;
var winHeight=$(window).height();
var winWidth=$(window).width();

var mapHeight=750;
var mapShiftTop=mapHeight+130-winHeight;
if(mapShiftTop<0) mapShiftTop=0;
$(".map").css("height",winHeight+mapShiftTop-160+"px").css("margin-top","-"+mapShiftTop+"px");

if($(window).width()<=768) {
    //mapShiftTop=mapShiftTop-80;
    $(".map").css("top","100px");}
//console.log(mapShiftTop);

var thisPin=0;

function cssPxToInt(str){
    var tmp=str.split("px");
    var tmp1=parseFloat(tmp[0]);
    return tmp1;
}

var scale_r = d3.scale.linear()
    .domain([0, 17])
    .range([1, 35]);
var scale_duration = d3.scale.linear()
    .domain([0, 300])
    .range([2, 5]);

function mapPlay(){
    //console.log(dateUnit);
    //console.log("map play")
    // $(".map").draggable();
    if($(window).width()>=768)
        map_interval=setInterval(function(){showDate()},200)
    else
        map_interval=setInterval(function(){showDate()},150)



    //console.log(dateToNumber("2016-01-01","2016-01-04"));

    d3.json("data/rain.json", function(error, root) {

        if (error)
            return console.error(error);
        //console.log(root.cities[0].geometry);

        //for(var j=0; j<root.cities.length;j++){
        //console.log(root.cities[j]);

        svg.selectAll("circle")
            .data(root.cities)
            .enter()
            .append("circle")
            .attr("id",function(d,i){return "c"+i})
            .attr("class","dot")
            //.text(function(d){console.log(d.city);return d.city})
            .attr("cx", function(d,i){
                //console.log(j);
                //console.log(root.cities[j].name);
                var c = projection(d.cp);
                return c[0];
                //console.log(c);
            })
            .attr("cy", function(d,i){
                var c = projection(d.cp);
                return c[1];

            })
            .attr("r",0)
            .attr("fill", function(d){
                var c;
                var r=scale_r(Math.sqrt(d.precipitation));
                if(r>0&&r<5) c=0;
                else if(r>=5&&r<10) c=1;
                else if(r>=10&&r<20) c=2;
                else if(r>=20) c=3;
                return color(c);
            })
            //.attr("stroke", "rgba(34,124,186,0.2)")
            //.attr("stroke-width",1)
            .transition()

            .duration(1000)
            .delay(function(d,i){
                return dateUnit*dateToNumber("2016-03-01",d.date)})
            .attr("r",function(d){
                var r;
                r=scale_r(Math.sqrt(d.precipitation));
                return r;
            })
            .transition()
            .duration(function(d){
                return scale_duration(d.precipitation)*500;
            })
            .style("opacity",function(d){
                return 0;
            })
            .remove()
        //.delay(function(d,i){
        //return scale_duration(d.precipitation)*500+dateUnit*dateToNumber("2016-03-01",d.date
        //)})


    });


    var width =1000,
        height = 800;

    var svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class","svg1")
        .append("g")
        .attr("transform", "translate(0,0)")
        .style("z-index",0);

    var svg_btn = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class","svg2")
        .append("g")
        .attr("transform", "translate(0,0)")
        .style("z-index",1);

    //建立一个墨卡托投影
    var projection = d3.geo.mercator()
        .center([104.5, 36.3])
        .scale(858)  //858
        .translate([width/2, height/2]);

    var path = d3.geo.path()
        .projection(projection);

//==颜色取值==//
    var index = [0, 1, 2, 3];
    var colorPool = ["rgba(32,119,186,0.2)",
        "rgba(32,119,186,0.2)",
        "rgba(12,95,163,0.3)",
        "rgba(12,75,144,0.3)"
    ]
    var colorPool_full = ["rgba(32,119,186,0)",
        "rgba(12,95,163,0.1)",
        "rgba(12,95,163,0.1)",
        "rgba(12,75,144,0.3)"
    ]

    var color = d3.scale.ordinal()
        .domain(index)
        .range(colorPool);

    var color_full = d3.scale.ordinal()
        .domain(index)
        .range(colorPool_full);

    var i=0;

//日期坐标
    var monthCaption=[["3月",31],["4月",30],["5月",31],["6月",30],["7月",31],["8月",31],["9月",30],["10月",16]];
    var sumdays=0;
    for (i in monthCaption){
        var obj=$('<div></div>');
        obj.addClass("month-caption");
        obj.html(monthCaption[i][0]);

        obj.css("left",(($(window).width()>=768?50:0)+sumdays*date_step)+"px")
        $(".map-part1-timeline").append(obj);
        sumdays+=monthCaption[i][1]
    }

    /*
    d3.json("data/china.json", function(error, root) {

      if (error)
        return console.error(error);
        //console.log(root.features);

        svg.selectAll("path")
        .data( root.features )
        .enter()
        .append("path")
        .attr("stroke","#999")
        .attr("stroke-width",0)
        .attr("fill", function(d,i){
          return "rgba(225,225,225,0)"
                //return "url(#pattern)";
              })
        .attr("d", path )   //使用地理路径生成器

    });
     */
    function dateToNumber(start, date){
        var str=start.split("-");
        var startDate=new Date(parseInt(str[0]),parseInt(str[1])-1,parseInt(str[2]));
        str=date.split("-");
        var thisDate=new Date(parseInt(str[0]),parseInt(str[1])-1,parseInt(str[2]));

        return (thisDate - startDate)/(24 * 60 * 60 * 1000);

    }
    function showAll(){
        //svg.selectAll(".dot")
        //.remove()

        d3.json("data/rain.json", function(error, root) {
            if (error)
                return console.error(error);
            svg.selectAll(".dot")
                .data(root.cities)
                .enter()
                .append("circle")
                .attr("class",function(d,i){
                    return "dot dot-"+d.city;
                })
                .attr("cx", function(d,i){
                    var c = projection(d.cp);
                    return c[0];
                })
                .attr("cy", function(d,i){
                    var c = projection(d.cp);
                    return c[1];
                })
                .attr("fill", function(d){
                    var c;
                    var r=scale_r(Math.sqrt(d.precipitation));
                    if(r>0&&r<5) c=0;
                    else if(r>=5&&r<10) c=1;
                    else if(r>=10&&r<20) c=2;
                    else if(r>=20) c=3;
                    return color_full(c);
                })
                .style("opacity",0)
                .attr("r",function(d){
                    var r;
                    r=scale_r(Math.sqrt(d.precipitation));
                    return r;
                })

                //.text(function(d){return d.city})
                .transition()
                .duration(1000)
                .style("opacity",1)

        });

    }
    function drawCityButton(){
        $(".map-part1-cityline-name").show();
        d3.json("data/cities.json", function(error, root) {
            if (error)
                return console.error(error);
            svg_btn.selectAll(".city-btn")
                .data(root.cities)
                .enter()
                .append("circle")
                .attr("class","city-btn")
                .attr("cx", function(d,i){
                    var c = projection(d.cp);
                    return c[0];
                })
                .attr("cy", function(d,i){
                    var c = projection(d.cp);
                    return c[1];
                })
                .attr("fill", function(d){
                    return "rgba(0,0,0,0)";
                })
                .attr("r",15)
                .on("touchstart",function(d){clickCityButton(d.city)})
                .on("mouseover",function(d,i){clickCityButton(d.city)})
            //.on("mouseout",function(d,i){clickCityButton(d.city)})
        });

    }
    function datetoMonthDay(date){
        var d=date.split("-");
        return parseInt(d[1])+"-"+parseInt(d[2]);
    }
    function clickCityButton(city){

        $(".svg3").remove();
        $(".map-part1-cityline").show();
        var svg_line = d3.select(".map-part1-cityline").append("svg")
            .attr("width", width)
            .attr("height", 70)
            .attr("class","svg3")
            .append("g")
            .attr("transform", "translate(0,0)")
            .style("z-index",1);

        $(".map-part1-cityline-name").html(city)
        //d3.selectAll(".dot").attr("fill","rgba(34,124,186,0.1)");
        $(".dot").removeClass("circle-green");
        $(".dot-"+city).addClass("circle-green");
        //console.log($(".dot-"+city));

        var yScale = d3.scale.linear()
            .domain([0,260])
            .range([2,70]);

        var c=new Array();

        d3.json("data/rain_full.json", function(error, root) {
            if (error) throw error;
            var p=root.cities;
            for(var i in p){
                //console.log(p[i]);
                if(p[i].city==city) c.push(p[i].precipitation)
            }
            //添加曲线
            var line = d3.svg.line()
                .x(function(d,i) { return date_step*i; })
                .y(function(d) { return 70-yScale(d);})
                .interpolate("cardinal")


            svg_line.append("path")
                .datum(c)
                .attr("d", line)
                .attr("class", "line-city")


            d3.select(".map-part1-cityline").on("mousemove",function(d){
                var mouseX=d3.mouse(this)[0];
                var mouseY=d3.mouse(this)[1];
                var count=Math.floor(mouseX/date_step);

                //console.log(count);
                //console.log(c[count],60-yScale(c[count])+"px")
                if(count>=0&&count<=229){
                    $(".map-line-number").show().css("left",mouseX+"px");
                    $(".map-line-number").html("降水量:<br/>"+c[count]+"mm");
                    $(".map-part1-dotted-line").show().css("left",mouseX-1+"px").css("height",86-yScale(c[count])+"px")
                    $(".map-part1-timeline-pointer").css("left",($(window).width()>=768?mouseX+44:mouseX-5)+"px")
                    $(".date-box").show().css("left",mouseX+($(window).width()>=768?40:0)+"px");
                    var date=addDate("2016-03-01",count);
                    //console.log(date);
                    $("#date-tag").html(datetoMonthDay(date));
                }
            })
            var initDate=141;
            $(".date-box").show()
            $(".date-box").css("left",initDate*date_step+($(window).width()>=768?42:0)+"px");
            $(".map-line-number").show().css("left",initDate*date_step+"px");
            $(".map-line-number").html("降水量:<br/>"+c[initDate]+"mm");
            $("#date-tag").html(datetoMonthDay(addDate("2016-03-01",initDate)));
            $(".map-part1-dotted-line").show().css("left",initDate*date_step-1+"px").css("height",86-yScale(c[initDate])+"px")
            $(".map-part1-timeline-pointer").css("left",($(window).width()>=768?initDate*date_step+44:initDate*date_step-5)+"px")





        });


        //坐标

    }
    function mouseOverCityButton(city){
        //console.log(id);
        clickCityButton(city)
    }
    function mouseOutCityButton(city){
        //console.log(id);

    }
    var pin=[[114.323042,30.580273],[114.596863,37.041623],[114.036077,38.126039],[114.02965,36.558754],[119.599552,31.478913],[119.810596,33.764375],[118.26,26.21]];
    var pin_alt=new Array();
    svg_btn.selectAll(".map-pin")
        .data(pin)
        .enter()
        .append("circle")
        .attr("cx", function(d,i){
            var c = projection(d);
            pin_alt.push(c);
        })


    function clearCityLine(){
        $(".dot").removeClass("circle-green");
        $(".line-city").remove();
        $(".date-box").fadeOut()
        $(".map-line-number").fadeOut();

        $(".map-part1-dotted-line").css("left","-2000px")
        $(".map-part1-timeline-pointer").css("left","-2000px")

    }



    function showPin(){
        $(".map-pin").bind("mousemove",function(){
            $(this).css("opacity",1)
        })
            .bind("mouseout",function(){
                $(this).css("opacity",0.7)
                $(".map-pin"+thisPin).css("opacity",1);

            })


        $(".caption-exit").bind("click touchstart",function(){$(".map-caption-box").hide();})

        $(".map-pin1").css("left",pin_alt[0][0]+"px").css("top",pin_alt[0][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption1").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=1;
            //clearCityLine()
        })
            .fadeIn(1000);
        $(".map-pin2").css("left",pin_alt[1][0]+2+"px").css("top",pin_alt[1][1]-5+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption2").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=2;
            //clearCityLine()
        }).fadeIn(1000);
        $(".map-pin3").css("opacity",1).css("left",pin_alt[2][0]+"px").css("top",pin_alt[2][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption3").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=3;
            //clearCityLine()
        }).fadeIn(1000);

        $(".map-pin4").css("left",pin_alt[3][0]+"px").css("top",pin_alt[3][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption4").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=4;
            //clearCityLine()
        }).fadeIn(1000);
        $(".map-pin5").css("left",pin_alt[4][0]+"px").css("top",pin_alt[4][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption5").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=5;
            //clearCityLine()
        }).fadeIn(1000);
        $(".map-pin6").css("left",pin_alt[5][0]+"px").css("top",pin_alt[5][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption6").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=6;
            //clearCityLine()
        }).fadeIn(1000);
        $(".map-pin7").css("left",pin_alt[6][0]+"px").css("top",pin_alt[6][1]+"px").bind("click touchstart",function(){
            $(".map-caption-box").hide();
            $(".map-caption7").fadeIn(500)
            $(".map-pin").css("opacity",0.7);
            $(this).css("opacity",1);
            thisPin=7;
            //clearCityLine()
        }).fadeIn(1000);

        $(".map-caption3").fadeIn(1000);

    }

    if($(window).width()>=768) {
        $(".map-zoom").bind("click touchstart",function(){
            $(".map").css('-webkit-transform','scale(1.7)').css("top","-200px").css("left","-100px");
            $(this).hide();
            $(".map-zoom-out").show();
        })
        $(".map-zoom-out").bind("click touchstart",function(){
            $(".map").css('-webkit-transform','scale(1)').css("top","0px").css("left","0px");
            $(this).hide();
            $(".map-zoom").show();
        })
    }

    function showDate(){
        date0 = addDate(date0,1);
        //console.log(date0);
        $("#date-tag").html(datetoMonthDay(date0));

        if(date0=="2016-10-16") {
            window.clearInterval(map_interval);

            //console.log("clear");
            showAll();
            setTimeout(function(){
                showPin();
                clickCityButton("石家庄");
                drawCityButton();
            },1000)

            $(".map-replay").css("opacity",1);
            mapReplay();
            $(".date-box").hide()
            $(".rain-title1").fadeOut(1000)
            $(".rain-title2").fadeIn(1000)

            if($(window).width()<768){
                $(".map").css('-webkit-transform','scale(1)').css("top","30px").css("left","-125px");
                $(".map-legend").hide();
            }
        }

        var nextDateLeft=cssPxToInt($(".date-box").css("left"))+date_step+"px";
        var nextPointerLeft=cssPxToInt($(".map-part1-timeline-pointer").css("left"))+date_step+"px";

        $(".date-box").css("left",nextDateLeft);
        $(".map-part1-timeline-pointer").css("left",nextPointerLeft);
    }



    function addDate(date,days){
        var str=date.split("-");
        var d=new Date(parseInt(str[0]),parseInt(str[1])-1,parseInt(str[2]));

        d.setDate(d.getDate()+days);
        var month=d.getMonth()+1;
        var day = d.getDate();
        if(month<10){
            month = "0"+month;
        }
        if(day<10){
            day = "0"+day;
        }
        var val = d.getFullYear()+"-"+month+"-"+day;
        return val;
    }




}

function mapReplay(){
    $(".map-replay").bind("click",function(){
        $(".map-caption-box").hide();
        $(".map-pin").css("opacity",1).hide();
        $(".map-replay").css("opacity",0.3).unbind();
        $(".svg1").remove();
        $(".svg2").remove();
        $(".dot").removeClass("circle-green");
        $(".rain-title1").fadeIn(1000);
        $(".rain-title2").fadeOut(1000);

        $(".svg3").remove();
        $(".map-part1-cityline").hide();

        date0="2016-03-01";
        $(".map-part1-timeline-pointer").css("left",$(window).width()>=768?50:0+"px");
        $(".date-box").show().css("left",$(window).width()>=768?48:0+"px");
        $("#date-tag").html("7-19");


        $(".map-part1-dotted-line").hide();
        $(".map-line-number").hide();

        thisPin=3;
        mapPlay();


    })
}