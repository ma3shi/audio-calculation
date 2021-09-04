'use strict';

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
recognition.lang = 'ja'; //認識言語設定
// recognition.interimResults = true; //認識している途中で暫定の認識結果を得る

// Start recognition and game
recognition.start();

// Speak result
recognition.addEventListener('result', onSpeak);

// End SR service
recognition.addEventListener('end', () => recognition.start());

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const messageEl = document.getElementById('message');
const endgameEl = document.getElementById('end-game');
let countEl = document.getElementById('count');

const questions = [
  { q: '11 × 16', a: 176, h: '1●×1▲＝10×（10+●+▲）+●×▲' },
  { q: '22 × 28', a: 616, h: '■●×■▲＝■0×（■+1）0+●×▲　※●+▲＝10' },
  { q: '22 × 82', a: 1804, h: '●■×▲■＝（●×▲+■）×100+■×■　※●+▲＝10' },
  { q: '92 × 98', a: 9016, h: '（100-a）（100-b）＝100｛100-（a+ｂ）｝+ab' },
  { q: '22 × 18', a: 396, h: '(a+b)(a－b)=a2 － b2' },
  { q: '45 × 11', a: 495, h: '●▲×11=●（●+▲）▲' },
  { q: '45 × 99', a: 4455, h: 'a×99＝100a－a' },
  { q: '45 × 19', a: 855, h: 'a×b＝a（b+1）－a' },
];

let currentCount = 0; //問題番号

// 問題を表示
function displayQuestion() {
  countEl.textContent = `第${currentCount + 1}問`;
  questionEl.innerText = questions[currentCount].q;
  answerEl.textContent = '';
  messageEl.innerText = '';
}

displayQuestion(); // 問題を表示

// 回答を表示
function writeAnswer(answer) {
  answerEl.textContent = answer;
}

// 言葉を話す
function onSpeak(e) {
  const answer = e.results[0][0].transcript;
  writeAnswer(answer);
  checkAnswer(answer);
}

// 回答をチェック
function checkAnswer(answer) {
  const num = +answer;

  // 渡された値が NaN であり、かつその型が Number であるかどうかを判断
  if (Number.isNaN(num)) {
    console.log('数字を話してください');
    messageEl.innerText = '数字を話してください';
    return;
  }
  //正解
  if (num === +questions[currentCount].a) {
    console.log('正解!');
    messageEl.innerText = '正解！';
    currentCount++;
    if (currentCount === 8) {
      gameEnd();
    } else {
      setTimeout(() => {
        displayQuestion();
      }, 2000);
    }
    //不正解
  } else {
    console.log('不正解');
    messageEl.innerText = questions[currentCount].h;
  }
}

// ゲーム終了
function gameEnd() {
  endgameEl.innerHTML = `
    <h1>全問終了</h1>
    <button onclick="location.reload()">もう一度</button>
  `;

  endgameEl.style.display = 'flex';
}
