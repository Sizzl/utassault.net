/**************************************************************************
 * jQuery Banner Rotator
 * @info: http://www.codegrape.com/item/jquery-banner-rotator/1333
 * @version: 1.0 (29/05/2015)
 * @requires: jQuery v1.7 or later (tested on 1.11.3)
 * @author: flashblue - http://www.codegrape.com/user/flashblue
**************************************************************************/

;(function($,undefined) {
	
	$.fn.extend({	
	
		bannerRotator:function(options) {
			
			//Default values
			var defaults = {
				startWidth:1170,
				startHeight:500,
				
				autoPlay:true,
				playOnce:false,
				selectOnHover:false,
				
				randomize:false,					   	//Randomize slide order	
				
				//Transition
				delay:5000,								//Default delay time	
				transition:"random",				   	//Effects
				easing:"",
				velocity:1,
	
				//Button
				showButton:true,
				showNumber:true,
				showPlayPauseButton:true,
				showPreviousNextArrow:false,
				showCenterPreviousNextArrow:true,
				showButtonOnHover:false,
				buttonAlign:"BR",					  	//Align
				buttonWidth:20,
				buttonHeight:20,
				buttonBorderRadius:2,
				buttonMargin:1,
				buttonOffsetHorizontal:10,
				buttonOffsetVertical:10,
				touchEnabled:true,					 	//Enable Swipe Function
	
				//Thumbnail
				showThumb:false,
				thumbWidth:72,						 	//Thumb width, height
				thumbHeight:54,
				
				//Timer
				showTimer:true,
				timerType:"clock",					 	//clock, line
				timerArcSize:2,							//Clock timer arc size
				timerAlign:"top",				   	  	//bottom, top
				pauseOnHover:false,				     	//Pause timer on hover
	
				//Shadow
				shadow:2,							  	//0 = no Shadow, 1,2,3 = 3 Different art of shadows
				
				//Tooltip
				showTooltip:true,
				tooltipType:"image",				   	//image, text
				
				//Caption
				hideCaptionAtResolution:0,			 	//It defines if a caption should be shown under a screen resolution (Based on the width of browser)
				captionEasing:"easeOutQuint",
				
				//Lazy load
				lazyLoad:false,							//Load all images if no lazy load for each image
				
				//Current item
				currentItem:0,
				
				//Mouse scroll
				scrollMouseWheel:true,
				
				//Full width
				fullWidth:false,					   	//Turns on or off the fullwidth image centering
				
				//Full screen
				fullScreen:false,
				fullScreenOffsetContainer:"",
				
				//Video
				videoJsPath:"videojs/"
			};
	
			//Options
			var options = $.extend({}, defaults, options);
			
			//Button alignment
			var ALIGN = {"TL":0, "TC":1, "TR":2, "BL":3, "BC":4, "BR":5, "LT":6, "LC":7, "LB":8, "RT":9, "RC":10, "RB":11};
			
			//Effects
			var ei = 0;
			var EFFECTS = {
				"block":ei++, 				"cube":ei++, 				"cubeRandom":ei++,  		"cubeShow":ei++,		"cubeStop":ei++, 
				"cubeStopRandom":ei++, 	   	"cubeHide":ei++, 			"cubeSize":ei++, 			"cubeSpread":ei++,		"horizontal":ei++, 			  
				"showBars":ei++, 			"showBarsRandom":ei++, 	   	"tube":ei++,				"fade":ei++,			"fadeFour":ei++,	
				"parallel":ei++,			"blind":ei++,				"blindHeight":ei++,			"blindWidth":ei++,		"directionTop":ei++,			
				"directionBottom":ei++, 	"directionRight":ei++,	   	"directionLeft":ei++,		"glassCube":ei++,		"glassBlock":ei++,
				"circles":ei++,			  	"circlesInside":ei++,		"circlesRotate":ei++,		"upBars":ei++, 			"downBars":ei++, 
				"hideBars":ei++, 			"swapBars":ei++, 			"swapBarsBack":ei++, 		"swapBlocks":ei++,		"cut":ei++,
				"random":ei++
			};
			
			/************************
			    - Rotator class -
			************************/
			function BannerRotator($obj, options) {
				
				//Variables
				this.container = $obj;
				this.cap = this.container.parent();			
				this.currentli;
				this.oldli;
				this.fulloff = 0;
				this.httpprefix = location.protocol==="https:" ? "https:" : "http:";
				
				//Options
				this.opt = options;	
				this.opt.container = this.container;
				this.opt.button = "next";
				this.opt.oldItem = 0;	
				
				//Buttons
				this.buttons = $('<div class="buttons">\
									<div class="previous-btn"></div>\
									<div class="play-btn"></div>\
									<div class="next-btn"></div>\
								</div>');
				this.playBtn;
				this.previousBtn;
				this.nextBtn;
				this.cPreviousBtn;
				this.cNextBtn;
				this.bullets;
				this.tooltip;
				this.verticalButtonAlign = false;
				
				//List items
				this.listItems;	
					
				//Preloader
				this.preloader = $('<div class="preloader"></div>');
								
				//Timer
				this.timer = $('<div class="timer"></div>');
				this.clockTimerHolder = $('<div class="clock-timer-holder"></div>');
				this.clockTimer = $('<canvas class="clock-timer"></canvas>');	
				this.clockContext;				
				this.timerId = null;
				this.delay = 0;	
				this.paused = false;
				
				//Browser
				this.opt.ie = false;
				this.opt.ie9 = false;	
				
				//Video				
				this.opt.videoPlaying = false;
				this.opt.videoStarted = false;
				this.opt.videoStopped = false;	
				
				//Init rotator
				this.init();
			}
			
			BannerRotator.prototype = {
				
				//Init rotator
				init:function() {
					var that = this;					
					this.container.data("opt", this.opt);
					if (this.container.attr('id')==undefined) this.container.attr('id',"banner-rotator-"+Math.round(Math.random()*1000+5));
					
					//Check browser type
					this.checkBrowser();
					
					//Check jQuery version
					this.checkJQueryVersion();
					
					//Delegate .transition() calls to .animate() if the browser can't do CSS transitions
					if (!$.support.transition) {$.fn.transition = $.fn.animate;}
					$.cssEase['bounce'] = 'cubic-bezier(0,1,0.5,1.3)';
					
					//Load YouTube API if necessary			
					this.loadYouTubeAPI();
	
					//Load Vimeo API if necessary
					this.loadVimeoAPI();
					
					//Load video.js API if necessary
					this.loadVideoJSAPI();
					
					//Randomize slides order if set
					if (this.opt.randomize) {
						this.randomizeSlides();
					}
					
					//List items
					this.listItems = this.container.find('>ul:first >li');
					
					//Rollover variables
					if (this.isTouchDevice()) {
						this.opt.showButtonOnHover = this.opt.pauseOnHover = this.opt.selectOnHover = false;	
					}
					
					//Amount of the slides
					this.opt.slideCount = this.listItems.length;
					
					//Change options
					if (this.opt.slideCount<=1) {
						this.opt.autoPlay = this.opt.showButton = this.opt.showPlayPauseButton = this.opt.showPreviousNextArrow = this.opt.showCenterPreviousNextArrow = this.opt.showTimer = this.opt.scrollMouseWheel = false;
					}
					
					if (this.opt.showCenterPreviousNextArrow) {
						this.opt.showPreviousNextArrow = false;
					}
					if (this.opt.showThumb) {
						this.opt.showNumber = false;
						if (this.opt.tooltipType=="image") {
							this.opt.tooltipType = "none";
						}
					}
					
					//Preloader
					this.container.append(this.preloader);
					
					//Create timer
					this.createTimer();
					
					//Old item
					this.opt.oldItem = this.opt.currentItem-1;
					if (this.opt.oldItem==-1) {this.opt.oldItem = this.opt.slideCount-1;}
					
					//A basic grid must be defined. If no default grid exist than we need a default value, actual size of container
					if (this.container.height()==0) this.container.height(this.opt.startHeight);
					if (this.opt.startWidth==0) this.opt.startWidth = this.container.width();
					if (this.opt.startHeight==0) this.opt.startHeight = this.container.height();
	
					//Option width & height should be set
					this.opt.width = this.container.width();
					this.opt.height = this.container.height();
	
					//Default dependencies
					this.opt.bw = this.opt.startWidth / this.container.width();
					this.opt.bh = this.opt.startHeight / this.container.height();
	
					//If the item already in a resized form
					if (this.opt.width!=this.opt.startWidth) {
						this.opt.height = Math.round(this.opt.startHeight*(this.opt.width/this.opt.startWidth));
						this.container.height(this.opt.height);
					}
					
					//Velocity
					if (this.opt.velocity>=2) this.opt.velocity = 1.3;
					if (this.opt.velocity<=0) this.opt.velocity = 1;
					
					//Create shadow
					this.createShadow();
					
					if (!this.opt.lazyLoad) {
						//Wait for images to load
						this.container.waitForImages(function() {
							that.container.waitForImages(function() {
								//Hide preloader
								that.preloader.fadeOut(600);
								setTimeout(function() {
									//Prepare the slides
									that.prepareSlides();
									//Create buttons
									that.createButtons();								
									//Start the first slide
									that.swapSlide();								
									//Onloaded event trigger
									that.container.trigger('banner_rotator.onloaded');
								}, 600);
							});
						});
					} else {
						//If lazy load is activated
						var fli = this.container.find('ul >li >img').first();
						if (fli.data('lazyload')!=undefined) fli.attr('src', fli.data('lazyload'));
						fli.data('lazydone', 1);
						
						fli.parent().waitForImages(function() {
							fli.parent().waitForImages(function() {
								//Hide preloader
								that.preloader.fadeOut(600);
								setTimeout(function() {
									//Prepare the slides
									that.prepareSlides();
									//Create buttons
									that.createButtons();								
									//Start the first slide
									that.swapSlide();								
									//Onloaded event trigger
									that.container.trigger('banner_rotator.onloaded');
								}, 600);
							});
						});
					}							
					
					//If resized, need to stop actual transition and resize actual images
					$(window).resize(function() {
						if ($("body").find(that.container)!=0) {
							if (that.container.outerWidth(true)!=that.opt.width) {							
								that.containerResized();
							}
						}
					});
					
					//Check if the caption is a "Scroll me to position" caption
					this.container.find('.scrollbelowslider').on('click',function() {
							var off = 0;
							
							try{
								off = $('body').find(that.opt.fullScreenOffsetContainer).height();
							} catch(e) {}
							
							try{
								off -= $(this).data('scrolloffset');
							} catch(e) {}

							$('body,html').animate({scrollTop:(that.container.offset().top+(that.container.find('>ul >li').height())-off)+"px"}, {duration:400});
					});
				},
				
				//Check browser type
				checkBrowser:function() {
					this.opt.ie = !$.support.opacity;
					this.opt.ie9 = (document.documentMode == 9);
				},
				
				//Check jQuery version
				checkJQueryVersion:function() {
					var version = $.fn.jquery.split('.'),
						versionTop = parseFloat(version[0]),
						versionMinor = parseFloat(version[1]),
						versionIncrement = parseFloat(version[2] || '0');
					
					//If jQuery is less than 1.7 generate error
					if (versionTop==1 && versionMinor<7) {
						alert("jQuery version is "+version+". Please, update it to 1.7 or later.");
					}
				},
				
				//Check if touch device
				isTouchDevice:function() {
					return (("ontouchstart" in window) || (navigator.MaxTouchPoints>0) || (navigator.msMaxTouchPoints>0));
				},
				
				//Load YouTube API if necessary				
				loadYouTubeAPI:function() {
					var that = this;
					var addedyt = false;
					
					this.container.find('.caption iframe').each(function() {
						try {
							if ($(this).attr('src').indexOf('you')>0 && !addedyt) {
								addedyt = true;
								var src = that.httpprefix+"//www.youtube.com/iframe_api";
								
								var s = document.createElement("script");
								s.src = src;
								var before = document.getElementsByTagName("script")[0];
								
								var loadit = true;
								$('head').find('*').each(function() {
									if ($(this).attr('src')==src) {
									   loadit = false;
									}
								});
								
								if (loadit) {
									before.parentNode.insertBefore(s, before);
								}
							}
						} catch(e) {}
					});
				},
					
				//Load Vimeo API if necessary
				loadVimeoAPI:function() {
					var that = this;
					var addedvim = false;
					
					this.container.find('.caption iframe').each(function() {
						try {
							var src = that.httpprefix+"//a.vimeocdn.com/js/froogaloop2.min.js";
							
							if ($(this).attr('src').indexOf('vim')>0 && !addedvim) {
								addedvim = true;
								
								var f = document.createElement("script");
								f.src = src;
								var before = document.getElementsByTagName("script")[0];

								var loadit = true;
								$('head').find('*').each(function() {
									if ($(this).attr('src')==src) {
									   loadit = false;
									}
								});
								
								if (loadit) {
									before.parentNode.insertBefore(f, before);
								}
							}							
							
							if ($(this).attr('src').indexOf('vim')>0) {
								var f = document.createElement("script");
								f.src = src;
								var before = document.getElementsByTagName("script")[0];
								before.parentNode.insertBefore(f, before);
							}
						} catch(e) {}
					});
				},
				
				//Load video.js API if necessary
				loadVideoJSAPI:function() {
					var that = this;
					var addedvid = false;
					
					this.container.find('.caption video').each(function(i) {
						try{
							if ($(this).hasClass('video-js') && !addedvid) {
								addedvid = true;
								var src = that.opt.videoJsPath+"video.js";
								
								var f = document.createElement("script");
								f.src = src;
								var before = document.getElementsByTagName("script")[0];
								
								var loadit = true;
								$('head').find('*').each(function() {									
									if ($(this).attr('src')==src) {
									   loadit = false;
									}
								});
								
								if (loadit) {
									before.parentNode.insertBefore(f, before);
									$('head').append('<link rel="stylesheet" type="text/css" href="'+that.opt.videoJsPath+'video-js.min.css" media="screen" />');
									$('head').append('<script> videojs.options.flash.swf = "'+that.opt.videoJsPath+'video-js.swf";</script>');
								}
							}
						} catch(e) {}
					});
				},
				
				//Randomize slides
				randomizeSlides:function() {
					var len = this.container.find('>ul:first-child >li').length;
					var arrSlides = new Array(len);
					var i = 0;
					
					for (i=0; i<len; i++) {
						arrSlides[i] = this.container.find('>ul:first-child >li:eq('+i+')').clone(true);
					}	
								
					for (i=0; i<len; i++) {
						var rnd = Math.floor(Math.random()*len);
						var temp = arrSlides[i];
						arrSlides[i] = arrSlides[rnd];
						arrSlides[rnd] = temp;
					}	
								
					for (i=0; i<len; i++) {
						this.container.find('>ul:first-child >li:eq('+i+')').replaceWith(arrSlides[i]);
					}
				},
				
				//Randomize array
				randomizeArray:function(arr) {
					var total = arr.length;
					for (var i=0; i<total; i++) {
						var rnd = Math.floor(Math.random()*total);
						var temp = arr[i];
						arr[i] = arr[rnd];
						arr[rnd] = temp;
					}
				},
				
				//Prevent default behaviour
				preventDefault:function() {
					return false;
				},
				
				//Prepare the slides
				prepareSlides:function() {	
					var that = this;
					
					//Caption
					this.container.find('.caption').each(function() { 
						$(this).addClass($(this).data('transition'));
						$(this).addClass('start');
					});
					
					//Prepare the ul container to having max height and height for any situation
					this.container.find('>ul:first').css({overflow:'hidden', width:'100%', height:'100%', maxHeight:this.cap.css('maxHeight')});
		
					//Link
					this.listItems.each(function() {
						var li = $(this);
						
						//Make li overflow hidden for further issues
						li.css({'width':'100%', 'height':'100%', 'overflow':'hidden'});
						
						if (li.data('link')!=undefined) {
							var link = li.data('link');
							var target = "_self";
							if (li.data('target')!=undefined) target = li.data('target');
							li.prepend('<div class="caption sft slidelink" data-x="0" data-y="0" data-start="0"><a target="'+target+'" href="'+link+'"><div></div></a></div>');	
						}	
					});	
					
					//Image
					this.listItems.find(">img").each(function() {
						var img = $(this);
						img.addClass("defaultimg");
						
						if (img.data('lazyload')==undefined) {
							that.setSize(img);
							that.setSize(img);
						}
					});	
					
					//Resolve overflow hidden of main container
					this.cap.css({'overflow':'visible'});
				},
				
				//Create shadow
				createShadow:function() {
					if (this.opt.shadow) {
						this.cap.append('<div class="banner-rotator-shadow banner-rotator-shadow'+this.opt.shadow+'"></div>');
						this.cap.find('.banner-rotator-shadow').css({'width':this.opt.width});
					}
				},
				
				//Create buttons
				createButtons:function() {
					//Add buttons
					this.cap.append(this.buttons);
					
					//Width-height
					this.buttons.find("div").css({width:this.opt.buttonWidth, height:this.opt.buttonHeight}).mousedown(this.preventDefault());
					
					//Vertical alignment				
					this.verticalButtonAlign = ALIGN[this.opt.buttonAlign] >= ALIGN["LT"] ? true : false;
					
					//Bullets-thumbs
					if (this.opt.showButton) {
						if (this.opt.showThumb) {
							//Add thumbs
							var bullets = "", item, thumb;
							
							for (i=0; i<this.opt.slideCount; i++) {
								item = $(this.listItems.get(i));
								thumb = item.data("thumb");
								bullets += '<div class="thumb" data-index="'+i+'">\
												<img src="'+thumb+'" width="'+this.opt.thumbWidth+'" height="'+this.opt.thumbHeight+'" data-index="'+i+'" />\
										    </div>';
							}
							
							this.bullets = $(bullets);							
							this.bullets.css({width:this.opt.thumbWidth, height:this.opt.thumbHeight})
										.mousedown(this.preventDefault());
						} else {
							//Add bullets
							var bullets = "";
							
							for (i=0; i<this.opt.slideCount; i++) {
								bullets += '<div class="bullet" data-index="'+i+'">'+(this.opt.showNumber ? (i+1) : "")+'</div>';
							}	
							
							this.bullets = $(bullets);
							this.bullets.css({width:this.opt.buttonWidth, height:this.opt.buttonHeight, "line-height":this.opt.buttonHeight+"px"})
										.mousedown(this.preventDefault());						
						}
						
						//Add bullets-thumbs holder
						this.buttons.prepend(this.bullets);
						
						//Mouse over-click event
						if (this.opt.selectOnHover) {
							this.bullets.bind("mouseover", {elem:this}, this.selectItem);
						} else {
							this.bullets.bind("click", {elem:this}, this.selectItem);
						}
						
						//Margin
						if (this.verticalButtonAlign) {
							this.buttons.find("div").addClass("vertical").css("margin-bottom", this.opt.buttonMargin);
							this.buttons.find("div:last-child").css("margin-bottom", "0");
						} else {
							this.buttons.find("div").css("margin-right", this.opt.buttonMargin);
							this.buttons.find("div:last-child").css("margin-right", "0");
						}
						
						//Set button alignment
						this.setButtonAlign();
						
						//Create tooltip
						this.createTooltip();
					}
					
					//Buttons
					this.buttons.find("div").css({"border-radius":this.opt.buttonBorderRadius});
					this.playBtn = this.buttons.find(".play-btn");
					this.previousBtn = this.buttons.find(".previous-btn");
					this.nextBtn = this.buttons.find(".next-btn");
					
					//Play-pause button
					this.playBtn.toggleClass("pause", this.opt.autoPlay).bind("click", {elem:this}, this.togglePlay);					
					
					if (!this.opt.showPlayPauseButton) {
						this.playBtn.hide();
					}
					
					//Directional buttons
					this.previousBtn.bind("click", {elem:this}, this.previousItem);
					this.nextBtn.bind("click", {elem:this}, this.nextItem);
					
					if (!this.opt.showPreviousNextArrow) {						
						this.previousBtn.hide();
						this.nextBtn.hide();
					}
					
					//Pause on hover
					this.pauseOnHoverBind();
					

					//Center arrows
					if (this.opt.showCenterPreviousNextArrow) {
						this.container.append('<div class="s-prev"></div><div class="s-next"></div>');
						this.cPreviousBtn = this.container.find(".s-prev");
						this.cNextBtn = this.container.find(".s-next");


						this.cPreviousBtn.bind("click", {elem:this}, this.previousItem).mousedown(this.preventDefault());
						this.cNextBtn.bind("click", {elem:this}, this.nextItem).mousedown(this.preventDefault());
						
						if (this.opt.showButtonOnHover) {
							this.cPreviousBtn.css("opacity", 0);
							this.cNextBtn.css("opacity", 0);
						}
					}
					
					//Show buttons on hover
					if (this.opt.showButtonOnHover) {
						this.buttons.css("opacity", 0);
						this.container.bind("mouseenter", {elem:this}, this.showSideButtons)
									  .bind("mouseleave", {elem:this}, this.hideSideButtons);
						this.buttons.bind("mouseenter", {elem:this}, this.showSideButtons)
									.bind("mouseleave", {elem:this}, this.hideSideButtons);
					}
					
					//Enable swipe function
					this.swipeAction();
					
					//Scroll with mouse wheel
					if (this.opt.scrollMouseWheel) {
						try {
							this.container.bind("mousewheel", {elem:this}, this.mouseScroll).bind("DOMMouseScroll", {elem:this}, this.mouseScroll);
						} catch(ex) {}
					}
					
					//Show buttons
					this.buttons.css("visibility", "visible");
				},
				
				//Set button alignment
				setButtonAlign:function() {					
					switch (ALIGN[this.opt.buttonAlign]) {
						case ALIGN["BL"]:						
							this.setHPanel("left");
							this.setInsideHP("bottom");
							break;
						case ALIGN["BC"]:
							this.setHPanel("center");
							this.setInsideHP("bottom");
							break;
						case ALIGN["BR"]:
							this.setHPanel("right");
							this.setInsideHP("bottom");
							break;
						case ALIGN["TL"]:							
							this.setHPanel("left");
							this.setInsideHP("top");
							break;
						case ALIGN["TC"]:								
							this.setHPanel("center");
							this.setInsideHP("top");
							break;
						case ALIGN["TR"]:								
							this.setHPanel("right");
							this.setInsideHP("top");
							break;
						case ALIGN["LT"]:
							this.setVPanel("top");
							this.setInsideVP("left");
							break;
						case ALIGN["LC"]:
							this.setVPanel("center");
							this.setInsideVP("left");
							break;
						case ALIGN["LB"]:
							this.setVPanel("bottom");
							this.setInsideVP("left");
							break;
						case ALIGN["RT"]:								
							this.setVPanel("top");
							this.setInsideVP("right");
							break;
						case ALIGN["RC"]:								
							this.setVPanel("center");
							this.setInsideVP("right");
							break;
						case ALIGN["RB"]:								
							this.setVPanel("bottom");
							this.setInsideVP("right");
							break;
					}											
				},
				
				//Set horizontal panel
				setHPanel:function(align) {
					var alignPos, padding;
					
					if (align=="center") {						
						alignPos = Math.round(this.buttons.width()/2);
						this.buttons.css({"left":"50%", "margin-left":"-"+alignPos+"px"});
					} else if (align=="left") {
						padding = parseInt(this.cap.css("padding-left"));
						this.buttons.css({"left":(this.opt.buttonOffsetHorizontal+padding)+"px"});
					} else {
						padding = parseInt(this.cap.css("padding-right"));
						this.buttons.css({"right":(this.opt.buttonOffsetHorizontal+padding)+"px"});
					}
				},
				
				//Set vertical panel
				setVPanel:function(align) {
					var alignPos, padding;
					
					if (align=="center") {						
						alignPos = Math.round(this.buttons.height()/2);
						this.buttons.css({"top":"50%", "margin-top":"-"+alignPos+"px"});
					} else if (align=="top") {
						padding = parseInt(this.cap.css("padding-top"));
						this.buttons.css({"top":(this.opt.buttonOffsetVertical+padding)+"px"});
					} else {
						padding = parseInt(this.cap.css("padding-bottom"));
						this.buttons.css({"bottom":(this.opt.buttonOffsetVertical+padding)+"px"});
					}
				},
				
				//Set inside horizontal panel
				setInsideHP:function(align) {
					var padding;
					
					if (align=="top") {
						padding = parseInt(this.cap.css("padding-top"));
						this.buttons.css({"top":(this.opt.buttonOffsetVertical+padding)+"px"});
					} else {
						padding = parseInt(this.cap.css("padding-bottom"));
						this.buttons.css({"bottom":(this.opt.buttonOffsetVertical+padding)+"px"});
					}
				},
				
				//Set inside vertical panel
				setInsideVP:function(align) {
					var padding;
					
					if (align=="left") {
						padding = parseInt(this.cap.css("padding-left"));
						this.buttons.css({"left":(this.opt.buttonOffsetHorizontal+padding)+"px"});
					} else {
						padding = parseInt(this.cap.css("padding-right"));
						this.buttons.css({"right":(this.opt.buttonOffsetHorizontal+padding)+"px"});
					}
				},
				
				//Set the swipe function
				swipeAction:function() {
					var that = this;
					
					//Touch enabled function
					if (this.opt.touchEnabled) {
						this.container.swipe({
							data:that.container,
							swipeRight:function() {
								that.opt.button = "previous";
								that.resetTimer();
								that.opt.oldItem = that.opt.currentItem;
								that.opt.currentItem = that.opt.currentItem>0 ? (that.opt.currentItem-1) : (that.opt.slideCount-1);
								that.swapSlide();
							},
							swipeLeft:function() {
								that.opt.button = "next";
								that.resetTimer();
								that.opt.oldItem = that.opt.currentItem;
								that.opt.currentItem = that.opt.currentItem<(that.opt.slideCount-1) ? (that.opt.currentItem+1) : 0;
								that.swapSlide();
							},
							allowPageScroll:"auto"
						});
					}
				},
				
				//Scroll with mouse wheel
				mouseScroll:function(e) {
					var that = e.data.elem;
					var delta = (typeof e.originalEvent.wheelDelta == "undefined") ?  -e.originalEvent.detail : e.originalEvent.wheelDelta;
					delta>0 ? that.previousItem() : that.nextItem();
					return false;
				},
				
				/******************
				    - Tooltip -
				******************/
				
				//Create tooltip
				createTooltip:function() {
					if (this.opt.showTooltip) {
						if (this.opt.tooltipType=="text") {
							$("body").append("<div id='rotator-tooltip'><div class='arrow'></div><div class='tt-txt'></div></div>");
							this.tooltip = $("body").find("#rotator-tooltip");
							this.bullets.bind("mouseover", {elem:this}, this.showTooltip).bind("mouseout", {elem:this}, this.hideTooltip).bind("mousemove", {elem:this}, this.moveTooltip);
							
							switch (ALIGN[this.opt.buttonAlign]) {
								case ALIGN["TL"]: case ALIGN["TC"]: case ALIGN["TR"]:
									this.tooltip.data("bottom",true).addClass("txt-down");
									break;
								default:
									this.tooltip.data("bottom",false).addClass("txt-up");
							}
						} else if (this.opt.tooltipType=="image") {					
							var content = '<div id="rotator-tooltip"><div class="arrow"></div>';
							
							for (var i=0; i<this.opt.slideCount; i++) {	
								var img = $(this.listItems.get(i)).data("thumb");						
								if (img!=undefined) {
									content += '<img src="'+img+'" />';
								} else {
									content += '<img/>';
								}
							}
							
							content += '</div>';							
							$("body").append(content);
							
							this.tooltip = $("body").find("#rotator-tooltip");
							this.tooltip.css({opacity:0, "-moz-opacity":0, "filter":"alpha(opacity=0)"});
							
							switch (ALIGN[this.opt.buttonAlign]) {
								case ALIGN["TL"]: case ALIGN["TC"]: case ALIGN["TR"]:
									this.bullets.bind("mouseover", {elem:this}, this.showHImgTooltip);
									this.tooltip.data("bottom",true).addClass("img-down");
									break;
								case ALIGN["LT"]: case ALIGN["LC"]: case ALIGN["LB"]:
									this.bullets.bind("mouseover", {elem:this}, this.showVImgTooltip);
									this.tooltip.data("right",true).addClass("img-right");
									break;
								case ALIGN["RT"]: case ALIGN["RC"]: case ALIGN["RB"]:
									this.bullets.bind("mouseover", {elem:this}, this.showVImgTooltip);
									this.tooltip.data("right",false).addClass("img-left");
									break;
								default:
									this.bullets.bind("mouseover", {elem:this}, this.showHImgTooltip);
									this.tooltip.data("bottom",false).addClass("img-up");
							}
							
							this.bullets.bind("mouseout", {elem:this}, this.hideImgTooltip);
						}						
					}
				},
				
				//Show horizontal image tooltip
				showHImgTooltip:function(e) {
					var that = e.data.elem;
					var img = that.tooltip.find(">img").eq($(this).index());
					
					if (img.attr("src")) {
						that.tooltip.find(">img").hide();
						img.show();
						
						if (img[0].complete || img[0].readyState == "complete") {	
							var yOffset = that.tooltip.data("bottom") ? $(this).outerHeight() : -that.tooltip.outerHeight();
							var offset = $(this).offset();
							var top = offset.top+yOffset;
							var animOffset = that.tooltip.data("bottom") ? -5 : 5;
							
							that.tooltip.stop(true, true)
										 .css({display:"block", top:top+animOffset, left:offset.left + (($(this).outerWidth() - that.tooltip.outerWidth())/2)})
										 .delay(300).animate({top:top, opacity:1}, 500);
						}
					}
				},
				
				//Show vertical image tooltip
				showVImgTooltip:function(e) {
					var that = e.data.elem;
					var img = that.tooltip.find(">img").eq($(this).index());
					
					if (img.attr("src")) {
						that.tooltip.find(">img").hide();
						img.show();
						
						if (img[0].complete || img[0].readyState == "complete") {
							var xOffset = that.tooltip.data("right") ? $(this).outerWidth() : -that.tooltip.outerWidth();
							var offset = $(this).offset();
							var left = offset.left+xOffset;
							var animOffset = that.tooltip.data("right") ? -5 : 5;
							
							that.tooltip.stop(true, true)
										 .css({display:"block", top:offset.top + (($(this).outerHeight() - that.tooltip.outerHeight())/2), left:left+animOffset})
										 .delay(300).animate({left:left, opacity:1}, 500);
						}
					}
				},
				
				//Hide image tooltip
				hideImgTooltip:function(e) {
					var that = (typeof e!="undefined") ? e.data.elem : this;
					
					if (that.opt.showTooltip) {
						that.tooltip.stop(true, true)
						.animate({opacity:0}, 500, "linear", function() {that.tooltip.css({display:"none"});});
					}
				},
				
				//Show text tooltip
				showTooltip:function(e) {
					var that = e.data.elem;
					var i = $(this).data("index");
					var item = $(that.listItems.get(i));
					var title = item.data("title");
					
					if (title!="") {								
						that.tooltip.find(">div.tt-txt").html(title);
						var yOffset = that.tooltip.data("bottom") ? 20 : -that.tooltip.outerHeight(true);
						var xOffset = that.tooltip.data("bottom") ? 9: 13;
						that.tooltip.css({top:e.pageY+yOffset, left:e.pageX-xOffset}).stop(true, true).delay(300).fadeIn(500);
					}
				},
				
				//Move text tooltip
				moveTooltip:function(e) {
					var that = e.data.elem;
					var yOffset = that.tooltip.data("bottom") ? 20 : -that.tooltip.outerHeight(true);
					var xOffset = that.tooltip.data("bottom") ? 9: 13;
					
					that.tooltip.css({top:e.pageY+yOffset, left:e.pageX-xOffset});
				},
				
				//Hide text tooltip
				hideTooltip:function(e) {
					var that = (typeof e!="undefined") ? e.data.elem : this;
					
					if (that.opt.showTooltip && that.tooltip!=undefined) {
						that.tooltip.stop(true, true).hide();
					}
				},
				
				/***********************
				    - Play / Pause -
				***********************/
				
				//Toggle
				togglePlay:function(e) {
					var that = e.data.elem;
					that.opt.autoPlay = !that.opt.autoPlay;
					
					if (that.container.data('play')!=undefined) {
						that.opt.autoPlay = that.container.data('play');						
						that.container.removeData('play');						
					}
										
					that.playBtn.toggleClass("pause", that.opt.autoPlay);
					that.opt.autoPlay ? that.startTimer() : that.pauseTimer();
					
					return false;
				},
				
				//Play
				play:function(e) {
					var that = e.data.elem;
					
					if (!that.opt.videoPlaying) {
						that.paused = false;
						that.opt.autoPlay = true;
						that.playBtn.addClass("pause");
						that.startTimer();
					}
				},
				
				//Pause
				pause:function(e) {
					var that = e.data.elem;
					that.paused = true;
					that.opt.autoPlay = false;
					that.playBtn.removeClass("pause");
					that.pauseTimer();
				},
				
				//Pause on last item
				pauseLast:function() {
					if (this.opt.currentItem==(this.opt.slideCount-1)) {
						this.opt.autoPlay = false;
						this.playBtn.removeClass("pause");
						this.container.trigger('banner_rotator.onstop');
					}
				},
				
				//Bind pause on hover
				pauseOnHoverBind:function() {
					if (this.opt.autoPlay && this.opt.pauseOnHover) {						
						this.container.bind("mouseenter", {elem:this}, this.pause)
									  .bind("mouseleave", {elem:this}, this.play);
					}
				},
				
				//Unbind pause on hover
				pauseOnHoverUnBind:function() {
					if (this.opt.pauseOnHover) {
						this.container.unbind("mouseenter");
						this.container.unbind("mouseleave");
					}
				},	
				
				/**************************
				    - Previous / Next -
				**************************/
				
				//Go to previous item
				previousItem:function(e) {
					var that = (typeof e != "undefined") ? e.data.elem : this;
					
					that.opt.button = "previous";
					that.resetTimer();
					that.opt.oldItem = that.opt.currentItem;
					that.opt.currentItem = that.opt.currentItem>0 ? (that.opt.currentItem-1) : (that.opt.slideCount-1);
					that.swapSlide();
					
					return false;
				},
				
				//Go to next item
				nextItem:function(e) {
					var that = (typeof e != "undefined") ? e.data.elem : this;
					
					that.opt.button = "next";
					that.resetTimer();
					that.opt.oldItem = that.opt.currentItem;
					that.opt.currentItem = that.opt.currentItem<(that.opt.slideCount-1) ? (that.opt.currentItem+1) : 0;
					
					if (that.container.data('showslide')!=undefined) {
						that.opt.currentItem = that.container.data('showslide')-1;
						that.container.removeData('showslide');
					}	
									
					that.swapSlide();
					
					return false;
				},
				
				//Select item
				selectItem:function(e) {
					var that = e.data.elem;
					var item = $(e.target);
					var i = item.data("index");
					
					if (i>=0 && i!=that.opt.currentItem) {
						that.opt.button = i<that.opt.currentItem ? "previous" : "next"; 
						that.resetTimer();
						that.opt.oldItem = that.opt.currentItem;
						that.opt.currentItem = i;
						that.swapSlide();
						that.hideTooltip();
					}
									
					return false;
				},
				
				/************************
				    - Center arrows -
				************************/
				
				//Show arrows
				showSideButtons:function(e) {
					var that = e.data.elem;
					that.buttons.stop().animate({"opacity":1}, 500, "linear");
					
					if (that.opt.showCenterPreviousNextArrow) {
						that.cPreviousBtn.stop().animate({"opacity":0.3}, 500, "linear");
						that.cNextBtn.stop().animate({"opacity":0.3}, 500, "linear");
					}
				},
				
				//Hide arrows
				hideSideButtons:function(e) {
					var that = e.data.elem;
					that.buttons.stop().animate({"opacity":0}, 500, "linear");
					
					if (that.opt.showCenterPreviousNextArrow) {
						that.cPreviousBtn.stop().animate({"opacity":0}, 500, "linear");
						that.cNextBtn.stop().animate({"opacity":0}, 500, "linear");
					}
				},
				
				/****************
				    - Timer -
				****************/
				
				//Create timer
				createTimer:function() {
					this.container.append(this.timer);
					this.timer.data("pct", 1).css("width", "0%");
					
					var canvas_support = document.createElement("canvas").getContext;
					
					if (!canvas_support) {
						this.opt.timerType = "line";
					}
							  
					if (this.opt.showTimer) {
						if (this.opt.timerType=="clock") {
							this.clockTimerHolder.css({width:this.opt.buttonWidth, height:this.opt.buttonHeight});
							this.buttons.append(this.clockTimerHolder);						
							this.clockTimerHolder.append(this.clockTimer);									
							this.clockContext = this.clockTimer[0].getContext("2d");
							this.clockContext.lineWidth = this.opt.timerArcSize;
							this.clockContext.lineCap = "round";
							this.clockTimerContext(this, 0, 1, true);
						} else {
							this.timer.addClass("timer-"+this.opt.timerAlign);
						}
					} else {
						this.timer.hide();						
					}					
				},
				
				//Clock timer context
				clockTimerContext:function(that, now, left, clear) {
					var x = y = that.opt.buttonWidth/2;
					var r = x-that.opt.buttonWidth/10;	
						
					that.clockContext.clearRect(0, 0, this.opt.buttonWidth, this.opt.buttonHeight);
					
					//Circle
					that.clockContext.strokeStyle = "rgba(255, 255, 255, .4)";
					that.clockContext.beginPath();
					that.clockContext.arc(x, y, r, 0, Math.PI*2, true);
					that.clockContext.stroke();
					that.clockContext.closePath();
					
					if (clear==null) {
						//Percent
						that.clockContext.strokeStyle = "rgba(255, 255, 255, .85)";
						that.clockContext.beginPath();
						that.clockContext.arc(x, y, r, (Math.PI*2*(now/left))-(Math.PI/2), -Math.PI/2, true);
						that.clockContext.stroke();
						that.clockContext.closePath();
					}
				},
				
				//Start timer
				startTimer:function() {
					if (this.opt.autoPlay && !this.opt.videoPlaying && this.timerId==null) {
						var that = this;											
						var duration = Math.round(this.timer.data("pct")*this.delay);
						
						if (this.opt.showTimer) {
							if (this.opt.timerType=="clock") {						
								var left = 780;
								this.timer.animate({"left":left+"px"}, {
									easing:"linear", duration:duration, queue:false,
									step:function (now, fx) {
										$(this).data("pct", 1-now/left);
										that.clockTimerContext(that, now, left);
									}
								});
							} else {
								this.timer.animate({width:(this.opt.width+1)}, duration, "linear");
							}
						}
						
						this.timerId = setTimeout(function(e) {
														that.resetTimer();				
														that.opt.button = "next";
														that.opt.oldItem = that.opt.currentItem;
														that.opt.currentItem = that.opt.currentItem<(that.opt.slideCount-1) ? (that.opt.currentItem+1) : 0;				
														that.swapSlide();
													  }, duration);
						
						//Resume event
						this.container.trigger('banner_rotator.onresume');
						
						//Event triggering in case video has been started
						if (that.opt.videoStarted) {
							that.container.trigger('banner_rotator.onvideoplay');
							that.opt.videoStarted = false;
						}
						
						//Event triggering in case video has been stopped
						if (that.opt.videoStopped) {
							that.container.trigger('banner_rotator.onvideostop');
							that.opt.videoStopped = false;
						}
					}
				},
				
				//Reset timer
				resetTimer:function() {					
					clearTimeout(this.timerId);
					
					this.timerId = null;			
					this.timer.stop(true).data("pct", 1);
					
					if (this.opt.showTimer) {
						if (this.opt.timerType=="clock") {
							this.timer.css("left", "0px");
							this.clockTimerContext(this, 0, 1, true);
						} else {
							this.timer.width(0);
						}
					}
				},
				
				//Pause timer
				pauseTimer:function() {
					clearTimeout(this.timerId);
					
					this.timerId = null;
					this.timer.stop(true);
					
					if (this.opt.showTimer && this.opt.timerType=="line") {
						this.timer.data("pct", 1-(this.timer.width()/(this.opt.width+1)));
					}
					
					this.container.trigger('banner_rotator.onpause');
				},
				
				/*****************
				    - Resize -
				*****************/
				
				//Container resized
				containerResized:function() {
					var that = this;
					
					//Resize images
					this.listItems.find(".defaultimg").each(function(i) {
						that.setSize($(this));
						
						that.opt.height = Math.round(that.opt.startHeight * (that.opt.width/that.opt.startWidth));
						that.container.height(that.opt.height);
			
						that.setSize($(this));
						
						try{
							that.container.parent().find('.banner-rotator-shadow').css({'width':that.opt.width});
						} catch(e) {}					
					});	
					
					//Set caption position
					this.setCaptionPosition();
					this.container.find('.caption').each(function() { 
						$(this).stop(true, true);
					});
					this.showCaption(this.currentli);
					
					//Start timer
					this.resetTimer();
					this.startTimer();					
				},
				
				//Set the image size to fit into the container
				setSize:function(img) {	
					this.opt.width = parseInt(this.container.width(),0);
					this.opt.height = parseInt(this.container.height(),0);
		
					this.opt.bw = this.opt.width / this.opt.startWidth;
					this.opt.bh = this.opt.height / this.opt.startHeight;
					
					if (this.opt.fullScreen) {
						this.opt.height = this.opt.bw*this.opt.startHeight;
					}
		
					if (this.opt.bh>1) {
						this.opt.bw = 1;
						this.opt.bh = 1;
					}
		
					//If image is already prepared, we reset the size first here
					if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload')==undefined) {
						if (img.data('orgw')!=undefined && img.data('orgw')!=0) {
							img.width(img.data('orgw'));
							img.height(img.data('orgh'));
						}	
					}
		
					var fw = this.opt.width / img.width();
					var fh = this.opt.height / img.height();
		
					this.opt.fw = fw;
					this.opt.fh = fh;
					
					if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload')==undefined) {
						if (img.data('orgw')==undefined || img.data('orgw')==0) {
							img.data('orgw',img.width());
							img.data('orgh',img.height());
						}	
					}
		
					if (this.opt.fullWidth && !this.opt.fullScreen) {	
						var cow = this.cap.width();
						var coh = this.cap.height();
						var ffw = cow/img.data('orgw');
						var ffh = coh/img.data('orgh');						
	
						if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload')==undefined) {
							img.width(img.width()*ffh);
							img.height(coh);
						}
						
						if (img.width()<cow) {
							img.width(cow+50);
							ffw = img.width()/img.data('orgw');
							img.height(img.data('orgh')*ffw);
						} 
						
						if (img.width()>cow) {
							img.data("fxof", (cow-img.width())/2);	
							img.css({'position':'absolute', 'left':img.data('fxof')+'px'});
						}
						
						if (img.height()<=coh) {
							img.data('fyof',0);
							img.data("fxof", (cow-img.width())/2);
							img.css({'position':'absolute','top':img.data('fyof')+"px",'left':img.data('fxof')+"px"});
						} 
						
						if (img.height()>coh && img.data('fullwidthcentering')==true) {
							img.data('fyof', (coh-img.height())/2);
							img.data("fxof", (cow-img.width())/2);
							img.css({'position':'absolute','top':img.data('fyof')+"px",'left':img.data('fxof')+"px"});
						}
					} else if (this.opt.fullScreen) {	
						var cow = this.cap.width();
						var coh = $(window).height();						

						//If the default grid is higher than the calculated slider height, we need to resize the slider height
						var offsety = (coh-(this.opt.startHeight*this.opt.bh))/2;
						if (offsety<0) coh = this.opt.startHeight*this.opt.bh;

						if (this.opt.fullScreenOffsetContainer!=undefined) {
							try{
								var offcontainers = this.opt.fullScreenOffsetContainer.split(",");
								$.each(offcontainers, function(index, searchedcont) {
									coh -= $(searchedcont).outerHeight(true);
								});
							} catch(e) {}
						}
						
						this.container.parent().height(coh);
						this.container.css({'height':'100%'});					

						this.opt.height = coh;

						var ffh = coh/img.data('orgh');
						var ffw = cow/img.data('orgw');

						if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload') ===undefined) {
							img.width(img.width()*ffh);
							img.height(coh);
						}

						if (img.width()<cow) {
							img.width(cow+50);
							var ffw = img.width()/img.data('orgw');
							img.height(img.data('orgh')*ffw);
						}

						if (img.width()>cow) {
							img.data("fxof", (cow- img.width())/2);
							img.css({'position':'absolute','left':img.data('fxof')+"px"});
						}

						if (img.height()<=coh) {
							img.data('fyof',0);
							img.data("fxof", (cow-img.width())/2);
							img.css({'position':'absolute','top':img.data('fyof')+"px",'left':img.data('fxof')+"px"});
						}

						if (img.height()>coh && img.data('fullwidthcentering')==true) {
							img.data('fyof', (coh-img.height())/2);
							img.data("fxof", (cow-img.width())/2);
							img.css({'position':'absolute','top':img.data('fyof')+"px",'left':img.data('fxof')+"px"});
						}
					} else {	
						if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload')==undefined) {
							img.width(this.opt.width);
							img.height(img.height()*fw);							
						}
						
						if (img.height()<this.opt.height && img.height()!=0 && img.height()!=null) {
							if ((img.data('lazyload')!=undefined && img.data('lazydone')==1) || img.data('lazyload')==undefined) {	
								img.height(this.opt.height);
								img.width(img.data('orgw')*fh);
							}
						}
					}
		
					img.data('neww', img.width());
					img.data('newh', img.height());	
				},		
					
				//Get positive number
				getPosNumber:function(val, defaultVal) {
					if (!isNaN(val) && val>0) {
						return val;
					}
					return defaultVal;
				},
				
				//Get boolean value
				getBoolean:function(val, defaultVal) {
					if (val!=undefined) {
						return val.toString()=="true";
					}
					return defaultVal;
				},
				
				//Get random number
				getRandom:function(i) {
					return Math.floor(Math.random()*i);
				},
				
				//Get banner clone
				getBannerClone:function(img) {					
					if (!img) {						
						img = this.currentli.find(".defaultimg");
					}
					
					this.fulloff = img.data("fxof");
					if (this.fulloff==undefined) this.fulloff = 0;
					var img_clone = img.clone();				
					var banner_clone = $('<div class="banner-clone"></div>');
					banner_clone.append(img_clone);
					
					return banner_clone;
				},
				
				//Get banner clone background
				getBannerCloneBackground:function(opts) {
					var banner_clone = $('<div class="banner-clone"></div>');		
					
					banner_clone.css({
						'left':opts.left, 
						'top':opts.top, 
						'width':opts.width, 
						'height': opts.height,
						'background-image':'url('+opts.image+')', 
						'background-position':opts.position.left+'px '+opts.position.top+'px'
					});	
						
					return banner_clone;
				}, 				
				
				//Add banner clone
				addBannerClone:function(banner_clone) {
					this.container.append(banner_clone);
				},
				
				//Swap the slides
				swapSlide:function() {
					var that = this;
					
					//Old list item
					this.oldli = $(this.listItems.get(this.opt.oldItem));
										
					//Current list item
					this.currentli = $(this.listItems.get(this.opt.currentItem));					
					
					var defimg = this.currentli.find('.defaultimg');
		
					if (defimg.data('lazyload')!=undefined && defimg.data('lazydone')!=1 ) {
						defimg.attr('src', defimg.data('lazyload')),
						defimg.data('lazydone', 1);
						defimg.data('orgw', 0);
						
						var waitforsrc = setInterval(function() {
							if (defimg.attr('src')==defimg.data('lazyload')) {
								clearInterval(waitforsrc);
								that.preloader.fadeIn(300);
								
								setTimeout(function() {
									that.resetTimer();
								}, 180);
								
								that.currentli.waitForImages(function() {		
									setTimeout(function() {
										that.startTimer();
									}, 190);
									
									that.preloader.fadeOut(600);
									that.setSize(defimg);							
									that.swapSlideProgress();							
								});	
							}
						}, 100);	
					} else {
						this.swapSlideProgress();
					}				
				},
				
				//Swap the slides
				swapSlideProgress:function() {
					var that = this;
					
					//Play once
					if (this.opt.playOnce) {
						this.pauseLast();
					}
					
					this.container.trigger('banner_rotator.onbeforeswap');
					
					this.opt.transitionStarted = true;
					this.opt.videoPlaying = false;
					
					//Show current item
					this.showListItem();
					
					//Set z-index of old-current list items
					this.oldli.css({"z-index":1});
					this.currentli.css({"z-index":2});
					
					//Delay
					this.delay = this.getPosNumber(this.currentli.data("delay"), this.opt.delay);
					
					//Get effect number
					var effect = EFFECTS[this.currentli.data("transition")];					
					if (effect==undefined) {
						effect = EFFECTS[this.opt.transition];
					}
					if (effect==EFFECTS["random"]) {
						effect = Math.floor(Math.random()*(ei-1));
					}
					
					//Hide old items
					this.listItems.each(function() {
						var li = $(this);
						if (li.index()!=that.opt.oldItem) {							
							li.css("visibility", "hidden");
						}
						if (li.index()!=that.opt.currentItem) {	
							li.css({"z-index":1});
						}
					});
					
					//Remove old captions
					this.removeCaption(this.oldli);
					
					//Add current item class
					if (this.opt.showButton) {
						this.buttons.find("div.curr-thumb").removeClass("curr-thumb");
						this.buttons.find(">div:eq("+this.opt.currentItem+")").addClass("curr-thumb");
					}
					
					//Animate the effect
					switch (effect) {
						case EFFECTS["block"]:
							this.animationBlock();
							break;
						case EFFECTS["cube"]:
							this.animationCube();
							break;
						case EFFECTS["cubeRandom"]:
							this.animationCube({random:true});
							break;
						case EFFECTS["cubeShow"]:
							this.animationCubeShow();
							break;
						case EFFECTS["cubeStop"]:
							this.animationCubeStop();
							break;
						case EFFECTS["cubeStopRandom"]:
							this.animationCubeStop({random:true});
							break;
						case EFFECTS["cubeHide"]:
							this.animationCubeHide();
							break;
						case EFFECTS["cubeSize"]:
							this.animationCubeSize();
							break;
						case EFFECTS["cubeSpread"]:
							this.animationCubeSpread();
							break;
						case EFFECTS["horizontal"]:
							this.animationHorizontal();
							break;
						case EFFECTS["showBars"]:
							this.animationShowBars();
							break;
						case EFFECTS["showBarsRandom"]:
							this.animationShowBars({random:true});
							break;
						case EFFECTS["tube"]:
							this.animationTube();
							break;
						case EFFECTS["fade"]:
							this.animationFade();
							break;
						case EFFECTS["fadeFour"]:
							this.animationFadeFour();
							break;
						case EFFECTS["parallel"]:
							this.animationParallel();
							break;
						case EFFECTS["blind"]:
							this.animationBlind();
							break;
						case EFFECTS["blindHeight"]:
							this.animationBlindDimension({height:true});
							break;
						case EFFECTS["blindWidth"]:
							this.animationBlindDimension({height:false, speed:400, delay:50});
							break;
						case EFFECTS["directionTop"]:
							this.animationDirection({direction:"top"});
							break;
						case EFFECTS["directionBottom"]:
							this.animationDirection({direction:"bottom"});
							break;
						case EFFECTS["directionRight"]: 
							this.animationDirection({direction:"right", total:5});
							break;
						case EFFECTS["directionLeft"]: 
							this.animationDirection({direction:"left", total:5});
							break;
						case EFFECTS["glassCube"]:
							this.animationGlassCube();
							break;
						case EFFECTS["glassBlock"]:
							this.animationGlassBlock();
							break;
						case EFFECTS["circles"]:
							this.animationCircles();
							break;
						case EFFECTS["circlesInside"]:
							this.animationCirclesInside();
							break;
						case EFFECTS["circlesRotate"]:
							this.animationCirclesRotate();
							break;
						case EFFECTS["upBars"]:
							this.animationDirectionBars({direction:"top"});
							break;
						case EFFECTS["downBars"]:
							this.animationDirectionBars({direction:"bottom"});
							break;
						case EFFECTS["hideBars"]:
							this.animationHideBars();
							break;
						case EFFECTS["swapBars"]:
							this.animationSwapBars();
							break;
						case EFFECTS["swapBarsBack"]:
							this.animationSwapBars({easing:"easeOutBack"});
							break;
						case EFFECTS["swapBlocks"]:
							this.animationSwapBlocks();
							break;
						case EFFECTS["cut"]:
							this.animationCut();
							break;
					}
					
					var data = {};
					data.currentItem = this.opt.currentItem+1;
					this.container.trigger('banner_rotator.onchange', data);
				},
				
				//Finish animation
				finishAnimation:function() {
					this.opt.transitionStarted = false;
					
					//Animation finished event trigger
					this.container.trigger('banner_rotator.onafterswap');
					
					//Show current item
					this.showListItem();
					
					//Animate the captions
					this.showCaption(this.currentli);
					
					//Start timer
					this.startTimer();
				},
				
				//Show current item
				showListItem:function() {
					//Remove banner clones
					this.container.find(".banner-clone").stop().remove();
					
					//Show current item
					if (this.currentli) { 
						this.currentli.css("visibility", "visible");	
					}
				},
				
				/****************************
				    - Transition efects -
				****************************/
					
				//Block
				animationBlock:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					var total = 15;
					var width = this.opt.width/total;
					var height = this.opt.height;
					var i = 0;
					
					for (i=0; i<total; i++) {				
						var left = width*i;
						var top = 0;
						
						var banner_clone = this.getBannerClone();
						var img = banner_clone.find("img");
						banner_clone.css({left:(this.opt.width+100), top:0, width:width, height:height});
						img.css({left:this.fulloff-(width*i)});	
						this.addBannerClone(banner_clone);
						
						var delay = 80*i;					
						banner_clone.show().delay(delay).animate({top:top, left:left}, speed, easing);
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.find("img").hide().delay(delay+100).animate({opacity:'show'}, speed+300, easing, callback);
					}
				},
				
				//Cube
				animationCube:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {random:false}, opts || {});
					
					var easing = (this.opt.easing=="") ? "easeOutExpo" : this.opt.easing;
					var speed = 700/this.opt.velocity;
					
					var division_w = 8;
					var division_h = 3;
					var total = division_w*division_h;
					
					var width = Math.ceil(this.opt.width / division_w);
					var height = Math.ceil(this.opt.height / division_h);
					
					var init_top = this.opt.height+200;
					var init_left = this.opt.height+200;
					
					var col_t = 0;
					var col = 0;
					
					for (i=0; i<total; i++) {						
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top+(height*col_t)+(col_t*150);
						var vleft = -this.opt.width;
						
						var vtop_image = -(height*col_t);
						
						var vleft_image = -(width*col);
						var btop = (height*col_t);
						var bleft = (width*col);
						
						var banner_clone = this.getBannerClone();
						banner_clone.hide();
						
						var delay = 50 * (i);
						
						if (opts.random) {
							delay = 40 * (col);
							banner_clone.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						} else {
							speed = 500;
							banner_clone.css({left:(this.opt.width+(width*i)), top:(this.opt.height+(height*i)), width:width, height:height});
						}
						
						this.addBannerClone(banner_clone);
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.show().delay(delay).animate({top:btop+'px', left:bleft+'px'}, speed, easing, callback);
						
						if (opts.random) {
							banner_clone.find('img').css({left:this.fulloff+vleft_image+100, top:vtop_image+50});
							banner_clone.find('img').delay(delay+(speed/2)).animate({left:this.fulloff+vleft_image, top:vtop_image}, 1000, 'easeOutBack');
						} else {
							banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});
							banner_clone.find('img').delay(delay+(speed/2)).fadeTo(100, 0.5).fadeTo(300, 1);
						}
						
						col_t++;
						if (col_t==division_h) {
							col_t = 0;
							col++;
						}
					}
				},
				
				//CubeShow
				animationCubeShow:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easin;
					var speed = 400/this.opt.velocity;
					
					var division_w = 8;
					var division_h = 4;
					var total = division_w * division_h;
					
					var width = Math.ceil(this.opt.width/division_w);
					var height = Math.ceil(this.opt.height/division_h);
					
					var last = false;
					
					var btop = 0;
					var bleft = 0;
					var line = 0;
					var col = 0;
					
					for (i=0; i<total; i++) {						
						btop = height * line;
						bleft = width * col;
						
						var delay = 30*i;
						
						var banner_clone = this.getBannerClone();
						banner_clone.css({left:bleft, top:btop, width:width, height:height}).hide();
						banner_clone.find('img').css({left:this.fulloff-bleft, top:-btop});
						this.addBannerClone(banner_clone);
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({width:"show", height:"show"}, speed, easing, callback);
						
						line++;
						if (line==division_h) {
							line = 0;
							col++;
						}
					}
				},
				
				//CubeStop
				animationCubeStop:function(opts) {
					var that = this;
		
					var opts = $.extend({}, {random:false}, opts || {});
		
					var easing = (this.opt.easing=="") ? "easeInQuad" : this.opt.easing;
					var speed = 300/this.opt.velocity;
		
					var image_old = this.oldli.find(".defaultimg");
		
					this.currentli.css("visibility", "visible");
		
					var division_w = 8;
					var division_h = Math.ceil(this.opt.height/(this.opt.width/8));
					var total = division_w * division_h;
		
					var width = Math.ceil(this.opt.width/division_w);
					var height = Math.ceil(this.opt.height/division_h);
		
					var init_top = 0;
					var init_left = 0;
		
					var col_t = 0;
					var col = 0;
					var ftop = this.opt.width/16;
		
					for (i = 0; i < total; i++) {
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top+(height*col_t);
						var vleft = init_left+(width*col);
						var vtop_image = -(height*col_t);
		
						var vleft_image = -(width*col);
						var btop = vtop-ftop;
						var bleft = vleft-ftop;
		
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});
		
						this.addBannerClone(banner_clone);
						banner_clone.show();
		
						var delay = 50 * i;
		
						if (opts.random) {
							speed = (400*(this.getRandom(2)+1))/this.opt.velocity;
							btop = vtop;
							bleft = vleft;
							delay = Math.ceil(30*this.getRandom(30));
						}
						
						if (opts.random && i==(total-1)) {
							speed = 400*3;
							delay = 30*30;
						}
		
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({opacity:'hide', top:btop+'px', left:bleft+'px'}, speed, easing, callback);
		
						col_t++;
						if (col_t==division_h) {
							col_t = 0;
							col++;
						}
					}
				},
				
				//CubeHide
				animationCubeHide:function(opts) {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
		
					this.currentli.css("visibility", "visible");
					
					var division_w = 8;
					var division_h = 3;
					var total = division_w*division_h;
					
					var width = Math.ceil(this.opt.width/division_w);
					var height = Math.ceil(this.opt.height/division_h);
					
					var init_top = 0;
					var init_left = 0;
										
					var col_t = 0;
					var col = 0;
					
					for (i=0; i<total; i++) {						
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top + (height * col_t);
						var vleft = (init_left + (width * col));
						var vtop_image = -(height * col_t);
						
						var vleft_image = -(width*col);
						var btop = vtop-50;
						var bleft = vleft-50;
						
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						
						var delay = 50*i;
						delay = (i == (total - 1)) ? (total * 50) : delay;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";				
						banner_clone.delay(delay).animate({opacity:'hide'}, speed, easing, callback);
						
						col_t++;
						if (col_t==division_h) {
							col_t = 0;
							col++;
						}
					}					
				},
				
				//CubeSize
				animationCubeSize:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeInOutQuad" : this.opt.easing;
					var speed = 600/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
		
					this.currentli.css("visibility", "visible");
					
					var division_w = 8;
					var division_h = 3;
					var total = division_w*division_h;
					
					var width = Math.ceil(this.opt.width/division_w);
					var height = Math.ceil(this.opt.height/division_h);
					
					var init_top = 0;
					var init_left = 0;
					
					var col_t = 0;
					var col = 0;
					var ftop = Math.ceil(this.opt.width/6);
					
					for (i=0; i<total; i++) {						
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top + (height * col_t);
						var vleft = (init_left + (width * col));
						var vtop_image = -(height * col_t);
						
						var vleft_image = -(width * col);
						var btop = vtop - ftop;
						var bleft = vleft - ftop;
						
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.css({left:vleft, top:vtop, width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						
						var delay = 50*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({
							opacity:"hide", width:"hide", height:"hide", top:vtop+(width*1.5), left:vleft+(height*1.5)
						}, speed, easing, callback);
						
						col_t++;
						if (col_t==division_h) {
							col_t = 0;
							col++;
						}
					}			
				},
				
				//CubeSpread
				animationCubeSpread:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 700/this.opt.velocity;
					
					var division_w = 8;
					var division_h = Math.ceil(this.opt.height/(this.opt.width/8));
					var total = division_w * division_h;
					
					var width 	= Math.ceil(this.opt.width/division_w);
					var height 	= Math.ceil(this.opt.height/division_h);
					
					var init_top = 0;
					var init_left = 0;
					
					var col_t = 0;
					var col = 0;
					var order = new Array;
					var spread = new Array;
					
					//Make order
					for (i = 0; i < total; i++) {
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top+(height*col_t);
						var vleft = init_left+(width*col);
						
						order[i] = [vtop, vleft];
						
						col_t++;
						if (col_t == division_h) {
							col_t = 0;
							col++;
						}
					}
					
					//Reset
					col_t = 0;
					col = 0;
					
					//Make array for spread
					for (i=0; i<total; i++) {
						spread[i] = i;
					};
					
					//Randomize array
					this.randomizeArray(spread);
					
					for (i=0; i<total; i++) {
						init_top = (i%2==0) ? init_top : -init_top;
						init_left = (i%2==0) ? init_left : -init_left;
		
						var vtop = init_top+(height*col_t);
						var vleft = init_left+(width*col);
						var vtop_image = -(height*col_t);
						
						var vleft_image = -(width*col);
						var btop = vtop;
						var bleft = vleft;
						
						vtop = order[spread[i]][0];
						vleft = order[spread[i]][1];
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						this.addBannerClone(banner_clone);
						
						var delay = 30*(Math.random()*30);
						if (i == (total-1)) delay = 30*30;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({opacity:'show',top:btop+'px', left:bleft+'px'}, speed, easing, callback);
						
						col_t++;
						if (col_t==division_h) {
							col_t = 0;
							col++;
						}
					}
				}, 
				
				//Horizontal
				animationHorizontal:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutExpo" : this.opt.easing;
					var speed = 700/this.opt.velocity;
					
					var total = 7;
					var width = (this.opt.width);
					var height = Math.ceil(this.opt.height/total);
					
					for (i=0; i<total; i++) {
						var bleft = width;
						var btop = i*height;
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:bleft+'px', top:btop+'px', width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff, top:-btop});						
						this.addBannerClone(banner_clone);
						
						var delay = 90*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({opacity:'show', top:btop, left:0}, speed, easing, callback);
					}
				},
				
				//ShowBars
				animationShowBars:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {random:false}, opts || {});
					
					var easing = (this.opt.easing=="") ? 'easeOutQuad' : this.opt.easing;
					var speed = 400/this.opt.velocity;
					
					var total = 10;
					var width = Math.ceil(this.opt.width/total);
					var height = (this.opt.height);
					
					for (i=0; i<total; i++) {						
						var bleft = width *i;
						var btop = 0;
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:bleft, top:(btop-50), width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff-(width*i), top:0});						
						this.addBannerClone(banner_clone);
						
						if (opts.random) {
							var random = this.getRandom(total);
							var delay = 50*random;
							delay = (i == (total-1)) ? (50*total) : delay;
						} else {
							var delay = 70*i;
							speed = speed-(i*2);
						}
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({
							opacity:'show', top:btop+'px', left:bleft+'px'
						}, speed, easing, callback);
					}					
				},
				
				//Tube
				animationTube:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutElastic" : this.opt.easing;
					var speed = 600/this.opt.velocity;
					
					var total = 10;
					var width = Math.ceil(this.opt.width/total);
					var height = this.opt.height;
					
					for (i=0; i<total; i++) {
						var btop = 0;
						var vtop = height;
						var vleft = width*i;
					
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:vleft, top:vtop, height:height, width: width});
						banner_clone.find('img').css({left:this.fulloff-(vleft)});						
						this.addBannerClone(banner_clone);
						
						var random = this.getRandom(total);
						var delay = 30*random;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.show().delay(delay).animate({top:btop}, speed, easing, callback);
					}
				},
						
				//Fade
				animationFade:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 800/this.opt.velocity;					
					var width = this.opt.width;
					var height = this.opt.height;					
					var left = 0;
					var top = 0;
					
					var banner_clone = this.getBannerClone();
					banner_clone.css({left:left, top:top, width:width, height:height});
					this.addBannerClone(banner_clone);
					
					var callback = function() {that.finishAnimation();};
					banner_clone.animate({opacity:"show", left:0, top:0}, speed, easing, callback);
				},	
				
				//FadeFour
				animationFadeFour:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var width = this.opt.width;
					var height = this.opt.height;
					var total = 4;
					var vtop, vleft;
					
					for (i=0; i<total; i++) {	
						switch (i) {
							case 0:
								vtop = '-100px';
								vleft = '-100px';
								break;
							case 1:
								vtop = '-100px';
								vleft = '100px';
								break;
							case 2:
								vtop = '100px';
								vleft = '-100px';
								break;
							case 3:
								vtop = '100px';
								vleft = '100px';
								break;
						}
						
						var banner_clone = this.getBannerClone();
						banner_clone.css({left:vleft, top:vtop, width:width, height:height});
						this.addBannerClone(banner_clone);
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.animate({opacity:"show", left:0, top:0}, speed, easing, callback);
					}
				},
				
				//Parallel
				animationParallel:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 400/this.opt.velocity;
					
					var total = 16;
					var width = Math.ceil(this.opt.width/total);
					var height = this.opt.height;
					
					for (i=0; i<total; i++) {						
						var bleft = width*i;
						var btop = 0;
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:bleft, top:btop-this.opt.height, width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff-(width*i), top:0});						
						this.addBannerClone(banner_clone);
						
						var delay;
						if (i<=((total/2)-1)) {
							delay = 1400 - (i*200);
						} else if (i>((total/2)-1)) {
							delay = ((i-(total/2))*200);
						}
						delay = delay/2.5;
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({
							top:btop+'px', left:bleft+'px', opacity: 'show'
						}, speed, easing, callback);
					}					
				},
				
				//Blind
				animationBlind:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {height:false}, opts || {});
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 400/this.opt.velocity;
					
					var total = 16;
					var width = Math.ceil(this.opt.width/total);
					var height = this.opt.height;
					var delay;
					
					for (i=0; i<total; i++) {						
						var bleft = width*i;
						var btop = 0;
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:bleft, top:btop, width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff-(width*i), top:0});						
						this.addBannerClone(banner_clone);
						
						if (!opts.height) {
							if (i<=((total/2)-1)) {
								delay = 1400-(i*200);
							} else if (i>((total/2)-1)) {
								delay = ((i-(total/2))*200);
							}
							var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						} else {
							if (i<=((total/2)-1)) {
								delay = 200 + (i * 200);
							} else if (i>((total/2)-1)) {
								delay = (((total/2)-i)*200)+(total*100);
							}
							var callback = (i==(total/2)) ? function() {that.finishAnimation();} : "";
						}
						
						delay = delay/2.5;
						
						if (!opts.height) {
							banner_clone.delay(delay).animate({
								opacity:'show',top:btop+'px', left:bleft+'px', width:'show'
							}, speed, easing, callback);
						} else {
							speed += i*2;
							var easing = 'easeOutQuad';
							banner_clone.delay(delay).animate({
								opacity:'show',top:btop+'px', left:bleft+'px', height:'show'
							}, speed, easing, callback);
						}
					}					
				},
				
				//BlindDimension
				animationBlindDimension:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {height:true, speed:500, delay:100}, opts || {});
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = opts.speed/this.opt.velocity;
					
					var total = 16;
					var width = Math.ceil(this.opt.width/total);
					var height = this.opt.height;
					
					for (i=0; i<total; i++) {					
						var bleft = width*i;
						var btop = 0;
						
						var banner_clone = this.getBannerClone();						
						banner_clone.css({left:bleft, top:btop, width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff-(width*i), top:0});						
						this.addBannerClone(banner_clone);
						
						var delay = opts.delay*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						
						if (!opts.height) {
							banner_clone.delay(delay).animate({
								opacity:'show',top:btop+'px', left:bleft+'px', width:'show'
							}, speed, easing, callback);
						} else {
							var easing = 'easeOutQuad';
							banner_clone.delay(delay).animate({
								opacity:'show',top:btop+'px', left:bleft+'px', height:'show'
							}, speed, easing, callback);
						}
					}					
				},
				
				//Direction
				animationDirection:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {direction:"top", delay_type:"sequence", total:7}, opts || {});
					
					var easing = (this.opt.easing=="") ? "easeInOutExpo" : this.opt.easing;
					var speed = 1200/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					var total = opts.total;
					
					for (i=0; i<total; i++) {
						
						switch (opts.direction) {
							default: 
							case "top":								
								var width = Math.ceil(this.opt.width/total);
								var height = this.opt.height;
								
								var itopc = 0;
								var ileftc = width*i;
								var ftopc = -height;
								var fleftc = ileftc;
								
								var itopn = height;
								var ileftn = ileftc;
								var ftopn = 0;
								var fleftn = ileftc;
								
								var vtop_image = 0;
								var vleft_image = -ileftc;								
								break;								
							case "bottom": 							
								var width = Math.ceil(this.opt.width/total);
								var height = this.opt.height;
								
								var itopc = 0;
								var ileftc = width*i;
								var ftopc = height;
								var fleftc = ileftc;
								
								var itopn = -height;
								var ileftn = ileftc;
								var ftopn = 0;
								var fleftn = ileftc;
								
								var vtop_image = 0;
								var vleft_image = -ileftc;								
								break;								
							case "right": 							
								var width = this.opt.width;
								var height = Math.ceil(this.opt.height/total);
								
								var itopc = height*i;
								var ileftc = 0;
								var ftopc = itopc;
								var fleftc = width;
								
								var itopn = itopc;
								var ileftn = -fleftc;
								var ftopn = itopc;
								var fleftn = 0;
								
								var vtop_image = -itopc;
								var vleft_image = 0;								
								break;								
							case "left": 							
								var width = this.opt.width;
								var height = Math.ceil(this.opt.height/total);
								
								var itopc = height*i;
								var ileftc = 0;
								var ftopc = itopc;
								var fleftc = -width;
								
								var itopn = itopc;
								var ileftn = -fleftc;
								var ftopn = itopc;
								var fleftn = 0;
								
								var vtop_image = -itopc;
								var vleft_image = 0;								
								break;								
						}
						
						switch (opts.delay_type)  {
							case 'zebra' : default : var delay = (i%2==0) ? 0 : 150; break;
							case 'random' : var delay = 30*(Math.random() * 30); break;
							case 'sequence' : var delay = i*100; break;
						}
						
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						banner_clone.css({top:itopc, left:ileftc, width:width, height:height});						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						banner_clone.delay(delay).animate({top:ftopc, left:fleftc}, speed, easing);
						
						//Next image
						var banner_clone_next = this.getBannerClone();
						banner_clone_next.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						banner_clone_next.css({top:itopn, left:ileftn, width:width, height:height});						
						this.addBannerClone(banner_clone_next);
						banner_clone_next.show();
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone_next.delay(delay).animate({ top:ftopn, left:fleftn }, speed, easing, callback);						
					}
				},
				
				//GlassCube
				animationGlassCube:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutExpo" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var total = 20;
					var width = Math.ceil(this.opt.width/total) * 2;
					var height = this.opt.height/2;
					var col = 0;
					
					for (i=0; i<total; i++) {
						mod = (i%2)==0 ? true : false;
						
						var ileft = width*col;
						var itop = mod ? -this.opt.height : this.opt.height;
						
						var fleft = width*col;
						var ftop = mod ? 0 : height;
						
						var bleft = -(width*col);
						var btop = mod ? 0 : -height;
						
						var delay = 120*col;
						
						var banner_clone = this.getBannerClone();
						banner_clone.css({left: ileft, top:itop, width:width, height:height});
						
						banner_clone
							.find('img')
							.css({left:this.fulloff+bleft+(width/1.5), top:btop})
							.delay(delay)
							.animate({left:this.fulloff+bleft, top:btop}, (speed * 1.9), 'easeOutQuad');
						
						this.addBannerClone(banner_clone);
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.show().delay(delay).animate({top:ftop, left:fleft}, speed, easing, callback);
						
						if ((i%2)!=0) col++;
					}
				},
				
				//GlassBlock
				animationGlassBlock:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutExpo" : this.opt.easing;
					var speed = 700 / this.opt.velocity;
					
					var total = 10;
					var width = Math.ceil(this.opt.width/total);
					var height = this.opt.height;
					
					for (i=0; i<total; i++) {
						var ileft = width*i;
						var itop = 0;
						
						var fleft = width*i;
						var ftop = 0;
						
						var bleft = -(width*i);
						var btop = 0;
						
						var delay = 100*i;
						
						var banner_clone = this.getBannerClone();
						banner_clone.css({left: ileft, top:itop, width:width, height:height});
						
						banner_clone
							.find('img')
							.css({left:this.fulloff+bleft+(width/1.5), top:btop})
							.delay(delay)
							.animate({left:this.fulloff+bleft, top:btop}, (speed*1.1), 'easeInOutQuad');
						
						this.addBannerClone(banner_clone);
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({top:ftop, left:fleft, opacity:'show'}, speed, easing, callback);						
					}
				},
				
				//Circles
				animationCircles:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeInQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var total = 10;
					var size = 100;
					
					var radius = Math.ceil(Math.sqrt(Math.pow((this.opt.width), 2)+Math.pow((this.opt.height), 2)));
					
					this.fulloff = this.currentli.find(".defaultimg").data("fxof");
					if (this.fulloff==undefined) this.fulloff = 0;
					
					for (i=0; i<total; i++) {
						var ileft = (this.opt.width-size)/2;
						var itop = (this.opt.height-size)/2;
						
						var fleft = ileft; 
						var ftop = itop; 
						var banner_clone = null;
						
						banner_clone = this.getBannerCloneBackground({
							image:this.currentli.find(".defaultimg").attr("src"),
							left:ileft,
							top:itop,
							width:size,
							height:size,
							position:{
								top:-itop,
								left:this.fulloff-ileft
							}
						}).css({
							"border-radius":radius+"px"
						});
						
						size += 100;
						
						this.addBannerClone(banner_clone);
						
						var delay = 70*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({top:ftop, left:fleft, opacity:'show'}, speed, easing, callback);						
					}
				},
				
				//CirclesInside
				animationCirclesInside:function() {
					var that = this;
					
					var easing = (this.opt.easing =="") ? "easeInQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					this.currentli.css("visibility", "visible");
					
					var total = 10;
					
					var radius = Math.sqrt(Math.pow((this.opt.width), 2) + Math.pow((this.opt.height), 2));
					var radius = Math.ceil(radius);
					var size = radius;
					
					this.fulloff = image_old.data("fxof");
					if (this.fulloff==undefined) this.fulloff = 0;
					
					for (i=0; i<total; i++) {
						var ileft = (this.opt.width-size)/2;
						var itop = (this.opt.height-size)/2;
						
						var fleft = ileft; 
						var ftop = itop; 
						var banner_clone = null;
		
						banner_clone = this.getBannerCloneBackground({
							image:image_old.attr("src"),
							left:ileft, 
							top:itop, 
							width:size, 
							height:size,
							position:{
								top:-itop, 
								left:this.fulloff-ileft
							}
						}).css({
							"border-radius":radius+"px"
						});
						
						size -= 100;
						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						
						var delay = 70*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";
						banner_clone.delay(delay).animate({top:ftop, left:fleft, opacity:"hide"}, speed, easing, callback);						
					}
				},
				
				//CirclesRotate
				animationCirclesRotate:function() {
					var that = this;
					
					var easing = (this.opt.easing=="") ? "easeOutQuad" : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					this.currentli.css("visibility", "visible");
					
					var total = 10;
					
					var radius = Math.ceil(Math.sqrt(Math.pow((this.opt.width), 2) + Math.pow((this.opt.height), 2)));
					var size = radius;
					
					var nAgt = navigator.userAgent;
					var mozilla = (nAgt.indexOf("Mozilla")!=-1 ? true : false);
					
					this.fulloff = image_old.data("fxof");
					if (this.fulloff==undefined) this.fulloff = 0;
					
					for (i=0; i<total; i++) {
						var ileft = (this.opt.width-size)/2;
						var itop = (this.opt.height-size)/2;
						
						var fleft = ileft; 
						var ftop = itop; 
						var banner_clone = null;
		
						if (mozilla) {
							banner_clone = this.getBannerClone(image_old);
							banner_clone.css({left:ileft, top:itop, width:size, height:size, "border-radius":radius+"px"});
							banner_clone.find("img").css({left:this.fulloff-ileft, top:-itop});
						} else {
							banner_clone = this.getBannerCloneBackground({
								image:image_old.attr("src"),
								left:ileft, 
								top:itop, 
								width:size, 
								height:size,
								position:{
									top:-itop,
									left:this.fulloff-ileft
								}
							}).css({
								"border-radius":radius+"px"
							});
						}
						
						size -= 100;
						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						
						var delay = 100*i;
						var rotate = (i%2==0) ? "20deg" : "-20deg";
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";					
						banner_clone.delay(delay).animate({top:ftop, left:fleft, opacity:"hide", rotate:rotate}, speed, easing, callback);
					}
				},
				
				//DirectionBars
				animationDirectionBars:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {direction:"top"}, opts || {});
					
					var easing = (this.opt.easing=="") ? "easeInOutQuad" : this.opt.easing;
					var speed = 400/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
		
					this.currentli.css("visibility", "visible");
					
					var total = 12;
					var width = Math.ceil(this.opt.width / total);
					var height = this.opt.height;
					var ftop = (opts.direction=="top") ? -height : height;
					
					for (i=0; i<total; i++) {
						var vtop = 0;
						var vleft = width*i;
						var vtop_image = 0;
						var vleft_image = -(width*i);
		
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});						
						this.addBannerClone(banner_clone);
						banner_clone.show();
						
						var delay = 70*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";						
						banner_clone.delay(delay).animate({top:ftop}, speed, easing, callback);
					}					
				},
		
				//HideBars
				animationHideBars:function() {
					var that = this;
		
					var easing = (this.opt.easing=="") ? "easeOutCirc" : this.opt.easing;
					var speed = 700/this.opt.velocity;
		
					var image_old = this.oldli.find(".defaultimg");
		
					this.currentli.css("visibility", "visible");
		
					var division_w = 10;
					var total = division_w;
		
					var width = Math.ceil(this.opt.width/division_w);
					var height = this.opt.height;
		
					for (i=0; i<total; i++) {
						var vtop = 0;
						var vleft = width*i;
		
						var vtop_image = 0;
						var vleft_image = -(width*i);
		
						var fleft = '+='+width;
		
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.css({left:0, top:0, width:width, height:height});
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:vtop_image});
		
						var banner_clone_main = this.getBannerClone(image_old);
						banner_clone_main.css({left:vleft+'px', top:vtop+'px', width:width, height:height});
						banner_clone_main.html(banner_clone);
		
						this.addBannerClone(banner_clone_main);
						banner_clone.show();
						banner_clone_main.show();
		
						var delay = 50*i;
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";						
						banner_clone.delay(delay).animate({left:fleft}, speed, easing, callback);
					}
				},
		
				//SwapBars
				animationSwapBars:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {direction:"top", delay_type:"sequence", total:7, easing:"easeOutCirc"}, opts || {});
					
					var easing = (this.opt.easing=="") ? opts.easing : this.opt.easing;
					var speed = 500/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					var total = opts.total;
					
					for (i=0; i<total; i++) {
		
						var width = Math.ceil(this.opt.width/total);
						var height = this.opt.height;
						
						var itopc = 0;
						var ileftc = width*i;
						var ftopc = -height;
						var fleftc = ileftc + width;
						
						var itopn = height;
						var ileftn = ileftc;
						var ftopn = 0;
						var fleftn = ileftc;
						
						var vtop_image = 0;
						var vleft_image = -ileftc;
						
						switch (opts.delay_type) {
							case "zebra": 
							default : 
								var delay = (i%2==0) ? 0 : 150; 
								break;
							case "random": 
								var delay = 30*(Math.random()*30); 
								break;
							case "sequence": 
								var delay = i*100; 
								break;
						}
		
						//Old image
						var banner_clone = this.getBannerClone(image_old);
						banner_clone.find('img').css({left:this.fulloff+vleft_image, top:0});
						banner_clone.css({top:0, left:0, width:width, height:height});
		
						//Next image
						var banner_clone_next = this.getBannerClone();
						banner_clone_next.find('img').css({left:this.fulloff+vleft_image, top:0});
						banner_clone_next.css({top:0, left:-width, width:width, height:height});
						
						var banner_clone_container = this.getBannerClone();
						banner_clone_container.html('').append(banner_clone).append(banner_clone_next);
						banner_clone_container.css({top:0, left:ileftc, width:width, height:height});
						
						this.addBannerClone(banner_clone_container);
		
						banner_clone_container.show();
						banner_clone.show();
						banner_clone_next.show();
						
						var callback = (i==(total-1)) ? function() {that.finishAnimation();} : "";	
		
						banner_clone.delay(delay).animate({left:width}, speed, easing);
						banner_clone_next.delay(delay).animate({left:0}, speed, easing, callback);
					}
				},
				
				//SwapBlocks
				animationSwapBlocks:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {easing_old:"easeInOutQuad", easing_new:"easeOutQuad"}, opts || {});
					
					var easing_old = (this.opt.easing=="") ? opts.easing_old : this.opt.easing;
					var easing_new = (this.opt.easing=="") ? opts.easing_new : this.opt.easing;
					var speed = 800/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					var total = 2;
					var width = this.opt.width;
					var height = Math.ceil(this.opt.height/total);
		
					//Old image
					var banner_clone1 = this.getBannerClone(image_old);					
					banner_clone1.find('img').css({left:this.fulloff, top:0});
					banner_clone1.css({top:0, left:0, width:width, height:height});
		
					var banner_clone2 = this.getBannerClone(image_old);
					banner_clone2.find('img').css({left:this.fulloff, top:-height});
					banner_clone2.css({top:height, left:0, width:width, height:height});
		
					//Next image
					var banner_clone_next1 = this.getBannerClone();					
					banner_clone_next1.find('img').css({left:this.fulloff, top:height});
					banner_clone_next1.css({top:0, left:0, width:width, height:height});
		
					var banner_clone_next2 = this.getBannerClone();
					banner_clone_next2.find('img').css({left:this.fulloff, top:-(height*total)});
					banner_clone_next2.css({top:height, left:0, width:width, height:height});
		
					this.addBannerClone(banner_clone_next1);
					this.addBannerClone(banner_clone_next2);
					this.addBannerClone(banner_clone1);
					this.addBannerClone(banner_clone2);
		
					banner_clone1.show();
					banner_clone2.show();
					banner_clone_next1.show();
					banner_clone_next2.show();
		
					var callback = function() {that.finishAnimation();};
		
					banner_clone1.find('img').animate({top:height}, speed, easing_old, function() {
						banner_clone1.remove();
					});
					banner_clone2.find('img').animate({top:-(height*total)}, speed, easing_old, function() {
						banner_clone2.remove();
					});
					banner_clone_next1.find('img').animate({top:0}, speed, easing_new);
					banner_clone_next2.find('img').animate({top:-height}, speed, easing_new, callback);
				},
		
				//Cut
				animationCut:function(opts) {
					var that = this;
					
					var opts = $.extend({}, {easing_old:"easeInOutExpo", easing_new:"easeInOutExpo"}, opts || {});
					
					var easing_old = (this.opt.easing=="") ? opts.easing_old : this.opt.easing;
					var easing_new = (this.opt.easing=="") ? opts.easing_new : this.opt.easing;
					var speed = 900/this.opt.velocity;
					
					var image_old = this.oldli.find(".defaultimg");
					
					var total = 2;
					var width = this.opt.width;
					var height = Math.ceil(this.opt.height/total);
		
					//Old image
					var banner_clone1 = this.getBannerClone(image_old);					
					banner_clone1.find('img').css({left:this.fulloff, top:0});
					banner_clone1.css({top:0, left:0, width:width, height:height});
		
					var banner_clone2 = this.getBannerClone(image_old);
					banner_clone2.find('img').css({left:this.fulloff, top:-height});
					banner_clone2.css({top:height, left:0, width:width, height:height});
		
					//Next image
					var banner_clone_next1 = this.getBannerClone();					
					banner_clone_next1.find('img').css({left:this.fulloff, top:0});
					banner_clone_next1.css({top:0, left:width, width:width, height:height});
		
					var banner_clone_next2 = this.getBannerClone();
					banner_clone_next2.find('img').css({left:this.fulloff, top:-height});
					banner_clone_next2.css({top:height, left:-width, width:width, height:height});
		
					this.addBannerClone(banner_clone_next1);
					this.addBannerClone(banner_clone_next2);
					this.addBannerClone(banner_clone1);
					this.addBannerClone(banner_clone2);
		
					banner_clone1.show();
					banner_clone2.show();
					banner_clone_next1.show();
					banner_clone_next2.show();
		
					var callback = function() {that.finishAnimation();};
		
					banner_clone1.animate({left:-width}, speed, easing_old, function() {
						banner_clone1.remove();
					});
					banner_clone2.animate({left:width}, speed, easing_old, function() {
						banner_clone2.remove();
					});
					banner_clone_next1.animate({left:0}, speed, easing_new);
					banner_clone_next2.animate({left:0}, speed, easing_new, callback);
				},
				
				/******************
				    - YouTube -
				******************/
				onYouTubePlayerAPIReady:function() {},
	
				//Change the YouTube player state here
				onPlayerStateChange:function(e) {
					var embedCode = e.target.getVideoEmbedCode();
					var ytcont = $('#'+embedCode.split('id="')[1].split('"')[0]);
					var container = ytcont.closest('.banner-rotator');
					var opt = container.data('opt');
					
					if (e.data==YT.PlayerState.PLAYING) {						
						container.data('play', false);
						opt.videoPlaying = true;
						opt.videoStarted = true;
						container.parent().find('.play-btn').click();
						if (ytcont.closest('.caption').data('volume')=="mute") {
							player.mute();
						}
					} else {
						if (e.data!=-1) {
							container.data('play', true);
							opt.videoPlaying = false;
							opt.videoStopped = true;
							container.parent().find('.play-btn').click();
						}
					}
					
					if (e.data==0 && opt.nextSlideAtEnd) {
						opt.container.brNext();
					}
				},
				
				//YouTube video autoplay
				onPlayerReady:function(e) {
					e.target.playVideo();
				},
	
				/****************
				    - Vimeo -
				****************/
				
				//Add event
				addEvent:function(element, eventName, callback) {
					if (element.addEventListener) {
						element.addEventListener(eventName, callback, false);
					} else {
						element.attachEvent(eventName, callback, false);
					}
				},
	
				//Change the vimeo player state here
				vimeoReady:function(player_id, autoplay) {
					var froogaloop = $f(player_id);
					var vimcont = $('#'+player_id);
					var container = vimcont.closest('.banner-rotator');
					var opt = container.data('opt');
					
					froogaloop.addEvent('ready', function(data) {
						if(autoplay) froogaloop.api('play');
						
						froogaloop.addEvent('play', function(data) {							
							container.data('play', false);
							opt.videoPlaying = true;
							container.parent().find('.play-btn').click();
							if (vimcont.closest('.caption').data('volume')=="mute") {
								froogaloop.api('setVolume',"0");
							}
						});
						
						froogaloop.addEvent('finish', function(data) {
							container.data('play', true);							
							opt.videoPlaying = false;
							opt.videoStarted = true;
							container.parent().find('.play-btn').click();
							if (opt.nextSlideAtEnd) opt.container.brNext();
						});
						
						froogaloop.addEvent('pause', function(data) {
							container.data('play', true);							
							opt.videoPlaying = false;
							opt.videoStopped = true;
							container.parent().find('.play-btn').click();
						});
					});	
				},
	
				/**********************
				    - HTML5 video -
				**********************/
				html5VideoReady:function(myPlayer, player_id, that) {
					if (player_id==undefined) player_id = $(myPlayer["b"]).attr('id');
					var player_cont = $('#'+player_id);
					var container = player_cont.closest('.banner-rotator');
					var opt = container.data('opt');
					
					myPlayer.on("play",function() {
						if (player_cont.closest('.caption').data('volume')=="mute") {
							myPlayer.volume(0);
						}
						container.data('play', false);
						try {
							opt.videoPlaying = true;
						} catch(e) {}
						container.parent().find('.play-btn').click();						
					});

					myPlayer.on("pause",function() {
						container.data('play', true);
						opt.videoPlaying = false;
						opt.videoStopped = true;
						container.parent().find('.play-btn').click();						
					});

					myPlayer.on("ended",function() {
						container.data('play', true);
						opt.videoPlaying = false;						
						opt.videoStopped = true;
						container.parent().find('.play-btn').click();
						if (opt.nextSlideAtEnd) opt.container.brNext();
					});
					
					myPlayer.on("loadedmetadata", function(data) {
						var videoWidth = 0;
						var videoHeight = 0;

						for(var prop in this) {
							try{
								if(this[prop].hasOwnProperty('videoWidth')) {
									videoWidth = this[prop].videoWidth;
								}
								if(this[prop].hasOwnProperty('videoHeight')) {
									videoHeight = this[prop].videoHeight;
								}
							} catch(e) {}
						}

						var mediaAspect = videoWidth/videoHeight;
						
						if (player_cont.data('mediaAspect')==undefined) {
							player_cont.data('mediaAspect', mediaAspect);
						}
						
						if (player_cont.closest('.caption').data('forcecover')) {
							that.updateHTML5Size(player_cont, container);
						}
					});
				},
				
				//Resize HTML video for fullscreen
				updateHTML5Size:function(pc, container) {					
					var windowW = container.width();
					var windowH = container.height();
					var mediaAspect = pc.data('mediaAspect');
					var windowAspect = windowW/windowH;
					
					pc.parent().find('.vjs-poster').css({width:"100%",height:"100%"});
					
					if (windowAspect<mediaAspect) {						
						//Taller
						pc.width(windowH*mediaAspect).height(windowH);
						pc.css('top',0).css('left',-(windowH*mediaAspect-windowW)/2).css('height',windowH);
						pc.find('.vjs-tech').css('width',windowH*mediaAspect);
					} else {
						//Wider
						pc.width(windowW).height(windowW/mediaAspect);
						pc.css('top',-(windowW/mediaAspect-windowH)/2).css('left',0).css('height',windowW/mediaAspect);
						pc.find('.vjs-tech').css('width','100%');
					}
				},
				
				/******************
				    - Caption -
				******************/
				
				//Set caption position
				setCaptionPosition:function() {
					//Set the next caption and remove the last caption
					var nextcaption = this.currentli.find('.caption');
					if (nextcaption.find('iframe')==0) {
						//Move the captions to the right position
						if (nextcaption.hasClass('hcenter')) {
							nextcaption.css({'height':this.opt.height+"px",'top':'0px','left':((this.opt.width-nextcaption.outerWidth())/2)+'px'});
						} else {
							if (nextcaption.hasClass('vcenter')) {
								nextcaption.css({'width':this.opt.width+"px",'left':'0px','top':((this.opt.height-nextcaption.outerHeight())/2)+'px'});
							}
						}
						
					}
				},
	
				//Show caption
				showCaption:function(nextli) {
					var that = this;
					var offsetx = 0;
					var offsety = 0;
					
					nextli.find('.caption').each(function(i) {
						offsetx = (that.opt.width-that.opt.startWidth)/2;
	
						if (that.opt.bh>1) {
							that.opt.bw=1;
							that.opt.bh=1;
						}
	
						if (that.opt.bw>1) {
							that.opt.bw=1;
							that.opt.bh=1;
						}
	
						var xbw = that.opt.bw;
						var xbh = that.opt.bh;
						
						if (that.opt.fullScreen) {
							offsety = (that.opt.height-(that.opt.startHeight*that.opt.bh))/2;
						}
						
						if (offsety<0) offsety = 0;
	
						var nextcaption = nextli.find('.caption:eq('+i+')');
						nextcaption.stop(true,true);
						
						var handlecaption = false;
	
						//Hide caption on resolution
						if (that.opt.width<=that.opt.hideCaptionAtResolution && nextcaption.data('captionhidden')==true) {
							nextcaption.addClass("hidden-caption");
							handlecaption = true;							
						} else {
							if (that.opt.width<that.opt.hideCaptionAtResolution) {
								nextcaption.addClass("hidden-caption");
								handlecaption = true;	
							} else {
								nextcaption.removeClass("hidden-caption");
							}
						}
	
						if (!handlecaption) {
							//Link to slide
							if (nextcaption.data('linktoslide')!=undefined) {
								nextcaption.css({'cursor':'pointer'});
								nextcaption.click(function() {
									var nextcaption = $(this);
									var dir = nextcaption.data('linktoslide');
									if (dir!="next" && dir!="prev") {
										that.container.data('showus',dir);
										that.container.parent().find('.rightarrow').click();
									} else
										if (dir=="next")
											that.container.parent().find('.rightarrow').click();
									else
										if (dir=="prev")
											that.container.parent().find('.leftarrow').click();
								});
							}
		
							if (nextcaption.hasClass("coloredbg")) offsetx = 0;
							if (offsetx<0) offsetx = 0;
		
							clearTimeout(nextcaption.data('timer'));
							clearTimeout(nextcaption.data('timer-end'));
		
							//YouTube and Vimeo listeners initialization
							var frameID = "iframe"+Math.round(Math.random()*1000+1);
	
							if (nextcaption.find('iframe').length>0) {
								if (nextcaption.data('autoplayonlyfirsttime')) {
									nextcaption.data('autoplay', true);
								}
										
								nextcaption.find('iframe').each(function() {
									var ifr = $(this);
			
									if (ifr.attr('src').toLowerCase().indexOf('youtube')>=0) {
										that.opt.nextSlideAtEnd = nextcaption.data('nextslideatend');
										
										if (!ifr.hasClass("HasListener")) {
											try {
												ifr.attr('id',frameID);
												var player;
												
												if (nextcaption.data('autoplay')) {
													player = new YT.Player(frameID, {
														events:{
															"onStateChange":that.onPlayerStateChange,
															"onReady":that.onPlayerReady
														}
													});
												} else {
													player = new YT.Player(frameID, {
														events:{
															"onStateChange":that.onPlayerStateChange
														}
													});
												}
												
												ifr.addClass("HasListener");
												nextcaption.data('player', player);
												
												if (nextcaption.data('autoplay')) {
													var timer = $('body').find('#'+that.opt.container.attr('id')).find('.timer');
													setTimeout(function() {
														timer.stop();
														that.opt.videoPlaying = true;
													},200);
												}
											} catch(e) {}
										} else {
											if (nextcaption.data('autoplay')) {
												var player = nextcaption.data('player');
												
												nextcaption.data('timerplay',setTimeout(function() {
													if (nextcaption.data('forcerewind')) {
														player.seekTo(0);
													}
													player.playVideo();
												},nextcaption.data('start')));

												var timer = $('body').find('#'+that.opt.container.attr('id')).find('.timer');
												setTimeout(function() {
													timer.stop();
													that.opt.videoPlaying = true;
												},200);
											}
										}
									} else {
										if (ifr.attr('src').toLowerCase().indexOf('vimeo')>=0) {
											that.opt.nextSlideAtEnd = nextcaption.data('nextslideatend');
											
										   	if (!ifr.hasClass("HasListener")) {									   
												ifr.addClass("HasListener");
												ifr.attr('id',frameID);
												var isrc = ifr.attr('src');
												var queryParameters = {}, queryString = isrc,
												re = /([^&=]+)=([^&]*)/g, m;
												
												//Creates a map with the query string parameters
												while (m = re.exec(queryString)) {
													queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
												}
													
												if (queryParameters['player_id']!=undefined) {	
													isrc = isrc.replace(queryParameters['player_id'],frameID);
												} else {
													isrc += "&player_id="+frameID;
												}
													
												try{
													isrc = isrc.replace('api=0','api=1');
												} catch(e) {}
													
												isrc += "&api=1";	
												ifr.attr('src',isrc);
												var player = nextcaption.find('iframe')[0];
												
												if (nextcaption.data('autoplay')) {
													$f(player).addEvent('ready', function() {that.vimeoReady(frameID, true);});
													var timer = $('body').find('#'+that.opt.container.attr('id')).find('.timer');
													setTimeout(function() {
														timer.stop();
														that.opt.videoPlaying = true;
													},200);
												} else {
													$f(player).addEvent('ready', function() {that.vimeoReady(frameID, false);});	
												}
											} else {
												if (nextcaption.data('autoplay')) {
													var ifr = nextcaption.find('iframe');
													var id = ifr.attr('id');
													var froogaloop = $f(id);
													
													nextcaption.data('timerplay',setTimeout(function() {
														if (nextcaption.data('forcerewind')) {
															froogaloop.api("seekTo", 0);
														}
														froogaloop.api("play");
													},nextcaption.data('start')));
													
													var timer = $('body').find('#'+that.opt.container.attr('id')).find('.timer');
													
													setTimeout(function() {
														timer.stop();
														that.opt.videoPlaying = true;
													},200);
												}	
											}
										}
									}
								});
							}
							
							//If HTML5 video is embedded
							if (nextcaption.find('video').length>0) {
								if (nextcaption.data('autoplayonlyfirsttime')) {
									nextcaption.data('autoplay', true);
								}
								
								nextcaption.find('video').each(function(i) {
									var video = $(this).parent();
									
									var mediaaspect = 16/9;
									if (nextcaption.data('aspectratio')=="4:3") mediaaspect = 4/3;
									video.data('mediaAspect', mediaaspect);
									
									if (video.hasClass("video-js")) {										
										that.opt.nextSlideAtEnd = nextcaption.data('nextslideatend');
										
										if (!video.hasClass("HasListener")) {
											video.addClass("HasListener");
											var videoID = "videoid_"+Math.round(Math.random()*1000+1);
											video.attr('id',videoID);											
											videojs(videoID).ready(function() {
												that.html5VideoReady(this, videoID, that);
											});
										} else {
											videoID = video.attr('id');
										}
										
										video.find('.vjs-poster').css({display:"block"});
										
										if (nextcaption.data('autoplay')) {
											var timer = $('body').find('#'+that.opt.container.attr('id')).find('.timer');
											setTimeout(function() {
												timer.stop();
												that.opt.videoPlaying = true;
											},200);

											videojs(videoID).ready(function() {
												var myPlayer = this;
												
												try {
													if (nextcaption.data("forcerewind")) {
														myPlayer.currentTime(0);
													}
												} catch(e) {}
												
												video.data('timerplay',setTimeout(function() {
													if (nextcaption.data('forcerewind')) {
													  	myPlayer.currentTime(0);
													}

													if (video.closest('.caption').data('volume')=="mute") {
													  	myPlayer.volume(0);
													}
													
													setTimeout(function() {
														myPlayer.play(0);
														video.find('.vjs-poster').css({display:"none"});
													},50);
												},10+nextcaption.data('start')));
											});
										}

										if (video.data('ww')==undefined) video.data('ww',video.width());
										if (video.data('hh')==undefined) video.data('hh',video.height());

										videojs(videoID).ready(function() {
											if (!nextcaption.hasClass("fullscreenvideo")) {
												var myPlayer = videojs(videoID);

												try{
													myPlayer.width(video.data('ww')*that.opt.bw);
													myPlayer.height(video.data('hh')*that.opt.bh);
												} catch(e) {}
											}
										});
										
										if (video.closest('.caption').data('forcecover')) {
											that.updateHTML5Size(video, that.opt.container);
											video.addClass("fullcoveredvideo");
										}							
									 }
								});
							}
							
							if (nextcaption.find('iframe').length>0 || nextcaption.find('video').length>0) {
								if (nextcaption.data('autoplayonlyfirsttime')) {
									nextcaption.data('autoplay', false);
									nextcaption.data('autoplayonlyfirsttime', false);
								}
							}
		
							//Random rotate
							if (nextcaption.hasClass("randomrotate") && (that.opt.ie || that.opt.ie9)) nextcaption.removeClass("randomrotate").addClass("sfb");
							nextcaption.removeClass('noFilterClass');
		
							var imw = 0;
							var imh = 0;
	
							if (nextcaption.find('img').length>0) {
								var im = nextcaption.find('img');
								if (im.data('ww') == undefined) im.data('ww',im.width());
								if (im.data('hh') == undefined) im.data('hh',im.height());
								var ww = im.data('ww');
								var hh = im.data('hh');
								im.width(ww*that.opt.bw);
								im.height(hh*that.opt.bh);
								imw = im.width();
								imh = im.height();
							} else {
								if (nextcaption.find('iframe').length>0) {
									var im = nextcaption.find('iframe');
									im.css({display:"block"});
									
									if (nextcaption.data('ww') == undefined) {
										nextcaption.data('ww',im.width());
									}
									if (nextcaption.data('hh') == undefined) nextcaption.data('hh',im.height());
		
									var ww = nextcaption.data('ww');
									var hh = nextcaption.data('hh');
		
									var nc =nextcaption;
									if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
									if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
									if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
									if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
									if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);
		
									if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
									if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
									if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
									if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);
		
									if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTopWidth'),0) || 0);
									if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottomWidth'),0) || 0);
									if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeftWidth'),0) || 0);
									if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRightWidth'),0) || 0);
		
									if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || 0);
		
									var fvwidth = that.opt.width;
									var fvheight = that.opt.height;
									if (fvwidth>that.opt.startWidth) fvwidth = that.opt.startWidth;
									if (fvheight>that.opt.startHeight) fvheight = that.opt.startHeight;
		
									if (!nextcaption.hasClass('fullscreenvideo')) {
										nextcaption.css({
											'font-size': (nc.data('fsize') * that.opt.bw)+"px",
		
											'padding-top': (nc.data('pt') * that.opt.bh) + "px",
											'padding-bottom': (nc.data('pb') * that.opt.bh) + "px",
											'padding-left': (nc.data('pl') * that.opt.bw) + "px",
											'padding-right': (nc.data('pr') * that.opt.bw) + "px",
		
											'margin-top': (nc.data('mt') * that.opt.bh) + "px",
											'margin-bottom': (nc.data('mb') * that.opt.bh) + "px",
											'margin-left': (nc.data('ml') * that.opt.bw) + "px",
											'margin-right': (nc.data('mr') * that.opt.bw) + "px",
		
											'border-top-width': (nc.data('bt') * that.opt.bh) + "px",
											'border-bottom-width': (nc.data('bb') * that.opt.bh) + "px",
											'border-left-width': (nc.data('bl') * that.opt.bw) + "px",
											'border-right-width': (nc.data('br') * that.opt.bw) + "px",
		
											'line-height': (nc.data('lh') * that.opt.bh) + "px",
											'height':(hh*that.opt.bh)+'px',
											'white-space':"nowrap"
										});
									} else {
										nextcaption.css({
											'width':that.opt.startWidth*that.opt.bw,
											'height':that.opt.startHeight*that.opt.bh
										});
									}
		
									im.width(ww*that.opt.bw);
									im.height(hh*that.opt.bh);
									imw = im.width();
									imh = im.height();
									imw = 900;
								} else {
									nextcaption.find('.resizeme, .resizeme *').each(function() {
										that.calcCaptionResponsive($(this));
									});
	
									if (nextcaption.hasClass("resizeme")) {
										nextcaption.find('*').each(function() {
											that.calcCaptionResponsive($(this));
										});
									}
	
									that.calcCaptionResponsive(nextcaption);
	
									imh = nextcaption.outerHeight(true);
									imw = nextcaption.outerWidth(true);
	
									//Next caption front corner changes
									var ncch = nextcaption.outerHeight();
									var bgcol = nextcaption.css('backgroundColor');									
									nextcaption.find('.frontcorner').css({
										'borderWidth':ncch+"px",
										'left':(0-ncch)+'px',
										'borderRight':'0px solid transparent',
										'borderTopColor':bgcol
									});
									
									nextcaption.find('.frontcornertop').css({
										'borderWidth':ncch+"px",
										'left':(0-ncch)+'px',
										'borderRight':'0px solid transparent',
										'borderBottomColor':bgcol
									});
	
									//Next caption back corner changes
									nextcaption.find('.backcorner').css({
										'borderWidth':ncch+"px",
										'right':(0-ncch)+'px',
										'borderLeft':'0px solid transparent',
										'borderBottomColor':bgcol
									});
	
									nextcaption.find('.backcornertop').css({
										'borderWidth':ncch+"px",
										'right':(0-ncch)+'px',
										'borderLeft':'0px solid transparent',
										'borderTopColor':bgcol
									});					
								}
							}
						
							//Video
							var video = nextcaption.data("video");
							if (video!=undefined) {
								var w = that.opt.startWidth*that.opt.bw;
								var h = that.opt.startHeight*that.opt.bh;
								nextcaption.html("").width(w).height(h);
								var videoFrame = $('<div class="video-frame"></div>');
								nextcaption.append(videoFrame);
								var videoPlayBtn = $('<div class="video-play"></div>');							
								nextcaption.append(videoPlayBtn);
								
								videoPlayBtn.bind("click", function() {
									that.opt.videoPlaying = true;
									that.opt.videoStarted = true;
									that.cap.find('.play-btn').click();
									
									if (that.opt.showTimer) {
										that.timer.hide();
									}
									
									videoFrame.html('<iframe frameborder="0" width="'+w+'" height="'+h+'" src="'+video+'" /><div class="video-close"></div>');
									var videoCloseBtn = videoFrame.find(".video-close");
									
									videoCloseBtn.bind("click", function() {
										that.opt.videoPlaying = false;
										that.opt.videoStopped = true;
										videoFrame.html("");										
										that.cap.find('.play-btn').click();
										
										if (that.opt.showTimer) {
											that.timer.show();	
										}
									});								
								});		
							}
						
							//Offset
							if (nextcaption.data('voffset')==undefined) nextcaption.data('voffset',0);
							if (nextcaption.data('hoffset')==undefined) nextcaption.data('hoffset',0);
	
							var vofs = nextcaption.data('voffset')*xbw;
							var hofs = nextcaption.data('hoffset')*xbw;
	
							var crw = that.opt.startWidth*xbw;
							var crh = that.opt.startHeight*xbw;
	
							//Center the caption horizontally
							if (nextcaption.data('x')=='center' || nextcaption.data('xcenter')=='center') {
								nextcaption.data('xcenter','center');
								nextcaption.data('x',((crw-nextcaption.outerWidth(true))/2)/xbw+hofs);
							}
	
							//Align left the caption horizontally
							if (nextcaption.data('x')=='left' || nextcaption.data('xleft')=='left') {
								nextcaption.data('xleft','left');
								nextcaption.data('x',(0)/xbw+hofs);
							}
	
							//Align right the caption horizontally
							if (nextcaption.data('x')=="right" || nextcaption.data('xright')=='right') {
								nextcaption.data('xright','right');
								nextcaption.data('x',(crw-nextcaption.outerWidth(true)+hofs)/xbw);							
							}
	
							//Center the caption vertically
							if (nextcaption.data('y')=="center" || nextcaption.data('ycenter')=='center') {
								nextcaption.data('ycenter','center');
								nextcaption.data('y',((crh-nextcaption.outerHeight(true))/2)/that.opt.bh+vofs);
							}
	
							//Align top the caption vertically
							if (nextcaption.data('y')=="top" || nextcaption.data('ytop')=='top') {
								nextcaption.data('ytop','top');
								nextcaption.data('y',vofs);
							}
	
							//Align bottom the caption vertically
							if (nextcaption.data('y')=="bottom" || nextcaption.data('ybottom')=='bottom') {
								nextcaption.data('ybottom','bottom');
								nextcaption.data('y',((crh-nextcaption.outerHeight(true))+vofs)/xbw);
							}
							
							//Calculate x-y positions
							var calcx = 0;
							var calcy = 0;
							var skwx = 0;
							var rox = 0;
							
							if (!nextcaption.hasClass('fullscreenvideo')) {
								calcx = xbw*nextcaption.data('x')+offsetx;
								calcy = that.opt.bh*nextcaption.data('y')+offsety;
							}
							
							//Fade
							if (nextcaption.hasClass('fade')) {
								nextcaption.css({'opacity':0, 'left':calcx+'px', 'top':calcy+"px"});
							}
		
							//Random rotate
							if (nextcaption.hasClass("randomrotate")) {
								nextcaption.css({'opacity':0, 'left':calcx+'px', 'top':(xbh*nextcaption.data('y')+offsety)+'px'});
								var sc = Math.random()*2+1;
								var ro = Math.round(Math.random()*200-100);
								var xx = Math.round(Math.random()*200-100);
								var yy = Math.round(Math.random()*200-100);
								nextcaption.data('repx',xx);
								nextcaption.data('repy',yy);
								nextcaption.data('repo',nextcaption.css('opacity'));
								nextcaption.data('rotate',ro);
								nextcaption.data('scale',sc);
								nextcaption.transition({scale:sc, rotate:ro, x:xx, y:yy, duration:'0ms'});
							} else {
								if (that.opt.ie || that.opt.ie9) {
								} else {
									nextcaption.transition({scale:1, rotate:0});
								}
							}
							
							var oo = nextcaption.data('opacity');
							if (oo==undefined) oo = 1;
							
							//Short from bottom
							if (nextcaption.hasClass('sfb')) {
								nextcaption.css({'opacity':0, 'left':calcx+'px', 'top':(calcy+50)+'px'});
							}
							
							//Short from left
							if (nextcaption.hasClass('sfl')) {
								nextcaption.css({'opacity':0, 'left':(calcx-50)+'px', 'top':calcy+'px'});
							}
		
							//Short from right
							if (nextcaption.hasClass('sfr')) {
								nextcaption.css({'opacity':0, 'left':(calcx+50)+'px', 'top':calcy+'px'});
							}
							
							//Short from top
							if (nextcaption.hasClass('sft')) {
								nextcaption.css({'opacity':0, 'left':calcx+'px', 'top':(calcy-50)+'px'});
							}
							
							//Long from bottom
							if (nextcaption.hasClass('lfb')) {
								nextcaption.css({'opacity':oo, 'left':calcx+'px', 'top':(25+that.opt.height)+'px'});
							}
							
							//Long from left
							if (nextcaption.hasClass('lfl')) {
								nextcaption.css({'opacity':oo, 'left':(-15-imw)+'px', 'top':calcy+'px'});
							}
							
							//Long from right
							if (nextcaption.hasClass('lfr')) {
								nextcaption.css({'opacity':oo, 'left':(15+that.opt.width)+'px', 'top':calcy+'px'});
							}	
							
							//Long from top
							if (nextcaption.hasClass('lft')) {
								nextcaption.css({'opacity':oo, 'left':calcx+'px', 'top':(-25-imh)+'px'});
							}
							
							//Skew from left
							if (nextcaption.hasClass('skewfromleft')) {
								skwx = 85;
								nextcaption.css({'opacity':0, 'left':(-15-imw)+'px', 'top':calcy+'px'});
								nextcaption.transition({skewX:skwx, duration:'0ms'});
							}
							
							//Skew from right
							if (nextcaption.hasClass('skewfromright')) {
								skwx = -85;
								nextcaption.css({'opacity':0, 'left':(15+that.opt.width)+'px', 'top':calcy+'px'});
								nextcaption.transition({skewX:skwx, duration:'0ms'});
							}
							
							//Skew from left short
							if (nextcaption.hasClass('skewfromleftshort')) {
								skwx = 85;
								nextcaption.css({'opacity':0, 'left':(calcx-50)+'px', 'top':calcy+'px'});
								nextcaption.transition({skewX:skwx, duration:'0ms'});
							}
							
							//Skew from right short
							if (nextcaption.hasClass('skewfromrightshort')) {
								skwx = -85;
								nextcaption.css({'opacity':0, 'left':(calcx+50)+'px', 'top':calcy+'px'});
								nextcaption.transition({skewX:skwx, duration:'0ms'});
							}
							
							//Custom in
							if (nextcaption.hasClass('customin')) {
								rox = 90;
								nextcaption.css({'opacity':0});
								nextcaption.transition({origin:'50% 0%', perspective:200, rotateX:rox, duration:'0ms'});

							}
							
							nextcaption.data('repskewx',skwx);
							nextcaption.data('reprox',rox);
	
							//Animate in order
							nextcaption.data('timer',setTimeout(function() {
									nextcaption.css({'visibility':'visible'});
									
									if (nextcaption.hasClass('fade')) {
										nextcaption.data('repo',nextcaption.css('opacity'));
										nextcaption.animate({'opacity':1},{duration:nextcaption.data('speed')});
										if (that.opt.ie) nextcaption.addClass('noFilterClass');
									}
									
									if (nextcaption.hasClass("randomrotate")) {
										var rndy = (!nextcaption.hasClass('fullscreenvideo')) ? (xbh*(nextcaption.data('y'))+offsety) : 0;
										nextcaption.transition({opacity:1, scale:1, 'left':calcx+'px', 'top':rndy+"px", rotate:0, x:0, y:0, duration:nextcaption.data('speed')});
										if (that.opt.ie) nextcaption.addClass('noFilterClass');
									}
									
									if (nextcaption.hasClass('lfr') || nextcaption.hasClass('lfl') || nextcaption.hasClass('lft') || nextcaption.hasClass('lfb') ||
										nextcaption.hasClass('sfr') || nextcaption.hasClass('sfl') || nextcaption.hasClass('sft') || nextcaption.hasClass('sfb') ||
										nextcaption.hasClass('skewfromleft') || nextcaption.hasClass('skewfromright') || nextcaption.hasClass('skewfromleftshort') || nextcaption.hasClass('skewfromrightshort') ||
										nextcaption.hasClass('customin')
									) {
										var oo = nextcaption.data('opacity');
										var speed = nextcaption.data('speed');
										var easetype = nextcaption.data('easing');	
										
										if (oo==undefined) oo = 1;
										if (easetype==undefined) easetype = that.opt.captionEasing;
										
										nextcaption.data('repx',nextcaption.position().left);
										nextcaption.data('repy',nextcaption.position().top);
										nextcaption.data('repo',nextcaption.css('opacity'));
										
										nextcaption.transition({opacity:oo, scale:1, left:calcx+'px', top:calcy+'px', rotate:0, x:0, y:0, skewX:0, rotateX:0, rotateY:0, duration:speed, easing:easetype});
										
										if (that.opt.ie) nextcaption.addClass('noFilterClass');
									}
							},nextcaption.data('start')));
	
							//If there is any exit anim defined
							if (nextcaption.data('end')!=undefined) {
								nextcaption.data('timer-end', setTimeout(function() {
									if ((that.opt.ie || that.opt.ie9) && (nextcaption.hasClass("randomrotate") || nextcaption.hasClass("randomrotateout"))) {
										nextcaption.removeClass("randomrotate").removeClass("randomrotateout").addClass('fadeout');
									}
									that.endMoveCaption(nextcaption);
								}, nextcaption.data('end')));
							}
						}
					});
				},
				
				//Calculate the responsive sizes of captions
				calcCaptionResponsive:function(nc) {
					if (nc.data('fsize') == undefined) nc.data('fsize',parseInt(nc.css('font-size'),0) || 0);
					if (nc.data('pt') == undefined) nc.data('pt',parseInt(nc.css('paddingTop'),0) || 0);
					if (nc.data('pb') == undefined) nc.data('pb',parseInt(nc.css('paddingBottom'),0) || 0);
					if (nc.data('pl') == undefined) nc.data('pl',parseInt(nc.css('paddingLeft'),0) || 0);
					if (nc.data('pr') == undefined) nc.data('pr',parseInt(nc.css('paddingRight'),0) || 0);

					if (nc.data('mt') == undefined) nc.data('mt',parseInt(nc.css('marginTop'),0) || 0);
					if (nc.data('mb') == undefined) nc.data('mb',parseInt(nc.css('marginBottom'),0) || 0);
					if (nc.data('ml') == undefined) nc.data('ml',parseInt(nc.css('marginLeft'),0) || 0);
					if (nc.data('mr') == undefined) nc.data('mr',parseInt(nc.css('marginRight'),0) || 0);

					if (nc.data('bt') == undefined) nc.data('bt',parseInt(nc.css('borderTopWidth'),0) || 0);
					if (nc.data('bb') == undefined) nc.data('bb',parseInt(nc.css('borderBottomWidth'),0) || 0);
					if (nc.data('bl') == undefined) nc.data('bl',parseInt(nc.css('borderLeftWidth'),0) || 0);
					if (nc.data('br') == undefined) nc.data('br',parseInt(nc.css('borderRightWidth'),0) || 0);

					if (nc.data('lh') == undefined) nc.data('lh',parseInt(nc.css('lineHeight'),0) || 0);
					if (nc.data('minwidth') == undefined) nc.data('minwidth',parseInt(nc.css('minWidth'),0) || 0);
					if (nc.data('minheight') == undefined) nc.data('minheight',parseInt(nc.css('minHeight'),0) || 0);
					if (nc.data('maxwidth') == undefined) nc.data('maxwidth',parseInt(nc.css('maxWidth'),0) || "none");
					if (nc.data('maxheight') == undefined) nc.data('maxheight',parseInt(nc.css('maxHeight'),0) || "none");

					nc.css({
						'font-size':Math.round((nc.data('fsize')*this.opt.bw))+"px",

						'padding-top':Math.round((nc.data('pt')*this.opt.bh))+"px",
						'padding-bottom':Math.round((nc.data('pb')*this.opt.bh))+"px",
						'padding-left':Math.round((nc.data('pl')*this.opt.bw))+"px",
						'padding-right':Math.round((nc.data('pr')*this.opt.bw))+"px",
						
						'margin-top':(nc.data('mt')*this.opt.bh)+"px",
						'margin-bottom':(nc.data('mb')*this.opt.bh)+"px",
						'margin-left':(nc.data('ml')*this.opt.bw)+"px",
						'margin-right':(nc.data('mr')*this.opt.bw)+"px",
						
						'borderTopWidth':Math.round((nc.data('bt')*this.opt.bh))+"px",
						'borderBottomWidth':Math.round((nc.data('bb')*this.opt.bh))+"px",
						'borderLeftWidth':Math.round((nc.data('bl')*this.opt.bw))+"px",
						'borderRightWidth':Math.round((nc.data('br')*this.opt.bw))+"px",
						
						'line-height':Math.round((nc.data('lh')*this.opt.bh))+"px",
						'white-space':"nowrap",
						'minWidth':(nc.data('minwidth')*this.opt.bw)+"px",
						'minHeight':(nc.data('minheight')*this.opt.bh)+"px",
					});

					if (nc.data('maxheight')!='none') {
						nc.css({'maxHeight':(nc.data('maxheight')*this.opt.bh)+"px"});
					}

					if (nc.data('maxwidth')!='none') {
						nc.css({'maxWidth':(nc.data('maxwidth')*this.opt.bw)+"px"});
					}
				},
					
				//Remove caption
				removeCaption:function(actli) {
					var that = this;
					
					actli.find('.caption').each(function(i) {
						var nextcaption = actli.find('.caption:eq('+i+')');
						nextcaption.stop(true,true);
						
						clearTimeout(nextcaption.data('timer'));
						clearTimeout(nextcaption.data('timer-end'));
		
						if (nextcaption.find('iframe').length>0) {
							//Vimeo video pause
							try {
								var ifr = nextcaption.find('iframe');
								var id = ifr.attr('id');
								var froogaloop = $f(id);
								froogaloop.api("pause");
							} catch(e) {}
							
							//YouTube video pause
							try {
								var player = nextcaption.data('player');
								player.stopVideo();
							} catch(e) {}
						}
						
						//If HTML5 video is embedded
						if (nextcaption.find('video').length>0) {
							try {
								nextcaption.find('video').each(function(i) {
									var video = $(this).parent();
									var videoID = video.attr('id');
									
									clearTimeout(video.data('timerplay'));
									
									videojs(videoID).ready(function() {
										var myPlayer = this;
										myPlayer.pause();
									});
								})
							} catch(e) {}
						}
						
						try {
							that.endMoveCaption(nextcaption);
						} catch(e) {}
					});
				},	
				
				//Move out the captions
				endMoveCaption:function(nextcaption) {
					if (nextcaption.hasClass("randomrotate") && (this.opt.ie || this.opt.ie9)) nextcaption.removeClass("randomrotate").addClass("sfb");
					if (nextcaption.hasClass("randomrotateout") && (this.opt.ie || this.opt.ie9)) nextcaption.removeClass("randomrotateout").addClass("stb");

					var endspeed = nextcaption.data('endspeed');
					if (endspeed==undefined) endspeed = nextcaption.data('speed');
					
					var easetype = nextcaption.data('endeasing');
					if (easetype==undefined) easetype="linear";

					var xx = nextcaption.data('repx');
					var yy = nextcaption.data('repy');
					var oo = nextcaption.data('repo');
					var skwx = nextcaption.data('repskewx');
					var rox = nextcaption.data('reprox');
					
					if (skwx==undefined) skwx = 0;
					if (rox==undefined) rox = 0;

					if (this.opt.ie) {
						nextcaption.css({'opacity':'inherit','filter':'inherit'});
					}

					if (nextcaption.hasClass('ltr') || nextcaption.hasClass('ltl') || nextcaption.hasClass('ltt') || nextcaption.hasClass('ltb') ||
						nextcaption.hasClass('str') || nextcaption.hasClass('stl') || nextcaption.hasClass('stt') || nextcaption.hasClass('stb') ||
						nextcaption.hasClass('skewtoleft') || nextcaption.hasClass('skewtoright') || nextcaption.hasClass('skewtoleftshort') || nextcaption.hasClass('skewtorightshort')
					) {
						xx = nextcaption.position().left;
						yy = nextcaption.position().top;
						skwx = 0;

						if (nextcaption.hasClass('ltr') || nextcaption.hasClass('skewtoright'))
							xx = this.opt.width+60;
						else if (nextcaption.hasClass('ltl') || nextcaption.hasClass('skewtoleft'))
							xx = -nextcaption.width()-60;
						else if (nextcaption.hasClass('ltt'))
							yy = -nextcaption.height()-60;
						else if (nextcaption.hasClass('ltb'))
							yy = this.opt.height+60;
						else if (nextcaption.hasClass('str') || nextcaption.hasClass('skewtorightshort')) {
							xx += 50; oo=0;
						} else if (nextcaption.hasClass('stl') || nextcaption.hasClass('skewtoleftshort')) {
							xx -= 50; oo=0;
						} else if (nextcaption.hasClass('stt')) {
							yy -= 50; oo=0;
						} else if (nextcaption.hasClass('stb')) {
							yy += 50; oo=0;
						}
						
						if (nextcaption.hasClass('skewtoright') || nextcaption.hasClass('skewtorightshort')) {
							skwx = 35;
						}

						if (nextcaption.hasClass('skewtoleft') || nextcaption.hasClass('skewtoleftshort')) {
							skwx = -35;
						}

						nextcaption.transition({'opacity':oo, 'left':xx+'px', 'top':yy+"px", skewX:skwx, duration:nextcaption.data('endspeed'), easing:easetype,
							complete:function() {
								if (easetype.indexOf("Bounce")>=0 || easetype.indexOf("Elastic")>=0) {
									$(this).css({visibility:'hidden'});
								}
							}
						});
						
						if (this.opt.ie) nextcaption.removeClass('noFilterClass');
					} else if (nextcaption.hasClass("randomrotateout")) {
						nextcaption.transition({opacity:0, scale:Math.random()*2+0.3, 'left':Math.random()*this.opt.width+'px','top':Math.random()*this.opt.height+"px", rotate:Math.random()*40, duration:endspeed, easing:easetype, 
							complete:function() {
								$(this).css({visibility:'hidden'});
							}
						});
						if (this.opt.ie) nextcaption.removeClass('noFilterClass');
					} else if (nextcaption.hasClass('fadeout')) {
						if (this.opt.ie) nextcaption.removeClass('noFilterClass');
						nextcaption.transition({'opacity':0, duration:200});
					} else if (nextcaption.hasClass('customout')) {
						nextcaption.transition({'opacity':oo, scale:0.75, origin:'50% 50%', perspective:600, rotateX:0, duration:nextcaption.data('endspeed'), easing:easetype,
							complete:function() {
								if (easetype.indexOf("Bounce")>=0 || easetype.indexOf("Elastic")>=0) {
									$(this).css({visibility:'hidden'});
								}
							}
						});
						if (this.opt.ie) nextcaption.removeClass('noFilterClass');
					} else {
						if (nextcaption.hasClass('lfr') || nextcaption.hasClass('lfl') || nextcaption.hasClass('lft') || nextcaption.hasClass('lfb') ||
							nextcaption.hasClass('sfr') || nextcaption.hasClass('sfl') || nextcaption.hasClass('sft') || nextcaption.hasClass('sfb') ||
							nextcaption.hasClass('skewfromleft') || nextcaption.hasClass('skewfromright') || nextcaption.hasClass('skewfromleftshort') || nextcaption.hasClass('skewfromrightshort')
						) {							
							if (nextcaption.hasClass('lfr'))
								xx = this.opt.width+60;
							else if (nextcaption.hasClass('lfl'))
								xx = -nextcaption.width()-60;
							else if (nextcaption.hasClass('lft'))
								yy = -nextcaption.height()-60;
							else if (nextcaption.hasClass('lfb'))
								yy = this.opt.height+60;

							nextcaption.transition({'opacity':oo, 'left':xx+'px', 'top':yy+"px", skewX:skwx, duration:nextcaption.data('endspeed'), easing:easetype,
								complete:function() { 
									if (easetype.indexOf("Bounce")>=0 || easetype.indexOf("Elastic")>=0) {
										$(this).css({visibility:'hidden'});
									}
								}
							});							
						} else if (nextcaption.hasClass('customin')) {
							nextcaption.transition({'opacity':oo, origin:'50% 0%', perspective:200, rotateX:rox, duration:nextcaption.data('endspeed'), easing:easetype,
								complete:function() { 
									if (easetype.indexOf("Bounce")>=0 || easetype.indexOf("Elastic")>=0) {
										$(this).css({visibility:'hidden'});
									}
								}
							});
						} else if (nextcaption.hasClass('fade')) {
							nextcaption.transition({'opacity':0, duration:endspeed});
						} else if (nextcaption.hasClass("randomrotate")) {
							nextcaption.transition({opacity:0, scale:Math.random()*2+0.3, 'left':Math.random()*this.opt.width+'px','top':Math.random()*this.opt.height+"px", rotate:Math.random()*40, duration:endspeed, easing:easetype});
						}
						
						if (this.opt.ie) nextcaption.removeClass('noFilterClass');
					}
				}
				
			};
			
			//Create rotator
			var container = $(this);
			container.addClass("banner-rotator");
			container.css({visibility:"visible"});
			return this.each(function() {
				objRotator = new BannerRotator($(this), options);
			});
			
		},
		
		/************************
		    - API functions -
		************************/
		
		//Pause
		brPause:function(options) {
			return this.each(function() {
				var container = $(this);
				container.data('play', false);
				container.trigger('banner_rotator.onpause');
				container.parent().find('.play-btn').click();
			});
		},
		
		//Resume
		brResume:function(options) {
			return this.each(function() {
				var container = $(this);
				container.data('play', true);
				container.trigger('banner_rotator.onresume');
				container.parent().find('.play-btn').click();
			});
		},
		
		//Previous
		brPrev:function(options) {
			return this.each(function() {
				var container = $(this);
				container.parent().find('.previous-btn').click();
			});
		},
	
		//Next
		brNext:function(options) {
			return this.each(function() {
				var container = $(this);
				container.parent().find('.next-btn').click();
			});
		},
	
		//Length
		brMaxSlide:function(options) {
			return $(this).find('>ul:first-child >li').length;
		},
	
		//Jump to slide
		brShowSlide:function(slide) {
			return this.each(function() {
				var container = $(this);
				container.data('showslide', slide);
				container.parent().find('.next-btn').click();
			});
		},
		
		//Current slide
		brCurrentSlide:function() {
			var container = $(this);
			var opt = container.data('opt');
			return opt.currentItem;
		},
		
		//Last slide
		brLastSlide:function() {
			var container = $(this);
			var opt = container.data('opt');
			return opt.oldItem;
		},
		
		//Scroll Top
		brScroll:function(oy) {
			return this.each(function() {
				var container = $(this);
				$('body,html').animate({scrollTop:(container.offset().top+(container.find('>ul >li').height())-oy)+"px"}, {duration:400});
			});
		}
			
	});
	
	//Rotate patch
    var rotateUnits = 'deg';
    
    $.fn.rotate = function (val) {
        var style = $(this).css('transform') || 'none';
        if (typeof val=='undefined') {
            if (style) {
                var m = style.match(/rotate\(([^)]+)\)/);
                if (m && m[1]) {
                    return m[1];
                }
            }
            return 0;
        }
        var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m) {
            if (m[3]) rotateUnits = m[3];
            $(this).css('transform',
                style.replace(/none|rotate\([^)]*\)/, '') + 'rotate('+m[1]+rotateUnits+')'
            );
        }        
        return this;
    };
	
	$.fx.step.rotate = function (fx) {
        $(fx.elem).rotate(fx.now+rotateUnits);
    };
	
})(jQuery);