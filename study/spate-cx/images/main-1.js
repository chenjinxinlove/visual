
var scrollCount=0;
var sourcePic = ["index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/bg.jpg*/,"index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/map-bg.png*/,"index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/cover-m.png*/];
var loadSourcPicCount = 0;
var audioPlay=1;
//var au=document.getElementById("cover-audio")

$(document).ready(function(){
	$('body,html').animate({
	        scrollTop: 0
    },function(){scrollCount=0})

    
    var isAndroid=navigator.userAgent.match(/android/ig),isIos=navigator.userAgent.match(/iphone|ipad/ig),isWinPhone = navigator.userAgent.match(/Windows Phone/ig);
    if(isAndroid || isWinPhone)
    {
       
       location = "index_n.html"/*tpa=http://datanews.caixin.com/mobile/flood/index_n.html*/;
    }
    else
    {
        loadNBSourcePic();
    }
		
	
});

   
// 加载图片的函数
function loadNBSourcePic()
{
    var sLen= sourcePic.length;
    var i;

    for(i=0;i<sLen;i++)
    {
        //var url = "http://datanews.caixin.com/mobile/cxsp2016/images/" + sourcPicArray[i];
        var url = "./images/" + sourcePic[i];
        var img = new Image();
        img.src = url;
        img.onload = function()
        {
            loadSourcPicCount ++;
            if($(window).width()<768){
            	$("#loadingPercent").html(parseInt(loadSourcPicCount * 100 / sLen) + "%<br>建议在Wi-Fi环境浏览");   
            }else
                $("#loadingPercent").html(parseInt(loadSourcPicCount * 100 / sLen) + "%<br>支持浏览器：Google Chrome、Safari、Firefox（43.0.4版本）"); 

            if(loadSourcPicCount == sLen)
            {
                setTimeout(function(){
    				$(".loading").fadeOut(500,initMainPage);
                   
                },500);
            }
        }
    }
}

function initMainPage()
{
	//loading 消息，主页面显示。
     coverStart();

}

	$(".ending").css("margin-top",($(window).height()-100)/2+"px");
	
	if($(window).width()>=768){
		$('#sroll-tip-image').attr('src','index-1.htm'/*tpa=http://datanews.caixin.com/mobile/flood/en/js/images/scroll-tip-pc.png*/);
		$(".part-7,.part-3,.part-0, .part-1, .part-9, .ending-bg").css("height",$(window).height()+"px")		
		//$(".cover-title").css("left",($(window).width()-990)/2+"px")

	}else{
		$(".title-left,.title-right").remove();
		$(".part-7, .part-3, .part-9,.ending-bg").css("height",$(window).height()+"px");	

		$(".text-overflow").append("<div class='text-overflow-mask'><span class='text-overflow-click'>阅读更多</span></div>");
		$(".text-overflow-click").bind("touchstart",function(){
			
			$(this).parent().parent().removeClass("text-overflow");
			$(this).parent().remove();
		})
		//$(".bottom").css({"min-height":$(window).height() + "px"});
		
		$(".dilishu").css("height",$(window).width()*559/640+"px");
		$(".chart98").css("height",$(window).width()*920/640+"px");
		
		$(".flood-video-control, .flood-video").remove();
		$(".part-1").css("height",$("#flood-video").css("height"))
		
		$(".map").css("margin-left","-"+$(window).width()+"px");
		$(".map").css({"transform":"scale(0.7)"});

		$(".disaster-nav ul li").eq(0).html("农作物受灾面积<br/>（千公顷）");
		$(".disaster-nav ul li").eq(1).html("直接经济损失<br/>（亿元）");
		$(".disaster-nav ul li").eq(2).html("倒塌房屋<br/>（万间）");
		$(".disaster-nav ul li").eq(3).html("因灾死亡人口<br/>（人）");
		$(".damage-chart").find("img").attr("src","index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/images/damage-m.png*/);

		for(var i=0;i<6;i++)
		$(".dilishu ul").eq(1).find("li").eq(i).find("img").attr("src","images/mobile/book-"+(i+1)+".jpg");

		$(".chart98").find("img").attr("src","index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/images/mobile/chart-3-1.png*/);
		for(var i=0;i<4;i++)
		$(".chart98 ul").eq(1).find("li").eq(i).find("img").attr("src","images/mobile/chart-3-"+(i+2)+".png");
		//console.log($(".dilishu ul").eq(1).find("li").eq(i).find("img").src("src"));
	
		$("#flood-video").attr("controls","controls");
		$(".cover-title").attr("src","index-1.htm"/*tpa=http://datanews.caixin.com/mobile/flood/en/js/images/cover-m.png*/).attr("width","100%")

		
		

	    var startY=0,moveY=0; //手指移动距离
	    $(".part-0").bind("touchstart",function(e){
	     startY = e.originalEvent.targetTouches[0].pageY;
	     e.preventDefault();
	    });
	    $(".part-0").bind("touchmove",function(e){
	 		moveY = e.originalEvent.targetTouches[0].pageY - startY;
	    });
	    $(".part-0").bind("touchend",function(e){
	     if(moveY<-50){

	     	$('body,html').animate({
		        	scrollTop: 0
	    			},function(){scrollCount=0
	    	})
	    	//$("#flood-video").attr("controls","controls");
			$(".scroll-tip").fadeOut(1000);
			

			//$("#cover-audio").trigger("pause");
			$(this).animate({
		        	top: "-"+($(window).height()+100)+"px"
	    			},1000);
		 }
		
		});

		$(".part-backcover").bind("touchstart",function(e){
	     startY = e.originalEvent.targetTouches[0].pageY;
	     //e.preventDefault();
	    });
	    $(".part-backcover").bind("touchmove",function(e){
	 		moveY = e.originalEvent.targetTouches[0].pageY - startY;
	    });
	    $(".part-backcover").bind("touchend",function(e){
	     //console.log("moveY",moveY);
	     if(moveY>100&&$(".part-1").offset().top<=0){
			$(".part-0").animate({
		        	top: "0px"
	    			},1000);
		 }
		
		});

		$(".cx-logo").remove();
		
	}
	
	
	// 所有已有IMG图片都加载后开始执行
	/*$(function(){
	    var imgdefereds=[];
	    $('.preload img').each(function(){
	        var dfd=$.Deferred();
	        $(this).bind('load',function(){
	            dfd.resolve();
	        }).bind('error',function(){
	        //图片加载错误，加入错误处理  
	        //  dfd.resolve();  
	        })  
	        if(this.complete) setTimeout(function(){
	            dfd.resolve();
	        },1000); 
	        imgdefereds.push(dfd);
	    })
	    $.when.apply(null,imgdefereds).done(function(){
	    	
	        //scrollOpacity("part-6")
			//scrollOpacity("part-12")
	    }); 
	})

	// 滚动中改变文字文字透明度
	function scrollOpacity(cls){
		if($(window).width() >=768){
			var partTopVal = $("." + cls).offset().top,
				winHeight = $(window).height(),
				indexS = 0,
				indexL = 0;		// 滚动时只执行一次的参数
			$(window).scroll(function(){
				if($(window).scrollTop() >= partTopVal && $(window).scrollTop() < partTopVal + winHeight){
					var opaVal = ($(window).scrollTop()-partTopVal) / winHeight;
					opaVal = Math.round(opaVal*100)/150
					$("." + cls + " .scroll-cons-mask").css("opacity",opaVal)
					indexS = 0;
					indexL = 0;
				} else if($(window).scrollTop() < partTopVal){
					if(indexS == 0){
						$("." + cls + " .scroll-cons-mask").css("opacity",0)
						indexS = 1;
					}
				} else if($(window).scrollTop() > partTopVal + $("." + cls).height()){
					if(indexL == 0){
						$("." + cls + " .scroll-cons-mask").css("opacity",0.6)
						indexL = 1;
					}
				}
			})
		} else {
			$(".scroll-cons-mask").css("opacity",0.5)
		}
	}*/


	//轮播翻页
	var n=[0,0,0,0,0,0,0,0,0];
	//console.log($(window).width())
	if($(window).width()>=768){

		var left=(($(window).width()-640)/2).toString()+"px";
		//var left=(($(window).width()-990)/2).toString()+"px";
		//$(".photo-album, .sub-head-points").css('left',left);
		//$(".sub-head-points").css('margin-left','-'+left);
		
		var photoHeight='530px';
		var subHeight='400px';

		//var photoHeight=530*990/640+'px';
		//var subHeight=400*990/640+'px';

		$(".photo-album").append("<div class='photo-next'></div><div class='photo-prev'></div>");
		photoSwipeWeb(1);
		photoSwipeWeb(2);
		
	}else{
		
		//var photoHeight='530px';
		//var subHeight='400px';

		var photoHeight=Math.floor($(window).width()*640/960+85).toString()+'px';
		var subHeight=Math.floor($(window).width()*640/960-25).toString()+'px';
	
		photoSwipe(1);
		photoSwipe(2);
		//$('.photo-album, .sub-head-points').css('width',$(window).width())
		
	}
	
	$('.photo-album').css('height',photoHeight)
	$('.sub-head-points').css('top',subHeight)
	
	function photoSwipeWeb(id){
			
			$(".photo-album"+id).find('.photo-next').click(function(){
				var total = $(".photo-album"+id+" li").length/2;
				
     		
    			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeOut(500);
     			if(n[id]<total-1) n[id]++;
				else n[id]=0;
				
				
     			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeIn(500);

     			$(this).parent().find('.sub-head-points li').removeClass('now');
     			$(this).parent().find('.sub-head-points li').eq(n[id]).addClass('now');
     			
	  		});

	  		$(".photo-album"+id).find('.photo-prev').click(function(){
	  			var total = $(".photo-album"+id+" li").length/2;

      			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeOut(500);
     			if(n[id]>0) n[id]--;
				else n[id]=total-1;
  
  			
     			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeIn(500);

     			$(this).parent().find('.sub-head-points li').removeClass('now');
     			$(this).parent().find('.sub-head-points li').eq(n[id]).addClass('now');
	  		});

	}

	function photoSwipe(id){

		var startX=0,moveX=0; //手指移动距离
		
		$('.photo-album'+id).bind("touchstart",function(e){
			

			startX = e.originalEvent.targetTouches[0].pageX;
     		//
     		//e.preventDefault();
     		//document.removeEventListener('touchstart', bodyScroll, false);
    	});
    	$(".photo-album"+id).bind("touchmove",function(e){
     		moveX = e.originalEvent.targetTouches[0].pageX - startX;
    	});
    	$(".photo-album"+id).bind("touchend",function(e){
     		
     		var total = $(".photo-album"+id+" li").length/2;
    		if(moveX<-50){
     			//document.removeEventListener('touchstart', bodyScroll, false);

     			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeOut(500);
     			if(n[id]<total-1) n[id]++;
				else n[id]=0;
				
				
     			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeIn(500);

     			$(this).parent().find('.sub-head-points li').removeClass('now');
     			$(this).parent().find('.sub-head-points li').eq(n[id]).addClass('now');

     			//$(window).bind('scroll');
     			
	  		}
	  		else if(moveX>50){
	  			//document.removeEventListener('touchstart', bodyScroll, false);

      			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeOut(500);
     			if(n[id]>0) n[id]--;
				else n[id]=total-1;
  
     			$(".photo-album"+id+" li").eq(n[id]).find('.photo-album-frame').fadeIn(500);

     			$(this).parent().find('.sub-head-points li').removeClass('now');
     			$(this).parent().find('.sub-head-points li').eq(n[id]).addClass('now');



     			//$(window).bind('scroll');
	  		}

	  		//document.removeEventListener('touchmove', bodyScroll, false);
	  		
			
	    });
 		

	}


	// 首屏动画
	var au=document.getElementById("cover-audio")
	function coverStart(){
		if($(window).width()<768){
			$(".play-btn").fadeIn(1000);
			setTimeout(function(){$(".play-btn").fadeOut(1000)},5000);
		}
   
		if($(window).width()>=768){
		$(".cover-headline").bind("click",function(){
						
					//$("#cover-audio").trigger("pause");		
					coverShow=0;

					$('body,html').animate({
		        	scrollTop: 0
	    			},function(){scrollCount=0})
					
					$(".part-0").css("height",$(window).height()+"px").fadeOut(1000);
					coverShow=0;
					//$(".cover-video").trigger("pause")				
					$(".flood-video").trigger("play");
					$(".flood-video-control-bar").animate({width:"100%"},60000,"linear")
					

	    			$(".flood-video").bind("ended",function(){
	    				$(".flood-video-poster").fadeIn();
	    				$(".part-0").css("position","absolute").fadeIn();
	    				$(".flood-video-control-bar").css("width","0");
	    				$(".cover-video").trigger("play")
	    				$(".flood-replay").fadeIn().bind("click",function(){
	    					$(this).fadeOut();
	    					$(".part-0").fadeOut();
	    					$(".flood-video").trigger("play");
	    					$(".flood-video-control-bar").animate({width:"100%"},60000,"linear")
	    				})
	    			})
		})
	}
		
		setTimeout(function(){
			if($(window).width() < 768) $(".cover-headline").fadeIn(3000);
			else $(".cover-headline").animate({opacity:1},3000);
		},$(window).width() >= 768?5000:9000)

		if($(window).width() >= 768){ 
			setTimeout(function(){
				$(".cover-headline").css("opacity",1);
			},8000);
		}

		// 提示动画
		var scrollTime = null,
			bottomVal = "60px";
		if($(window).width() < 768){
			bottomVal = "40px"
		}
		setTimeout(function(){
			scrollTime = setInterval(scrollTip,2000)
			function scrollTip(){
				$(".scroll-tip").animate({
					bottom: bottomVal,
					opacity: 1
				},{
					duration:1200,easing:'easeOutCubic',complete:function(){
						$(".scroll-tip").css({
							bottom: "20px",
							opacity: 0
						})
					}
				});
			}
		},8000)
		
		$(window).scroll(function(){
			hideScrollTip()
		})

		//首页
		var map_freeze=0;
		var map_count=0;
		
		var disaster_freeze=0;
		var disaster_count=0;
		var disaster_id=0;

		var dilishu_freeze=0;
		var dilishu_count=0;
		var dilishuPlay=0;
		//var dilishu_id=0;
		var chart98Play=0;
		
		var chart1Play=0;
		var chart2Play=0;
		var coverShow=1;

		
		$(window).scroll(function(){			
			var top = $(this).scrollTop(); 
			var val1 = $(".part-3").offset().top //降水infographic
			var val2 = $(".part-7").offset().top //伤亡infographic
			var val3 = $(".dilishu").offset().top //地理书
			var val4 = $(".chart98").offset().top //98洪水

			if($(window).width()>768){
				scrollCount++;			
				if(coverShow==1) $(this).scrollTop(0);
				if(scrollCount>10&&coverShow==1) {
					
					//$("#cover-audio").trigger("pause");		
					coverShow=0;

					$('body,html').animate({
		        	scrollTop: 0
	    			},function(){scrollCount=0})
					
					$(".part-0").css("height",$(window).height()+"px").fadeOut(1000);
					coverShow=0;
					//$(".cover-video").trigger("pause")				
					$(".flood-video").trigger("play");
					$(".flood-video-control-bar").animate({width:"100%"},60000,"linear")
					

	    			$(".flood-video").bind("ended",function(){
	    				$(".flood-video-poster").fadeIn();
	    				$(".part-0").css("position","absolute").fadeIn();
	    				$(".flood-video-control-bar").css("width","0");
	    				$(".cover-video").trigger("play")
	    				$(".flood-replay").fadeIn().bind("click",function(){
	    					$(this).fadeOut();
	    					$(".part-0").fadeOut();
	    					$(".flood-video").trigger("play");
	    					$(".flood-video-control-bar").animate({width:"100%"},60000,"linear")
	    				})
	    			})
	    			
				}				
			}

			

			

			if(top>val1-100&&chart1Play==0){
				chart1Play=1;
				mapPlay();
							
			} 
							
			if(top>val2-400&&chart2Play==0){
				chart2Play=1;
				disasterPlay(0);				
			} 

			
			
			if(top>val3-winHeight&&dilishuPlay==0){
				dilishuAni(0);
				setInterval(function(){dilishuAni(dilishu_id);},4000);
				dilishuPlay=1;
			}

			if(top>val4-winHeight&&chart98Play==0){
				chart98Ani(0);
				setInterval(function(){chart98Ani(chart98_id);},3000);
				chart98Play=1;
			}

			

			

			function nextImage(divName, thisId, maxId){
				//console.log(thisId);
				if(thisId<maxId){
					$("."+divName+" ul li").eq(thisId).fadeOut(1000);
					$("."+divName+" ul li").eq(thisId+1).fadeIn(1000);
					dilishu_id++;
				}
				if(thisId==maxId){
					$("."+divName+" ul li").eq(thisId).fadeOut(1000);
					$("."+divName+" ul li").eq(0).fadeIn(1000);
					dilishu_id=0;
					dilishu_freeze=0;
					//setTimeout(function(){dilishu_freeze=1},2000)
					//jumpTo(divName);

				}

			} 




		});

		function hideScrollTip(){
			if($(window).scrollTop() > 0){
				clearInterval(scrollTime)
				$(".scroll-tip").remove()
			}
		}
	}

	var chart98_id=0;
	function chart98Ani(id){
				if(id<3){
					$(".chart98 ul").eq(1).find("li").eq(id).fadeOut(1000);
					$(".chart98 ul").eq(1).find("li").eq(id+1).fadeIn(1000);
					$(".chart98 ul").eq(0).find("li").removeClass("now");
					$(".chart98 ul").eq(0).find("li").eq(id+1).addClass("now");
					chart98_id++;

				}
				else if(id==3){
					$(".chart98 ul").eq(1).find("li").eq(id).fadeOut(1000);
					$(".chart98 ul").eq(1).find("li").eq(0).fadeIn(1000);
					$(".chart98 ul").eq(0).find("li").removeClass("now");
					$(".chart98 ul").eq(0).find("li").eq(0).addClass("now");
					chart98_id=0;
				}

	}
	//setInterval(function(){chart98Ani(chart98_id);},2500);

	var dilishu_id=0;
	function dilishuAni(id){
				if(id<5){
					$(".dilishu ul").eq(1).find("li").eq(id).fadeOut(1000);
					$(".dilishu ul").eq(1).find("li").eq(id+1).fadeIn(1000);
					$(".dilishu ul").eq(0).find("li").removeClass("now");
					$(".dilishu ul").eq(0).find("li").eq(id+1).addClass("now");
					dilishu_id++;
				}
				else if(id==5){
					$(".dilishu ul").eq(1).find("li").eq(id).fadeOut(1000);
					$(".dilishu ul").eq(1).find("li").eq(0).fadeIn(1000);
					$(".dilishu ul").eq(0).find("li").removeClass("now");
					$(".dilishu ul").eq(0).find("li").eq(0).addClass("now");
					dilishu_id=0;
				}

	}
	//setInterval(function(){dilishuAni(dilishu_id);},2500);

			

			//console.log(val1,val2,top);

	// part 2
	$(".lead-box").height($(window).height() - 60 + "px")
	$(".lead-cons").css("margin-top","-" + $(".lead-cons").height() / 2 + "px")
	// part 3
	//$(".cons-txt").css("margin-top","-" + $(".cons-txt").height() / 2 + "px")
	// part 5
	if ($(window).width() <= 767) {
		$(".video-cons").css({
			"top": "50%",
			"margin-top" : "-" + $(window).width() * 0.3 + "px"
		})
	}
	// part 6
	$(".sub-title-box").height($(window).height() - 22 + "px")

	//	打开导航菜单
	var menuIndex = 0;
	$(".menu-bt").mouseover(function(event){
		if(menuIndex == 0){
			$(".menu-box").animate({
				right: 0
			},220,function(){
				menuIndex = 1;
			});
			// 手机显示关闭按钮
			if($(window).width() < 768){
				$(".menu-icon").hide();
				$(".close-icon").show();
			}
		}
	})
	// 手机关闭按钮
	if($(window).width() < 768){
	    $(".close-icon").click(function(){
	    	closeMenu()
	    })
	}

	$(".menu-box").mouseover(function(event){
		event.stopPropagation();
	})

	//	关闭导航菜单
	$(document).mouseover(function(event) {
		closeMenu()
	});
	function closeMenu(){
		if(menuIndex == 1){
			$(".menu-box").animate({
				right: "-221px"
			},200,function(){
				menuIndex = 0;
			});
			$(".menu-subnav").slideUp(function(){
				for(var i = 0; i < $(".menu-nav li").length; i++){
					subMenuIndex[i] = 0;
				}
			});
			$(".close-icon").hide();
			$(".menu-icon").show();
		}
	}

	//	打开和关闭导航子菜单
	var subMenuIndex = [];
	for(var i = 0; i < $(".menu-nav li").length; i++){
		subMenuIndex[i] = 0;
	}
	$(".menu-nav li").mouseover(function(event) {
		var index = $(this).index()
		for(var i = 0; i < $(".menu-nav li").length; i++){
			if(i != index){
				$(".menu-nav li").eq(i).find(".menu-subnav").slideUp(function(){
					subMenuIndex[i] = 0;
				});
			}
		}
		if(subMenuIndex[index] == 0){
			$(this).find(".menu-subnav").slideDown(function(){
				subMenuIndex[index] = 1;
			});
		}
		return false
	})


	


	// 滚动到相应位置，cls为目标的class，isClose为手机端是否关闭导航的参数，值为true（关闭）和false（不关闭）,n为封面id
	function jumpTo(cls){
		console.log(cls)
		var val = $("." + cls).offset().top
		$('body,html').animate({
	        scrollTop: val
	    })
		if($("body").width() >= 768){
		    closeMenu()
		} else {
			if(isClose){
				closeMenu()
			}
		}
		$(".bg li").removeClass("display")
		$(".bg li").eq(n).addClass('display')
	}

	// 初始化图片显示为全屏
	function fullScrPhoto(cls){

		if($(window).height() > $(window).width() * 2 / 3){
			$("." + cls).height($(window).height());
			$("." + cls).width("auto");
		} else {
			$("." + cls).width($(window).width());
			$("." + cls).height("auto");
		}
		//$("." + cls).css({
		//	"margin-top" : "-" + $("." + cls).height() / 2 + "px",
		//	"margin-left" : "-" + $("." + cls).width() / 2 + "px"
		//})
	}

