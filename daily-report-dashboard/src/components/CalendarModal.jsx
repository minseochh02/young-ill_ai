import React, { useState } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarModal = ({ availableDates, selectedDate, onDateSelect, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = selectedDate ? new Date(selectedDate) : new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    const availableDateSet = new Set(availableDates);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];

        // 이전 달 빈 칸
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }

        // 현재 달 날짜
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                dateStr,
                isAvailable: availableDateSet.has(dateStr),
                isSelected: dateStr === selectedDate
            });
        }

        return days;
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="calendar-overlay" onClick={onClose}>
            <div className="calendar-modal" onClick={e => e.stopPropagation()}>
                <div className="calendar-header">
                    <button className="calendar-nav-btn" onClick={prevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <span className="calendar-title">
                        {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
                    </span>
                    <button className="calendar-nav-btn" onClick={nextMonth}>
                        <ChevronRight size={20} />
                    </button>
                    <button className="calendar-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="calendar-weekdays">
                    {dayNames.map(day => (
                        <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                </div>

                <div className="calendar-days">
                    {days.map((dayInfo, idx) => (
                        <div
                            key={idx}
                            className={`calendar-day ${!dayInfo ? 'empty' : ''} ${dayInfo?.isAvailable ? 'available' : ''} ${dayInfo?.isSelected ? 'selected' : ''}`}
                            onClick={() => dayInfo?.isAvailable && onDateSelect(dayInfo.dateStr)}
                        >
                            {dayInfo?.day}
                        </div>
                    ))}
                </div>

                <div className="calendar-legend">
                    <span className="legend-item">
                        <span className="legend-dot available"></span> 데이터 있음
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot selected"></span> 선택됨
                    </span>
                </div>
            </div>
        </div>
    );
};

const DateSelector = ({ availableDates, selectedDate, onDateSelect, showCumulative, onToggleCumulative }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDateSelect = (date) => {
        onDateSelect(date);
        setIsOpen(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '날짜 선택';
        const [year, month, day] = dateStr.split('-');
        return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
    };

    return (
        <div className="date-selector-container">
            <div className="date-selector-buttons">
                <button
                    className={`view-toggle-btn ${!showCumulative ? 'active' : ''}`}
                    onClick={() => onToggleCumulative(false)}
                >
                    일별 보기
                </button>
                <button
                    className={`view-toggle-btn ${showCumulative ? 'active' : ''}`}
                    onClick={() => onToggleCumulative(true)}
                >
                    누계 보기
                </button>
            </div>

            <button className="date-picker-btn" onClick={() => setIsOpen(true)}>
                <Calendar size={18} />
                <span>{formatDate(selectedDate)}</span>
            </button>

            {isOpen && (
                <CalendarModal
                    availableDates={availableDates}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default DateSelector;
