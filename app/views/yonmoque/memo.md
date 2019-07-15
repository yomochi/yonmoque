```shell
bundle exec rails generate migration CreateBoards situation:stirng turn:integer blueStock:integer whiteStock:integer victory:integer
```

- railsガイドでマイグレーションのやりかたを参照
https://railsguides.jp/active_record_migrations.html#%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B

- DBを作成する
- 一意とNULLを許さない場合は追加する。
- モデルをつくる




# RESTFULは下記の振る舞いがすべて対応している（ルーティング）
- GET（取得）
- POST（作成）
- PATCH（PUT）（更新）
- DELETE（削除）

# restfulなルーティングしよう
- show
- Create
- update
- delte

# モデル作ったら対応するresourcesも作りましょう

 $ bundle exec rails routes
                   Prefix Verb   URI Pattern                                                                              Controller#Action
                     root GET    /                                                                                        yonmoque#top
                   boards GET    /boards(.:format)                                                                        boards#index
                          POST   /boards(.:format)                                                                        boards#create
                new_board GET    /boards/new(.:format)                                                                    boards#new
               edit_board GET    /boards/:id/edit(.:format)                                                               boards#edit
                    board GET    /boards/:id(.:format)                                                                    boards#show
                          PATCH  /boards/:id(.:format)                                                                    boards#update
                          PUT    /boards/:id(.:format)                                                                    boards#update
                          DELETE /boards/:id(.:format)                                                                    boards#destroy
       rails_service_blob GET    /rails/active_storage/blobs/:signed_id/*filename(.:format)                               active_storage/blobs#show
rails_blob_representation GET    /rails/active_storage/representations/:signed_blob_id/:variation_key/*filename(.:format) active_storage/representations#show
       rails_disk_service GET    /rails/active_storage/disk/:encoded_key/*filename(.:format)                              active_storage/disk#show
update_rails_disk_service PUT    /rails/active_storage/disk/:encoded_token(.:format)                                      active_storage/disk#update
     rails_direct_uploads POST   /rails/active_storage/direct_uploads(.:format)


'''html.erb
<!--
<%= form_tag("/boards", method: "post") do %>
  <%= text_field_tag(:situation) %>
  <%= text_field_tag(:turn) %>
  <%= text_field_tag(:blueStock) %>
  <%= text_field_tag(:whiteStock) %>
  <%= text_field_tag(:victory) %>
  <%= submit_tag("create") %>
<% end %>
-->
'''

- situation	turn	blueStock	whiteStock	victory
- paramsはpermitで許可したやつならうけとれる
- createできる！！
- index 一覧
- show 詳細表示


# requireを使ったデータのアクセスについて
- fを使うならデータが入れ子になる
- 入れ子になるならrequireを使う
- テキストフォームに初期値を設定したい場合などにつかう
'''
  success: function(data) {
    alert("success");
  },
  error: function(data) {
    alert("errror");
  }
'''




new 新規作成画面
↓
create　作成
↓
showがないとみることができない
↓
editで編集画面
↓
updateで更新する

- コンソールでexitと同じ control + d

# デバック方法
- binding.pry
- <% binding.pry %>


# 今日やったこと　２０１９０６３０
- リソーシス
　restfulなルーテーィングがいっぱつでつくれる。
　bundle exec rails routes 確認できる

- コントローラを作成した
　boards_controller.rb

- ビュー作成しました。
　newのなかにurlにポストするボタンをつくった
　createメソッドの中身とつくった
　　board.create　ボードの値を与えることでcreateできるようになった
  showに今のIDのDBデータを表示させるしくみをつくった
　edit.html.edit
    findを使ってデータを取得したものをセット
    インスタンス変数からform中にfを使った
    updateボタンをクリックして更新できるようにした
    　findした値でDB更新できるようにした。
    　　

- ajax
  データを非同期で取得やら更新
  GETでshowのなかみをとってくるようになった
  jsonデータで返すためにshowの最後にrender json:jesonデータを返すようにした

- UPDATEしよう
　POSTをPATCHした。
　PATCHのURL　board/1やら２に
　boardのupdateをよべるようにした
　jsonを渡すようにした　require permitにあうjson形式に手動でかいた
　

- ヨンモクjsのなかにrequestBoardでヨンモクのデータをおくれるようにした
　盤面の情報をtoStringで整形した渡すようにした

# 課題
- ページ読み込んですぐにGETでリクエスト送って、サクセスrailsはrender jsonでかえす
- サクセスをみる。サクセスの処理でbanなどにデータを整形して渡す。
- リセットボタンを作りましょう。
- 初期状態のデータをPOSTする。
- 5秒にいっかいリロードするようにする



- バックエンド：railsはjsonを返すだけ
- フロントエンド：ｊｓはもらったjsonを使って画面を作る
- これ、両方できると給料高い
- jsonだけ返すのをapiサーバ

# WEBエンジニアについて
- バック
    rails,sql railsエンジニア、バックエンドエンジニア
    インフラ構築とサーバ構築  インフラエンジニア
    この２つできる人が上級バックエンドエンジニア
- フロント
  　js,html,css,  jsエンジニア
    html,css,ui/ux　webデザイナー

  　この２つできる人が上級WEBデザイナー
    フルスタックエンジニア　＝　上級バック　＋　上級デザイナー

# 20190706
- バリデーション、検証
　不正な入力を防ぐ。セキュリティー

- javascriptなどユーザが操作できるようなところは
セキュリティーフォールだよ、危険が危ない

- バリデーションはモデルが担当する。
- 配列を簡単に書く方法
  irb(main):012:0> %w(small medium large)
  => ["small", "medium", "large"]

- シンボルも簡単にかける！
irb(main):017:0> %i( small medium large )
=> [:small, :medium, :large]


- 文字列である必要がない場合はシンボルを使う！！
　そのほうがデータがかるい
　改ざんされにくい


- プルリクエストはこまめに送りましょう！！！
　レビューする側が確認するときに大変★

- コミットもこまかくやろう。

- １つなにかしたらコミットみたいな
コミットメッセージで２行以上になりそうであれば、それはいろいろやっているのでよくない

# 20190714
- Markdown記法を覚えましょう！

# 見出し
- 箇条書き
- [x] チェックボックス


```html
<p>hello</p>
```
#params.require(table名).permit(:キー, :キー)



- githubにプッシュするとテストが動く、
- テストが通ったらマージができて、
- masterにマージされたらテストが動く
- テストが通ったらherokuに自動でデプロイされる。

- 次回、WEBソケットについて
