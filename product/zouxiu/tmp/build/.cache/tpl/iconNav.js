/*TMODJS:{"version":10,"md5":"8f149f0d7be2df8ee923f5068cde8a26"}*/
template('tpl/iconNav',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,$out='';$out+='<div class="swiper-container-top"> <div class="swiper-wrapper"> ';
$each($data,function($value,$index){
$out+=' <div class="swiper-slide" id="';
$out+=$escape($value.classID);
$out+='"><i class="iconfont">';
$out+=$escape($value.icon);
$out+='</i></div> ';
});
$out+=' </div> </div>';
return new String($out);
});