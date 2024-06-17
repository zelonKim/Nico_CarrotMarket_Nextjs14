export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = (time - now) / dayInMs

    const formatter = new Intl.RelativeTimeFormat("ko") // new Intl.RelativeTimeFormat("국가명"): 해당 국가 표기형식에 맞는 '타임 포맷 객체'를 생성함.
    return formatter.format(diff, "days"); // 타임 포맷 객체.format(값, "단위"): 해당 값을 해당 단위에 맞도록 형식화함.
}


export function formatToDollar(price: number): string {
    return price.toLocaleString("en-US"); // 값.toLocaleString("지역명"): 해당 넘버 타입의 값을 스트링 타입의 값으로 변환해주며, 해당 지역 표기형식에 알맞도록 나타냄.
}