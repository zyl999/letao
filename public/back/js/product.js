/**
 * Created by Administrator on 2017/11/24.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
  function render(){
    $.ajax({
      type:'get',
      url:"/product/queryProductDetailList",
      data:{
        page:currentPage,
        pageSize:pageSize
      },
    success:function(info){
      //动态渲染页面
      $("tbody").html(template("tpl", info));
      //动态渲染页码
      $('#pagintor').bootstrapPaginator({
        bootstrapMajorVersion:3,
        currentPage:currentPage,
        totalPages:Math.ceil(info.total/pageSize),
        onPageChanged:function(a,b,c,page){
          currentPage=page;
          render();
        },
        //自定义页码 首页伟爷
        itemTexts:function(type,page,current){
          // console.log(type);
          //page:页码
          switch (type){
            case 'first':
              return '首页';
            case 'next':
              return "下一页";
            case 'last':
              return "尾页";
            case 'prev':
              return '上一页';
            default:
              return page;
          }
        }
      })
      }
    })
  }
  
  //注册点击事件
  $('.btn_add').on('click',function(){
    $('#addModal').modal('show');
    //渲染二级下拉框
    $.ajax({
      type:"get",
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSIze:100
      },
      success:function(info){
        // console.log(info)
        $('.dropdown-menu').html(template('secondDowp',info))
      }
      
    })
  })
 render();
  //动态的给每个二级下拉列表注册点击事件
  $('.dropdown-menu').on('click','a',function(){
    $('.dropdown_text').text($(this).text());
    //设置隐藏域brandId
    $('.brandId').val($(this).data('id'))
   
  })
  
  //进行表单校验
  $('form').bootstrapValidator({
    excluded:[],//对隐藏域也进行校验
    feedbackIcons: {
      //校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      
      brandId:{
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
        },
      proName:{
        validators:{
          notEmpty:{
            messages:"请输入产品名称"
          }
        
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            messages:"请输入商品描述"
          }
        }
      },
      num: {
        validators:{
          notEmpty:{
            message:"请输入商品的库存"
          },
          //正则校验
          regexp: {
            //不能是0开头，必须是数字
            regexp:/^[1-9]\d*$/,
            message:"请输入合法的库存"
          }
        }
      },
      size: {
        validators:{
          notEmpty:{
            message:"请输入商品的尺码"
          },
          //正则校验
          regexp: {
            //不能是0开头，必须是数字
            regexp:/^\d{2}-\d{2}$/,
            message:"请输入合法的尺码,例如(32-46)"
          }
        }
      },
      oldPrice: {
        validators:{
          notEmpty:{
            message:"请输入商品的原价"
          }
        }
      },
      price: {
        validators:{
          notEmpty:{
            message:"请输入商品的价格"
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:"请上传3张图片"
          },
          maxNumb:{
            message:'只能上传三张'
          }
        }
      }
    }
  });
  var imgArr=[];//用来存放图片地址，便于后面发送ajax请求数据的拼串
  //处理图片上传
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
     //动态添加图片
      $('.img_box').append('<img src="'+data.result.picAddr+'" alt="" width="100" height="100">');
      imgArr.push('data.result')
      //判断只能上传三张
      if(imgArr.length===3){
        $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')
        // return false;
      }else{
        $('form').data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
      }
    }
  })
  //表单校验成功后发送请求
  $('form').on('success.form.bv',function(){
    $parm=$('form').serialize();
    $parm+='&picName1='+imgArr[0].picName+'&picAddr1='+imgArr[0].picAddr;
    $parm+='&picName2='+imgArr[1].picName+'&picAddr2='+imgArr[1].picAddr;
    $parm+='&picName3='+imgArr[2].picName+'&picAddr3='+imgArr[2].picAddr;
    console.log($parm);
      $.ajax({
        type:'post',
        url:'/product/addProduct',
        data:$parm,
        success:function(info){
          if(info.success){
            $('#addModal').modal('hide');
            currentPage=1;
            render();
            
            //样式重置
            $("#form").data('bootstrapValidator').resetForm();
            $('form')[0].reset();
            $('.dropdown_text').text('二级菜单');
            $('.img_box img').remove();
            imgArr=[];
            $("[name='brandId']").val('');
            
          }
        }
      })
  })
})