// <!-- go top -->
// <div class="go_top" title="返回顶部"><a href="javascript:;">返回顶部</a></div>
// <script type="text/javascript">
//返回顶部
$(function(){
	//首先将#back-to-top隐藏
	$(".go_top").hide();
	//当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
	$(function () {
		$(window).scroll(function(){
			if ($(window).scrollTop()>100){
				$(".go_top").fadeIn(700);
			}
			else
			{
				$(".go_top").fadeOut(700);
			}
		});
		//当点击跳转链接后，回到页面顶部位置
		$(".go_top").click(function(){
			$('body,html').animate({scrollTop:0},1000);
			return false;
		});
	});
});
// </script>
// <!-- end go top -->