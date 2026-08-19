/* ============ DATA ============ */
const KANA = [
  ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
  ["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],
  ["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],
  ["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],
  ["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],
  ["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],
  ["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ","mo"],
  ["ヤ","ya"],["ユ","yu"],["ヨ","yo"],
  ["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],
  ["ワ","wa"],["ヲ","wo"],["ン","n"]
];

const ALT_ROMAJI = {
  "shi":["si"], "chi":["ti"], "tsu":["tu"], "fu":["hu"],
  "wo":["o"], "ji":["zi"], "n":["nn"]
};

const VOCAB = [
  ["コーヒー","kōhī","กาแฟ","coffee"],
  ["テレビ","terebi","โทรทัศน์","television"],
  ["パソコン","pasokon","คอมพิวเตอร์","computer"],
  ["アイス","aisu","ไอศกรีม","ice cream"],
  ["タクシー","takushī","แท็กซี่","taxi"],
  ["ホテル","hoteru","โรงแรม","hotel"],
  ["レストラン","resutoran","ร้านอาหาร","restaurant"],
  ["カメラ","kamera","กล้องถ่ายรูป","camera"],
  ["バス","basu","รถบัส","bus"],
  ["ビール","bīru","เบียร์","beer"],
  ["ケーキ","kēki","เค้ก","cake"],
  ["サラダ","sarada","สลัด","salad"],
  ["ジュース","jūsu","น้ำผลไม้","juice"],
  ["パン","pan","ขนมปัง","bread"],
  ["ノート","nōto","สมุด","notebook"],
  ["ペン","pen","ปากกา","pen"],
  ["バッグ","baggu","กระเป๋า","bag"],
  ["シャツ","shatsu","เสื้อเชิ้ต","shirt"],
  ["スカート","sukāto","กระโปรง","skirt"],
  ["ドア","doa","ประตู","door"],
  ["テーブル","tēburu","โต๊ะ","table"],
  ["ソファ","sofa","โซฟา","sofa"],
  ["ラジオ","rajio","วิทยุ","radio"],
  ["ギター","gitā","กีตาร์","guitar"],
  ["ピアノ","piano","เปียโน","piano"],
  ["スポーツ","supōtsu","กีฬา","sports"],
  ["サッカー","sakkā","ฟุตบอล","soccer"],
  ["テニス","tenisu","เทนนิส","tennis"],
  ["プール","pūru","สระว่ายน้ำ","pool"],
  ["バナナ","banana","กล้วย","banana"],
  ["トマト","tomato","มะเขือเทศ","tomato"],
  ["チーズ","chīzu","ชีส","cheese"],
  ["ミルク","miruku","นม","milk"],
  ["アメリカ","amerika","อเมริกา","America"],
  ["カナダ","kanada","แคนาดา","Canada"],
  ["ロボット","robotto","หุ่นยนต์","robot"],
  ["インターネット","intānetto","อินเทอร์เน็ต","internet"],
  ["メール","mēru","อีเมล","email"],
  ["カード","kādo","การ์ด","card"],
  ["ナイフ","naifu","มีด","knife"]
];

const GOJUON_ROWS = [
  {label:"-",  cells:["ア|a","イ|i","ウ|u","エ|e","オ|o"]},
  {label:"k",  cells:["カ|ka","キ|ki","ク|ku","ケ|ke","コ|ko"]},
  {label:"s",  cells:["サ|sa","シ|shi","ス|su","セ|se","ソ|so"]},
  {label:"t",  cells:["タ|ta","チ|chi","ツ|tsu","テ|te","ト|to"]},
  {label:"n",  cells:["ナ|na","ニ|ni","ヌ|nu","ネ|ne","ノ|no"]},
  {label:"h",  cells:["ハ|ha","ヒ|hi","フ|fu","ヘ|he","ホ|ho"]},
  {label:"m",  cells:["マ|ma","ミ|mi","ム|mu","メ|me","モ|mo"]},
  {label:"y",  cells:["ヤ|ya","","ユ|yu","","ヨ|yo"]},
  {label:"r",  cells:["ラ|ra","リ|ri","ル|ru","レ|re","ロ|ro"]},
  {label:"w",  cells:["ワ|wa","","","","ヲ|wo"]},
  {label:"n",  cells:["ン|n","","","",""]}
];

const DAKUTEN_ROWS = [
  {label:"g", cells:["ガ|ga","ギ|gi","グ|gu","ゲ|ge","ゴ|go"]},
  {label:"z", cells:["ザ|za","ジ|ji","ズ|zu","ゼ|ze","ゾ|zo"]},
  {label:"d", cells:["ダ|da","ヂ|ji","ヅ|zu","デ|de","ド|do"]},
  {label:"b", cells:["バ|ba","ビ|bi","ブ|bu","ベ|be","ボ|bo"]},
  {label:"p", cells:["パ|pa","ピ|pi","プ|pu","ペ|pe","ポ|po"]}
];

const YOUON_ROWS = [
  {label:"ky", cells:["キャ|kya","キュ|kyu","キョ|kyo"]},
  {label:"sh", cells:["シャ|sha","シュ|shu","ショ|sho"]},
  {label:"ch", cells:["チャ|cha","チュ|chu","チョ|cho"]},
  {label:"ny", cells:["ニャ|nya","ニュ|nyu","ニョ|nyo"]},
  {label:"hy", cells:["ヒャ|hya","ヒュ|hyu","ヒョ|hyo"]},
  {label:"my", cells:["ミャ|mya","ミュ|myu","ミョ|myo"]},
  {label:"ry", cells:["リャ|rya","リュ|ryu","リョ|ryo"]},
  {label:"gy", cells:["ギャ|gya","ギュ|gyu","ギョ|gyo"]},
  {label:"j",  cells:["ジャ|ja","ジュ|ju","ジョ|jo"]},
  {label:"by", cells:["ビャ|bya","ビュ|byu","ビョ|byo"]},
  {label:"py", cells:["ピャ|pya","ピュ|pyu","ピョ|pyo"]}
];

/* ============ KANA SET IDENTITY ============ */
const KANA_TYPE = "katakana";
const KANA_LABEL_TH = "คาตากานะ";
const KANA_LABEL_EN = "Katakana";
const APP_TITLE_JP = "カタカナ Lab";
