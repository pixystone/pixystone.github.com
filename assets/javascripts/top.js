// <!-- go top -->
// <div class="go_top" title="返回顶部"><a href="javascript:;">返回顶部</a></div>
// <script type="text/javascript">
//返回顶部
$(function(){
	var btn = $('.go_top').hide().attr('hideFocus', true);
	if(!btn.length) return;
	var 
	timer,
	offset = 0,
	state = 'init',
	win = $(window),
	DOC = $(document),
	docEl = $('body,html');
	function getMaxHeight(){
		return DOC.height() - win.height() - offset;
	}
	function _check(){
		if(state !== 'playing'){
			var top = win.scrollTop();
			btn[top <= 300 || top > getMaxHeight() ? 'hide' : 'show']();
		}
	}
	function checkFn(){
		clearTimeout(timer);
		timer = setTimeout(_check, 160);
	}
	win.scroll(_check);
	btn.click(function(){
		state = 'playing';
		docEl.animate({ scrollTop: 0}, 720, function(){ state = 'ready';});
		btn.hide();
	});
	setTimeout(function(){ _check();}, 320);
	//FIX IE6
	!+[1,] && !window.XMLHttpRequest && win.scroll(function(){ btn.stop().animate({top:win.scrollTop() + win.height() * 0.8}, 320);});
});
// </script>
// <!-- end go top -->