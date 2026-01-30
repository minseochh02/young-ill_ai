export const getPeriodDates = (type) => {
    const today = new Date();
    const normalize = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    let start = new Date(today);
    let end = new Date(today);

    switch (type) {
        case 'today': // 금일
            break;
        case 'yesterday': // 전일
            start.setDate(today.getDate() - 1);
            end.setDate(today.getDate() - 1);
            break;
        case 'this_week': // 금주 (월~일)
            {
                const day = today.getDay(); // 0(Sun) - 6(Sat)
                const diff = today.getDate() - (day === 0 ? 6 : day - 1); // Adjust when Sunday
                start.setDate(diff);
                // end is today
            }
            break;
        case 'last_week': // 전주 (Prev Mon ~ Prev Sun)
            {
                const day = today.getDay();
                const diff = today.getDate() - (day === 0 ? 6 : day - 1) - 7;
                start.setDate(diff);
                end = new Date(start);
                end.setDate(start.getDate() + 6);
            }
            break;
        case 'this_month': // 금월
            start.setDate(1);
            break;
        case 'last_month': // 전월
            start.setMonth(start.getMonth() - 1);
            start.setDate(1);
            end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0); // Last day of prev month
            break;
        case 'q1': // 1/4분기
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 2, 31);
            break;
        case 'q2': // 2/4분기
            start = new Date(today.getFullYear(), 3, 1);
            end = new Date(today.getFullYear(), 5, 30);
            break;
        case 'q3': // 3/4분기
            start = new Date(today.getFullYear(), 6, 1);
            end = new Date(today.getFullYear(), 8, 30);
            break;
        case 'q4': // 4/4분기
            start = new Date(today.getFullYear(), 9, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
        case 'last_year': // 작년
            start = new Date(today.getFullYear() - 1, 0, 1);
            end = new Date(today.getFullYear() - 1, 11, 31);
            break;
        case 'this_year': // 금년
            start = new Date(today.getFullYear(), 0, 1);
            break;
        default:
            return { startDate: '', endDate: '' };
    }

    return { startDate: normalize(start), endDate: normalize(end) };
};

export const PERIOD_OPTIONS = [
    { value: 'today', label: '금일' },
    { value: 'yesterday', label: '전일' },
    { value: 'this_week', label: '금주' },
    { value: 'last_week', label: '전주' },
    { value: 'this_month', label: '금월' },
    { value: 'last_month', label: '전월' },
    { value: 'q1', label: '1/4분기' },
    { value: 'q2', label: '2/4분기' },
    { value: 'q3', label: '3/4분기' },
    { value: 'q4', label: '4/4분기' },
    { value: 'this_year', label: '금년' },
    { value: 'last_year', label: '작년' }
];
