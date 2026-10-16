import {prefectures,records as samples} from './data.js';
import {verifiedRecords} from './verified.js';
import {moreRecipes} from './more-recipes.js';
import {filterRecords,regions} from './filters.js';
const records=[...verifiedRecords,...samples,...moreRecipes],$=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category='すべて',favorites=new Set(),storageOK=true;
try{const v=JSON.parse(localStorage.getItem('kyushoku-favorites')||'[]');if(Array.isArray(v))favorites=new Set(v.filter(id=>records.some(r=>r.id===id)))}catch{storageOK=false}
prefectures.forEach(p=>$('#pref').add(new Option(p,p)));
Object.keys(regions).forEach(r=>$('#region').add(new Option(r,r)));
$('#era').add(new Option('提供年代不明・未設定','unknown'));
for(let y=1950;y<=2025;y+=5)$('#era').add(new Option(`${y}–${y+4}年`,String(y)));
[...new Set(verifiedRecords.map(r=>r.municipality))].forEach(c=>$('#city').add(new Option(c,c)));
['すべて','主食','主菜','副菜','汁物','その他'].forEach(c=>{const b=document.createElement('button');b.textContent=c;b.onclick=()=>{category=c;render()};b.dataset.cat=c;$('#tabs').append(b)});
function current(){return filterRecords(records,{prefecture:$('#pref').value,region:$('#region').value,city:$('#city').value,era:$('#era').value,kind:$('#kind').value,query:$('#search').value,category,favoriteOnly:$('#favoriteOnly').checked,favorites,sort:$('#sort').value})}
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('kyushoku-favorites',JSON.stringify([...favorites]))}catch{storageOK=false}render()}
function render(){
 document.querySelectorAll('[data-cat]').forEach(b=>{const a=b.dataset.cat===category;b.classList.toggle('active',a);b.setAttribute('aria-pressed',String(a))});
 const found=current();$('#count').textContent=`${found.length} 件`;$('#favoriteCount').textContent=String(favorites.size);
 $('#storageNote').textContent=storageOK?'お気に入りはこのブラウザに保存されます。':'保存領域が使えないため、お気に入りはこの画面を開いている間だけ有効です。';
 $('#context').textContent=[$('#pref').value||$('#region').value||'全国',$('#city').value,$('#era').value==='unknown'?'提供年代不明・未設定':$('#era').value?`${$('#era').value}–${+$('#era').value+4}年`:'すべての年代'].filter(Boolean).join(' / ');
 $('#cards').replaceChildren();$('#random').disabled=!found.length;
 if(!found.length){$('#cards').innerHTML=`<div class="empty"><h3>${$('#favoriteOnly').checked?'この条件のお気に入りはありません。':'この条件の献立は未収録です。'}</h3><p>年代が不明・未設定のレシピは、特定年代の検索には含まれません。<br>条件を変えてお試しください。</p><button id="emptyReset">条件をリセット</button></div>`;$('#emptyReset').onclick=reset;return}
 found.forEach(r=>{const official=r.dataKind==='verified',a=document.createElement('article');a.className='card';
 a.innerHTML=`<button class="recipe-open" aria-label="${esc(r.title)}のレシピを開く"><div class="food-art" style="--bg:${r.color}"><span class="art-label">AI生成イメージ</span><img class="meal-photo" src="assets/${r.id}.webp" alt="${esc(r.title)}のAI生成イメージ" width="640" height="480" loading="lazy"></div><div class="card-body"><div class="tags"><span>${esc(r.prefecture||'地域指定なし')}${r.municipality?' / '+esc(r.municipality):''}</span><span>${r.category}</span></div><h3>${esc(r.title)}</h3><p>${r.servedYear===null?(r.dataKind==='verified'?'提供年代不明・未設定':'年代未設定'):`デモ年代：${Math.floor(r.servedYear/5)*5}–${Math.floor(r.servedYear/5)*5+4}年`}<br>${official?'公式資料の分量・手順を確認済み':'提供記録に基づかない創作献立'}</p><div class="card-bottom"><span class="${official?'verified':'sample'}">● ${official?'公式出典あり':'サンプル'}</span><span>レシピを見る ↗</span></div></div></button><button class="favorite" aria-label="${esc(r.title)}をお気に入り${favorites.has(r.id)?'から削除':'に追加'}" aria-pressed="${favorites.has(r.id)}">${favorites.has(r.id)?'♥ 保存済み':'♡ お気に入り'}</button>`;
 a.querySelector('.recipe-open').onclick=()=>openRecipe(r);a.querySelector('.favorite').onclick=()=>toggleFavorite(r.id);$('#cards').append(a)});
}
function sourceBlock(r){const s=r.source;return s?`<div class="source-box"><b>公式出典：${esc(s.publisher)}</b><p><a target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">${esc(s.title)} を開く ↗</a></p><small>確認日：${s.verifiedAt}${s.pageUpdatedAt?' ／ 原典更新日：'+s.pageUpdatedAt:''}<br>確認範囲：レシピ。学校別の提供実績・提供年は未確認です。</small></div>`:'<p class="warning">サンプル献立・創作レシピです。実データの出典はありません。</p>'}
function openRecipe(r){
 $('#detailBody').innerHTML=`<p class="eyebrow">RECIPE NOTE / ${esc(r.prefecture||'地域指定なし')}${r.municipality?' / '+esc(r.municipality):''} / ${r.category}</p><h2>${esc(r.title)}</h2><figure class="recipe-photo"><img src="assets/${r.id}.webp" alt="${esc(r.title)}のAI生成イメージ" width="640" height="480"><figcaption>AI生成イメージ。実際の学校給食の記録写真ではありません。</figcaption></figure><p class="warning">${esc(r.note)}</p>${sourceBlock(r)}<div class="recipe-actions"><button id="detailFavorite">${favorites.has(r.id)?'♥ お気に入りから削除':'♡ お気に入りに追加'}</button><button id="printRecipe">レシピを印刷</button></div><h3>材料（${esc(r.recipe.yieldLabel||r.recipe.servings+'人分')}）</h3><table>${r.recipe.ingredients.map(i=>`<tr><td>${esc(i)}</td></tr>`).join('')}</table><h3>作り方</h3><ol>${r.recipe.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${r.recipe.tip?`<h3>調理メモ</h3><p>${esc(r.recipe.tip)}</p>`:''}<p style="font-size:12px">${r.dataKind==='verified'?'原典の分量を記載し、手順は読みやすく要約しています。':'家庭向けに創作した試作用レシピです。'} アレルゲンは各食材・商品の表示をご確認ください。</p><h3>ほかの一皿も見る</h3><div id="related"></div>`;
 $('#detailFavorite').onclick=()=>{toggleFavorite(r.id);$('#detailFavorite').textContent=favorites.has(r.id)?'♥ お気に入りから削除':'♡ お気に入りに追加'};$('#printRecipe').onclick=()=>window.print();
 records.filter(x=>x.id!==r.id&&x.category===r.category).slice(0,3).forEach(x=>{const b=document.createElement('button');b.textContent=x.title+' →';b.onclick=()=>{openRecipe(x);$('#detail').scrollTop=0};$('#related').append(b)});
 if(!$('#detail').open)$('#detail').showModal();
}
function reset(){['pref','region','city','era','kind','search','sort'].forEach(id=>$('#'+id).value='');$('#favoriteOnly').checked=false;category='すべて';render()}
['pref','region','city','era','kind','sort','favoriteOnly'].forEach(id=>$('#'+id).onchange=render);$('#search').oninput=render;$('#reset').onclick=reset;
$('#saitama').onclick=()=>{reset();render();$('#explore').scrollIntoView()};
$('#random').onclick=()=>{const found=current();if(found.length)openRecipe(found[Math.floor(Math.random()*found.length)])};
$('.close').onclick=()=>$('#detail').close();$('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}});
$('#about').onclick=()=>{$('#detailBody').innerHTML=`<p class="eyebrow">ABOUT THIS NOTEBOOK</p><h2>日本の給食を、少しずつ。</h2><p>合計${records.length}件。公式出典付きレシピ${verifiedRecords.length}件、創作サンプル${samples.length+moreRecipes.length}件を収録しています。公式レシピは埼玉県の草加市とふじみ野市の公開資料を参照しました。</p><p class="warning">公式資料の公開・更新年と給食の提供年は別の情報です。公式レシピの提供年代は不明のため、特定年代の検索には含めません。サンプルの地域・年代はデモ設定です。</p><p>材料・分量は出典を確認し、作り方は要約しています。学校単位の提供実績や一食分の組み合わせを示すものではありません。</p><p>お気に入りはこのブラウザ内に保存します。他の端末との同期機能はありません。</p>`;$('#detail').showModal()};
$('#count').setAttribute('aria-live','polite');render();
