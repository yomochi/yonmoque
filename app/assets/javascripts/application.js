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
var move_flg = false;           //コマの移動中かどうかを表すフラグ
var move_point_id = "";     //移動元のID
var blue_stock = 6;         //青のコマ数
var white_stock = 6;        //白のコマ数
var row = 0;                //クリックしたテーブルの縦座標Y
var col = 0;                //クリックしたテーブルの横座標X
var row_bk = 0;             //Y座標のバックアップ
var col_bk = 0;             //X座標のバックアップ

/* 盤面の状態
0:[中立マス] なし
1:[中立マス] 青コマ
2:[中立マス] 白コマ
3:[白マス] なし
4:[白マス] 青コマ
5:[白マス] 白コマ
6:[青マス] なし
7:[青マス] 青コマ
8:[青マス] 白コマ
9:外枠
*/
var ban = [
  [9,9,9,9,9,9,9],
  [9,0,3,6,3,0,9],
  [9,3,6,3,6,3,9],
  [9,6,3,0,3,6,9],
  [9,3,6,3,6,3,9],
  [9,0,3,6,3,0,9],
  [9,9,9,9,9,9,9]
];

$(function(){
  $('table td').click(function(){
    //クリックされた場所を記録する
    row = $(this).closest('tr').index();    //縦
    col = this.cellIndex;                   //横

    //先攻のターン
    if(turn == 1){
      //コマの移動中
      if(move_flg){
        if($(this).text() == '★'){
          $(this).text('●');
          putBan();
          move_flg = false;
        }else if($(this).text() == ''){
          if(judg_move()){
            $(this).text('●');
            $(move_point_id).text('');
            move_flg = false;
            putBan();
            reverse();
            $('#msg').text('');
          }else{
            $('#msg').text('そこには置けません！！');
          }
        }else{
          $('#msg').text('そこには置けません！！');
        }
      //コマの移動中ではない
      }else{
        if($(this).text() == "●"){
          $(this).text('★');
          move_flg = true;
          move_point_id = '#' + $(this).attr('id');   //移動元IDを記録
          move_record();
          pullBan();
          return false;
        }else if($(this).text() == ''){
          if(blue_stock > 0){
            $(this).text('●');
            stock_calc(--blue_stock);
            putBan();
          }
          return false;
        }
      }
    //後攻のターン
    }else{
      //コマの移動中
      if(move_flg){
        if($(this).text() == '★'){
          $(this).text('○');
          putBan();
          move_flg = false;
        }else if($(this).text() == ''){
          if(judg_move()){
            $(this).text('○');
            $(move_point_id).text('');
            move_flg = false;
            putBan();
            reverse();
            $('#msg').text('');
          }else{
            $('#msg').text('そこには置けません！！');
          }
        }else{
          $('#msg').text('そこには置けません！！');
        }
      //コマの移動中ではない
      }else{
        if($(this).text() == "○"){
          $(this).text('★');
          move_flg = true;
          move_point_id = '#' + $(this).attr('id');   //移動元IDを記録
          move_record();
          pullBan();
        }else if($(this).text() == ''){
          if(white_stock > 0){
            $(this).text('○');
            stock_calc(--white_stock);
            putBan();
          }
        }
      }
    }
    return false;
  });

  //ターン終了ボタンのクリックイベント
  $('#turn-end').click(function(){
    if(move_flg){
      $('#msg').text('移動が終わっていません！！');
      return false;
    }

    turn = 3 - turn;
    if(turn == 1){
      $('#current-turn').text('青のターン');
    }else{
      $('#current-turn').text('白のターン');
    }
  });

  //ストック計算
  function stock_calc(stock){
    var disp_stock = "";

    for(var i=0; i < stock; i++){
      if(turn == 1){
        disp_stock += "●";
      }else{
        disp_stock += "○";
      }
    }

    if(turn == 1){
      $('#blue-piece').text(disp_stock);
    }else{
      $('#white-piece').text(disp_stock);
    }
  }

  //盤面にコマを置く
  function putBan(){
    ban[row][col] += turn;
  }
  //盤面からコマを取る
  function pullBan(){
    ban[row][col] -= turn;
  }

  //移動まえの座標を記録する
  function move_record(){
    row_bk = row;
    col_bk = col;
  }

  //移動できるか判定する
  function judg_move(){
    var absY = Math.abs(row - row_bk);  //絶対値
    var absX = Math.abs(col - col_bk);  //絶対値

    //移動範囲が１マスならば移動できる
    if(absY <= 1 && absX <= 1){
      if($(move_point_id).text('')){
        return true;
      }
    }

    if(turn == 1){
      return judg_diagonal(absY, absX, 6);
    }else{
      return judg_diagonal(absY, absX, 3);
    }
  }

  //斜め移動の判定
  function judg_diagonal(absY, absX, n){
    var rowSign = -(Math.sign(row_bk - row));   //signは正負または0を求める
    var colSign = -(Math.sign(col_bk - col));
    var banNum = ban[row_bk][col_bk];              //盤面の値
    var y = row_bk;
    var x = col_bk;

    //移動方向が斜めではない、または[指定マス]のコマなし
    if(absY != absX || banNum != n){
      return false;
    }

    while(y != row){
      y += rowSign;
      x += colSign;
      if(ban[y][x] != n){
        return false;
      }
    }
    if(ban[y][x] == n){
      return true;
    }
  }

  //コマの裏返し処理
  function reverse(){
    var ry,rx,dy,dx;

    for(dy = -1; dy <= 1; dy++){
      for(dx = -1; dx <= 1; dx++){
        if((dy == 0 && dx == 0) || ban[row][col] == ban[row + dy][col + dx]){
          continue;
        }

        ry = row;
        rx = col;
        while(ry >=1 && ry <= 5 && rx >= 1 && rx <= 5 && ban[ry][rx] != 0 && ban[ry][rx] != 3 && ban[ry][rx] != 6){
          ry += dy;
          rx += dx;
          //同じ色のコマか？
          if(Math.abs(ban[row][col] - ban[ry][rx]) == 0 || Math.abs(ban[row][col] - ban[ry][rx]) == 3 || Math.abs(ban[row][col] - ban[ry][rx]) == 6){
            ry -= dy;
            rx -= dx;

            while(!(ry == row && rx == col)){
              if(ban[ry][rx] == 1 || ban[ry][rx] == 4 || ban[ry][rx] == 7){
                $('#cell-' + ry + '' + rx).text('○');
                ban[ry][rx] += 1;
              }else if(ban[ry][rx] == 2 || ban[ry][rx] == 5 || ban[ry][rx] == 8){
                $('#cell-' + ry + '' + rx).text('●');
                ban[ry][rx] -= 1;
              }
              ry -= dy;
              rx -= dx;
            }
            break;
          }
        }
      }
    }
  }
});
