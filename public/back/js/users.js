/**
 * Created by Administrator on 2017/11/22.
 */
// 发送ajax请求
$(function(){
  //定义当前页，和每页显示几条数据
  
  var currentPage=1;
  var pageSize=5;
  //由于页面需要多次发送请求渲染，所以需要封装
  function render() {
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(data){
        // console.log(data);
        
        //渲染页面
        var html=template('tpl',data)
        $('tbody').html(html);
        
        //渲染分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion:3, //指定的版本号，若为2 则需要有div来装分页，3版本用ul
          currentPage:currentPage,//当前页数
          totalPages:Math.ceil(data.total/pageSize),
          //为页码绑定点击事件，四个参数，第四个参数是当前页，主要
          onPageClicked:function(a,b,c,page){
             // console.log(page);
            //没点击一页就重新渲染页面
            currentPage=page;
            render();
          }
        })
      }
    })
  }
 
  render();
  
  
  //给按钮注册点击事件 动态渲染的所以用委托事件
  $('tbody').on('click','button',function(){
    //点击显示模态框
    if($(this).hasClass('btn-danger')){
      $('#btnModal').find('strong').text('禁用');
    }
    else {
      $('#btnModal').find('strong').text('启用');
    }
    
    var userId=$(this).parent().data('id');
    var isDelete=$(this).hasClass('btn-danger')?0:1;
    // console.log(userId)
    //显示模态框
    $('#btnModal').modal('show');
    //给模态框注册事件之前先解绑以前的在重新绑定一次，保证每次只绑定一次
    $('.btn-confirm').off().on('click',function(){
      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:userId,
          isDelete:isDelete
        },
        success:function(data){
          if(data.success){
            //模态框隐藏
            $('#btnModal').modal('hide');
            //重新渲染页面
            render()
          }
        }
      })
    })
    
   
  });
  
});