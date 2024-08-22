let currentDate = new Date(); // 현재 날짜
let selectedDate = new Date(); // 선택된 날짜

// 공부 기록을 저장할 객체
let studyRecords = JSON.parse(localStorage.getItem('studyRecords')) || {};

// 총 공부 시간을 저장하는 변수
let totalStudyTimeInSeconds = 0;

// 타이머 변수
let timerInterval;
let seconds = 0;

// 달력 기능 초기화
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
}

// 달력 업데이트
function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('current-month-year').textContent = `${year}년 ${month + 1}월`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const calendarBody = document.querySelector('#calendar-body tbody');
    calendarBody.innerHTML = '';

    const today = new Date();
    let date = 1;

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                row.appendChild(document.createElement('td'));
            } else if (date > lastDay.getDate()) {
                break;
            } else {
                const cell = document.createElement('td');
                cell.textContent = date;
                const cellDate = new Date(year, month, date);

                cell.addEventListener('click', () => selectDate(cellDate));

                if (isSameDate(cellDate, today)) {
                    cell.classList.add('today');
                }

                if (isSameDate(cellDate, selectedDate)) {
                    cell.classList.add('selected');
                }

                // 메모가 있는 날짜인지 확인
                const dateString = getDateString(cellDate);
                if (localStorage.getItem(`memo-${dateString}`)) {
                    const checkmark = document.createElement('span');
                    checkmark.classList.add('checkmark');
                    cell.appendChild(checkmark); // 체크 아이콘 추가
                }

                row.appendChild(cell);
                date++;
            }
        }
        calendarBody.appendChild(row);
        if (date > lastDay.getDate()) break;
    }
}

// 날짜 비교 함수
function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// 월 변경 함수
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

//연도 변경 함수
function changeYear(delta) {
    const year = currentDate.getFullYear();
    currentDate.setFullYear(year + delta);
    updateCalendar();
}

// 날짜 선택 함수
function selectDate(date) {
    selectedDate = date;
    updateCalendar();
    loadMemo();
    updateStudyRecordsDisplay();
}

// 메모 기능 초기화
function initNotes() {
    document.getElementById('save-memo').addEventListener('click', saveMemo);
}

// 메모 로드
function loadMemo() {
    const memoText = document.getElementById('memo-text');
    const dateString = getDateString(selectedDate);
    memoText.value = localStorage.getItem(`memo-${dateString}`) || '';
}

// 메모 저장
function saveMemo() {
    const memoText = document.getElementById('memo-text').value;
    const dateString = getDateString(selectedDate);
    localStorage.setItem(`memo-${dateString}`, memoText);
    alert('메모가 저장되었습니다.');
}

// 날짜 문자열 변환
function getDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 타이머 기능 초기화
function initTimer() {
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('stop-timer').addEventListener('click', stopTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
}

// 타이머 시작
function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// 타이머 중지
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    saveStudyTime();
}

// 타이머 리셋
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    const elapsedTime = seconds;
    seconds = 0;
    updateTimerDisplay();

    // 과목 이름을 사용자로부터 입력받기
    const subject = prompt('타이머를 초기화했습니다. 공부한 과목 이름을 입력하세요:');
    
    if (subject) {
        // 타이머를 초기화할 때 오늘 날짜로 공부 기록 추가
        const today = new Date();  // 현재 날짜를 오늘 날짜로 설정
        addStudyRecord(subject, elapsedTime, today);  // 사용자 입력 과목 이름으로 기록을 추가합니다

        // 오늘 날짜를 선택된 날짜로 설정
        selectDate(today);
        
        // 총 공부 시간 업데이트
        addStudyTime(elapsedTime); // 총 공부 시간에 현재 시간을 추가
    } else {
        alert('과목 이름이 입력되지 않았습니다.');
    }
}

// 타이머 업데이트
function updateTimer() {
    seconds++;
    updateTimerDisplay();
}

// 타이머 디스플레이 업데이트
function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    document.getElementById('timer-display').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 총 공부 시간 업데이트
function updateTotalStudyTime() {
    const hours = Math.floor(totalStudyTimeInSeconds / 3600);
    const minutes = Math.floor((totalStudyTimeInSeconds % 3600) / 60);
    const secs = totalStudyTimeInSeconds % 60;
    document.getElementById('total-study-time').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    saveStudyTime();
}

// 총 공부 시간 추가
function addStudyTime(secondsToAdd) {
    totalStudyTimeInSeconds += secondsToAdd;
    updateTotalStudyTime();
}

// 총 공부 시간 로드
function loadStudyTime() {
    const savedTime = localStorage.getItem('totalStudyTimeInSeconds');
    if (savedTime) {
        totalStudyTimeInSeconds = parseInt(savedTime, 10);
        updateTotalStudyTime();
    }
}

// 총 공부 시간 저장
function saveStudyTime() {
    localStorage.setItem('totalStudyTimeInSeconds', totalStudyTimeInSeconds);
}

// 공부 기록 추가
function addStudyRecord(subject, timeInSeconds, date = new Date()) {
    const dateString = getDateString(date);  // 날짜를 매개변수로 전달받거나 오늘 날짜를 기본값으로 사용
    if (!studyRecords[dateString]) {
        studyRecords[dateString] = [];
    }
    studyRecords[dateString].push({ subject, time: timeInSeconds });
    localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
    updateStudyRecordsDisplay();  // 화면 업데이트
}

// 공부 기록 디스플레이 업데이트
function updateStudyRecordsDisplay() {
    const recordsContainer = document.getElementById('study-records');
    recordsContainer.innerHTML = '';
    const dateString = getDateString(selectedDate);

    if (studyRecords[dateString]) {
        studyRecords[dateString].forEach(record => {
            const recordElement = document.createElement('div');
            // 날짜를 제외하고 공부 기록만 표시
            recordElement.textContent = `${record.subject} - ${Math.floor(record.time / 3600)}h ${Math.floor((record.time % 3600) / 60)}m ${record.time % 60}s`;
            recordsContainer.appendChild(recordElement);
        });
    }
}

// 초기화 함수 호출
window.addEventListener('load', () => {
    initCalendar();
    initNotes();
    initTimer();
    loadStudyTime();
    updateStudyRecordsDisplay(); // 페이지 로드 시 공부 기록 불러오기
});
