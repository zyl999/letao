/**
 * Created by Administrator on 2017/11/22.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
 function render(){

   $.ajax({
     type:'get',
     url:'/category/querySecondCategoryPaging',
     data:{
       page:currentPage,
       pageSize:pageSize
     },
     success:function(data){
       console.log(data);
       //渲染页面
       $('tbody').html(template('tpl',data));

       
       //渲染页码
       $('#pagintor').bootstrapPaginator({
         bootstrapMajorVersion:3,
         currentPage:currentPage,
         totalPages:Math.ceil(data.total/pageSize),
         //点击每一页执行此函数
         onPageClicked:function(a,b,c,page) {
           currentPage = page;
           render();
         }
       })
     }
   })
 }
 render();
  //添加分类的功能
  $('.btn_add').on('click',function(){
    // console.log(111)
    $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        // console.log(info)
        var html=template('addTpl',info);
        $('.dropdown-menu').html(html);
      }
    })
  })
  
  //给每个一级菜单的a标签添加点击事件，（动态生成的所以用委托事件）
  $('.dropdown-menu').on('click','a',function(){
    $('.dropdown_text').text($(this).text());
    //设置隐藏域的值为了更新数据上传categoryId值，用表单
    $('.categoryIdHidden').val($(this).data('id'))
  })
  $('#fileupload').on('click',function(){
    $('#fileupload').fileupload({
      dataType:'json',//指定传输数据的类型
      //图片上传成功的回调函数；参数一：事件对象，参数二返回的数据
      done:function(e,data){
        // console.log(data);
        // 可以通过data.result.picAddr,获取后台返回的图片地址
        var pic=data.result.picAddr;
        //改变图片的路径
        $('.pic_box img').attr('src',pic);
        //将图片的地址上传到后台
        $('.brandLogal').val(pic);
      }
    })
  })
  
  //进行表单校验，若成功就发送ajax请求
  var $form = $("form");
  $form.bootstrapValidator({
    excluded: [],//不校验的内容
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //校验规则
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传品牌图片"
          }
        }
      }
    }
  });
  $("#form").on('success.form.bv', function (e) {
    console.log($form.serialize())
    e.preventDefault();
    
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $form.serialize(),
      success:function(info){
      if(info.success){
        $('#addModal').modal('hide');
        //更新第一页
        render();
        
        //表单和和样式重置
        $form[0].reset();
        $form.data('bootstrapValidator').resetForm();
        //让一级菜单恢复默认，让图片恢复到默认
        $('.pic_box img').attr('src','images/none.png');
        $('.dropdown_text').html('一级菜单');
      }
      }
    })
   
  })
})