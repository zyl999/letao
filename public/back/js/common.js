/**
 * Created by HUCC on 2017/11/21.
 */
//公共js功能
//1:进度条写在公共样式里，每个页面都需要进度条，公共样式在ajax请求开始，到ajax数据响应回来结束

$(function(){
  //固定写法 给doucument 或window添加
  // ajax六个全局事件第用法
//   1. ajaxStart在开始一个ajax请求时触发
//
// //beforeSend回调函数
//   2. ajaxSend在beforeSend回调函数之后触发
//
// //success回调函数
//   3. ajaxSuccess在success回调函数之后触发
//
// //error
//   4. ajaxError在error回调函数之后触发
//
// //complete
//   5. ajaxComplete在complete回调函数之后触发
//
//   6. ajaxStop在ajax请求结束时触发
  $(document).ajaxStart(function () {
    //请求开始时开启进度条
    NProgress.start();
  });
  $(window).ajaxStop(function(){
    //ajax请求结束时关闭进度条
    
    //因为服务器在本地，所以请求时间比较短，等500ms之后在关闭进度条（模拟远程服务器的响应时间）
    setTimeout(function(){
      NProgress.done()
    },500)
 
  })
  
  //每个页面登陆之前要判断是否登陆过，若没登陆就进行登陆
  //通过判断输入的地址栏中是否含有login.html字符串的索引，若没有则证明不是登陆也
  if(location.href.indexOf('login.html')==-1){
    //若不是登陆也发送ajax请求，发送登陆请求
    $.ajax({
      type:'get',
      url:'/employee/checkRootLogin',
      success:function(data){
        console.log(data);
        if(data.error === 400){
          //说明用户没有登录，跳转到登录页面
          location.href = "login.html";
        }
      }
    });
  }
  
  //侧边栏的点击高亮
  
  //公共侧边栏样式是公共的
  //二级菜单显示隐藏
 $('.child').prev().on('click',function(){
   $(this).next().slideToggle();
 });
  $('.icon_menu').on('click',function(){
    $('.it_aside').toggleClass('now');
    $('.it_body').toggleClass('now');
  })
  
  //退出
  $('.icon-logout').on('click',function(){
    //点击推出按钮出现模态提示框
    $("#logoutModal").modal("show");
  })
  
  //点击退出的确定按钮发送ajax请求，清除session 在返回登陆也重新登录
  $('.certain').on('click',function(){
    //不用设置dataType:json;因为后端返回的数据是json
    console.log(111)
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      success:function(data){
         if(data.success){
           location.href="login.html"
         }
      }
    })
  })
})