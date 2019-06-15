// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require jquery
//= require jquery_ujs
//= require_tree .

let turn = 1;               //ターンを表すフラグ 1:先攻 2:後攻
let move_flg = 0;           //コマの移動中かどうかを表すフラグ
var move_point_id = "";     //移動元のID

$(function(){
  $('table td').click(function(){
    //先攻のターン
    if(turn == 1){
      //コマの移動中ではない
      if(move_flg == 0){
        if($(this).text() == "●"){
          $(this).text('★');  
          move_flg = 1;
          move_point_id = '#' + $(this).attr('id');   //移動元IDを記録
          console.log(move_point_id); 
        }else if($(this).text() == ''){
          $(this).text('●');
        }  
      //コマの移動中
      }else if(move_flg == 1){
        if($(this).text() == '★'){
          $(this).text('●');
          move_flg = 0;
        }else if($(this).text() == ''){
          $(this).text('●');
          $(move_point_id).text('');
          move_flg = 0;
        }
      }
    //後攻のターン
    }else{
      //コマの移動中ではない
      if(move_flg == 0){
        if($(this).text() == "○"){
          $(this).text('★');  
          move_flg = 1;
          move_point_id = '#' + $(this).attr('id');   //移動元IDを記録
          console.log(move_point_id); 
        }else if($(this).text() == ''){
          $(this).text('○');
        }  
      //コマの移動中
      }else if(move_flg == 1){
        if($(this).text() == '★'){
          $(this).text('○');
          move_flg = 0;
        }else if($(this).text() == ''){
          $(this).text('○');
          $(move_point_id).text('');
          move_flg = 0;
        }
      } 
    }
  });

  //ターン終了ボタンのクリックイベント
  $('#turn-end').click(function(){
    turn = 3 - turn;

    if(turn == 1){
      $('#current-turn').text('青のターン');
    }else{
      $('#current-turn').text('白のターン');
    }
  });
});



