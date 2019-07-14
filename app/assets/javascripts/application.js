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
var victoryFlg = 0;       //勝利判定 0:なし　1:青の勝ち　2:白の勝ち

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
  getBoardInfo();

  $('table td').click(function(){
    if(victoryFlg == 0){
      turnAction(this);
    }
    if(victoryFlg != 0){
      gameEnd();
    }
    requestBoard();
  });

  //ターンの処理
  function turnAction(_this){
    //クリックされた場所を記録する
    row = $(_this).closest('tr').index() + 1;    //縦
    col = _this.cellIndex + 1;                   //横

    //先攻のターン
    if(turn == 1){
      //コマの移動中
      if(moveFlg){
        if($(_this).text() == '★'){
          $(_this).text('●');
          putBan();
          moveFlg = false;
        }else if($(_this).text() == ''){
          if(judgMove()){
            $(_this).text('●');
            $(movePointId).text('');
            putBan();
            reverse();
            judgVictory(row, col);
            if(victoryFlg == 0){
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
            --blueStock;
            stockCalc();
            putBan();
            judgVictory(row, col);
            if(victoryFlg == 0){
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
          moveFlg = false;
        }else if($(_this).text() == ''){
          if(judgMove()){
            $(_this).text('○');
            $(movePointId).text('');
            putBan();
            reverse();
            judgVictory(row, col);
            if(victoryFlg == 0){
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
            --whiteStock;
            stockCalc();
            putBan();
            judgVictory(row, col);
            if(victoryFlg == 0){
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
    dispCurrentTurn();
  }
  //現在のターン表示
  function dispCurrentTurn(){
    if(turn == 1){
      $('#current-turn').text('青のターン');
    }else{
      $('#current-turn').text('白のターン');
    }
  }

  //ストック計算
  function stockCalc(){
    var dispBlueStock = "";
    var dispWhiteStock = "";

    for(var i=0; i < blueStock; i++){
      dispBlueStock += "●";
    }

    $('#blue-piece').text(dispBlueStock);

    for(var i=0; i < whiteStock; i++){
      dispWhiteStock += "○";
    }

    $('#white-piece').text(dispWhiteStock);
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
                judgVictory(ry, rx);
              }else if(ban[ry][rx] == 2 || ban[ry][rx] == 5 || ban[ry][rx] == 8){
                $('#cell-' + ry + '' + rx).text('●');
                ban[ry][rx] -= 1;
                judgVictory(ry, rx);
              }
              ry -= dy;
              rx -= dx;
            }
            break;
          }
        }
      }
    }
    //4目以上コマが並んでいたら
    if(victoryFlg != 0){
      return false;
    }
  }

  //勝敗判定
  function judgVictory(ry, rx){
    var y = 0;
    var x = 0;
    var cnt = 0;
    var marker = 1;

    //縦軸を調べる
    for(y = 1; y <= 5; y++){
      if(turn == 1){
        if(ban[y][rx] == 1 || ban[y][rx] == 4 || ban[y][rx] == 7){
          if(y - marker <= 1){
            cnt++;
            marker = y;
          }
        }
      }else{
        if(ban[y][rx] == 2 || ban[y][rx] == 5 || ban[y][rx] == 8){
          if(y - marker <= 1){
            cnt++;
            marker = y;
          }
        }
      }
    }
    judgCnt(cnt);
    cnt = 0;
    marker = 1;

    //横軸を調べる
    for(x = 1; x <= 5; x++){
      if(turn == 1){
        if(ban[ry][x] == 1 || ban[ry][x] == 4 || ban[ry][x] == 7){
          if(x - marker <= 1){
            cnt++;
            marker = x;
          }
        }
      }else{
        if(ban[ry][x] == 2 || ban[ry][x] == 5 || ban[ry][x] == 8){
          if(x - marker <= 1){
            cnt++;
            marker = x;
          }
        }
      }
    }
    judgCnt(cnt);

    //斜めを調べる
    judgCnt(naname(1, 2, 1, 1, 4));       //右下
    judgCnt(naname(1, 1, 1, 1, 5));       //右下
    judgCnt(naname(2, 1, 1, 1, 4));       //右下
    judgCnt(naname(1, 4, 1, -1, 4));      //左下
    judgCnt(naname(1, 5, 1, -1, 5));      //左下
    judgCnt(naname(2, 5, 1, -1, 4));      //左下
  }

  function naname(ry, rx, addy, addx, kaisu){
    var i;
    var cnt = 0;
    var marker = 0;

    for(i = 0; i < kaisu; i++){
      if(turn == 1){
        if(ban[ry][rx] == 1 || ban[ry][rx] == 4 || ban[ry][rx] == 7){
          if(i - marker <= 1){
            cnt++;
            marker = i;
          }
        }
      }else{
        if(ban[ry][rx] == 2 || ban[ry][rx] == 5 || ban[ry][rx] == 8){
          if(i - marker <= 1){
            cnt++;
            marker = i;
          }
        }
      }
      ry += addy;
      rx += addx;
    }
    return cnt;
  }

  function judgCnt(cnt){
    if(victoryFlg != 0 && victoryFlg != turn){
      return false;
    }
    if(cnt == 5){
      victoryFlg = 3 - turn;
      return false;
    }
    if(cnt == 4){
      victoryFlg = turn;
      return false;
    }
  }

  function gameEnd(){
    //コマをおいて４つ並んだ場合は無視する
    if(moveFlg == false && victoryFlg == turn){
      victoryFlg = 0;
      turnChange();
      return false;
    }

    $('#current-turn').text('');
    if(victoryFlg == 1){
      $('#msg').text('青の勝ち');
    }else{
      $('#msg').text('白の勝ち');
    }
  }

  function createBoard(){
    initGame();

    var jsonData ={
      board:{
        situation: ban.toString(),
        turn: turn,
        blueStock: blueStock,
        whiteStock: whiteStock,
        victory: victoryFlg
      }
    }

    $.ajax({
      url: "/boards",
      type: "POST",
      dataType   : 'json',
      data: jsonData
    });
  }

  function requestBoard(){
    var jsonData ={
      board:{
        situation: ban.toString(),
        turn: turn,
        blueStock: blueStock,
        whiteStock: whiteStock,
        victory: victoryFlg
      }
    }

    $.ajax({
      url: "/boards/1",
      type: "PATCH",
      dataType   : 'json',
      data: jsonData
    });
  }

  //ボード情報の取得
  function getBoardInfo(){
    $.ajax({
      url: "/boards/1",
      type: "GET",
      dataType   : 'json'
    })
    //リクエスト成功
    .done(function(data){
      turn = data.turn;
      blueStock = data.blueStock;
      whiteStock = data.whiteStock;
      victoryFlg = data.victory;
      stockCalc();          //ストック計算
      dispCurrentTurn();    //現在のターン表示

      i = 0;
      for(y = 0; y < 7; y++){
        for(x = 0; x < 7; x++){
          ban[y][x] = Number(data.situation[i]);
          i += 2;
        }
      }

      for(y = 1; y <= 5; y++){
        for(x = 1; x <= 5; x++){
          if(ban[y][x] == 1 || ban[y][x] == 4 || ban[y][x] == 7){
            $('#cell-' + y + '' + x).text('●');
          }else if(ban[y][x] == 2 || ban[y][x] == 5 || ban[y][x] == 8){
            $('#cell-' + y + '' + x).text('○');
          }else{
            $('#cell-' + y + '' + x).text('');
          }
        }
      }
    })
    //リクエスト失敗
    .fail(function(){
      alert('初期化します！！');
      createBoard();
    })
    //リクエスト結果に関係なく通るロジック
    .always(function(){
      return false;
    });
  }

  //GETリクエストでDBからJSON形式で値を取得する
  $('#get-json').click(function(){
    getBoardInfo();
  });

  //ゲームの初期化
  function initGame(){
    turn = 1;             //ターンを表すフラグ 1:先攻 2:後攻
    moveFlg = false;      //コマの移動中かどうかを表すフラグ
    movePointId = "";     //移動元のID
    blueStock = 6;        //青のコマ数
    whiteStock = 6;       //白のコマ数
    row = 0;              //クリックしたテーブルの縦座標Y
    col = 0;              //クリックしたテーブルの横座標X
    rowBk = 0;            //Y座標のバックアップ
    colBk = 0;            //X座標のバックアップ
    victoryFlg = 0;       //勝利判定 0:なし　1:青の勝ち　2:白の勝ち

    ban = [
      [9,9,9,9,9,9,9],
      [9,0,3,6,3,0,9],
      [9,3,6,3,6,3,9],
      [9,6,3,0,3,6,9],
      [9,3,6,3,6,3,9],
      [9,0,3,6,3,0,9],
      [9,9,9,9,9,9,9]
    ];

    for(y = 1; y <= 5; y++){
      for(x = 1; x <= 5; x++){
        $('#cell-' + y + '' + x).text('');
      }
    }

    stockCalc();

    //メッセージの初期化
    $('#msg').text('');
    $('#current-turn').text('青のターン');
  }
  //ゲームを新しくはじめるためデータを初期化する
  $('#NewGame').click(function(){
    initGame();
    requestBoard();
  });
});
