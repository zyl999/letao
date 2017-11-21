/**
 * Created by HUCC on 2017/11/21.
 */
$(function(){
  var $form=$('form');
  $('form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //文档并没有这个方法所以不认识，是人为加上去的便于后面的自己调用callback
          callback:{
            message:'用户名错误'
          }
          // //正则校验
          // regexp: {
          //   regexp: /^[a-zA-Z0-9_\.]+$/,
          //   message: '用户名由数字字母下划线和.组成'
          // }
        }
      },
      password:{
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码6-12位'
          },
          callback:{
            message:'密码错误'
          }
        }
      }
    }
    
  });
  
  $("form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
   console.log('heeh');
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      data:$form.serialize(),
      success:function(info){
        console.log(info);
        if(info.success){
          location.href='index.html'
        }
        if(info.error==1000){
          //根据文档获取表单实例化对象实现改变表单的状态
          // 第一个参数：要改变的状态？
          // 第二个参数：改变状态的值，VALID 表示通过  INVALUD 表示不通过 NOT_VALIDATED：未校验的
          // 第三个参数：表示输出的反馈消息（提示信息）
          $("form").data('bootstrapValidator').updateStatus('username', 'INVALID','callback' )
         }
         if(info.error=1001){
           $("form").data('bootstrapValidator').updateStatus('password', 'INVALID','callback' )
         }
        }
    })
  });
  
  //样式表单的重置，reset 只会重置表单（恢复到默认状态） 不会重置添加的样式
  //根据 validator校验插件会帮助我们校验通过表单实例化对像来校验
  
  //重置表单，并且会隐藏所有的错误提示和图标
   $("[type='reset']").on('click',function(){
     $("form").data('bootstrapValidator').resetForm();
   })
  
  
  
})