function disasterPlay(myid){
    var disasterNavHeight=100;
    if($(window).width()>=768){
        var disasterChartWidth=900;
        var navStep=247;
        var navShift=120;
    }else{
        disasterChartWidth=$(window).width()-50
        navStep=$(window).width()*0.24;
        navShift=$(window).width()*0.12;
    }
    var paddingTop=30
    var paddingBottom=30
    var paddingLeft=50
    $(".disaster-chart").css("height",winHeight-disasterNavHeight+"px");


    //console.log(disasterChartWidth);


    var ruler=[[0,5000,10000,15000,20000,25000],
        [0,1000,2000,3000,4000],
        [0,300,600,900,1200,1500],
        [0,10000,20000,30000,40000,50000]];


    var scale_disaster1 = d3.scale.linear()
        .domain([0, 25000])
        .range([0, disasterChartWidth-paddingLeft]);

    var scale_disaster2 = d3.scale.linear()
        .domain([0, 4000])
        .range([0, disasterChartWidth-paddingLeft]);

    var scale_disaster3 = d3.scale.linear()
        .domain([0, 1500])
        .range([0, disasterChartWidth-paddingLeft]);

    var scale_disaster4 = d3.scale.linear()
        .domain([0, 50000])
        .range([0, disasterChartWidth-paddingLeft]);

    var line_step = (winHeight-disasterNavHeight-paddingTop-paddingBottom)/65;

    drawArea(1);
    var svg_disaster_dots_line = d3.select(".disaster")
        .append("svg")
        .style("z-index",0)
        .attr("width", winWidth)
        .attr("height", 70)
        .attr("class","svg_disaster_dots")
        .append("g")

    var svg_disaster_dots = d3.select(".disaster")
        .append("svg")
        .style("z-index",1)
        .attr("width", winWidth)
        .attr("height", 100)
        .attr("class","svg_disaster_dots")
        .append("g")




    svg_disaster_dots_line.append("rect")
        .attr("fill","#ccc")
        .attr("x",navShift)
        .attr("y",53)
        .attr("height",2)
        .attr("width",navStep*3)



    for(i=1;i<5;i++){
        svg_disaster_dots.append("circle")
            .attr("id","disaster-nav"+i)
            .attr("class","dis-nav line-disaster-full-"+i)
            .attr("cx", navStep*(i-1)+navShift)
            .attr("cy",55)
            .attr("r",function(){
                if(i==1) return 8;
                else return 5
            })

        if(i!=1){
            for(j=0;j<500;j++){
                // console.log(j);
                svg_disaster_dots.append("circle")
                    .attr("class","disaster-nav-ring")
                    .attr("cx", navStep*(i-1)+navShift)
                    .attr("cy",55)
                    .attr("stroke",function(){
                        var color;
                        if(i==2) color="rgba(185,37,64,0.5)";
                        else if(i==3) color="rgba(190,169,58,0.5)";
                        else if(i==4) color="rgba(191,109,41,0.5)";
                        return color;
                    })
                    .attr("stroke-width",1)
                    .attr("fill","transparent")
                    .attr("r",4)
                    .transition()
                    .duration(2000)
                    .delay(j*400)
                    .attr("r",30)
                    .style("opacity",0)
                    .remove()

            }
        }
    }





    function dotAnimation(id){
        d3.selectAll(".dis-nav").transition().duration(1000).attr("r",5)
        d3.select("#disaster-nav"+id).transition().duration(1000).attr("r",8)
    }

    function drawArea(id){



        $(".svg5").remove();
        var svg_disaster2 = d3.select(".disaster-chart").append("svg")
            .attr("width", winWidth)
            .attr("height", winHeight-disasterNavHeight)
            .attr("class","svg5 disaster-area")
            .append("g")
            .attr("transform", "translate(0,0)")

        $(".svg4").remove();
        var svg_disaster = d3.select(".disaster-chart").append("svg")
            .attr("width", winWidth)
            .attr("height", winHeight-disasterNavHeight)
            .attr("class","svg4")
            .append("g")
            .attr("transform", "translate(0,0)")


        d3.json("data/disaster.json", function(error, root) {
            if (error) throw error;

            //面积图函数
            var area = d3.svg.area()
                .y(function(d,i) { return line_step * i + paddingTop; })
                .x0(0)
                .x1(function(d) {
                    var res;
                    if(id==1){res=scale_disaster1(d.farm);}
                    else if(id==2){res=scale_disaster2(d.money);}
                    else if(id==3){res=scale_disaster3(d.house);}
                    else if(id==4){res=scale_disaster4(d.people);}
                    return res;
                });


            //添加面积图
            svg_disaster2.append("path")
                .datum(root.data)
                .attr("d", area)
                .attr("class", "line-disaster-"+id)
                .style("opacity",0)
                .style("transform","scaleX(0.01)")
                .transition()
                .duration(1000)
                .style("opacity",1)
                .style("transform","scaleX(1)")



            //添加横线
            svg_disaster.selectAll("rect")
                .data(root.data)
                .enter()
                .append("rect")
                .attr("class","line-disaster-full-"+id)
                .attr("x",function(d,i){
                    return paddingLeft;
                })
                .attr("y",function(d,i){
                    return line_step * i + paddingTop;
                })
                .attr("width",function(d){
                    return 0
                })
                .attr("height",1)
                .transition()
                .duration(1000)
                .attr("width",function(d){
                    var res;
                    if(id==1){res=scale_disaster1(d.farm);}
                    else if(id==2){res=scale_disaster2(d.money);}
                    else if(id==3){res=scale_disaster3(d.house);}
                    else if(id==4){res=scale_disaster4(d.people);}
                    return res;
                })


            //添加圆点
            svg_disaster.selectAll("circle")
                .data(root.data)
                .enter()
                .append("circle")
                .attr("cx", function(d,i){
                    return paddingLeft
                })
                .attr("cy", function(d,i){
                    return line_step * i + paddingTop;
                })
                .attr("r",function(d){
                    var r=3;
                    if(id==2&&d.money==null) r=0;
                    return r;
                })
                .attr("class","line-disaster-full-"+id)
                //.style("cursor","pointer")
                /*.on("mouseover",function(d){
                  $(".disaster-number").remove();
                  svg_disaster.append("text")
                  .attr("x", d3.select(this).attr("cx"))
                  .attr("y", d3.select(this).attr("cy"))
                  .attr("class","disaster-number")
                  .text(function(){
                    var res;
                    if(id==1){res=d.farm;}
                    else if(id==2){res=d.money;}
                    else if(id==3){res=d.house;}
                    else if(id==4){res=d.people;}
                    return res;
                  })
                })*/
                .transition()
                .duration(1000)
                .attr("cx", function(d,i){
                    var res;
                    if(id==1){res=scale_disaster1(d.farm);}
                    else if(id==2){res=scale_disaster2(d.money);}
                    else if(id==3){res=scale_disaster3(d.house);}
                    else if(id==4){res=scale_disaster4(d.people);}
                    return (res+paddingLeft);
                })





            //添加竖线
            svg_disaster.append("rect")
                .attr("class","line-disaster-full-"+id)
                .attr("x",function(d,i){
                    return paddingLeft;
                })
                .attr("y",function(d,i){
                    return paddingTop-5;
                })
                .attr("width",function(d){
                    return 2
                })
                .attr("height",line_step * 64 + 10)


            //添加坐标
            svg_disaster.selectAll("text")
                .data(root.data)
                .enter()
                .append("text")
                .attr("class","disaster-chart-y")
                //.attr("fill","#999")
                .attr("x", function(d,i){
                    return 7;
                })
                .attr("y",function(d,i){
                    return line_step * i + paddingTop + line_step * 0.5;
                })
                .text(function(d,i){
                    return i%10==0?d.year+"年":"";
                })

            //添加坐标
            for(i=0;i<6;i++){
                svg_disaster.append("text")
                    .attr("class","disaster-chart-x")
                    .attr("fill","#bbb")
                    .attr("x", function(){
                        var res;

                        if(id==2){res=(disasterChartWidth-paddingLeft)/4*i;}
                        else {res=(disasterChartWidth-paddingLeft)/5*i;}

                        return res+50;

                    })
                    .attr("y",function(){
                        return 10;
                    })
                    .text(function(){
                        //console.log(ruler[id-1][i])
                        return ruler[id-1][i]!=undefined?"|"+ruler[id-1][i]:"";
                    })
            }

            //添加“无数据”
            if(id==2){

                svg_disaster.append("text")
                    .attr("x", function(){

                        return 55;

                    })
                    .attr("y",function(){
                        return line_step * 39 + paddingTop - 5;
                    })
                    .text(function(){
                        //console.log(ruler[id-1][i])
                        return "1989年及以前无数据";
                    })
                    .style("font-size","12px")
                    .attr("fill","#bbb")

            }

        });
    }

    $(".disaster-nav ul li").eq(0).bind("click",function(){drawArea(1); dotAnimation(1); disaster_id=1; $(".disaster-nav-ring").remove()})
    $(".disaster-nav ul li").eq(1).bind("click",function(){drawArea(2); dotAnimation(2); disaster_id=2; $(".disaster-nav-ring").remove()})
    $(".disaster-nav ul li").eq(2).bind("click",function(){drawArea(3); dotAnimation(3); disaster_id=3; $(".disaster-nav-ring").remove()})
    $(".disaster-nav ul li").eq(3).bind("click",function(){drawArea(4); dotAnimation(4); disaster_id=0; $(".disaster-nav-ring").remove()})


    dotAnimation(myid+1);
    drawArea(myid+1);

}

