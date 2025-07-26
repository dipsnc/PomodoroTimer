
let minutes = document.getElementById('mins');
let seconds = document.getElementById('secs');
let short_break = document.getElementById('short-break');
let long_break = document.getElementById('long-break');
let Pomodoro = document.getElementById('pomodoro');
let Startbtn = document.getElementById('start');
let Pausebtn = document.getElementById('pause');
let Resetbtn = document.getElementById('restart');
const ding1 = document.getElementById('alert1');
const ding2 = document.getElementById('alert2');

function getRandomquote(){
    const quote= [
        "Look at you go! Just don't go away from your work...",
        "Yessss taking back control of your life one pomodoro at a time!",
        "25 minutes of work today means 25 minutes of free time tomorrow :]",
        "Work is important but health is too, take care of yourself <3",
        "A win is a win, even though you probably spent half of it staring at a wall?",
        "Aye nice hustle. Don't disappear on me now though, okay?",
        "Focus: 1, Doomscrolling: 0. Keep it up!"
    ]
    return quote[Math.floor(Math.random() * quote.length)];
}


let timer;
let time_left= 5;
let isRunning = false;
let currentSession = 'Pomodoro';

let streak = parseInt(localStorage.getItem('streak')) || 0;
let sessionsCompleted = parseInt(localStorage.getItem('sessionsCompleted')) || 0;
let level = localStorage.getItem('level') || 'Newbie';

const streakCount = document.getElementById('streak-count');
const sessionCount = document.getElementById('session-count');
const levelCount = document.getElementById('level-title');

function updatedisplay(){
    let mins = Math.floor(time_left/60);
    let secs = time_left%60;
    document.querySelector('.timer-display').innerHTML = 
    `<span id="mins">${Math.floor(time_left / 60).toString().padStart(2, '0')}</span>:
     <span id="secs">${(time_left % 60).toString().padStart(2, '0')}</span>`;
}

function updateStats() {
    streakCount.textContent = streak;
    sessionCount.textContent = sessionsCompleted;
    levelCount.textContent = level;
}

function updateStreak() {
  const today = new Date().toLocaleDateString(); // e.g., "7/26/2025"
  const lastSession = localStorage.getItem('lastSessionDate');
  let streak = parseInt(localStorage.getItem('streak') || '0');

  if (lastSession !== today) {
    if (lastSession) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString();

      if (lastSession === yesterdayStr) {
        streak += 1;
      } else {
        streak = 1; // Reset streak if gap > 1 day
      }
    } else {
      streak = 1; // First time starting streak
    }

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastSessionDate', today);
  }

  document.getElementById('streak-count').textContent = streak;
}



function startTimer(){
    if(!isRunning){
        isRunning=true;
        timer=setInterval(() =>{
            if (time_left>0){
                time_left--;
                updatedisplay();
            }else{
                clearInterval(timer);
                isRunning=false;
                if (currentSession === 'Pomodoro'){
                ding1.play();
                sessionsCompleted++;

                if (sessionsCompleted >= 10) level = 'Focused Pro';
                else if (sessionsCompleted >= 5) level = 'On Fire 🔥';
                else level = 'Newbie';

                localStorage.setItem('streak', streak);
                localStorage.setItem('sessionsCompleted', sessionsCompleted);
                localStorage.setItem('level', level);

                updateStats();
                updateStreak();


                const quote= getRandomquote();
                minutes.textContent = '';
                seconds.textContent ='';
                document.querySelector('.timer-display').innerHTML=`<div class="message"><p>Woohoo! You did it!</p><br><p>${quote}</p></div>`;
                }

                else{
                ding2.play();
                minutes.textContent = '00';
                seconds.textContent ='00';
                document.querySelector('.timer-display').innerHTML=`<div class= "message"><p>Break Over! Get back to work!</p></div>`;
                }
            }
        }, 1000);
    }
}




function pauseTimer(){
    clearInterval(timer);
    isRunning = false;
}

function resetTimer(){
    clearInterval(timer);
    isRunning = false;
    time_left = 25*60;
    updatedisplay()
}

function setTimer(minutes, sessionName){
    clearInterval(timer);
    isRunning =false;
    time_left=minutes*60;
    currentSession = sessionName
    updatedisplay();
}


short_break.addEventListener('click',()=>setTimer(5,'shortBreak'));
long_break.addEventListener('click',()=>setTimer(15, 'longBreak'));
Pomodoro.addEventListener('click',()=>setTimer(25,'Pomodoro'));

Startbtn.addEventListener('click',startTimer);
Pausebtn.addEventListener('click',pauseTimer);
Resetbtn.addEventListener('click',resetTimer);

updatedisplay();
updateStats();

const OpenModalBtn = document.getElementById('openModalBtn');
const StatsModal = document.getElementById('statsModal');
const CloseModalBtn = document.getElementById('closeModalBtn');



// Show modal when "View Stats" button is clicked
OpenModalBtn.addEventListener('click', () => {
    updateStreak()
    StatsModal.style.display = 'flex';
});

// Close modal when X is clicked
CloseModalBtn.addEventListener('click', () => {
  StatsModal.style.display = 'none';
});

// Optional: Click outside modal to close
window.addEventListener('click', (e) => {
  if (e.target === StatsModal) {
    StatsModal.style.display = 'none';
  }
});

