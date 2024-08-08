let currentDate = new Date(); //let은 블록스코프변수  new에 관한 설명은 https://velog.io/@gil0127/%EC%83%9D%EC%84%B1%EC%9E%90%EC%99%80-new-%ED%82%A4%EC%9B%8C%EB%93%9C 변경되지 않는 값에는 const 사용, 변경될 수 있는 값에는 let 사용 얘는 사실상 전역스코프임 블록{} 안에 있는 게 아니잖아

// 달력 기능
function initCalendar() {
    updateCalendar();
    document.getElementById('prev-month').addEventListener('click',()=>changeMonth(-1));
    document.getElementById('next-month').addEventListener('click',()=>changeMonth(1)); //()=>는 function{}의 줄임말
}

function updateCalendar(){
    const year = currentDate.getFullYear(); //Date()의 메소드
    const month = currentDate.getMonth();

    document.getElementById('current-month-year').textContent =`${year}년 ${month + 1}월`;//문자열 내에 변수를 삽입하고 싶으면 ${} ''+''랑 같음 주의 `백틱과 '따옴표는 다르다
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);

    const calendarBody = document.querySelector('#calendar-body tbody');
    calendarBody.innerHTML =''; //안에 비우기

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
                if (date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    cell.classList.add('today');
                }
                row.appendChild(cell);
                date++;
            }
        }
        calendarBody.appendChild(row);
        if (date > lastDay.getDate()) break;
    }

}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

window.onload = initCalendar; //웹페이지 로딩후 이 함수가 실행됨

// 타이머 기능
function initTimer() {
    // 타이머 초기화 코드
}

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


