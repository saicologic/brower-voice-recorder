# 1. インストール

```
npm install --save
```

# 2. アプリを起動する

```
node app.js
```

起動時の出力

```
Server started on port:3000
```

# 3. ブラウザを開く

http://localhost:3000

Developer Tools Barで`Socket connected to Server`と表示されていれば、サーバーと接続しています。

1. `Start recoding`を押すと、`...calhost:3000が次の許可を求めています`とポップアップが出るので、`許可`するを選択します。
2. 適当にマイクに向かって音声を収録します。
3. `Stop recording`を押すと、録音を終了します。

# 4. 収録した音声を聞く

1. 起動したサーバーで`Output output/sample.wav`出力されていれば保存が成功しています。
2. outputフォルダのsample.wavを開くと、録音した音声を確認できます。
