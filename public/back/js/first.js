/**
 * Created by Administrator on 2017/11/22.
 */
$(function(){
  //定义当前页，定义每页显示的条数
  var currentPage=1;
  var pageSize=5;
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(data){
        // console.log(data);
        //渲染页面
        $('tbody').html(template('tpl',data))
        //渲染页码
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:currentPage,
          totalPages:Math.ceil(data.total/pageSize),
          //点击每一页执行此函数
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        })
      }
    })
  }
  render();
  
  //给添加分类注册点击事件
  $('.btn_add').on('click',function(){
    // console.log(11);
    $('#addModal').modal('show');
    
    
  })
  
  //进行表单校验
  // console.log($('#form'))
  var $form = $("form")
  $form.bootstrapValidator({
    // 校验返回的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
   fields:{
     //校验的name
     categoryName:{
       validators: {
         //不能为空
         notEmpty: {
           message: '用户名不能为空'
         },
       }
     }
   }
  });
  $form.on('success.form.bv',function(e){
    console.log(111);
    //阻止表单的默认事件
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      success:function(data){
        if(data.success){
          //隐藏模态框
          $('#addModal').modal('hide');
          //添加用户,渲染第一页
          currentPage=1;
          render();
          
          //把模态框的样式和内容重置
          //用dom方法reset()方法可以实现表单的内容重置和 input type="reset"一样
          //调用 检验实例对象的fesetForm()可以重置样式
          // $('#form').data('bootstrapValidator')表单实例对象
          $('#form').data('bootstrapValidator').resetForm();
          $('#form')[0].reset();
        }
      }
    })
  })
})