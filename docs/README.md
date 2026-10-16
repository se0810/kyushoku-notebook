# きゅうしょく手帖

給食を題材にした60レシピと60枚のAI生成料理画像を含む、ビルド不要の静的サイトです。公式出典付きレシピ12件と創作サンプル48件を区別しています。写真はすべてAI生成イメージで、実際の給食記録写真ではありません。

## GitHub Pagesで公開する

1. GitHubで新しいリポジトリを作成します。
2. ZIPを展開し、**このREADMEとindex.htmlがある階層の中身すべて**をリポジトリ直下にアップロードします。ZIPそのものや、外側のフォルダーだけをアップロードしないでください。assetsフォルダーも含めてください。
3. リポジトリの Settings → Pages を開きます。
4. Source を Deploy from a branch、Branch を main、フォルダーを /(root) にして Save を押します。
5. 配信が完了するとPages設定にサイトURLが表示されます。他の端末でもそのURLから閲覧できます。

公式手順：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## ファイル

- index.html：ページ
- style.css：デザイン
- app.js：表示、検索、お気に入り、レシピ表示
- filters.js：絞り込み
- data.js / more-recipes.js：創作レシピ
- verified.js：公式資料を参照したレシピ、出典URL
- assets/：各料理IDに対応するWebP画像
- PHOTO-NOTES.md / photo-prompts.json：写真の生成情報

公式資料の公開・更新年を提供年として扱っていません。確認できない提供日はnullです。お気に入りはブラウザ内だけに保存します。

## ローカルで確認

このソースはJavaScriptモジュールを使用するため、ローカルHTTPサーバーで配信してください。別途提供した kyushoku-60-photos.html は画像とコードを内蔵した単独閲覧版です。
