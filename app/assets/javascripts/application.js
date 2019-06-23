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
var winFlg = false;       //勝利判定
var loseFlg = false;      //敗北判定

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
    if(winFlg == loseFlg){
      turnAction(this);
    }
    if(winFlg != loseFlg){
      gameEnd();
    }
  });

  //ターンの処理
  function turnAction(_this){
    //クリックされた場所を記録する
    row = $(_this).closest('tr').index();    //縦
    col = _this.cellIndex;                   //横

    //先攻のターン
    if(turn == 1){
      //コマの移動中
      if(moveFlg){
        if($(_this).text() == '★'){
          $(_this).text('●');
          putBan();
          turnChange();
          moveFlg = false;
        }else if($(_this).text() == ''){
          if(judgMove()){
            $(_this).text('●');
            $(movePointId).text('');
            putBan();
            reverse();
            judgVictory(row, col);
            if(winFlg == loseFlg){
              turnChange();
              moveFlg = false;
            }
          }else{
            $('#msg').text('そこには置けません！！');
          }
        }else{
          $('#msg').text('そこには置けません！！');
        }
      //コマの移動中ではない
      }else{
        if($(_this).text() == "●"){
          $(_this).text('★');
          movePointId = '#' + $(_this).attr('id');   //移動元IDを記録
          moveRecord();
          pullBan();
          moveFlg = true;
        }else if($(_this).text() == ''){
          if(blueStock > 0){
            $(_this).text('●');
            stockCalc(--blueStock);
            putBan();
            judgVictory(row, col);
            if(winFlg == loseFlg){
              turnChange();
            }
          }
        }
      }
    //後攻のターン
    }else{
      //コマの移動中
      if(moveFlg){
        if($(_this).text() == '★'){
          $(_this).text('○');
          putBan();
          turnChange();
          moveFlg = false;
        }else if($(_this).text() == ''){
          if(judgMove()){
            $(_this).text('○');
            $(movePointId).text('');
            putBan();
            reverse();
            judgVictory(row, col);
            if(winFlg == loseFlg){
              turnChange();
              moveFlg = false;
            }
          }else{
            $('#msg').text('そこには置けません！！');
          }
        }else{
          $('#msg').text('そこには置けません！！');
        }
      //コマの移動中ではない
      }else{
        if($(_this).text() == "○"){
          $(_this).text('★');
          movePointId = '#' + $(_this).attr('id');   //移動元IDを記録
          moveRecord();
          pullBan();
          moveFlg = true;
        }else if($(_this).text() == ''){
          if(whiteStock > 0){
            $(_this).text('○');
            stockCalc(--whiteStock);
            putBan();
            judgVictory(row, col);
            if(winFlg == loseFlg){
              turnChange();
            }
          }
        }
      }
    }
  }

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
    var resVictory = 0;

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
                resVictory = judgVictory(ry, rx);
              }else if(ban[ry][rx] == 2 || ban[ry][rx] == 5 || ban[ry][rx] == 8){
                $('#cell-' + ry + '' + rx).text('●');
                ban[ry][rx] -= 1;
                resVictory = judgVictory(ry, rx);
              }
              //4目以上コマが並んでいたら
              if(winFlg != loseFlg){
                return false;
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

  //勝敗判定
  function judgVictory(ry, rx){
    var y = 0;
    var x = 0;
    var cnt = 0;

    //縦軸を調べる
    for(y = 1; y <= 5; y++){
      if(turn == 1){
        if(ban[y][rx] == 1 || ban[y][rx] == 4 || ban[y][rx] == 7){
          cnt++;
        }
      }else{
        if(ban[y][rx] == 2 || ban[y][rx] == 5 || ban[y][rx] == 8){
          cnt++;
        }
      }
    }
    judgCnt(cnt);
    cnt = 0;

    //横軸を調べる
    for(x = 0; x <= 5; x++){
      if(turn == 1){
        if(ban[ry][x] == 1 || ban[ry][x] == 4 || ban[ry][x] == 7){
          cnt++;
        }
      }else{
        if(ban[ry][x] == 2 || ban[ry][x] == 5 || ban[ry][x] == 8){
          cnt++;
        }
      }
    }
    judgCnt(cnt);
    cnt = 0;

    //斜めを調べる
    judgCnt(naname(1, 2, 1, 1, 4));
    cnt = 0;
    judgCnt(naname(1, 1, 1, 1, 5));
    cnt = 0;
    judgCnt(naname(2, 1, 1, 1, 4));
    cnt = 0;
    judgCnt(naname(1, 4, 1, -1, 4));
    cnt = 0;
    judgCnt(naname(1, 5, 1, -1, 5));
    cnt = 0;
    judgCnt(naname(2, 5, 1, -1, 4));
  }

  function naname(ry, rx, addy, addx, kaisu){
    var i;
    var cnt = 0;

    for(i = 0; i < kaisu; i++){
      if(turn == 1){
        if(ban[ry][rx] == 1 || ban[ry][rx] == 4 || ban[ry][rx] == 7){
          cnt++;
        }
      }else{
        if(ban[ry][rx] == 2 || ban[ry][rx] == 5 || ban[ry][rx] == 8){
          cnt++;
        }
      }
      ry += addy;
      rx += addx;
    }
    return cnt;
  }
  function judgCnt(cnt){
    if(cnt == 5){
      loseFlg = true;
    }
    if(cnt == 4){
      winFlg = true;
    }
  }

  function gameEnd(){
    //コマをおいて４つ並んだ場合は無視する
    if(moveFlg == false && winFlg){
      winFlg = false;
      turnChange();
      return false;
    }

    $('#current-turn').text('');
    if(turn == 1){
      if(winFlg){
        $('#msg').text('青の勝ち');
      }else{
        $('#msg').text('白の勝ち');
      }
    }else{
      if(winFlg){
        $('#msg').text('白の勝ち');
      }else{
        $('#msg').text('青の勝ち');
      }
    }
  }
});
