/**
 * Created by my on 2016/10/4.
 */
$(".loginBtn").click(function () {
    login();
});
function login(){
    $.ajax({
       type:"post",
        url:"https://datainfo.duapp.com/shopdata/userinfo.php",
        data:{
            status:"login",
            userID:$("#userName").val(),
            password:$("#pw").val()
        },
        dataType:"JSON",
        success: function (data) {
            console.log(data);
            if(data == 0){
                $(".userSpan").html("用户名不存在");
            }else if(data == 2){
                $(".userSpan").html("用户名密码不符");
            }else {
                localStorage.setItem("userID",$("#userName").val());
                localStorage.setItem("userImg",data.userimg_url);
                location.href = "myXiu.html?userID="+data.userID+"&userimg_url="+data.userimg_url;
            }
        },
        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log("errorThrown:"+errorThrown);
        }
    });
}