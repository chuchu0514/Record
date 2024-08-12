let currentDate = new Date(); //let은 블록스코프변수  new에 관한 설명은 https://velog.io/@gil0127/%EC%83%9D%EC%84%B1%EC%9E%90%EC%99%80-new-%ED%82%A4%EC%9B%8C%EB%93%9C 변경되지 않는 값에는 const 사용, 변경될 수 있는 값에는 let 사용 얘는 사실상 전역스코프임 블록{} 안에 있는 게 아니잖아

// 달력 기능
function initCalendar() { //달력 갱신 함수 밑의 두 함수를 포함하고 있음
    updateCalendar();
    document.getElementById('prev-month').addEventListener('click',()=>changeMonth(-1));
    document.getElementById('next-month').addEventListener('click',()=>changeMonth(1)); //()=>는 function(){changeMonth(1)}의 줄임말
}

function updateCalendar(){ //달력 업데이트 함수
    const year = currentDate.getFullYear(); //Date()의 메소드 년과 월을 가져오기
    const month = currentDate.getMonth(); //0부터 시작 0=1월

    document.getElementById('current-month-year').textContent =`${year}년 ${month + 1}월`;//문자열 내에 변수를 삽입하고 싶으면 ${} ''+''랑 같음 주의 `백틱과 '따옴표는 다르다 
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0); //0은 이전 달의 마지막 날로 해석함 =다음 달의 0일 

    const calendarBody = document.querySelector('#calendar-body tbody');
    calendarBody.innerHTML =''; //안에 비우기

    let date = 1;
    for (let i = 0; i < 6; i++) { //행 생성
        const row = document.createElement('tr'); //tr을 생성하고 변수에 넣어줌
        for (let j = 0; j < 7; j++) { //일 생성
            if (i === 0 && j < firstDay.getDay()) { //첫째줄의 첫째요일 전까지는 빈칸 생성
                row.appendChild(document.createElement('td'));
            } else if (date > lastDay.getDate()) { //마지막 날이 되면 반복문 탈출
                break;
            } else {
                const cell = document.createElement('td'); //td를 생성하고 변수에 넣어줌
                cell.textContent = date; //날짜 출력
                if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    cell.classList.add('today'); //오늘 날짜 표시
                }
                row.appendChild(cell); //행에 추가
                date++;
            }
        }
        calendarBody.appendChild(row); //행을 추가
        if (date > lastDay.getDate()) break; //마지막 날이 되면 반복문 탈출
    }

}

function changeMonth(delta) { //월 변경 함수
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

window.onload = initCalendar; //웹페이지 로딩후 이 함수가 실행됨






let timerInterval;  // 타이머의 인터벌을 저장할 변수. setInterval의 반환값을 저장하여 나중에 타이머를 멈출 때 사용
let seconds = 0;  // 경과 시간을 초 단위로 저장할 변수

function initTimer() {
    // 각 버튼에 이벤트 리스너를 추가하여 클릭 시 해당 함수가 실행되도록 설정
    document.getElementById('start-timer').addEventListener('click', startTimer);//7번줄 함수와 왜 구조가 다른지 공부 인자가 없어
    document.getElementById('stop-timer').addEventListener('click', stopTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
}

function startTimer() {
    if (!timerInterval) {  // timerInterval이 null이거나 undefined일 때만 실행 (중복 시작 방지)
        timerInterval = setInterval(updateTimer, 1000);  // 1초(1000ms)마다 updateTimer 함수를 실행하고, 그 반환값을 timerInterval에 저장
    }
}

function stopTimer() {
    clearInterval(timerInterval);  // timerInterval에 저장된 인터벌을 중지
    timerInterval = null;  // timerInterval 변수를 초기화하여 타이머가 멈췄음을 표시
}

function resetTimer() {
    clearInterval(timerInterval);  // 실행 중인 타이머를 중지
    timerInterval = null;  // timerInterval 변수 초기화
    seconds = 0;  // 경과 시간을 0으로 리셋
    updateTimerDisplay();  // 화면에 표시되는 시간을 업데이트
}

function updateTimer() {
    seconds++;  // 경과 시간을 1초 증가
    updateTimerDisplay();  // 화면에 표시되는 시간을 업데이트
}

function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);  // 전체 초를 3600으로 나누어 시간 계산
    const minutes = Math.floor((seconds % 3600) / 60);  // 시간을 제외한 나머지 초를 60으로 나누어 분 계산
    const secs = seconds % 60;  // 60으로 나눈 나머지를 초로 사용
    const display = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;  // 시:분:초 형식의 문자열 생성
    document.getElementById('timer-display').textContent = display;  // 생성된 문자열을 화면에 표시
}

function pad(number) {
    return number.toString().padStart(2, '0');  // 숫자를 문자열로 변환하고, 한 자리 수일 경우 앞에 0을 붙여 두 자리로 만듦
}

// 페이지 로드 시 타이머 초기화
window.addEventListener('load', initTimer);  // 페이지 로드가 완료되면 initTimer 함수를 실행하여 타이머 초기화

// 노트 기능
function initNotes() {
    // 노트 기능 초기화 코드
}

// 페이지 로드 시 실행
window.onload = function() {
    initCalendar();
    initTimer();
    initNotes();
};


