/*TMODJS:{"version":15,"md5":"44ca51b52a30d568ec80fda31777cfc5"}*/
template('tpl/goodsList',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div id="wrapper"> <div id="scroller"> <div id="pullDown" class=""> <div class="pullDownLabel"></div> </div> <div class="pulldown-tips">下拉刷新</div> <ul> ';
$each($data,function($value,$index){
$out+=' <li> <div class="shopPic"> <img src="';
$out+=$escape($value.goodsListImg);
$out+='" alt=""> </div> <div class="name"> <p><a href="detail.html?goodsID=';
$out+=$escape($value.goodsID);
$out+='" class="getGoodId">';
$out+=$escape($value.goodsName);
$out+='</a></p> <div class="price"> <div class="priceLeft"> <h3> <b>￥<span class="num">';
$out+=$escape($value.price);
$out+='</span></b> <del> ';
if($value.discount == 0){
$out+=' <b>￥<span class="del">';
$out+=$escape($value.price);
$out+='</span></b> ';
}else{
$out+=' <b>￥<span class="del">';
$out+=$escape(($value.price*10/$value.discount).toFixed(2));
$out+='</span></b> ';
}
$out+=' </del> </h3> <h4><span class="discount">';
$out+=$escape($value.discount);
$out+='</span>折</h4> </div> <div class="cartBtn"> <a class="iconfont">&#xe61b;</a> </div> </div> </div> </li> ';
});
$out+=' </ul> <div id="pullUp" class=""> <div class="pullUpLabel">加载更多</div> </div> </div> </div>';
return new String($out);
});