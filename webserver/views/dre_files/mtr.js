/* $Id: mtr.js 151720 2015-08-03 15:03:15Z shawn.gao $ */
/*! mtr 21-07-2015 */
!function(a){"use strict";"function"==typeof define&&define.amd?define("ecomm/utils",["jquery/nyt"],function(b){return a(b)}):"object"==typeof NYTD&&(NYTD.Ecomm=NYTD.Ecomm||{},NYTD.Ecomm.Utils=a(NYTD.jQuery||window.jQuery))}(function(a){var b={};return b.setCookie=function(a,b,c){var d=new Date;d.setTime(d.getTime()),c&&(c=1e3*c*60*60*24);var e=new Date(d.getTime()+c),f=a+"="+b+";path=/"+(c?";expires="+e.toGMTString():"")+";domain=.nytimes.com";document.cookie=f},b.getCookie=function(a){return new RegExp(a+"=([^;]+)","i").test(unescape(document.cookie))?RegExp.$1:null},b.setToLocalStorage=function(a,c){if(b.hasLocalStorage())try{window.localStorage.setItem(a,c)}catch(d){}},b.hasLocalStorage=function(){if(/MSIE 8.0/.test(navigator.userAgent))return!1;try{return"localStorage"in window&&null!==window.localStorage}catch(a){return!1}},b.getFromLocalStorage=function(a){try{return b.hasLocalStorage()&&window.localStorage.getItem(a)}catch(c){return null}},b.filterObject=function(b,c){var d={};return a.each(b,function(b,e){a.inArray(b,c)>-1&&(d[b]=e)}),d},b.parseUri=function(a){for(var c=b.parseUri.options,d=c.parser[c.strictMode?"strict":"loose"].exec(a),e={},f=14;f--;)e[c.key[f]]=d[f]||"";return e[c.q.name]={},e[c.key[12]].replace(c.q.parser,function(a,b,d){b&&(e[c.q.name][b]=d)}),e},b.parseUri.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},b.appendParamsToUrl=function(c,d){var e,f,g,h={};return c.indexOf("#")>-1&&(e=c.split("#"),c=e[0]),c.indexOf("?")>-1?(f=c.split("?"),g=f[0],h=b.parseUri(c).queryKey):g=c,h=a.extend({},h,d),g+"?"+a.param(h)+(e?"#"+e[1]:"")},b.updateQueryStringParameter=function(a,b,c){var d,e=new RegExp("([?|&])"+b+"=.*?(&|$)","i"),f=-1!==a.indexOf("?")?"&":"?";return d=a.match(e)?a.replace(e,"$1"+b+"="+c+"$2"):a+f+b+"="+c},b.getLink=function(a){return a.is("a")?a:a.parents("a").eq(0)},b.isHrefValid=function(a){var b=this.getLink(a).attr("href"),c=/^javascript:|^#|^mailto:/gim;return!b||b.match(c)?!1:!0},b.runWhenReady=function(a,b,c,d){d=d||5,setTimeout(function e(){a()?b():--d&&setTimeout(e,c)},c)},b.pageType=function(){var b=a("meta[name='PT']")[0];return b=b&&b.content||"",b.replace(/ /g,"")}(),b.isNYT5Env=function(){var a=document.getElementsByName("sourceApp"),b={"nyt-v5":!0,blogs:!0};return"undefined"!=typeof a[0]&&a[0].getAttribute("content")in b},b.parseAds=function(b){var c="",d="";return a.each(b.ads,function(a,b){b.campaign&&(c+=b.campaign),d+=b.creative}),{adxCampaigns:c,creatives:d}},b.appendAds=function(c,d){var e=b.parseAds(c);return d=d||a("body"),d.append(e.creatives),e.adxCampaigns},b.debounce=function(a,b){var c=null;return function(){var d=this,e=arguments;clearTimeout(c),c=setTimeout(function(){a.apply(d,e)},b)}},b.isSlideShowApp=function(){return a("html").hasClass("app-slideshow")},b}),function(a){"use strict";"function"==typeof define&&define.amd?define("ecomm/etTracker",["jquery/nyt","ecomm/utils"],function(b,c){return a(b,c)}):"object"==typeof NYTD&&(NYTD.Ecomm=NYTD.Ecomm||{},NYTD.Ecomm.EtTracker=a(NYTD.jQuery||window.jQuery,NYTD.Ecomm.Utils))}(function(a,b){function c(c){this.$container=c.$container,this.module=c.module,this.region=c.region,this.meterCount=c.meterCount||d(),this.adxCampaignName=c.adxCampaignName||"",this.moduleInteractions=[{selector:".login-modal-trigger",tagxEvent:"login-click",action:"click",etParamKey:"modalLogin"},{selector:".registration-modal-trigger",tagxEvent:"regi-click",action:"click",etParamKey:"modalRegi"}],this.trackingParams={common:{version:"meter at "+this.meterCount,module:this.module,pgtype:b.pageType,region:this.region,contentId:this.adxCampaignName,mediaId:this.getMediaId(),referrer:document.referrer,priority:!0},load:{action:"Impression",eventName:"Impression"},close:{action:"click",eventName:"Dismiss"+this.module},modalRegi:{module:this.module+"-Regi",action:"click",eventName:"regi-click"},modalLogin:{module:this.module+"-Login",action:"click",eventName:"login-click"},links:{module:this.module+"-Links",action:"click",contentCollection:this.module.toLowerCase()+"-links-click"}},this.moduleInteractions=this.moduleInteractions.concat(c.moduleInteractions||[]),this.trackingParams=a.extend(!0,{},this.trackingParams,c.trackingParams),this.skipAnchorTracking=c.skipAnchorTracking||!1,this.init()}var d=function(){if(!d.ret){var a=b.getCookie("nyt-m")||b.getFromLocalStorage("nyt-m")||window.name||"",c=a.match(/v=i.([0-9]+)/);d.ret=c&&c[1]?parseInt(c[1],10):null}return d.ret};return c.prototype={init:function(){var b=this;this.sendViaTagx(this.module.toLowerCase()+"-load",a.extend({},this.trackingParams.common,this.trackingParams.load),"impression"),this.skipAnchorTracking||this.setAnchorTracking(),this.setupModuleInteractions(),a(document).on(this.module+".updateAnchorETParams",function(){b.addAnchorTracking.call(b,b.$container,b.trackingParams)})},getMediaId:function(){function b(a){return a&&""!==a}var c=a.trim(this.$container.find(".adxInfo").text()),d="";return b(c)&&(d=c.replace(/.*creative: ([^,]*).*/,"$1"),b(d)&&(d=d.indexOf(" -- ")?a.trim(d.split(" -- ")[0]):d)),d},setupModuleInteractions:function(){var a,b,c,d=this.moduleInteractions,e={};for(a=0;a<d.length;a++)b=d[a],"click"===b.action?(e.mouseup=1,this.moduleInteractions[a].action="mouseup"):e[b.action]=1;for(c in e)e.hasOwnProperty(c)&&this._listenTo(c)},_listenTo:function(b){a(this.$container).on(b,a.proxy(this._handle,this))},_isSelector:function(a,b){return a.is(b)||!!a.parents(b).length},_handle:function(c){var d,e,f,g,h;for(d=0;d<this.moduleInteractions.length;d++)e=this.moduleInteractions[d],f=a(c.target),this._isSelector(f,e.selector)&&e.action===c.type&&(g=3===c.which,g||(h=b.filterObject(f.data(),["contentCollection","contentPlacement"]),this.track(e.tagxEvent,e.etParamKey),e.callback&&"function"==typeof e.callback&&e.callback(c)))},setAnchorTracking:function(){var b=this;this.addAnchorTracking(this.$container,this.trackingParams),a(document).on(this.module+".updateAnchorETParams",function(){b.addAnchorTracking.call(b,b.$container,b.trackingParams)})},track:function(b,c,d){var e,f=this.trackingParams;e=a.extend({},f.common,f[c],d||{}),this.sendViaTagx(b,e,"interaction")},processUrlHref:function(a,c){var d,e,f=a.attr("href");!f||f.match(/^javascript:/i)||f.match(/^mailto:/i)||f.match(/^tel:/i)||f.match("#")||(e=f.match("[?|&]goto=([^;]+)"),d=e&&e[1]||null,d?(d=decodeURIComponent(d),d=encodeURIComponent(decodeURIComponent(b.appendParamsToUrl(d,c))),f=b.updateQueryStringParameter(f,"goto",d)):f=b.appendParamsToUrl(f,c),a.attr("href",f))},sendViaTagx:function(a,c,d){b.runWhenReady(function(){return"TAGX"in window},function(){TAGX.EventProxy.trigger(a,c,d)},1e3,10)},addAnchorTracking:function(c,d){var e=this,f=function(c,f){var g=a(f),h=d;if(b.isHrefValid(g)){var i=b.filterObject(g.data(),["contentCollection","contentPlacement"]),j=a.extend({},h.common,h.links,i);e.processUrlHref(g,j)}};c.find("a").each(f)}},c}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("auth/gateway/creatives",["jquery/nyt"],function(a){return b(a)}):"object"==typeof a.NYTD&&(NYTD.GatewayCreatives=b(NYTD.jQuery||window.jQuery))}(this,function(a){return{defaultPayCreative:['<div style="color: #000 !important; text-align: left !important; padding: 10px 10px 10px 15px; border: 5px solid #8f8c89 ; width: 751px ; margin: 0 auto ; height: 375px ; background: #ffffff ; -moz-border-radius: .8em !important; -webkit-border-radius: .8em !important; border-radius: .8em !important;">',"<div>",'<p style="font-family: georgia, verdana, serif !important; font-size: 27px !important; font-weight: bold !important; font-style: normal !important; margin: 10px 0 0 0; line-height: 130% !important;">',"Thank you for visiting NYTimes.com","</p>","</div>","<div>",'<div style="width: 460px; margin-right: 5px; float: left;">','<p style="font-family: georgia, verdana, serif !important; font-style: normal !important; margin: 22px 0 0 0; font-size: 15px !important; line-height: 140% !important;">',"If you are already a subscriber ",'<a class="sitewideLogInModal login-modal-trigger" style="color: #blue; text-decoration: underline; color: #002c5e; cursor:pointer;" id="NYTDGWY_login" href="https://myaccount.nytimes.com/auth/login">log in here</a>.',"</p>",'<p style="font-family: georgia, verdana, serif !important; font-style: normal !important; margin: 22px 0 0 0; font-size: 15px !important; line-height: 140% !important;">',"To see subscription options ",'<a data-content-collection="GWtoDSLP"  data-content-placement="1" style="color: #blue; text-decoration: underline; color: #002c5e; cursor:pointer;" id="NYTDGWY_LP" href="http://www.nytimes.com/subscriptions/Multiproduct/lp87JHJ.html?campaignId=44U9H">click here</a>.',"</p>","</div>",'<div style="width: 280px; float: left; margin: 35px 0 0 0;">','<img src="http://graphics8.nytimes.com/subscriptions/gateway/gw1/img/devices-white.jpg" alt="" width="280" height="150" alt="The New York Times Digital Platforms"/>',"</div>",'<div style="clear: both; margin: 0; padding-top: 10px;">','<div style="float: right; width: 220px; text-align: right;">','<img src="http://graphics8.nytimes.com/subscriptions/gateway/gw1/img/nyt-logo-white.gif" alt="The New York Times" width="195" height="31"/>',"</div>","</div>",'<div style="position: absolute;bottom: 20px;">','<p style="font-family: georgia, verdana, serif !important; font-style: normal !important; margin: 22px 0 0 0; font-size: 15px !important; line-height: 140% !important;">',"For questions about your account, contact Customer Care at ",'<a style="color: #blue; text-decoration: underline; color: #002c5e; cursor:pointer;" href="tel:18005919233">1-800-591‑9233</a>.',"</p>","</div>","</div>","</div>"].join("\n"),render:function(){a("#gatewayUnit").html(this.defaultPayCreative)}}}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("auth/gateway",["jquery/nyt","auth/gateway/creatives","ecomm/utils","ecomm/etTracker"],function(a,c,d,e){return b(a,c,d,"NYT5",e)}):"object"==typeof a.NYTD&&(NYTD.Gateway=b(NYTD.jQuery||window.jQuery,NYTD.GatewayCreatives,NYTD.Ecomm.Utils,"NYT4",NYTD.Ecomm.EtTracker))}(this,function(a,b,c,d,e){return function(f,g){function h(){var b,c=s();return b=null===c.offset()?"70%":a(window).height()-(c.offset().top+c.outerHeight(!0))}var i,j,k=window.location.host.indexOf(".stg.")>0,l="http://www.nytimes.com",m=k?"http://static.stg.nytimes.com":"http://graphics8.nytimes.com",n="pay",o=c.isSlideShowApp();"NYT5"!==d||o?("NYT4"===d||o)&&(i=['<div id="overlay" style="',"z-index:1000;","background: transparent;","background:-moz-linear-gradient(center bottom , #000, transparent);","background:-ms-linear-gradient(top, transparent, black);","background: -webkit-gradient(linear, left bottom, left top, from(#000), to(transparent));","filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000010', endColorstr='#000000');",'position:fixed; width:100%; height:0px; bottom:0; left:0; display: none">',"</div>"].join("")):i=['<div id="overlay" class="z-index-gateway-overlay" style="',"visibility: visible;","background: transparent;","background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjQiLz4KICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJ1cmwoI2dyYWQtdWNnZy1nZW5lcmF0ZWQpIiAvPgo8L3N2Zz4=);","background: -moz-linear-gradient(top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 100%); /* FF3.6+ */","background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,255,0.4)), color-stop(100%,rgba(255,255,255,1))); /* Chrome,Safari4+ */","background: -webkit-linear-gradient(top, rgba(255,255,255,0.4) 0%,rgba(255,255,255,1) 100%); /* Chrome10+,Safari5.1+ */","background: -o-linear-gradient(top, rgba(255,255,255,0.4) 0%,rgba(255,255,255,1) 100%); /* Opera 11.10+ */","background: -ms-linear-gradient(top, rgba(255,255,255,0.4) 0%,rgba(255,255,255,1) 100%); /* IE10+ */","background: linear-gradient(to bottom, rgba(255,255,255,0.4) 0%,rgba(255,255,255,1) 100%); /* W3C */","filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#66ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-8 */",'position:fixed; width:100%; height:0px; bottom:0; left:0; display: none">',"</div>"].join("");var p=function(){t(i,function(){var b=void 0!==document.body.style.webkitTransition||void 0!==document.body.style.MozTransition||void 0!==document.body.style.OTransition||void 0!==document.body.style.msTransition,c=function(){a("#overlay").css("height",h())};a(window).on("resize",function(){c()}),b||a("#overlay").css("background-image","url("+m+"/images/global/backgrounds/transparentBG.gif)"),c()})},q=unescape(document.cookie).match("NYT-Edition=([^;]+)"),r=function(){return f===n?q&&"edition|GLOBAL"==q[1]?g&&""!==g?"gateway-global_"+g+".nytimes.com":"gateway-global.nytimes.com":g&&""!==g?"gateway_"+g+".nytimes.com":"gateway.nytimes.com":q&&"edition|GLOBAL"==q[1]?"regiwall-global.nytimes.com":"regiwall.nytimes.com"},s=function(){var b=a(".gateway-anchor").first(),c=a("#masthead"),d=a("#slideshow-header"),e=c.find(".container").first(),f=a(".navigation").first(),g=f.next(".subNavigation");return b.length>0?b:e.length>0?e:d.length>0?d:g.length>0?g:f.length>0?f:c.length>0?c:a(document.body)},t=function(b,c){return document.body&&document.body.firstChild?(a("body").append(b),void(c&&c())):void setTimeout(function(){t(b,c)},100)},u=function(){var f,g=5e3,h=!1,i=function(a){var b;if(clearTimeout(f),!h){if(!a||!a.ads||"object"!=typeof a.ads.Gateway)return k();window.NYTD=window.NYTD||{},NYTD.Gateway=NYTD.Gateway||{},NYTD.Gateway.etAdxInfo={},b=c.parseAds(a),m(b.creatives,b.adxCampaigns)}},k=function(){clearTimeout(f),h=!0,m(b.defaultPayCreative)},m=function(b,c){p();var f="width:100%; position:fixed; bottom: 80px; display: none; left:0;";"NYT4"===d&&(f+=" z-index: 1000000040;"),b=['<div id="gatewayCreative" class="z-index-gateway-overlay" style="'+f+'">','<div id="gatewayUnit" style="position:relative">'].concat(b).concat(["</div>","</div>"]).join(""),t(b,function(){setTimeout(function(){var b=a("#gatewayCreative"),d={$container:b,module:"Gateway",region:"FixedCenter",trackingParams:{common:{contentId:c}}};j=new e(d),a("#overlay").fadeIn(),b.fadeIn()},200)})};a.ajax({url:l+"/adx/bin/adxrun.html?v=3&jsonp=?",dataType:"jsonp",data:{page:r(),positions:"Gateway,data_country,data1,data2,data3"},success:i}),f=setTimeout(k,g)},v=function(){var b=function(){c(),e(),d()},c=function(){window.scroll(0,0),a("body").css({overflow:"hidden",margin:"0 0 85px 0","padding-right":"15px"}),a("html").css({overflow:"hidden"}),a(document).off("keypress keydown keyup touchmove"),a(document).on("keypress keydown keyup",function(a){return a.keyCode in{37:"LEFT",38:"UP",39:"RIGHT",40:"DOWN",36:"HOME",35:"END",33:"PAGEUP",34:"PAGEDOWN"}?(a.preventDefault(),!1):void 0}),a(document).on("touchmove",function(a){a.preventDefault()}),window.Event&&"function"==typeof Event.stopObserving&&(Event.stopObserving(document,"keydown"),Event.stopObserving(document,"keyup"),Event.stopObserving(document,"keypress"),Event.stopObserving(window,"keydown"),Event.stopObserving(window,"keyup"),Event.stopObserving(window,"keypress"))},d=function(){a(["#article .articleInline","#article #readerscomment","#article .articleFooter","#article .authorIdentification","#article #articleExtras","#article .articleBottomExtra","#article .emailAlertModule","#article #pageLinks","#twitter-widget-0",".videoplayerContainer","iframe",".slideShowModule","#subscribeCallToAction","#story figure"].join(",")).not("figure.layout-horizontal-full-bleed").remove(),a(["#article .articleBody p","#content .entry-content p","#content .postContent p","#story .story-body-text"].join(",")).each(function(b,c){var d=1;if(c=a(c),0===b){var e=c.html();e.length&&e.length<400&&(d=2)}if(b==d){var f=a('<p id="subscribeCallToAction" style="text-align: center; margin-top: 28px; font-family: arial,helvetica,sans-serif; font-size: 1.2em; font-weight: bold;"><a  data-content-collection="GWtoDSLP" data-content-placement="1" class="applicationButtonLt" href="http://www.nytimes.com/articlegate" style="width: 250px; padding: 7px 25px !important; font-weight: bold; color: #004276; text-decoration: none"><span>To see the full article, subscribe here.</span></a></p>');f.insertAfter(c)}else b>d&&c.remove()})},e=function(){a("script").each(function(){return a(this).attr("src")&&a(this).attr("src").toLowerCase().indexOf("euri.ca")>0?(f("NYTClean"),window.location.reload(),!1):void 0})},f=function(a){};b(),setInterval(b,1e3)};v(),u()}}),function(a,b){"use strict";"function"==typeof define&&define.amd?define("auth/gateway-d",["jquery/nyt","ecomm/utils","ecomm/etTracker"],function(a,c,d){return b(a,c,d)}):"object"==typeof a.NYTD&&(NYTD.DismissibleGW=b(NYTD.jQuery||window.jQuery,NYTD.Ecomm.Utils,NYTD.Ecomm.EtTracker))}(this,function(a,b,c){return function(b){a.ajax({url:"http://www.nytimes.com/adx/bin/adxrun.html?v=3&jsonp=?",dataType:"jsonp",data:{page:"softwall.nytimes.com",positions:"Gateway"},success:function(d){var e,f,g,h="";d&&d.ads&&(window.NYTD=window.NYTD||{},NYTD.Gateway=NYTD.Gateway||{},NYTD.Gateway.etAdxInfo={},a.each(d.ads,function(a,b){b.campaign&&(g=b.campaign),h+=b.creative}),a(function(){var d=['<div id="gateway-d">',h,"</div>"].join("");a("body").append(d),f=a("#gateway-d"),e=new c({$container:f,module:"DismissibleGateway",adxCampaignName:g,region:"FixedCenter",meterCount:b.pageCount,anchorPrefix:"dgateway-",moduleInteractions:[{selector:".gw-modal-close",action:"click",tagxEvent:"gateway-dismiss",etParamKey:"close",callback:function(){f.fadeOut(100)}}]})}))}})}}),function(a){"use strict";if("function"==typeof define&&define.amd)define(["jquery/nyt","auth/gateway","auth/gateway-d","ecomm/utils"],function(b,c,d,e){return a(b,c,d,e)});else if("object"==typeof NYTD){var b=NYTD;b.Meter=a(b.jQuery||window.jQuery,b.Gateway,b.DismissibleGW,b.Ecomm.Utils)}}(function(a,b,c,d){"use strict";function e(){var a=document.getElementsByName("PST")[0],b=document.getElementsByTagName("title")[0],c=!1;return b&&b.innerHTML&&(c=new RegExp("Page Not Found|Page unavailable","i").test(b.innerHTML)),a&&a.content&&a.content.match(/error/i)||c}var f,g,h,i,j=window.location.host.indexOf(".stg.")>0,k=j?"http://static.stg.nytimes.com":"http://graphics8.nytimes.com",l="//meter-svc.nytimes.com/meter-echo.js?callback=?",m="//meter-svc.nytimes.com/meter.js?callback=?",n=k+"/js/gwy.js",o=[],p={loaded:!1},q=function(){r(),setTimeout(function(){E(i)},1500)},r=function(){a.ajax({dataType:"jsonp",url:l,jsonpCallback:"NYT_meterBackupCallback"})},s=function(a){a&&(d.getCookie("nyt-m")||a&&a["nyt-m"]&&d.setCookie("nyt-m",a["nyt-m"],730))};window.NYT_meterBackupCallback=s;var t=function(){window.location.replace(window.location.href.replace(/(\?|&)gwh=([^&]+)/g,"").replace(/(\?|&)gwt=([^&]+)/g,""))},u=function(a,b,c,d){var e,f,g,h;g=b?"pay":"regi",e=unescape(window.location.href).split("#"),e=e.length>1?"#"+e[1]:null,h=d?"&assetType="+d:"",a="gwh="+a+"&gwt="+g+h,f=window.location.search?window.location.href+"&"+a:window.location.href+"?"+a,f=e?f.replace(e,"")+e:f,window.location.replace(f)},v=function(){var a=d.getCookie("nyt-m")||d.getFromLocalStorage("nyt-m")||window.name||"";return d.setCookie("nyt-m",a,730),w(a),a},w=function(a){d.setToLocalStorage("nyt-m",a),window.name=a},x=function(){return v().substr(0,32)},y=function(){var a=/gwt=([^&]+)/.test(unescape(window.location.search.substring(1)))?RegExp.$1:"";return"regi"===a?"regi":"pay"},z=function(){return/gwh=([^&]+)/.test(unescape(window.location.search.substring(1)))?RegExp.$1:""},A=function(){var a=v().match(/v=i.([0-9]+)/);return a&&a[1]?parseInt(a[1],10):null},B=function(){return window.location.href.replace(/\b\?.+/g,"").replace(/\b\#.+/g,"")},C=function(a){return 27===a.keyCode?(a.preventDefault(),!1):void 0},D=function(){var a=B(window.location.href);h!=a&&(E({url:window.location.href,referrer:h}),h=a)},E=function(b){var e=[d.getFromLocalStorage("nyt-m"),window.name],f=function(b){var g=b.url||window.location.href,h=null===b.referrer||void 0===b.referrer?window.location.href:b.referrer;b.callback&&o.push(b.callback);var i,j=a("meta").filter('[name="channels"]').attr("content"),k="";"undefined"!=typeof j&&(k="&channels="+j),i=m+k,a.ajax({dataType:"jsonp",url:i,data:{url:g,referer:h},success:function(h){function i(b){var c=a(document);p.loaded=!0,p["final"]=!0,p.meterOn=b.meter,p.gatewayOn=b.gateway,p.hitPaypall=b.hitPaypall,p.hitRegiwall=b.hitRegiwall,p.cookieValid=b.isCookieValid,p.isLoggedIn=b.loggedIn,p.pageCount=k,p.url=g,p.assetType=j,p.counted=b.counted,b.loggedIn&&a("html").addClass("user-logged-in"),a.each(o,function(a,b){b(p)}),o=[],c.trigger("NYTD:MeterLoaded",p),c.trigger("NYTD:MeterFinal",p),c.off("keydown",C)}var j,k=A();return h.isCookieValid===!1&&e.length>0?(d.setCookie("nyt-m",e.pop(),730),void f(b)):(h.assetType&&(j=h.assetType),r(),a("head").append('<meta name="WT.z_cad" content="'+(h.counted?"1":"0")+'" /> '),h.hitSoftPaywall?(c(p),void i(h)):h.hitPaywall||h.hitRegiwall?void u(h.hash,h.hitPaywall,h.hitRegiwall,j):void i(h))}})};a(document).on("keydown",C),b=b||{},p.loaded=!1,f(b)},F=function(){var c=/&assetType=([^&]+)/.test(unescape(window.location.search.substring(1)))?RegExp.$1:"";p["final"]=!0,a(document).trigger("NYTD:MeterFinal",p),r(),b?new b(y(),c):a.ajax({url:n,dataType:"script",success:function(){new NYTD.Gateway(y(),c)}})},G=function(){d.isNYT5Env()||a.ajax({dataType:"jsonp",url:m,data:{url:window.location.href},success:function(b){b.loggedIn&&a("html").addClass("user-logged-in")}})};return a(document).on("popstate",D),h=B(window.location.href),f=z(),g=x(),i={url:window.location.href,referrer:document.referrer},e()?void a(document).off("keydown",C):(v()?f?f&&!g||f!==g?t():f&&g&&f===g&&(F(),G()):E(i):q(),p.check=E,p)}),function(a,b){"use strict";"function"==typeof define&&define.amd?(define("ecomm/growl",["foundation/hosts","jquery/nyt","auth/mtr","foundation/views/page-manager","ecomm/utils","ecomm/etTracker"],function(a,c,d,e,f,g){return b(a,c,d,e,f,g)}),setTimeout(function(){require(["ecomm/growl"])},0)):"object"==typeof a.NYTD&&(NYTD.AuthGrowl=b(NYTD.Hosts,NYTD.jQuery,NYTD.Meter,void 0,NYTD.Ecomm.Utils,NYTD.Ecomm.EtTracker))}(this,function(a,b,c,d,e,f){"use strict";var g={},h=a.www||a.wwwHost;g.close=function(a){g&&g.container&&(g.container.fadeOut("slow",function(){g&&g.container&&(g.container.unbind("click"),g.container.remove())}),a&&a.preventDefault())};var i=function(){var a=document.cookie.match(/v=i.([0-9]+)/);return a?a[1]:void 0},j=function(){var a=b("#growlCampaignScript"),c=a.attr("data-keywords");c=c&&c.length>0?c:"";var d=a.attr("data-query");return d=d&&d.length>0?d:"",{keywords:c,query:d}},k=function(a){var c=j(),k=a.assetType,l="www.nytimes.com/growl",m=k&&""!==k?l+"_"+k:l;g.close(),a.gatewayOn!==!1&&a.meterOn!==!1&&a.counted!==!1&&b.getJSON(h+"/adx/bin/adxrun.html?v=3&jsonp=?&keywords="+c.keywords+"&page="+m+"&type=fastscript&positions=Left9,data_country,data1,data2,data3&query="+c.query,function(c){function h(){var a=b("#masthead"),c=a.length?a.offset().left:0,d=g.container.find("#growl-container");c>0?d.css({left:c}):d.removeAttr("style")}function j(a){var b=a.match(/growl/i);return b&&b.length>0}function k(a){var b=a.match(/interstitial/i);return b&&b.length>0}var l=a.pageCount;if(c&&c.ads&&l==i()){var m=b("body");if(c.ads.Left9&&m){var n,o,p=b("meta[name='PT']").attr("content");p=p?p.replace(/\s/g,""):"Article",g.container&&g.container.off("click").remove(),g.container=b("<div class='mtr-growl-container'></div>"),o=e.appendAds(c,g.container),m.append(g.container);var q=g.container;d&&(h(),d.listenTo(d,"nyt:page-resize",h),d.listenTo(d,"nyt:page-ready",h));var r=j(o),s=k(o);r?(n=new f({$container:q,module:"Growl",region:"FixedBottom",adxCampaignName:o,meterCount:l,trackingParams:{expand:{eventName:"adExpansion",action:"hover"}},moduleInteractions:[{selector:".nytdGrowlNotifyCross",action:"click",tagxEvent:"growl-close",etParamKey:"close",callback:g.close}]}),q.on("growl.expandable",function(){q.on("mouseenter",e.debounce(function(){n.track("growl-expand","expand")},300)).off("growl.expandable")})):s&&(n=new f({$container:q,module:"Interstitial",region:"FixedCenter",pgtype:p,adxCampaignName:o,meterCount:l,moduleInteractions:[{selector:".nytdGrowlNotifyCross",action:"click",tagxEvent:"interstitial-close",etParamKey:"close",callback:g.close}]})),b(document).trigger("NYTD:AuthGrowlLoaded",{count:l})}}})};return b(document).on("NYTD:MeterLoaded",function(a,b){k(b)}),c&&c.loaded&&k(c),g.addGrowl=k,g});