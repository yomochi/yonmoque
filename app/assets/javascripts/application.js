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

let turn = 1;             //ターンを表すフラグ 1:先攻 2:後攻
var moveFlg = false;      //コマの移動中かどうかを表すフラグ
var movePointId = "";     //移動元のID
var blueStock = 6;        //青のコマ数
var whiteStock = 6;       //白のコマ数
var row = 0;              //クリックしたテーブルの縦座標Y
var col = 0;              //クリックしたテーブルの横座標X
var rowBk = 0;            //Y座標のバックアップ
var colBk = 0;            //X座標のバックアップ

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
      if(moveFlg){
        if($(this).text() == '★'){
          $(this).text('●');
          putBan();
          moveFlg = false;
          turnChange();
          return false;
        }else if($(this).text() == ''){
          if(judgMove()){
            $(this).text('●');
            $(movePointId).text('');
            moveFlg = false;
            putBan();
            reverse();
            turnChange();
            return false;
          }else{
            $('#msg').text('そこには置けません！！');
            return false;
          }
        }else{
          $('#msg').text('そこには置けません！！');
          return false;
        }
      //コマの移動中ではない
      }else{
        if($(this).text() == "●"){
          $(this).text('★');
          moveFlg = true;
          movePointId = '#' + $(this).attr('id');   //移動元IDを記録
          moveRecord();
          pullBan();
          return false;
        }else if($(this).text() == ''){
          if(blueStock > 0){
            $(this).text('●');
            stockCalc(--blueStock);
            putBan();
            turnChange();
            return false;
          }
          return false;
        }
      }
    //後攻のターン
    }else{
      //コマの移動中
      if(moveFlg){
        if($(this).text() == '★'){
          $(this).text('○');
          putBan();
          moveFlg = false;
          turnChange();
          return false;
        }else if($(this).text() == ''){
          if(judgMove()){
            $(this).text('○');
            $(movePointId).text('');
            moveFlg = false;
            putBan();
            reverse();
            turnChange();
            return false;
          }else{
            $('#msg').text('そこには置けません！！');
            return false;
          }
        }else{
          $('#msg').text('そこには置けません！！');
          return false;
        }
      //コマの移動中ではない
      }else{
        if($(this).text() == "○"){
          $(this).text('★');
          moveFlg = true;
          movePointId = '#' + $(this).attr('id');   //移動元IDを記録
          moveRecord();
          pullBan();
          return false;
        }else if($(this).text() == ''){
          if(whiteStock > 0){
            $(this).text('○');
            stockCalc(--whiteStock);
            putBan();
            turnChange();
            return false;
          }
          return false;
        }
      }
    }
  });

  //ターン交代
  function turnChange(){
    $('#msg').text('');
    turn = 3 - turn;
    if(turn == 1){
      $('#current-turn').text('青のターン');
    }else{
      $('#current-turn').text('白のターン');
    }
  }

  //ストック計算
  function stockCalc(stock){
    var dispStock = "";

    for(var i=0; i < stock; i++){
      if(turn == 1){
        dispStock += "●";
      }else{
        dispStock += "○";
      }
    }

    if(turn == 1){
      $('#blue-piece').text(dispStock);
    }else{
      $('#white-piece').text(dispStock);
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
  function moveRecord(){
    rowBk = row;
    colBk = col;
  }

  //移動できるか判定する
  function judgMove(){
    var absY = Math.abs(row - rowBk);  //絶対値
    var absX = Math.abs(col - colBk);  //絶対値

    //移動範囲が１マスならば移動できる
    if(absY <= 1 && absX <= 1){
      if($(movePointId).text('')){
        return true;
      }
    }

    if(turn == 1){
      return judgDiagonal(absY, absX, 6);
    }else{
      return judgDiagonal(absY, absX, 3);
    }
  }

  //斜め移動の判定
  function judgDiagonal(absY, absX, n){
    var rowSign = -(Math.sign(rowBk - row));   //signは正負または0を求める
    var colSign = -(Math.sign(colBk - col));
    var banNum = ban[rowBk][colBk];              //盤面の値
    var y = rowBk;
    var x = colBk;

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
