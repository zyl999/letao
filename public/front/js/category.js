/**
 * Created by HUCC on 2017/11/24.
 */
$(function(){
  //发送ajax请求，获取一级分类列表
  $.ajax({
    type:"get",
    url:"/category/queryTopCategory",
    success:function(info){
      // console.log(info);
      console.log($('.mui-scroll'))
      $('.lt_category_l .mui-scroll').html(template('categoryModal',info));
      //刚进入页面时渲染第0行的品牌
      rightRender(info.rows[0].id)
    }
  })
  
  //渲染右边栏
  function rightRender(id){
    $.ajax({
      type:'get',
      url:"/category/querySecondCategory",
      data:{
        id:id
      },
      success:function(info){
        $('.lt_category_r .mui-scroll').html(template('rightModel',info))
      }
    })
  }
  
  //动态g给 a注册点击事件
$( ".lt_category_l .mui-scroll").on('click','li',function(){
   $(this).addClass('now').siblings().removeClass('now');
  var id = $(this).data("id");
  rightRender(id);
  //让右边的区域滚动滚回 0，0
  mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,500);//100毫秒滚动到顶2
  })
})