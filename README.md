# ASC AutoFill

App Store Connect のログインを自動化する Chrome 拡張機能。

## 機能

- Apple ID とパスワードを保存し、ログインページで自動入力
- `idmsa.apple.com` の iframe 内フォームに対応
- 「パスワードで続行」ボタンの自動クリック
- 2FA（二要素認証）検出時は自動入力を停止

## インストール

1. このリポジトリをクローン
   ```
   git clone https://github.com/yaaayaaa/appstoreconnect-autofill-extension.git
   ```
2. Chrome で `chrome://extensions` を開く
3. 「デベロッパーモード」を ON
4. 「パッケージ化されていない拡張機能を読み込む」→ クローンしたフォルダを選択

## 使い方

1. 拡張機能のアイコンをクリック
2. Apple ID とパスワードを入力して「保存」
3. App Store Connect のログインページにアクセスすると自動でログイン

## ログインフロー

```
1. #account_name_text_field に Apple ID を入力
2. Submit ボタンをクリック
3. #continue-password（パスワードで続行）の出現を待機 → クリック
4. #password_text_field の出現を待機 → パスワードを入力
5. サインインボタンをクリック
6. 2FA が求められた場合は停止
```

## 注意事項

- 認証情報は `chrome.storage.local` にローカル保存されます（同期・外部送信なし）
- Apple のログイン UI が変更された場合、セレクタの更新が必要になる可能性があります
