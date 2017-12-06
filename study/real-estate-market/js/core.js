
$(document).ready(function(){
    basicInit();
    window.addEventListener( 'resize', basicInit, false );
    debugger;
    matrixPage.initLoading();
});
var windowSize = {};
var cityTierArray  = [];
var matrixPage = {
    currentCityName : "北京",
    mouse : {},
    cityTier:3,
    priceMax : d3.max(avgHouse),
    cellWidth : parseInt($("#matrixPage-canvasDiv .matrixDiv").innerWidth() / dateList.length),
    cellHeight : parseInt($("#matrixPage-canvasDiv .matrixDiv").innerHeight() / cityList.length),

    init : function(){
        $("#matrixPage-canvasDiv .matrixDiv").css({
            "width" : matrixPage.cellWidth*dateList.length,
            "height" : matrixPage.cellHeight*cityList.length
        });
        $("#matrixPage-canvasDiv .timeline").css("width", matrixPage.cellWidth*dateList.length);
        $("#matrixPage-canvasDiv .titleDiv").css("height", matrixPage.cellHeight*cityList.length);
        $("#matrixPage #matrix-CanvasDiv").css("width", $("#matrixPage-canvasDiv .matrixDiv").innerWidth() + $("#matrixPage-canvasDiv .titleDiv").innerWidth());
    },

    matrix : {
        maxPct : 5,//22.7
        minPct : -5,//-6.2

        init : function(){
            var matrixDiv = d3.select("#matrixPage-canvasDiv").select(".matrixDiv");

            var rects = matrixDiv.append("table")
                .attr("width", $("#matrixPage-canvasDiv .matrixDiv").innerWidth())
                .attr("height", $("#matrixPage-canvasDiv .matrixDiv").innerHeight())
                .attr("class","matrix");

            for(var i in cityTierArray){
                var rectsLine = rects.append("tr");

                for(var j in dateList){
                    var currentRect = {
                        "name": cityTierArray[i].city ,
                        "month":dateList[j],
                        "pct":cityTierArray[i].pct[j],
                        "price":cityTierArray[i].price[j],
                        "x":j,
                        "y":i
                    };
                    rectsLine.append("td")
                        .attr("class", function(){
                            if(i>0 && (cityTierArray[i].tier != cityTierArray[i-1].tier)){
                                switch(cityTierArray[i].tier){
                                    case 1:
                                        return "monthCube tier1";
                                        break;
                                    case 2:
                                        return "monthCube tier2";
                                        break;
                                    case 3:
                                        return "monthCube tier3";
                                        break;
                                }
                            }
                            return "monthCube";
                        })
                        .append("span")
                        .attr("id", j + "-" + i)//x-y
                        .attr("alt", j + "+" + i + "+" + currentRect.name + "+" + currentRect.month + "+" + currentRect.pct + "+" + currentRect.price)
                        .attr("width", function(){
                            $(this).css("width",matrixPage.cellWidth);
                            return matrixPage.matrix.cellWidth;
                        })
                        .attr("height", function(){
                            if(currentRect.name == matrixPage.currentCityName){
                                $(this).css("height", matrixPage.cellHeight*3);
                            }
                            else
                                $(this).css("height", matrixPage.cellHeight);
                            return matrixPage.matrix.cellHeight;
                        })
                        .style("background", matrixPage.matrix.fillColor(currentRect, matrixPage.matrix.maxPct, matrixPage.matrix.minPct))
                        .on("mouseover",function() {
                            $(this).css({"background-image":"url(http://datanews.caixin.com/mobile/home/image/highlightCube.png)","background-size":"100% 100%"});
                            matrixPage.sideTitle.redrawTitlesMatrix($(this).attr("alt"));
                            matrixPage.matrix.showFloatDiv($(this).attr("alt"), event);
                            matrixPage.timeline.drawCurrentRateTrend($(this).attr("alt"));
                        })
                        .on("mouseout", function(){
                            $(this).css("background-image","none");
                        });
                }
            }
        },

        showFloatDiv : function(currentRect, event){
            var x = currentRect.split("+")[0];
            var y = currentRect.split("+")[1];
            var name = currentRect.split("+")[2];
            var month = currentRect.split("+")[3];
            var pct = currentRect.split("+")[4];
            var price = currentRect.split("+")[5];

            $(".floatDiv").css("display" , "block");
            if( (windowSize.width-event.clientX) < windowSize.width/5){
                $(".floatDiv").css({
                    "left": (event.clientX-$(".floatDiv").innerWidth())  + "px",
                    "top": (event.clientY +matrixPage.cellHeight*4) + "px"});
            }else if((windowSize.height-event.clientY) < windowSize.height/3){
                $(".floatDiv").css({
                    "left": event.clientX  + "px",
                    "top": (event.clientY-$(".floatDiv").innerHeight()-matrixPage.cellHeight*4) + "px"});
            }else{
                $(".floatDiv").css({
                    "left": event.clientX  + "px",
                    "top": (event.clientY +matrixPage.cellHeight*4) + "px"});
            }

            $(".floatDiv").html(
                "<h3>" + name + "</h3>" +
                "<p>" + month.split("-")[0] + "年" + month.split("-")[1] + "月</p>" +
                "<p>新建住宅均价环比：" + pct + "%</p>" +
                "<p>新建住宅平均价格：" + Math.round(price) + "元/平方米</p>");
        },

        fillColor : function(d, maxPct, minPct){
            var scaleRuler = maxPct>(-minPct) ? -minPct/2 : maxPct/2;
            var scalePos = d3.scale.linear()
                .range([0.1, 1])
                .domain([0, scaleRuler]);
            var scaleNeg = d3.scale.linear()
                .range([-1, -0.1])
                .domain([-scaleRuler, 0])
            if(d.pct == 0){
                return "#2f2e29";
            }
            else if(d.pct > 0 && d.pct < scaleRuler){
                return "rgba(221, 120, 98," + scalePos(d.pct) + ")";
            }
            else if(d.pct < 0 && d.pct > -scaleRuler){
                return "rgba(159,197,215," + -scaleNeg(d.pct) + ")";
            }else if( d.pct >= scaleRuler){
                return "rgba(221, 120, 98, 1)";
            }else if(d.pct <= -scaleRuler){
                return "rgba(159,197,215,1)";
            }

            return;
        }

    },//matrix end

    sideTitle : {

        init : function(){
            var titleDiv = d3.select("#matrixPage-canvasDiv").select(".titleDiv");

            var text = titleDiv.selectAll(".cityName")
                .data(cityTierArray)
                .enter().append("p")
                .attr("class", function(d,i){
                    if(i%2 == 0)
                        return "cityNameUp cityName";
                    else
                        return "cityNameDown cityName";
                })
                .attr("id", function(d) {return d.city; })
                .attr("height", function(){
                    $(this).css("height", matrixPage.cellHeight*2);
                    return matrixPage.cellHeight*2;
                })
                .style("line-height", matrixPage.cellHeight*2 + "px")
                .text(function(d) { return d.city; });

            $("p#" + matrixPage.currentCityName).css("height", matrixPage.cellHeight*4);
            $("p#" + matrixPage.currentCityName).addClass("cityNameHover");
            $("p#" + matrixPage.currentCityName).css({"height":matrixPage.cellHeight * 4, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineLeftHover.png)"});
            $("p#" + matrixPage.currentCityName).next().css({"paddingTop":matrixPage.cellHeight * 2, "height": matrixPage.cellHeight * 4, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineHoverHelper.png)"});
        },

        redrawTitlesMatrix : function(currentRect){
            $(".cityName").css("height", matrixPage.cellHeight*2);
            $(".cityNameUp").css({"paddingTop":0, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineLeft.png)"});
            $(".cityNameDown").css({"paddingTop":"5px", "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineRight.png)"});
            $(".cityNameHover").removeClass("cityNameHover");
            $(".monthCube span").css("height", matrixPage.cellHeight);

            var x = parseInt(currentRect.split("+")[0]);
            var y = parseInt(currentRect.split("+")[1]);
            var name = currentRect.split("+")[2];
            var month = currentRect.split("+")[3];
            var pct = currentRect.split("+")[4];
            var price = currentRect.split("+")[5];

            if(y%2 == 0){s
                for(var i in dateList)
                    $("#" + i + "-" + y).css("height", matrixPage.cellHeight * 3);
                $("p#" + name).addClass("cityNameHover");
                $("p#" + name).css({"height":matrixPage.cellHeight * 4, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineLeftHover.png)"});
                $("p#" + name).next().css({"paddingTop":matrixPage.cellHeight * 2, "height": matrixPage.cellHeight * 4, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineHoverHelper.png)"})
            }else{
                for(var i in dateList)
                    $("#" + i + "-" + y).css("height", matrixPage.cellHeight * 3);
                $("p#" + name).addClass("cityNameHover");
                $("p#" + name).css({"height":matrixPage.cellHeight * 4, "paddingTop":matrixPage.cellHeight * 2, "background-image":"url(http://datanews.caixin.com/mobile/home/image/matrix-textLineRightHover.png)"});
                $("p#" + name).prev().css({"height":matrixPage.cellHeight * 4});

            }

            $("div#matrixPage #matrixTimelineLegend .cityPriceLegend span").html(name);
            $("div#matrixPage #matrixTimelineLegend .cityRateLegend span").html(name);
        }

    },//matrix end

    timeline : {

        drawTrend : function(){
            var _this = this;
            _this.parent = drawTimelineInherit;//inherit
            _this.parent("matrixPage");

            _this.svg.attr("transform", "translate(" + _this.margin.left + ",0)");
            _this.yAxis = d3.svg.axis()
                .ticks(5)
                .scale(_this.y)
                .orient("right");
            _this.yRateAxis = d3.svg.axis()
                .ticks(5)
                .tickFormat(function(d){ return d + "%";})
                .scale(_this.yRate)
                .orient("left");

            _this.svg.append("g")
                .attr("class", "y axis rateAxis")
                .call(_this.yRateAxis)
                .append("text")
                .attr("y", _this.margin.top/2)
                .attr("x", _this.margin.right*1.5)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("环比涨幅");
            _this.svg.append("g")
                .attr("class", "y axis priceAxis")
                .attr("transform", "translate(" + _this.boardWidth + ",0)")
                .call(_this.yAxis)
                .append("text")
                .attr("y", _this.margin.top/2)
                .attr("x", -_this.margin.left/4)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("房价（元）");
        },//timeline end

        drawCurrentRateTrend : function(currentRect){
            d3.select(".overallRateLine").remove();
            d3.select(".currentRateLine").remove();
            d3.select(".zeroRateLine").remove();
            d3.select(".rateAxis").remove();
            var _this = this;
            _this.parent = drawTimeline;//inherit
            _this.parent("matrixPage");

            _this.name = currentRect.split("+")[2];
            _this.currentRateData = [];
            for(var i in dateList){
                _this.currentRateData.push( { "date": _this.parseDate(dateList[i]), "rate":coreData[_this.name].pct[i], "positionX": i } )
            }
            _this.yRate = d3.scale.linear()
                .range([_this.boardHeight, 0])
                .domain([d3.min(coreData[_this.name].pct), d3.max(coreData[_this.name].pct)]);
            _this.yRateAxis = d3.svg.axis()
                .ticks(5)
                .tickFormat(function(d){ return d + "%";})
                .scale(_this.yRate)
                .orient("left");

            _this.svg.append("g")
                .attr("class", "y axis rateAxis")
                .call(_this.yRateAxis)
                .append("text")
                .attr("y", _this.margin.top/2)
                .attr("x", _this.margin.right*1.5)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("环比涨幅");

            _this.svg.append("line")
                .attr("class", "zeroRateLine")
                .attr("x1", 0)
                .attr("y1", _this.yRate(0))
                .attr("x2", _this.boardWidth)
                .attr("y2", _this.yRate(0));
            _this.svg.append("path")
                .attr("class", "currentRateLine")
                .datum(_this.currentRateData)
                .attr("d", _this.rateLine);
            _this.svg.append("path")
                .attr("class", "overallRateLine")
                .datum(_this.rateData)
                .attr("d", _this.rateLine);
        }

    },//timeline end

    initLoading : function(){
        $("#matrixPage .timeline").css("marginRight", 50);
        $("#matrixPage svg").remove();
        matrixPage.init();
        matrixPage.matrix.init();
        matrixPage.sideTitle.init();
        matrixPage.timeline.drawTrend();

        var aaa=0;
        document.body.onmousemove=function(){
            clearTimeout(aaa);
            aaa=setTimeout(function(){
                disFloatDiv();
            },3000);

        }
    }
}



function showPlicyFloatDiv(policy, event){
    $(".floatDiv").html(
        "<h3>政策出台 / 房价走势</h3>" +
        "<p>" + policy + "</p>");
    $(".floatDiv").fadeIn(50);
    /*$("#mapPage .floatDiv").css("display" , "block");*/
    $(".floatDiv").css({
        "left": (event.clientX-$(".floatDiv").innerWidth()/2)  + "px",
        "top": (event.clientY-$(".floatDiv").innerHeight()*1.2) + "px"});
}

function disPlicyFloatDiv(){
    setTimeout(function(){$(".floatDiv").fadeOut("slow");}, 6000);
}
function disFloatDiv(){
    $(".floatDiv").fadeOut("slow");
}

function drawTimeline(insertName){
    _this = this;

    _this.margin = {top: 20, right: 50, bottom: 20, left: 50};
    if(insertName == "matrixPage"){
        _this.boardWidth = $(".timeline").innerWidth() + _this.margin.left + _this.margin.right;
        _this.boardHeight = $(".timeline").innerHeight();
        _this.insertPlace = d3.select(".timeline");
        _this.yScale = d3.max(avgHouse);
    }else if(insertName == "mapPage"){
        _this.boardWidth = $(".timeline").innerWidth();
        _this.boardHeight = $(".timeline").innerHeight();
        _this.insertPlace = d3.select(".timeline");
        _this.yScale = 44504.32;//max
    }
    _this.boardWidth = _this.boardWidth - _this.margin.left - _this.margin.right;

    _this.parseDate = d3.time.format("%Y-%m").parse;
    _this.data = [];
    _this.dataPolicy = [];
    _this.rateData = [];
    for(var i in dateList)
        _this.data.push( { "date": _this.parseDate(dateList[i]), "price":parseInt(avgHouse[i]), "positionX": i });
    for(var i in dateList)
        _this.dataPolicy.push({ "date": _this.parseDate(dateList[i]), "policy":keyEvents[i], "positionX": i });
    for(var i in dateList){
        _this.rateData.push( { "date": _this.parseDate(dateList[i]), "rate":avgRate[i], "positionX": i } )
    }
    _this.x = d3.time.scale()
        .range([0, _this.boardWidth])
        .domain(d3.extent(_this.data, function(d) { return d.date; }));
    _this.yRate = d3.scale.linear()
        .range([_this.boardHeight, 0])
        .domain([d3.min(avgRate), d3.max(avgRate)]);
    _this.y = d3.scale.linear()
        .range([_this.boardHeight, 0])
        .domain([0, _this.yScale]);//d3.max(data, function(d) { return d.price; })


    _this.rateLine = d3.svg.line()
        .x(function(d) { return _this.x(d.date); })
        .y(function(d) {return _this.yRate(d.rate); });
    _this.line = d3.svg.line()
        .x(function(d) { return _this.x(d.date); })
        .y(function(d) { return _this.y(d.price); });
    _this.xAxis = d3.svg.axis()
        .scale(_this.x)
        .orient("bottom");
}

function drawTimelineInherit(insertName){
    var _this = this;
    _this.parent = drawTimeline;//inherit
    _this.parent(insertName);

    _this.svg = _this.insertPlace.append("svg")
        .attr("width", _this.boardWidth + _this.margin.left + _this.margin.right)
        .attr("height", _this.boardHeight + _this.margin.top + _this.margin.bottom)
        .append("g")
        .attr("class","loopLineChart")
        .attr("transform", "translate(" + _this.margin.left + ",0)");

    _this.svg.append("path")
        .attr("class", "overallRateLine")
        .datum(_this.rateData)
        .attr("d", _this.rateLine);
    _this.svg.append("path")
        .attr("class", "overallPriceLine")
        .datum(_this.data)
        .attr("d", _this.line);
    _this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + _this.boardHeight + ")")
        .call(_this.xAxis);
    _this.svg.append("g").selectAll("circle")
        .data(_this.dataPolicy)
        .enter()
        .append("circle")
        .attr("class", "policyCircle")
        .attr("cx", function(d) {
            return _this.x(d.date)/* + (d.positionX - dateList.length/2)*cellPart*/;
        })
        .attr("cy", function(d) {
            return _this.boardHeight;
        })
        .attr("r", function(d) {
            if(d.policy[0] || d.policy[1]){
                return windowSize.fontSize/2;
            }else{
                return 0;
            }
        })
        .on("mouseover", function(d){
            for(var i in cityList){
                $("#matrixPage #" + d.positionX + "-" + i).addClass("borderMatrix");
            }

            d3.select(this).attr("r", windowSize.fontSize);
            showPlicyFloatDiv(d.policy, event);
        })
        .on("mouseout", function(){
            $(".borderMatrix").removeClass("borderMatrix");

            disPlicyFloatDiv();
            d3.select(this)
                .transition()
                .duration(300)
                .ease("linear")
                .attr("r", windowSize.fontSize/2);
        })
        .on("click", function(d){
            if(insertName == "mapPage"){
                mapPage.timeline.mapPolicyPosition(d.positionX);
            }
        });
}

function basicInit(){
    var fontSize = 10;

    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;
    windowSize.fontSize = Math.round(Math.max.apply(Math, [windowSize.width/100, windowSize.height/100]));

    //fit different p
    $("body").css("font-size", windowSize.fontSize);
    $("html").css("font-size", windowSize.fontSize);

    //CityAxis ranking by city tier
    var cityTier=4;
    for(var i = 0; i < cityTier; i++){
        for(var j in coreData){
            if(coreData[j].tier == i){
                cityTierArray.push({ city:j, tier:coreData[j].tier, income:coreData[j].income, price:coreData[j].price, pct:coreData[j].pct});
            }
        }
    }
}

