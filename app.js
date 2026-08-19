/* ============ APP ENGINE (shared by Hiragana.html & Katakana.html) ============
   This file expects the following globals to already be defined by a
   data file loaded before it (data-hiragana.js or data-katakana.js):
   KANA, ALT_ROMAJI, VOCAB, GOJUON_ROWS, DAKUTEN_ROWS, YOUON_ROWS,
   KANA_TYPE, KANA_LABEL_TH, KANA_LABEL_EN, APP_TITLE_JP
   ================================================================== */

/* ============ i18n ============ */
const STR_TEMPLATE = {
  th:{
    appSubtitle:"ฝึกจำอักษร%KTH% 46 ตัว",
    heroTitle:"เลือกโหมดฝึกฝน",
    heroSub:"เรียนรู้และทดสอบตัวอักษร%KTH%ทั้ง 46 ตัว ผ่าน 6 รูปแบบ",
    mode1Title:"สุ่มตัวอักษร", mode1Desc:"ดูตัวอักษร%KTH%ที่สุ่มขึ้นมา ฝึกจำรูปตัวอักษร",
    mode2Title:"สุ่มคำอ่าน", mode2Desc:"ดูคำอ่านโรมาจิที่สุ่มขึ้นมา แล้วเลือกตัวอักษร%KTH%ที่ตรงกันจากตัวเลือก",
    mode3Title:"พิมพ์คำอ่าน", mode3Desc:"พิมพ์คำอ่านให้ตรงกับตัวอักษรที่สุ่มขึ้นมา วัดความแม่นยำ",
    mode4Title:"คำศัพท์%KTH%", mode4Desc:"คำศัพท์ที่เขียนด้วย%KTH%ล้วน พร้อมคำอ่านและคำแปล",
    mode5Title:"ตาราง%KTH%", mode5Desc:"ตารางอ้างอิงอักษร%KTH%ครบชุด พร้อมคำอ่านและเสียงพิเศษ",
    mode6Title:"ฝึกเขียน", mode6Desc:"ดูคำอ่านแล้วลากเขียนตัว%KTH%ด้วยนิ้ว ปากกา หรือเมาส์ เขียนเบี้ยวได้ ไม่ต้องเป๊ะ",
    mode7Title:"ฝึกอ่านออกเสียง", mode7Desc:"สุ่มตัวอักษรหรือคำศัพท์ กดเปิดไมค์แล้วลองอ่านออกเสียงเพื่อตรวจสอบความถูกต้อง",
    hintClick5:"ดูคำอ่านด้านบน แล้วลากเขียนตัว%KTH%ในกรอบ เขียนเบี้ยวหรือเส้นไม่ตรงก็ได้ ไม่ต้องเป๊ะ",
    hideGuide:"ซ่อนตัวอย่าง", showGuide:"แสดงตัวอย่าง",
    revealBtnText:"เฉลย", clearBtnText:"ล้าง", nextBtnText:"คำถัดไป →",
    chartLegend:"ตารางอ้างอิง ดูอักษรพร้อมคำอ่านโรมาจิได้ครบทุกตัว",
    chartMainTitle:"เสียงพื้นฐาน (Gojūon)",
    chartDakutenTitle:"เสียงพิเศษ: เสียงก้อง / กึ่งก้อง (Dakuten・Handakuten)",
    chartYouonTitle:"เสียงพิเศษ: เสียงควบ (Yōon)",
    backBtn:"กลับเมนู",
    hintClick:"แตะการ์ด หรือกด Space / Enter เพื่อสุ่มใหม่",
    hintClick2:"แตะตัวอักษร%KTH%ที่ตรงกับคำอ่าน",
    hintClick4:"แตะการ์ด หรือกด Space / Enter เพื่อคำถัดไป",
    checkBtn:"ตรวจคำตอบ",
    scoreLabel:"คะแนน", streakLabel:"ติดต่อกัน",
    correctMsg:"ถูกต้อง! 🎉",
    wrongMsgPrefix:"ไม่ถูก คำตอบคือ: ",
    hideRomaji:"ซ่อนคำอ่าน", showRomaji:"แสดงคำอ่านอังกฤษ",
    hideMeaning:"ซ่อนคำแปล", showMeaning:"แสดงคำแปล",
    footerText:"%ATITLE% — ฝึก%KTH%ให้คล่อง ทีละตัว ทีละคำ",
    inputPlaceholder:"พิมพ์คำอ่าน...",
    revealAndListen: "ฟังเฉลย (เสียงสิริ)",
    nextWord: "คำถัดไป →",
    singleLetter: "ตัวอักษรเดี่ยว",
    listening: "กำลังฟัง... พูดได้เลย",
    tryAgain: "ลองใหม่อีกครั้ง ❌",
    notSupportMic: "อุปกรณ์นี้ไม่รองรับระบบแยกแยะเสียง หรือคุณปฏิเสธการเข้าถึง",
    permissionRequired: "โหมดนี้จำเป็นต้องใช้ไมโครโฟนในการรับเสียง คุณต้องการอนุญาตหรือไม่? (ขอเพียงครั้งเดียว)",
    speakMatch: "สุดยอด อ่านถูกต้อง! 🌟"
  },
  en:{
    appSubtitle:"Master all 46 %KEN% characters",
    heroTitle:"Choose a practice mode",
    heroSub:"Learn and test all 46 %KEN% characters through 6 modes",
    mode1Title:"Random Character", mode1Desc:"See a random %KEN% character, practice recognizing its shape",
    mode2Title:"Random Reading", mode2Desc:"See a random romaji reading, then pick the matching %KEN% character",
    mode3Title:"Type the Reading", mode3Desc:"Type the romaji reading that matches the character shown",
    mode4Title:"%KEN% Vocabulary", mode4Desc:"Words written purely in %KEN%, with reading and meaning",
    mode5Title:"%KEN% Chart", mode5Desc:"A full reference chart of %KENLOWER% with readings and special sounds",
    mode6Title:"Writing Practice", mode6Desc:"See a reading and trace the %KEN% with your finger, stylus, or mouse — wobbly lines are totally fine",
    mode7Title:"Speaking Practice", mode7Desc:"Random character or vocabulary, press mic and speak out loud to check correctness",
    hintClick5:"Look at the reading above, then draw the %KEN% in the box. Wobbly or uneven lines are fine — it doesn't need to be perfect",
    hideGuide:"Hide example", showGuide:"Show example",
    revealBtnText:"Reveal", clearBtnText:"Clear", nextBtnText:"Next word →",
    chartLegend:"Reference chart — every character with its romaji reading",
    chartMainTitle:"Basic Sounds (Gojūon)",
    chartDakutenTitle:"Special Sounds: Voiced / Semi-voiced (Dakuten・Handakuten)",
    chartYouonTitle:"Special Sounds: Contracted (Yōon)",
    backBtn:"Back to menu",
    hintClick:"Tap the card, or press Space / Enter for a new one",
    hintClick2:"Tap the %KEN% character that matches the reading",
    hintClick4:"Tap the card, or press Space / Enter for the next word",
    checkBtn:"Check answer",
    scoreLabel:"Score", streakLabel:"Streak",
    correctMsg:"Correct! 🎉",
    wrongMsgPrefix:"Not quite — the answer was: ",
    hideRomaji:"Hide reading", showRomaji:"Show Romaji",
    hideMeaning:"Hide meaning", showMeaning:"Show meaning",
    footerText:"%ATITLE% — practice %KENLOWER%, one card at a time",
    inputPlaceholder:"Type the reading...",
    revealAndListen: "Reveal & Listen (Siri)",
    nextWord: "Next →",
    singleLetter: "Single Letter",
    listening: "Listening... speak now",
    tryAgain: "Try again ❌",
    notSupportMic: "Speech Recognition not supported or permission denied",
    permissionRequired: "This mode requires microphone input. Do you want to allow access? (Asked only once)",
    speakMatch: "Awesome! Correct Pronunciation! 🌟"
  }
};

/* Fill in the %KTH% / %KEN% / %ATITLE% placeholders above using the
   KANA_LABEL_TH / KANA_LABEL_EN / APP_TITLE_JP constants defined in the
   per-set data file (data-hiragana.js or data-katakana.js) that is
   loaded before this script. This lets one engine file serve both
   the Hiragana and Katakana pages. */
function buildSTR(template){
  const out = {};
  for(const langKey in template){
    out[langKey] = {};
    for(const key in template[langKey]){
      out[langKey][key] = template[langKey][key]
        .replaceAll("%KTH%", KANA_LABEL_TH)
        .replaceAll("%KEN%", KANA_LABEL_EN)
        .replaceAll("%KENLOWER%", KANA_LABEL_EN.toLowerCase())
        .replaceAll("%ATITLE%", APP_TITLE_JP);
    }
  }
  return out;
}
const STR = buildSTR(STR_TEMPLATE);

let lang = "th";
let theme = "sky";

function applyLang(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(STR[lang][key]) el.textContent = STR[lang][key];
  });
  document.getElementById("answerInput").placeholder = STR[lang].inputPlaceholder;
  document.getElementById("toggleRomajiText").textContent = state.hideRomaji ? STR[lang].showRomaji : STR[lang].hideRomaji;
  document.getElementById("toggleMeaningText").textContent = state.hideMeaning ? STR[lang].showMeaning : STR[lang].hideMeaning;
  document.getElementById("toggleGuide5Text").textContent = guideVisible5 ? STR[lang].hideGuide : STR[lang].showGuide;
  document.getElementById("toggleRomajiText6").textContent = state6.showRomaji ? STR[lang].hideRomaji : STR[lang].showRomaji;
  document.documentElement.lang = lang;
}

document.getElementById("langSelect").addEventListener("change", (e)=>{
  lang = e.target.value;
  applyLang();
  renderMeaning4();
});

/* ============ THEME ============ */
document.getElementById("themeDots").addEventListener("click",(e)=>{
  const dot = e.target.closest(".theme-dot");
  if(!dot) return;
  theme = dot.getAttribute("data-t");
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll(".theme-dot").forEach(d=>d.classList.remove("active"));
  dot.classList.add("active");
});

/* ============ NAVIGATION ============ */
const screens = {
  home: document.getElementById("screen-home"),
  0: document.getElementById("panel-0"),
  1: document.getElementById("panel-1"),
  2: document.getElementById("panel-2"),
  3: document.getElementById("panel-3"),
  4: document.getElementById("panel-4"),
  5: document.getElementById("panel-5"),
  6: document.getElementById("panel-6")
};
let currentMode = null;
let chartBuilt = false;
let hasMicPermission = false; // ตัวแปรสำหรับจำสถานะการขอสิทธิ์ไมค์

function goHome(){
  currentMode = null;
  screens.home.style.display = "block";
  [0,1,2,3,4,5,6].forEach(m=>screens[m].classList.remove("active"));
  if (recognition) { try { recognition.stop(); } catch(e){} }
}

function goMode(m){
  if(m === 6) {
    // แก้ไขจุดที่ 1: ถ้าเคยได้สิทธิ์แล้ว ให้เข้าโหมด 6 ทันที ไม่ต้องเรียก confirm อีก
    if (hasMicPermission) {
      proceedToMode6();
      return;
    }

    // ถามครั้งแรกครั้งเดียวจริง ๆ
    const consent = confirm(STR[lang].permissionRequired);
    if(!consent) return;
    
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
        hasMicPermission = true; 
        proceedToMode6();
      })
      .catch(err => {
        alert(STR[lang].notSupportMic);
      });
    } else {
      hasMicPermission = true; 
      proceedToMode6();
    }
    return;
  }
  
  proceedToMode(m);
}

function proceedToMode(m) {
  currentMode = m;
  screens.home.style.display = "none";
  [0,1,2,3,4,5,6].forEach(x=>screens[x].classList.toggle("active", x==m));
  if(m==1) newCard1();
  if(m==2) newCard2(true);
  if(m==3) newCard3(true);
  if(m==4) newCard4();
  if(m==0 && !chartBuilt){ buildAllCharts(); chartBuilt = true; }
  if(m==5){
    newCard5();
    requestAnimationFrame(()=> setupCanvas5());
  }
}

function proceedToMode6() {
  proceedToMode(6);
  initSpeechRecognition();
  newCard6();
}

document.querySelectorAll(".mode-card").forEach(c=>{
  c.addEventListener("click", ()=> goMode(parseInt(c.getAttribute("data-mode"))));
});
document.querySelectorAll("[data-back]").forEach(b=> b.addEventListener("click", goHome));

/* ============ helpers ============ */
function pickRandom(arr, excludeIdx){
  if(arr.length===1) return 0;
  let i;
  do{ i = Math.floor(Math.random()*arr.length); }while(i===excludeIdx);
  return i;
}
function normalize(str){
  return str.trim().toLowerCase();
}

/* ============ MODE 1 ============ */
let idx1 = -1;
function newCard1(){
  idx1 = pickRandom(KANA, idx1);
  document.getElementById("kanaDisplay1").textContent = KANA[idx1][0];
}
document.getElementById("card1").addEventListener("click", newCard1);

/* ============ MODE 2 ============ */
let idx2 = -1;
let score2 = 0, total2 = 0, streak2 = 0;
let awaitingNext2 = false;

function newCard2(reset){
  if(reset){ score2=0; total2=0; streak2=0; updateStats2(); }
  idx2 = pickRandom(KANA, idx2);
  document.getElementById("romajiDisplay2").textContent = KANA[idx2][1];
  buildChoices2();
  const fb = document.getElementById("feedback2");
  fb.textContent = "";
  fb.className = "feedback";
  awaitingNext2 = false;
}

function buildChoices2(){
  const poolSize = KANA.length;
  const chosen = new Set([idx2]);
  while(chosen.size < 4 && chosen.size < poolSize){
    chosen.add(Math.floor(Math.random()*poolSize));
  }
  const arr = Array.from(chosen);
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  const grid = document.getElementById("choiceGrid2");
  grid.innerHTML = "";
  arr.forEach(i=>{
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.textContent = KANA[i][0];
    btn.setAttribute("data-idx", i);
    grid.appendChild(btn);
  });
}

function updateStats2(){
  document.getElementById("scoreVal2").textContent = score2;
  document.getElementById("totalVal2").textContent = total2;
  document.getElementById("streakVal2").textContent = streak2;
}

document.getElementById("choiceGrid2").addEventListener("click", (e)=>{
  const btn = e.target.closest(".choice-btn");
  if(!btn || awaitingNext2) return;
  const chosenIdx = parseInt(btn.getAttribute("data-idx"), 10);
  total2++;
  const fb = document.getElementById("feedback2");
  document.querySelectorAll("#choiceGrid2 .choice-btn").forEach(b=> b.disabled = true);
  if(chosenIdx === idx2){
    score2++; streak2++;
    btn.classList.add("correct");
    fb.textContent = STR[lang].correctMsg;
    fb.className = "feedback ok";
  }else{
    streak2 = 0;
    btn.classList.add("wrong");
    const correctBtn = document.querySelector(`#choiceGrid2 .choice-btn[data-idx="${idx2}"]`);
    if(correctBtn) correctBtn.classList.add("correct");
    fb.textContent = STR[lang].wrongMsgPrefix + KANA[idx2][0];
    fb.className = "feedback no";
  }
  updateStats2();
  awaitingNext2 = true;
  setTimeout(()=> newCard2(false), 1100);
});

/* ============ MODE 3 ============ */
let idx3 = -1;
let score3 = 0, total3 = 0, streak3 = 0;
let awaitingNext3 = false;
function newCard3(reset){
  if(reset){ score3=0; total3=0; streak3=0; updateStats3(); }
  idx3 = pickRandom(KANA, idx3);
  document.getElementById("kanaDisplay3").textContent = KANA[idx3][0];
  const input = document.getElementById("answerInput");
  input.value = "";
  input.classList.remove("wrong","right");
  document.getElementById("feedback3").textContent = "";
  document.getElementById("feedback3").className = "feedback";
  awaitingNext3 = false;
  input.focus();
}
function updateStats3(){
  document.getElementById("scoreVal").textContent = score3;
  document.getElementById("totalVal").textContent = total3;
  document.getElementById("streakVal").textContent = streak3;
}
function checkAnswer3(){
  if(awaitingNext3){ newCard3(false); return; }
  const input = document.getElementById("answerInput");
  const val = normalize(input.value);
  if(!val) return;
  const correct = KANA[idx3][1];
  const alts = ALT_ROMAJI[correct] || [];
  const isRight = val === correct || alts.includes(val);
  total3++;
  const fb = document.getElementById("feedback3");
  if(isRight){
    score3++; streak3++;
    input.classList.remove("wrong"); input.classList.add("right");
    fb.textContent = STR[lang].correctMsg;
    fb.className = "feedback ok";
  }else{
    streak3 = 0;
    input.classList.remove("right"); input.classList.add("wrong");
    fb.textContent = STR[lang].wrongMsgPrefix + correct;
    fb.className = "feedback no";
  }
  updateStats3();
  awaitingNext3 = true;
  setTimeout(()=> newCard3(false), 1100);
}
document.getElementById("checkBtn").addEventListener("click", checkAnswer3);
document.getElementById("answerInput").addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){ e.preventDefault(); checkAnswer3(); }
});

/* ============ MODE 4 ============ */
let idx4 = -1;
const state = { hideRomaji:false, hideMeaning:false };
function newCard4(){
  idx4 = pickRandom(VOCAB, idx4);
  const [kana, romaji] = VOCAB[idx4];
  document.getElementById("kanaDisplay4").textContent = kana;
  document.getElementById("romajiDisplay4").textContent = romaji;
  renderMeaning4();
}
function renderMeaning4(){
  const item = VOCAB[idx4];
  if(!item) return;
  const meaning = lang==="th" ? item[2] : item[3];
  document.getElementById("meaningDisplay4").textContent = meaning;
}
document.getElementById("card4").addEventListener("click", (e)=>{
  if(e.target.closest(".toggle-btn")) return;
  newCard4();
});
document.getElementById("toggleRomaji").addEventListener("click",(e)=>{
  e.stopPropagation();
  state.hideRomaji = !state.hideRomaji;
  const el = document.getElementById("romajiDisplay4");
  el.classList.toggle("blurred", state.hideRomaji);
  e.currentTarget.classList.toggle("off", state.hideRomaji);
  applyLang();
});
document.getElementById("toggleMeaning").addEventListener("click",(e)=>{
  e.stopPropagation();
  state.hideMeaning = !state.hideMeaning;
  const el = document.getElementById("meaningDisplay4");
  el.classList.toggle("blurred", state.hideMeaning);
  e.currentTarget.classList.toggle("off", state.hideMeaning);
  applyLang();
});

/* ============ MODE 5 (writing practice) ============ */
let idx5 = -1;
let guideVisible5 = false;
const canvas5 = document.getElementById("writeCanvas5");
const ctx5 = canvas5.getContext("2d");
let drawing5 = false;

function setupCanvas5(){
  const rect = canvas5.getBoundingClientRect();
  if(rect.width === 0 || rect.height === 0) return;
  const dpr = window.devicePixelRatio || 1;
  canvas5.width = rect.width * dpr;
  canvas5.height = rect.height * dpr;
  ctx5.setTransform(1,0,0,1,0,0);
  ctx5.scale(dpr, dpr);
  ctx5.lineCap = "round";
  ctx5.lineJoin = "round";
  ctx5.lineWidth = Math.max(8, rect.width * 0.045);
  ctx5.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#14b8c9";
}

function clearCanvas5(){
  ctx5.save();
  ctx5.setTransform(1,0,0,1,0,0);
  ctx5.clearRect(0, 0, canvas5.width, canvas5.height);
  ctx5.restore();
}

function getCanvasPos5(e){
  const rect = canvas5.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

canvas5.addEventListener("pointerdown", (e)=>{
  e.preventDefault();
  e.stopPropagation(); // 👈 ป้องกันไม่ให้ Event หลุดไปถึงตัวเบราว์เซอร์ชั้นนอก
  drawing5 = true;
  canvas5.setPointerCapture(e.pointerId);
  const p = getCanvasPos5(e);
  ctx5.beginPath();
  ctx5.moveTo(p.x, p.y);
});

// ดักจับเพิ่มเติมเพื่อป้องกันการกดค้าง (Context Menu) บนปุ่มขวาหรือบน Mobile ในพื้นที่วาดเขียน
canvas5.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
canvas5.addEventListener("pointermove", (e)=>{
  if(!drawing5) return;
  e.preventDefault();
  const p = getCanvasPos5(e);
  ctx5.lineTo(p.x, p.y);
  ctx5.stroke();
});
window.addEventListener("pointerup", ()=> drawing5 = false);
window.addEventListener("pointercancel", ()=> drawing5 = false);

window.addEventListener("resize", ()=>{
  if(currentMode === 5){ setupCanvas5(); }
});

function newCard5(){
  idx5 = pickRandom(KANA, idx5);
  document.getElementById("romajiDisplay5").textContent = KANA[idx5][1];
  const ghost = document.getElementById("writeGhost5");
  ghost.textContent = KANA[idx5][0];
  ghost.style.display = guideVisible5 ? "" : "none";
  const revealEl = document.getElementById("revealKana5");
  revealEl.textContent = KANA[idx5][0];
  revealEl.classList.remove("show");
  clearCanvas5();
}

document.getElementById("clearBtn5").addEventListener("click", clearCanvas5);
document.getElementById("nextBtn5").addEventListener("click", newCard5);
document.getElementById("revealBtn5").addEventListener("click", ()=>{
  document.getElementById("revealKana5").classList.toggle("show");
});
document.getElementById("toggleGuide5").addEventListener("click", (e)=>{
  guideVisible5 = !guideVisible5;
  const ghost = document.getElementById("writeGhost5");
  ghost.style.display = guideVisible5 ? "" : "none";
  e.currentTarget.classList.toggle("off", !guideVisible5);
  document.getElementById("toggleGuide5Text").textContent = guideVisible5 ? STR[lang].hideGuide : STR[lang].showGuide;
});

/* ============ MODE 6 - SPEAKING PRACTICE ============ */
let currentItem6 = null; 
let state6 = { showRomaji: false, isRecording: false };
let recognition = null;

function initSpeechRecognition() {
  if (recognition) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById("feedback6").textContent = STR[lang].notSupportMic;
    document.getElementById("micBtn6").style.display = "none";
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "ja-JP"; 
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    state6.isRecording = true;
    const micBtn = document.getElementById("micBtn6");
    micBtn.classList.add("recording");
    micBtn.textContent = "🛑";
    const fb = document.getElementById("feedback6");
    fb.textContent = STR[lang].listening;
    fb.className = "feedback";
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    evaluateSpeech6(speechResult);
  };

  // แก้ไขจุดที่ 3: ป้องกันกรณีระเบิดเวลาเออเรอร์ ให้เคลียร์สถานะปุ่มให้กลับมาปกติเสมอ
  recognition.onerror = (event) => {
    console.log("Speech Error:", event.error);
    stopRecordingState6();
    if(event.error !== 'no-speech') {
      document.getElementById("feedback6").textContent = STR[lang].tryAgain;
      document.getElementById("feedback6").className = "feedback no";
    }
  };

  recognition.onend = () => {
    stopRecordingState6();
  };
}

function stopRecordingState6() {
  state6.isRecording = false;
  const micBtn = document.getElementById("micBtn6");
  micBtn.classList.remove("recording");
  micBtn.textContent = "🎙️";
}

function newCard6() {
  const isVocab = Math.random() < 0.5;
  if (isVocab) {
    const vIdx = Math.floor(Math.random() * VOCAB.length);
    const item = VOCAB[vIdx];
    currentItem6 = { type: 'vocab', jp: item[0], romaji: item[1], th: item[2] };
  } else {
    const lIdx = Math.floor(Math.random() * KANA.length);
    const item = KANA[lIdx];
    currentItem6 = { type: 'letter', jp: item[0], romaji: item[1], th: STR[lang].singleLetter };
  }

  document.getElementById("kanaDisplay6").textContent = currentItem6.jp;
  document.getElementById("romajiDisplay6").textContent = currentItem6.romaji;
  document.getElementById("meaningDisplay6").textContent = currentItem6.th;
  
  const fb = document.getElementById("feedback6");
  fb.textContent = "";
  fb.className = "feedback";
}

function evaluateSpeech6(resultText) {
  const fb = document.getElementById("feedback6");
  // ทำความสะอาดข้อความ ตัดพวกเว้นวรรคและจุดฟูลสต็อปออกให้หมด
  const cleanResult = resultText.replace(/[\s\.\?、。]/g, "");
  const target = currentItem6.jp;

  // สำหรับคนไทยสำเนียงไม่เป๊ะ: ใช้ .includes ตรวจจับส่วนใดส่วนหนึ่งของคำ ช่วยให้ผ่านง่ายขึ้น
  if (cleanResult === target || target.includes(cleanResult) || cleanResult.includes(target)) {
    fb.textContent = `「${resultText}」 -> ` + STR[lang].speakMatch;
    fb.className = "feedback ok";
  } else {
    fb.textContent = `「${resultText}」 -> ` + STR[lang].tryAgain;
    fb.className = "feedback no";
  }
}

document.getElementById("micBtn6").addEventListener("click", () => {
  if (!recognition) return;
  if (state6.isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
});

document.getElementById("answerBtn6").addEventListener("click", () => {
  if (!currentItem6) return;
  const utterance = new SpeechSynthesisUtterance(currentItem6.jp);
  utterance.lang = "ja-JP";
  
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith("ja"));
  if (jpVoice) utterance.voice = jpVoice;
  
  window.speechSynthesis.speak(utterance);
});

document.getElementById("nextBtn6").addEventListener("click", newCard6);

document.getElementById("toggleRomaji6").addEventListener("click", (e) => {
  state6.showRomaji = !state6.showRomaji;
  const el = document.getElementById("romajiDisplay6");
  el.classList.toggle("blurred", !state6.showRomaji);
  e.currentTarget.classList.toggle("off", !state6.showRomaji);
  applyLang();
});


/* ============ MODE 5 - CHART ============ */
function renderKanaTable(containerId, rows, headerLabels){
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  const colTemplate = `56px repeat(${headerLabels.length},1fr)`;

  const headRow = document.createElement("div");
  headRow.className = "kt-row";
  headRow.style.gridTemplateColumns = colTemplate;
  headRow.appendChild(document.createElement("div"));
  headerLabels.forEach(h=>{
    const d = document.createElement("div");
    d.className = "kt-head-cell";
    d.textContent = h;
    headRow.appendChild(d);
  });
  el.appendChild(headRow);

  rows.forEach(r=>{
    const rowEl = document.createElement("div");
    rowEl.className = "kt-row";
    rowEl.style.gridTemplateColumns = colTemplate;

    const label = document.createElement("div");
    label.className = "kt-label";
    label.textContent = r.label;
    rowEl.appendChild(label);

    r.cells.forEach(c=>{
      const cell = document.createElement("div");
      if(!c){
        cell.className = "kt-cell empty";
        rowEl.appendChild(cell);
        return;
      }
      const [kj, rj] = c.split("|");
      cell.className = "kt-cell";
      cell.innerHTML = `<span class="kj">${kj}</span><span class="rj">${rj}</span>`;
      rowEl.appendChild(cell);
    });
    el.appendChild(rowEl);
  });
}
function buildAllCharts(){
  renderKanaTable("tableMain", GOJUON_ROWS, ["a","i","u","e","o"]);
  renderKanaTable("tableDakuten", DAKUTEN_ROWS, ["a","i","u","e","o"]);
  renderKanaTable("tableYouon", YOUON_ROWS, ["ya","yu","yo"]);
}

/* ============ GLOBAL KEYS ============ */
document.addEventListener("keydown",(e)=>{
  if(e.target.tagName === "INPUT") return;
  if(e.code==="Space" || e.code==="Enter"){
    if(currentMode===1){
      e.preventDefault();
      newCard1();
    }
    if(currentMode===4){
      e.preventDefault();
      newCard4();
    }
  }
});

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {};
}

/* ============ระบบป้องกันการคัดลอกและดูโค้ด ============ */

// 1. ป้องกันการคลิกขวา (Context Menu) ทั่วทั้งหน้าเว็บ
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// 2. ป้องกันคีย์ลัดยอดฮิต (Ctrl+S, Ctrl+U, Ctrl+Shift+I, F12 ฯลฯ)
document.addEventListener('keydown', function(e) {
  // บล็อก F12
  if (e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
  
  // บล็อก Ctrl + Shift + I (เปิด DevTools บน Windows) หรือ Cmd + Alt + I (Mac)
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
    e.preventDefault();
    return false;
  }
  
  // บล็อก Ctrl + U (ดู Source Code) หรือ Cmd + Option + U
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
    e.preventDefault();
    return false;
  }
  
  // บล็อก Ctrl + S (เซฟหน้าเว็บลงเครื่อง) หรือ Cmd + S
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
    e.preventDefault();
    return false;
  }

  // บล็อก Ctrl + C (คัดลอก) ในกรณีที่หลุดจาก CSS ป้องกัน
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
    e.preventDefault();
    return false;
  }
});

// 3. ป้องกันการลากคลุมเพื่อลากสิ่งของหรือรูปภาพ (Drag & Drop) ออกไปนอกเว็บ
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
});

/* ============ INIT ============ */
goHome();
applyLang();
