import "server-only"; 

export function fetchFromAPI() { // 서버온니 함수를 클라이언트 컴포넌트에서 사용할 경우, 에러를 발생시킴.
    fetch(".......");
}