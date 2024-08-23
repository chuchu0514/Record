let currentDate = new Date(); // 현재 날짜
let selectedDate = new Date(); // 선택된 날짜

// 공부 기록을 저장할 객체
let studyRecords = JSON.parse(localStorage.getItem('studyRecords')) || {};

// 타이머 변수
let timerInterval;
let seconds = 0; // 타이머 초 단위

// 달력 기능 초기화
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
}

// 배경색 결정 함수
function getBackgroundColor(totalSeconds) {
    const hours = totalSeconds / 3600; // 초를 시간으로 변환

    if (hours >= 7) {
        return '#004d40'; // 제일 진한 파란색
    } else if (hours >= 5) {
        return '#00796b'; // 더더 진한 하늘색
    } else if (hours >= 3) {
        return '#00acc1'; // 더 진한 하늘색
    } else if (hours >= 1) {
        return '#80deea'; // 진한 하늘색
    } else if (totalSeconds > 0) {
        return '#e0f7fa'; // 연한 하늘색
    } else {
        return ''; // 공부 시간이 없을 때 기본 배경색
    }
}

// 달력 업데이트 함수
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
                const cellDate = new Date(year, month, date);

                // 날짜 텍스트 추가
                const dateText = document.createElement('span');
                dateText.textContent = date;
                cell.appendChild(dateText);

                // 클릭 이벤트 추가: 날짜 클릭 시 이동하도록 설정
                cell.addEventListener('click', () => {
                    if (cellDate.getFullYear() === 514 && cellDate.getMonth() === 4 && cellDate.getDate() === 14) {
                        window.open('https://youtu.be/iyNAGmObuaI?si=i6q0DZ2VdxxVy7lqcom', '_blank'); // URL로 이동
                    } else {
                        selectDate(cellDate);
                    }
                });

                if (isSameDate(cellDate, today)) {
                    cell.classList.add('today');
                } else {
                    // 오늘 날짜가 아닐 경우 배경색 설정
                    const dateString = getDateString(cellDate);
                    const totalSeconds = studyRecords[dateString]?.reduce((total, record) => total + record.time, 0) || 0;
                    cell.style.backgroundColor = getBackgroundColor(totalSeconds);
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

// 날짜 문자열 변환
function getDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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

// 연도 변경 함수
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
    loadStudyTime();  // 선택한 날짜의 총 공부 시간을 로드
    updateStudyRecordsDisplay();
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
        studyRecords[dateString].forEach((record, index) => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('study-record');
            recordElement.textContent = `${record.subject} - ${Math.floor(record.time / 3600)}h ${Math.floor((record.time % 3600) / 60)}m ${record.time % 60}s`;

            // 메모 아이콘 추가
            if (record.memo) {
                const checkmark = document.createElement('span');
                checkmark.classList.add('checkmark');
                recordElement.appendChild(checkmark);
            }

            // 이스터에그: 과목명이 '514'일 때 배경색 변경
            if (record.subject === '514') {
                recordElement.style.backgroundColor = '#d0f0c0'; // 연두색 배경
            }

            // 버튼을 감싸는 div 생성
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex'; // 플렉스 박스 사용

            // 메모 버튼 생성
            const memoButton = document.createElement('button');
            memoButton.textContent = '메모';
            memoButton.addEventListener('click', () => showMemoEditor(record, index));

            // 수정 버튼 아이콘 생성
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fas fa-edit"></i>'; // 수정 아이콘
            editButton.addEventListener('click', () => editRecord(index, dateString));

            // 삭제 버튼 아이콘 생성
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // 삭제 아이콘
            deleteButton.addEventListener('click', () => deleteRecord(index, dateString));

            // 버튼을 버튼 컨테이너에 추가
            buttonContainer.appendChild(memoButton);
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            // 버튼 컨테이너를 기록에 추가
            recordElement.appendChild(buttonContainer);
            recordsContainer.appendChild(recordElement);
        });
    }
}


// 총 공부 시간 업데이트
function updateTotalStudyTime() {
    const dateString = getDateString(selectedDate);
    const totalSeconds = studyRecords[dateString]?.reduce((total, record) => total + record.time, 0) || 0;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    document.getElementById('total-study-time').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 총 공부 시간 추가
function addStudyTime(secondsToAdd) {
    const dateString = getDateString(selectedDate);
    if (!studyRecords[dateString]) {
        studyRecords[dateString] = [];
    }
    updateTotalStudyTime();
}

// 총 공부 시간 로드
function loadStudyTime() {
    updateTotalStudyTime();
}

// 메모 편집기 표시
function showMemoEditor(record, index) {
    const memoEditor = document.createElement('div');
    memoEditor.classList.add('memo-editor');
    
    // 메모 입력 필드 생성
    const memoInput = document.createElement('textarea');
    memoInput.value = record.memo || ''; // 기존 메모가 있다면 표시
    memoInput.rows = 4;
    memoInput.placeholder = '메모를 입력하세요...';
    
    // 저장 버튼 생성
    const saveButton = document.createElement('button');
    saveButton.textContent = '저장';
    saveButton.addEventListener('click', () => saveMemoForRecord(record, index, memoInput.value));
    
    // 취소 버튼 생성
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '취소';
    cancelButton.addEventListener('click', () => {
        memoEditor.remove();
    });

    // 입력 필드와 버튼을 메모 편집기 컨테이너에 추가
    memoEditor.appendChild(memoInput);
    memoEditor.appendChild(saveButton);
    memoEditor.appendChild(cancelButton);
    
    // 메모 편집기 컨테이너를 본문에 추가
    document.body.appendChild(memoEditor);
}

// 메모 저장 (기록에 대한)
function saveMemoForRecord(record, index, memo) {
    const dateString = getDateString(selectedDate);
    studyRecords[dateString][index].memo = memo;
    localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
    updateStudyRecordsDisplay();  // 화면 업데이트
    document.querySelector('.memo-editor').remove(); // 메모 편집기 닫기
}

// 공부 기록 수정
function editRecord(recordIndex, dateString) {
    const newSubject = prompt('새로운 과목 이름을 입력하세요:', studyRecords[dateString][recordIndex].subject);

    if (newSubject !== null && newSubject.trim() !== '') {
        studyRecords[dateString][recordIndex].subject = newSubject;
        localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
        updateStudyRecordsDisplay();  // 화면 업데이트
    } else if (newSubject === null) {
        // 사용자가 취소를 클릭한 경우 아무 것도 하지 않음
    } else {
        alert('과목 이름이 입력되지 않았습니다.');
    }
}

// 공부 기록 삭제
function deleteRecord(recordIndex, dateString) {
    if (confirm('정말로 이 기록을 삭제하시겠습니까?')) {
        studyRecords[dateString].splice(recordIndex, 1);

        if (studyRecords[dateString].length === 0) {
            delete studyRecords[dateString]; // 빈 배열이면 삭제
        }

        localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
        updateStudyRecordsDisplay();  // 화면 업데이트
    }
}

// 메모 기능 초기화
function initNotes() {
    document.getElementById('save-memo').addEventListener('click', saveMemoToLocalStorage);
}

// 메모 로드
function loadMemo() {
    const memoText = document.getElementById('memo-text');
    const dateString = getDateString(selectedDate);
    memoText.value = localStorage.getItem(`memo-${dateString}`) || '';
}

// 메모 저장 (로컬 스토리지)
function saveMemoToLocalStorage() {
    const memoText = document.getElementById('memo-text').value;
    const dateString = getDateString(selectedDate);
    localStorage.setItem(`memo-${dateString}`, memoText);
    alert('메모가 저장되었습니다.');
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
        timerInterval = setInterval(updateTimer, 1000); // 1초마다 업데이트
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
    seconds = 0; // 타이머 초 초기화
    updateTimerDisplay();

    // 과목 이름을 사용자로부터 입력받기
    const subject = prompt('타이머를 초기화했습니다. 공부한 과목 이름을 입력하세요:');
    
    if (subject) {
        const today = new Date();
        addStudyRecord(subject, seconds, today);
        selectDate(today);
        addStudyTime(seconds);
    } else {
        alert('과목 이름이 입력되지 않았습니다.');
    }
}

// 타이머 업데이트
function updateTimer() {
    seconds++; // 초 단위로 증가
    updateTimerDisplay();
}

// 타이머 디스플레이 업데이트
function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    document.getElementById('timer-display').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}



// 초기화 함수 호출
window.addEventListener('load', () => {
    initCalendar();
    initNotes();
    initTimer();
    loadStudyTime();
    updateStudyRecordsDisplay(); // 페이지 로드 시 공부 기록 불러오기
});