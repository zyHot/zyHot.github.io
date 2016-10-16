/**
 * Created by my on 2016/10/4.
 */
var isSame = false;
var isForm = false;
$(".registerBtn").click(function () {
    if(isSame && isForm){
        checkUserNameeXist();
    }
});
$("#userName").blur(function () {

})
$("#pw").blur(function () {
    checkPwForm();
});
$("#pwTwo").blur(function () {
    checkPwSame();
});
function checkUserNameeXist(){
    $.ajax({
        type:"POST",
        url:"http://datainfo.duapp.com/shopdata/userinfo.php",
        data:{
            status:"register",
            userID:$("#userName").val(),
            password:$("#pw").val()
        },
        success:function(data){
            if(data == 1){
                location.href = "login.html";
            }else if(data == 0){
                $(".userSpan").html("用户名已存在！")
            }
            console.log(data);
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    });
}
function checkPwForm(){
    isForm = false;
    var userStr = $("#pw").val();
    var regExp = /^[0-9a-zA-Z_]{6,20}$/;
    if (userStr === "") {
        $(".pwSpan").removeClass("color").html("不能为空");
    }
    if (!regExp.test(userStr)) {
        $(".pwSpan").removeClass("color").html("密码6-20位");
    } else {
        $(".pwSpan").addClass("color").html("OK");
        isForm = true;
    }
}
function checkPwSame() {
    isSame = false;
    var pwStr = $("#pw").val();
    if($("#pwTwo").val() === ""){
        $(".pwTwoSpan").removeClass("color").html("您输入的密码为空");
        return
    }else if ($("#pwTwo").val() === pwStr) {
        $(".pwTwoSpan").addClass("color").html("OK");
        isSame = true;
    } else if ($("#pwTwo").val() !== pwStr) {
        $(".pwTwoSpan").removeClass("color").html("您两次输入的密码不一致")
    }
}