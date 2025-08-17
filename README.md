## 概要

ナンプレを遊ぶためのボードをReactで作成しました。

画面中央の１－９を選択して、ボードのマス目をクリックすると数字が入ります。空欄を選択した状態でクリックするとクリアされます。マスに数字が入っていてもクリックすると上書きします。

- ボードの内容を1つだけsaveし、loadできるようにしています。（localStrageを使用）
- clearを押すとボードがまっさらになります。
- nextを押すと、機械的に次の設定値の予測を行い値を設定します。
  - 値確定
    - あるマス目に対して、重複してはいけない対象のマス目に8種類の数字が入っている場合に残った数字が入ることが確定できた場合の予測数字です。
  - 条件確定
    - 重複してはいけない対象のグループに対して、各マス目に入りうる数字の候補を計算し、グループのマス目の中で1つのマスだけに候補の数字があることで確定できた場合の予測数字です。
  - 予約（Naked Pair/Triple/Quad）による候補除去
    - 行・列・ブロック内で、2～4個のマスが同じ候補セット（例：2つのマスが「2,5」のみを候補に持つ）となっている場合、それ以外のマスからその候補セットの数字を除去します。
- 操作履歴を表示します
  - ユーザーがマス目をクリックするか、nextボタンでマスの内容を変更した場合にどのマスに何の値を入れたかを履歴として表示していきます。
  - clear時は履歴もクリアします。
  - load時は履歴をクリアし、「ロードしました」と表示します。

## 開発

## setup

windows環境に　wingetというms標準のパッケージ管理ソフトがあることを知ったため使用して、Node.jsをインストール。

```
> winget search Node.js 
名前          ID                バージョン 一致         ソース                                                                                                 
--------------------------------------------------------------
Node.js       OpenJS.NodeJS     24.6.0                  winget
Nodist        Nodist.Nodist     0.10.3     Tag: node.js winget
Volta         Volta.Volta       2.0.2      Tag: node.js winget
Node.js (LTS) OpenJS.NodeJS.LTS 22.18.0                 winget  

```

```
> winget install Node.js   
```

※npmにパスが通らなかったので、ターミナル再起動。

type script は共通で使用すると思ったので、global installした。
```
npm install -g typescript 
```

### node version

```
> node -v
v24.6.0

> npm -v       
11.5.1
```


## 動作
github pagesで動作させるようにしています。

- https://tomobou.github.io/react-number-place/

## 参考

github pages への公開の仕方などを参考にさせていただきました。
- https://qiita.com/EisKern/items/15dcf7864fa49df8f247

