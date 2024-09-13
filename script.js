let currentDate = new Date(); // 현재 날짜
let selectedDate = new Date(); // 선택된 날짜

// 달력 기능 초기화
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
    document.getElementById('prev-year').addEventListener('click', ()=> changeYear(-1));
    document.getElementById('next-year').addEventListener('click', ()=> changeYear(1));
    document.getElementById('current-month-year').addEventListener('click', ()=> goToday());

}
//고투데이함수
function goToday(){
    currentDate=new Date();
    selectedDate = new Date(); // 선택된 날짜
    loadUpdate();
}
// 배경색 결정 함수
function getBackgroundColor(totalSeconds) {//색반환
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
//호버배경색
function getBackgroundColorHover(totalSeconds) {
    const hours = totalSeconds / 3600; // 초를 시간으로 변환

    if (hours >= 7) {
        return '#003d33'; 
    } else if (hours >= 5) {
        return '#00695c'; 
    } else if (hours >= 3) {
        return '#0097a7'; 
    } else if (hours >= 1) {
        return '#4fc3f7'; 
    } else if (totalSeconds > 0) {
        return '#b2ebf2'; 
    } else {
        return ''; 
    }
}
// 달력 업데이트 함수
function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('current-month-year').textContent = `${year}년 ${month + 1}월`;//년 월 표시
   
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);//다음 달0일=전 달 막날

    const calendarBody = document.querySelector('#calendar-body tbody');
    calendarBody.textContent = '';

    const today = new Date();
    let date = 1;

    for (let i = 0; i < 6; i++) {//최대 6주를 상정
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                row.appendChild(document.createElement('td'));
            } else if (date > lastDay.getDate()) {
                row.appendChild(document.createElement('td'));
            } else {
                const cell = document.createElement('td');
                const cellDate = new Date(year, month, date);

                // 날짜 텍스트 추가
                const dateText = document.createElement('span');
                dateText.textContent = date;
                cell.appendChild(dateText);

                //각각의 셀에 클릭 이벤트 추가: 날짜 클릭 시 이동하도록 설정
                cell.addEventListener('click', () => {
                    if (cellDate.getFullYear() === 514 && cellDate.getMonth() === 4 && cellDate.getDate() === 14) {
                        window.open('https://youtu.be/af6ttgmlFZI?si=0RHKb01OF9LTrNEY', '_blank'); // URL로 이동
                    } else {
                        selectDate(cellDate);
                    }
                });

                if (isSameDate(cellDate, today)) {
                    cell.classList.add('today');
                } else {
                    // 오늘 날짜가 아닐 경우 배경색 설정
                    const dateString = getDateString(cellDate);//gDS내가 적은 함수임
                    const totalSeconds = studyRecords[dateString]?.reduce((total, record) => total + record.time, 0) || 0; //studyRecords는 5번줄 전역으로 저장한 객체 + addStudyRecord에 정의한 객체임 참고로 total, record는 내가 그냥 임의로 붙인 이름이고 studyRecords안에 있는 프로퍼티나 메소드 사용가능
                    cell.style.backgroundColor = getBackgroundColor(totalSeconds);
            
                    cell.addEventListener('mouseover', () => {
                        cell.style.backgroundColor = getBackgroundColorHover(totalSeconds);
                    });

                    cell.addEventListener('mouseout', () => {
                        cell.style.backgroundColor = getBackgroundColor(totalSeconds);
                    });
                }

                if (isSameDate(cellDate, selectedDate)) { //클래스 추가
                    cell.classList.add('selected');
                }

                // 메모가 있는 날짜인지 확인
                const dateString = getDateString(cellDate);
                if (localStorage.getItem(`memo-${dateString}`)) {//saveMemoToLocalStorage()에 정의
                    const checkmark = document.createElement('span');
                    checkmark.classList.add('checkmark'); //span에 체크마크 클래스
                    cell.appendChild(checkmark); // 체크 아이콘 추가
                }

                row.appendChild(cell);
                date++;
            }
        }
        calendarBody.appendChild(row);
        if (date > lastDay.getDate()) break; //불필요한 맨처음 for문 반복 중지를 위함
    }
}

// 날짜 문자열 변환 (객체 값을 갖고있음 원랜)
function getDateString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; //padstart(a,b) a는 최소길이 b는 추가할 문자열 시작부분에 추가됨 저거 쓰려면 문자열이어야 해서 string으로 변환먼저 하는 거임
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
    currentDate.setFullYear(currentDate.getFullYear()+ delta);
    updateCalendar();
}

// 날짜 선택 함수
function selectDate(date) {
    selectedDate = date;
    loadUpdate();
}

////여기까지 캘린더


// 공부 기록을 저장할 객체
let studyRecords = JSON.parse(localStorage.getItem('studyRecords')) || {}; //JSON.parse는 JSON 형식의 문자열을 JavaScript 객체로 변환하는 메서드입니다. not문자열 그니까 로컬스트로지에 아무것도 없는 제일 처음엔 빈 객체겠지


// 공부 기록 추가
function addStudyRecord(subject, timeInSeconds, date = new Date()) {
    const dateString = getDateString(date);  //오늘 날짜를 기본값으로 사용
    if (!studyRecords[dateString]) { //객체의 datestring키에: 배열 (배열 안에 객체)
        studyRecords[dateString] = [];  //dateString이라는 키가 존재하지 않거나 그 값이 undefined일 경우, studyRecords[dateString]에 빈 배열을 할당하는 코드입니다.
    }
    studyRecords[dateString].push({ subject, time: timeInSeconds });
    localStorage.setItem('studyRecords', JSON.stringify(studyRecords));//전자는 그냥 내가 저장할 이름 a b c 이런 거여도 됨, 후자가 이제 js에서 내가 정의한 객체
    updateStudyRecordsDisplay();  // 화면 업데이트
    updateTotalStudyTime(); // 총 공부 시간 업데이트 추가
}

// 공부 기록 디스플레이 업데이트
function updateStudyRecordsDisplay() {
    const recordsContainer = document.getElementById('study-records');
    recordsContainer.innerHTML = '';
    const dateString = getDateString(selectedDate);

    if (studyRecords[dateString]) {
        studyRecords[dateString].forEach((record, index) => {
            const recordElement = document.createElement('div');
            recordElement.classList.add('study-record');//클래스 추가 참고 아이디는 study-records임
            recordElement.textContent = `${record.subject} - ${Math.floor(record.time / 3600)}h ${Math.floor((record.time % 3600) / 60)}m ${record.time % 60}s`; //addStudyRecord함수에 푸쉬로 변수명을 키와 값을 subject로 받음

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
            memoButton.addEventListener('click', () => miniMemoEditor(record, index));
            
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

    document.getElementById('total-study-time').textContent = formatTime(totalSeconds);
}


// 시간 포맷팅 함수
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}



//공부기록 메모 편집기 표시
function miniMemoEditor(record, index) {
    const memoEditor = document.createElement('div');
    memoEditor.classList.add('minimemo-editor');
    
    // 메모 입력 필드 생성
    const memoInput = document.createElement('textarea');
    memoInput.value = record.memo || ''; // 기존 메모가 있다면 표시
    memoInput.rows = 4;
    memoInput.placeholder = '메모를 입력하세요...';
    
    // 저장 버튼 생성
    const saveButton = document.createElement('button');
    saveButton.textContent = '저장';
    saveButton.addEventListener('click', () => saveMiniMemoForRecord(index, memoInput.value));
    
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

// 공부기록 메모 저장 
function saveMiniMemoForRecord(index, memo) {
    const dateString = getDateString(selectedDate);
    studyRecords[dateString][index].memo = memo;//minimemoeditor에서 이 함수가 쓰이는데 거기서 index를 인수로 받음
    localStorage.setItem('studyRecords', JSON.stringify(studyRecords));
    updateStudyRecordsDisplay();  // 화면 업데이트
    document.querySelector('.minimemo-editor').remove(); // 메모 편집기 닫기
}

// 공부 기록 수정
function editRecord(recordIndex, dateString) {
    const newSubject = prompt('새로운 과목 이름을 입력하세요:', studyRecords[dateString][recordIndex].subject);//후자는 현재과목이 필드에 자동입력돼있음

    if (newSubject !== null && newSubject.trim() !== '') {//후자는 newsubject에 입력이 됐을 때
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

        // 만약 날짜에 관련된 공부 기록이 없으면 해당 날짜의 기록 삭제
        if (studyRecords[dateString].length === 0) {
            delete studyRecords[dateString];  //객체의 빈 배열을 삭제하는 것
        }

        // 로컬 스토리지에 저장
        localStorage.setItem('studyRecords', JSON.stringify(studyRecords));

        // 공부 기록과 총 공부 시간 업데이트
        updateStudyRecordsDisplay();
        updateTotalStudyTime();  
    }
}

////여기까지 공부기록


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
    updateCalendar(); // 메모 저장 후 달력 업데이트
}

////여기까지 노트


// 타이머 변수
let timerRequestId;
let seconds = 0; // 타이머 초 단위
let milliseconds = 0; // 타이머 밀리초 단위
let lastUpdateTime = 0; // 마지막 업데이트 시간 (밀리초 단위)

// 타이머 기능 초기화
function initTimer() {
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('stop-timer').addEventListener('click', stopTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);
    document.getElementById('set-alarm').addEventListener('click', setAlarm);
    document.getElementById('cancel-alarm').addEventListener('click', cancelAlarm); // 알람 취소 버튼 이벤트 추가
}

// 타이머 시작
function startTimer() {
    if (!timerRequestId) {//제일 첨엔 undefined이므로 실행됨
        lastUpdateTime = performance.now(); // 시작 시간 설정 밀리초 단위로 시간반환 , 시작시간을 기억하는 구조
        requestAnimationFrame(updateTimer); // 타이머 업데이트 시작 ,프레임 단위로 함수 호출 업데이트타이머함수 안에 변수를 자동으로 줌 프레임이 그려지는 정확한 시간(timestamp)=페이지가 로드된 이후 경과된 시간  아이디 넣어도 상관은 없음 timerRequestId
    }
}

// 타이머 중지
function stopTimer() {
    cancelAnimationFrame(timerRequestId); //저거 중지 
    timerRequestId = null;
    saveStudyTime();
}

// 타이머 리셋
function resetTimer() {
    if (seconds > 0 || milliseconds > 0) {  // 만약 시간이 0보다 크다면 기록을 저장합니다.
        askForSubject();  // 과목명을 입력받고 기록 저장
    }
    cancelAnimationFrame(timerRequestId);
    timerRequestId = null;
    seconds = 0; // 타이머 초 초기화
    milliseconds = 0; // 타이머 밀리초 초기화
    updateTimerDisplay();
}

// 과목명을 입력받고 타이머 초기화 확인
function askForSubject() {
    const subject = prompt('타이머를 초기화했습니다. 공부한 과목 이름을 입력하세요:');
    
    if (subject === null) {
        // 취소 버튼을 누른 경우, 두 번째 확인 팝업을 표시
        const confirmCancel = confirm('취소하시겠습니까? 과목명 입력을 원하시면 확인을 클릭하십시오.');
        if (confirmCancel) {
            resetTimer(); // 초기화 확인 요청을 다시 호출
        } 
    } else if (subject.trim() === '') {
        alert('과목 이름이 입력되지 않았습니다.');
        askForSubject(); // 빈 입력일 경우 다시 요청
    } else {
        // 과목 이름이 입력된 경우, 타이머 기록 추가 및 초기화
        addStudyRecord(subject, seconds, new Date());
        selectDate(new Date());
    }
}

// 타이머 업데이트 함수에 알람 체크 추가
function updateTimer(timestamp) {
    if (!lastUpdateTime) {
        lastUpdateTime = timestamp;
    }
    const elapsed = timestamp - lastUpdateTime;
    milliseconds += elapsed;
    lastUpdateTime = timestamp;

    while (milliseconds >= 1000) {
        milliseconds -= 1000;
        seconds++;
        if (remainingAlarmTime !== null) {
            remainingAlarmTime--; // 알람까지 남은 시간을 줄임
        }
    }

    updateTimerDisplay();
    updateAlarmStatus(); // 알람 상태 업데이트
    checkAlarm(); // 알람 확인

    timerRequestId = requestAnimationFrame(updateTimer);
}

// 타이머 디스플레이 업데이트
function updateTimerDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const ms = Math.floor(milliseconds / 10); // 밀리초를 100단위로 변환 (0~99)
    document.getElementById('timer-display').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`; // 포맷 변경
}



////여기까지 타이머

let alarmTime = null; // 알람이 설정된 시간을 저장할 변수
let remainingAlarmTime = null; // 남은 시간을 추적할 변수
const alarmSound = new Audio('alarm-sound.mp3');

// 알람 설정 함수
function setAlarm() {
    // 사용자에게 알람 시간을 한 번에 입력받기
    const input = prompt('알람 시간을 입력하세요 (형식: 시 분 초):', '0 0 0');
    if (input === null) return; // 취소 클릭 시 함수 종료

    // 입력된 값을 공백으로 분리
    const [hoursInput, minutesInput, secondsInput] = input.split(' ');

    // 입력된 값을 정수로 변환
    const hours = parseInt(hoursInput, 10) || 0;
    const minutes = parseInt(minutesInput, 10) || 0;
    const alarmseconds = parseInt(secondsInput, 10) || 0;

    // 알람 시간을 초로 변환
    const alarmInSeconds = (hours * 3600) + (minutes * 60) + alarmseconds;

    if (alarmInSeconds === 0) {
        alert('알람 시간을 0초로 설정할 수 없습니다. 유효한 시간을 입력하세요.');
        return;
    }

    alarmTime = seconds + alarmInSeconds;
    remainingAlarmTime = alarmInSeconds; // 남은 시간을 저장

    document.getElementById('alarm-status').textContent = `알람 설정: ${hours}시간 ${minutes}분 ${alarmseconds}초 후`;
    alert(`알람이 설정되었습니다. ${hours}시간 ${minutes}분 ${alarmseconds}초 후에 알람이 울립니다.`);
}

function cancelAlarm() {
    if (alarmTime !== null) {
        alarmTime = null;
        document.getElementById('alarm-status').textContent = '알람이 취소되었습니다.'; // 상태 업데이트
        alert('알람이 취소되었습니다.');
    } else {
        alert('설정된 알람이 없습니다.');
    }
}

function checkAlarm() {
    if (alarmTime !== null && seconds >= alarmTime) {
        alarmSound.play(); // 소리 재생
        alert('알람 시간입니다!'); // 사용자에게 알람 시간 알림

        // 알람이 울리면 초기화
        alarmTime = null;

        // 알람 소리를 멈추기 위해 오디오를 중지
        alarmSound.pause();
        alarmSound.currentTime = 0; // 소리의 재생 위치를 처음으로 돌립니다.
    }
}

function updateAlarmStatus() {
    if (remainingAlarmTime !== null) {
        if (remainingAlarmTime > 0) {
            const hours = Math.floor(remainingAlarmTime / 3600);
            const minutes = Math.floor((remainingAlarmTime % 3600) / 60);
            const secs = remainingAlarmTime % 60;
            document.getElementById('alarm-status').textContent = `알람까지 남은 시간: ${hours}시간 ${minutes}분 ${secs}초`;
        } else {
            document.getElementById('alarm-status').textContent = '알람 시간입니다!';
            remainingAlarmTime = null; // 알람 시간이 도달하면 초기화
        }
    }
}


//알람

//업데이트들
function loadUpdate(){

    updateCalendar(); //initcalendar 하면 안 됨 다른 것도 확인해보자 특히 이벤트리스너
    updateTotalStudyTime();
    updateStudyRecordsDisplay(); // 페이지 로드 시 공부 기록 불러오기
    loadMemo();

}

window.addEventListener('load', () => { //냅다 loadinit()박는 것보다 이게 안전함 
    initCalendar();//주의!
    initNotes();
    initTimer();
    updateTotalStudyTime();
    updateStudyRecordsDisplay();
    loadMemo();
});

