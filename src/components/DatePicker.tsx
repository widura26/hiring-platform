'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  styleInput?: string; 
  styleCalendarBox?: string; 
  label?: string;
  placeholder?: string;
}

export default function DatePicker({ onDateSelect, initialDate, minDate, maxDate, label = "Date of birth",
  placeholder = "Select your date of birth", styleInput, styleCalendarBox }: DatePickerProps) {

    const [currentDate, setCurrentDate] = useState<Date>(initialDate || new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const months: string[] = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const getDaysInMonth = (date: Date): number => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const isDateDisabled = (date: Date): boolean => {
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    };

    const handlePrevYear = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    };

    const handleNextYear = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    };

    const handlePrevMonth = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (): void => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number): void => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        if (isDateDisabled(newDate)) return;
        
        setSelectedDate(newDate);
        onDateSelect?.(newDate);
        setIsOpen(false);
    };

    const getPrevMonthDays = (): number[] => {
        const firstDay = getFirstDayOfMonth(currentDate);
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        const days: number[] = [];
        
        for (let i = firstDay - 1; i >= 0; i--) {
        days.push(daysInPrevMonth - i);
        }
        
        return days;
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const prevMonthDays = getPrevMonthDays();
        const days = [];

        prevMonthDays.forEach((day, index) => {
        days.push(
            <div key={`prev-${index}`} className="p-2 text-center text-gray-300 text-sm">
            {day}
            </div>
        );
        });
  
        for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isSelected = selectedDate && 
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();
        const disabled = isDateDisabled(date);

        days.push(
            <button
            key={day}
            onClick={() => handleDateClick(day)}
            disabled={disabled}
            className={`p-2 text-sm rounded-full transition-all ${
                disabled 
                ? 'text-gray-300 cursor-not-allowed' 
                : isSelected 
                    ? 'bg-yellow-400 text-gray-900 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
            {day}
            </button>
        );
        }

        const totalCells = days.length;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        
        for (let i = 1; i <= remainingCells; i++) {
        days.push(
            <div key={`next-${i}`} className="p-2 text-center text-gray-300 text-sm">
            {i}
            </div>
        );
        }

        return days;
    };

    const formatDisplayDate = (date: Date | null): string => {
        if (!date) return '';
        return date.toLocaleDateString('en-GB', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
        });
    };


    return (
        <div className="relative">
            <button type='button' onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between w-full ${styleInput}`}>
                <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="path-1-inside-1_2847_3684" fill="white">
                            <path d="M7.99992 12.666C8.13177 12.666 8.26067 12.6269 8.3703 12.5537C8.47993 12.4804 8.56538 12.3763 8.61584 12.2545C8.6663 12.1327 8.6795 11.9986 8.65378 11.8693C8.62805 11.74 8.56456 11.6212 8.47132 11.5279C8.37809 11.4347 8.2593 11.3712 8.12998 11.3455C8.00066 11.3198 7.86661 11.333 7.7448 11.3834C7.62298 11.4339 7.51886 11.5193 7.44561 11.629C7.37235 11.7386 7.33325 11.8675 7.33325 11.9993C7.33325 12.1762 7.40349 12.3457 7.52851 12.4708C7.65354 12.5958 7.82311 12.666 7.99992 12.666ZM11.3333 12.666C11.4651 12.666 11.594 12.6269 11.7036 12.5537C11.8133 12.4804 11.8987 12.3763 11.9492 12.2545C11.9996 12.1327 12.0128 11.9986 11.9871 11.8693C11.9614 11.74 11.8979 11.6212 11.8047 11.5279C11.7114 11.4347 11.5926 11.3712 11.4633 11.3455C11.334 11.3198 11.1999 11.333 11.0781 11.3834C10.9563 11.4339 10.8522 11.5193 10.7789 11.629C10.7057 11.7386 10.6666 11.8675 10.6666 11.9993C10.6666 12.1762 10.7368 12.3457 10.8618 12.4708C10.9869 12.5958 11.1564 12.666 11.3333 12.666ZM11.3333 9.99935C11.4651 9.99935 11.594 9.96025 11.7036 9.88699C11.8133 9.81374 11.8987 9.70962 11.9492 9.5878C11.9996 9.46599 12.0128 9.33194 11.9871 9.20262C11.9614 9.0733 11.8979 8.95451 11.8047 8.86128C11.7114 8.76804 11.5926 8.70455 11.4633 8.67882C11.334 8.6531 11.1999 8.6663 11.0781 8.71676C10.9563 8.76722 10.8522 8.85267 10.7789 8.9623C10.7057 9.07193 10.6666 9.20083 10.6666 9.33268C10.6666 9.50949 10.7368 9.67906 10.8618 9.80409C10.9869 9.92911 11.1564 9.99935 11.3333 9.99935ZM7.99992 9.99935C8.13177 9.99935 8.26067 9.96025 8.3703 9.88699C8.47993 9.81374 8.56538 9.70962 8.61584 9.5878C8.6663 9.46599 8.6795 9.33194 8.65378 9.20262C8.62805 9.0733 8.56456 8.95451 8.47132 8.86128C8.37809 8.76804 8.2593 8.70455 8.12998 8.67882C8.00066 8.6531 7.86661 8.6663 7.7448 8.71676C7.62298 8.76722 7.51886 8.85267 7.44561 8.9623C7.37235 9.07193 7.33325 9.20083 7.33325 9.33268C7.33325 9.50949 7.40349 9.67906 7.52851 9.80409C7.65354 9.92911 7.82311 9.99935 7.99992 9.99935ZM12.6666 1.99935H11.9999V1.33268C11.9999 1.15587 11.9297 0.986302 11.8047 0.861278C11.6796 0.736253 11.5101 0.666016 11.3333 0.666016C11.1564 0.666016 10.9869 0.736253 10.8618 0.861278C10.7368 0.986302 10.6666 1.15587 10.6666 1.33268V1.99935H5.33325V1.33268C5.33325 1.15587 5.26301 0.986302 5.13799 0.861278C5.01297 0.736253 4.8434 0.666016 4.66659 0.666016C4.48977 0.666016 4.32021 0.736253 4.19518 0.861278C4.07016 0.986302 3.99992 1.15587 3.99992 1.33268V1.99935H3.33325C2.80282 1.99935 2.29411 2.21006 1.91904 2.58514C1.54397 2.96021 1.33325 3.46892 1.33325 3.99935V13.3327C1.33325 13.8631 1.54397 14.3718 1.91904 14.7469C2.29411 15.122 2.80282 15.3327 3.33325 15.3327H12.6666C13.197 15.3327 13.7057 15.122 14.0808 14.7469C14.4559 14.3718 14.6666 13.8631 14.6666 13.3327V3.99935C14.6666 3.46892 14.4559 2.96021 14.0808 2.58514C13.7057 2.21006 13.197 1.99935 12.6666 1.99935ZM13.3333 13.3327C13.3333 13.5095 13.263 13.6791 13.138 13.8041C13.013 13.9291 12.8434 13.9993 12.6666 13.9993H3.33325C3.15644 13.9993 2.98687 13.9291 2.86185 13.8041C2.73682 13.6791 2.66659 13.5095 2.66659 13.3327V7.33268H13.3333V13.3327ZM13.3333 5.99935H2.66659V3.99935C2.66659 3.82254 2.73682 3.65297 2.86185 3.52794C2.98687 3.40292 3.15644 3.33268 3.33325 3.33268H3.99992V3.99935C3.99992 4.17616 4.07016 4.34573 4.19518 4.47075C4.32021 4.59578 4.48977 4.66602 4.66659 4.66602C4.8434 4.66602 5.01297 4.59578 5.13799 4.47075C5.26301 4.34573 5.33325 4.17616 5.33325 3.99935V3.33268H10.6666V3.99935C10.6666 4.17616 10.7368 4.34573 10.8618 4.47075C10.9869 4.59578 11.1564 4.66602 11.3333 4.66602C11.5101 4.66602 11.6796 4.59578 11.8047 4.47075C11.9297 4.34573 11.9999 4.17616 11.9999 3.99935V3.33268H12.6666C12.8434 3.33268 13.013 3.40292 13.138 3.52794C13.263 3.65297 13.3333 3.82254 13.3333 3.99935V5.99935ZM4.66659 9.99935C4.79844 9.99935 4.92733 9.96025 5.03697 9.88699C5.1466 9.81374 5.23205 9.70962 5.28251 9.5878C5.33296 9.46599 5.34617 9.33194 5.32044 9.20262C5.29472 9.0733 5.23122 8.95451 5.13799 8.86128C5.04475 8.76804 4.92597 8.70455 4.79665 8.67882C4.66733 8.6531 4.53328 8.6663 4.41146 8.71676C4.28965 8.76722 4.18553 8.85267 4.11227 8.9623C4.03902 9.07193 3.99992 9.20083 3.99992 9.33268C3.99992 9.50949 4.07016 9.67906 4.19518 9.80409C4.32021 9.92911 4.48977 9.99935 4.66659 9.99935ZM4.66659 12.666C4.79844 12.666 4.92733 12.6269 5.03697 12.5537C5.1466 12.4804 5.23205 12.3763 5.28251 12.2545C5.33296 12.1327 5.34617 11.9986 5.32044 11.8693C5.29472 11.74 5.23122 11.6212 5.13799 11.5279C5.04475 11.4347 4.92597 11.3712 4.79665 11.3455C4.66733 11.3198 4.53328 11.333 4.41146 11.3834C4.28965 11.4339 4.18553 11.5193 4.11227 11.629C4.03902 11.7386 3.99992 11.8675 3.99992 11.9993C3.99992 12.1762 4.07016 12.3457 4.19518 12.4708C4.32021 12.5958 4.48977 12.666 4.66659 12.666Z"/>
                        </mask>
                        <path d="M7.99992 12.666C8.13177 12.666 8.26067 12.6269 8.3703 12.5537C8.47993 12.4804 8.56538 12.3763 8.61584 12.2545C8.6663 12.1327 8.6795 11.9986 8.65378 11.8693C8.62805 11.74 8.56456 11.6212 8.47132 11.5279C8.37809 11.4347 8.2593 11.3712 8.12998 11.3455C8.00066 11.3198 7.86661 11.333 7.7448 11.3834C7.62298 11.4339 7.51886 11.5193 7.44561 11.629C7.37235 11.7386 7.33325 11.8675 7.33325 11.9993C7.33325 12.1762 7.40349 12.3457 7.52851 12.4708C7.65354 12.5958 7.82311 12.666 7.99992 12.666ZM11.3333 12.666C11.4651 12.666 11.594 12.6269 11.7036 12.5537C11.8133 12.4804 11.8987 12.3763 11.9492 12.2545C11.9996 12.1327 12.0128 11.9986 11.9871 11.8693C11.9614 11.74 11.8979 11.6212 11.8047 11.5279C11.7114 11.4347 11.5926 11.3712 11.4633 11.3455C11.334 11.3198 11.1999 11.333 11.0781 11.3834C10.9563 11.4339 10.8522 11.5193 10.7789 11.629C10.7057 11.7386 10.6666 11.8675 10.6666 11.9993C10.6666 12.1762 10.7368 12.3457 10.8618 12.4708C10.9869 12.5958 11.1564 12.666 11.3333 12.666ZM11.3333 9.99935C11.4651 9.99935 11.594 9.96025 11.7036 9.88699C11.8133 9.81374 11.8987 9.70962 11.9492 9.5878C11.9996 9.46599 12.0128 9.33194 11.9871 9.20262C11.9614 9.0733 11.8979 8.95451 11.8047 8.86128C11.7114 8.76804 11.5926 8.70455 11.4633 8.67882C11.334 8.6531 11.1999 8.6663 11.0781 8.71676C10.9563 8.76722 10.8522 8.85267 10.7789 8.9623C10.7057 9.07193 10.6666 9.20083 10.6666 9.33268C10.6666 9.50949 10.7368 9.67906 10.8618 9.80409C10.9869 9.92911 11.1564 9.99935 11.3333 9.99935ZM7.99992 9.99935C8.13177 9.99935 8.26067 9.96025 8.3703 9.88699C8.47993 9.81374 8.56538 9.70962 8.61584 9.5878C8.6663 9.46599 8.6795 9.33194 8.65378 9.20262C8.62805 9.0733 8.56456 8.95451 8.47132 8.86128C8.37809 8.76804 8.2593 8.70455 8.12998 8.67882C8.00066 8.6531 7.86661 8.6663 7.7448 8.71676C7.62298 8.76722 7.51886 8.85267 7.44561 8.9623C7.37235 9.07193 7.33325 9.20083 7.33325 9.33268C7.33325 9.50949 7.40349 9.67906 7.52851 9.80409C7.65354 9.92911 7.82311 9.99935 7.99992 9.99935ZM12.6666 1.99935H11.9999V1.33268C11.9999 1.15587 11.9297 0.986302 11.8047 0.861278C11.6796 0.736253 11.5101 0.666016 11.3333 0.666016C11.1564 0.666016 10.9869 0.736253 10.8618 0.861278C10.7368 0.986302 10.6666 1.15587 10.6666 1.33268V1.99935H5.33325V1.33268C5.33325 1.15587 5.26301 0.986302 5.13799 0.861278C5.01297 0.736253 4.8434 0.666016 4.66659 0.666016C4.48977 0.666016 4.32021 0.736253 4.19518 0.861278C4.07016 0.986302 3.99992 1.15587 3.99992 1.33268V1.99935H3.33325C2.80282 1.99935 2.29411 2.21006 1.91904 2.58514C1.54397 2.96021 1.33325 3.46892 1.33325 3.99935V13.3327C1.33325 13.8631 1.54397 14.3718 1.91904 14.7469C2.29411 15.122 2.80282 15.3327 3.33325 15.3327H12.6666C13.197 15.3327 13.7057 15.122 14.0808 14.7469C14.4559 14.3718 14.6666 13.8631 14.6666 13.3327V3.99935C14.6666 3.46892 14.4559 2.96021 14.0808 2.58514C13.7057 2.21006 13.197 1.99935 12.6666 1.99935ZM13.3333 13.3327C13.3333 13.5095 13.263 13.6791 13.138 13.8041C13.013 13.9291 12.8434 13.9993 12.6666 13.9993H3.33325C3.15644 13.9993 2.98687 13.9291 2.86185 13.8041C2.73682 13.6791 2.66659 13.5095 2.66659 13.3327V7.33268H13.3333V13.3327ZM13.3333 5.99935H2.66659V3.99935C2.66659 3.82254 2.73682 3.65297 2.86185 3.52794C2.98687 3.40292 3.15644 3.33268 3.33325 3.33268H3.99992V3.99935C3.99992 4.17616 4.07016 4.34573 4.19518 4.47075C4.32021 4.59578 4.48977 4.66602 4.66659 4.66602C4.8434 4.66602 5.01297 4.59578 5.13799 4.47075C5.26301 4.34573 5.33325 4.17616 5.33325 3.99935V3.33268H10.6666V3.99935C10.6666 4.17616 10.7368 4.34573 10.8618 4.47075C10.9869 4.59578 11.1564 4.66602 11.3333 4.66602C11.5101 4.66602 11.6796 4.59578 11.8047 4.47075C11.9297 4.34573 11.9999 4.17616 11.9999 3.99935V3.33268H12.6666C12.8434 3.33268 13.013 3.40292 13.138 3.52794C13.263 3.65297 13.3333 3.82254 13.3333 3.99935V5.99935ZM4.66659 9.99935C4.79844 9.99935 4.92733 9.96025 5.03697 9.88699C5.1466 9.81374 5.23205 9.70962 5.28251 9.5878C5.33296 9.46599 5.34617 9.33194 5.32044 9.20262C5.29472 9.0733 5.23122 8.95451 5.13799 8.86128C5.04475 8.76804 4.92597 8.70455 4.79665 8.67882C4.66733 8.6531 4.53328 8.6663 4.41146 8.71676C4.28965 8.76722 4.18553 8.85267 4.11227 8.9623C4.03902 9.07193 3.99992 9.20083 3.99992 9.33268C3.99992 9.50949 4.07016 9.67906 4.19518 9.80409C4.32021 9.92911 4.48977 9.99935 4.66659 9.99935ZM4.66659 12.666C4.79844 12.666 4.92733 12.6269 5.03697 12.5537C5.1466 12.4804 5.23205 12.3763 5.28251 12.2545C5.33296 12.1327 5.34617 11.9986 5.32044 11.8693C5.29472 11.74 5.23122 11.6212 5.13799 11.5279C5.04475 11.4347 4.92597 11.3712 4.79665 11.3455C4.66733 11.3198 4.53328 11.333 4.41146 11.3834C4.28965 11.4339 4.18553 11.5193 4.11227 11.629C4.03902 11.7386 3.99992 11.8675 3.99992 11.9993C3.99992 12.1762 4.07016 12.3457 4.19518 12.4708C4.32021 12.5958 4.48977 12.666 4.66659 12.666Z" fill="#1D1F20" stroke="#1D1F20" strokeWidth="2" mask="url(#path-1-inside-1_2847_3684)"/>
                    </svg>

                    <span className={`${selectedDate ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
                    </span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {
                isOpen && (
                    <div className={`absolute z-10 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 ${styleCalendarBox}`}>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type='button'
                                onClick={handlePrevYear}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Previous Year"
                            >
                                <ChevronsLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        
                            <button
                                type='button'
                                onClick={handlePrevMonth}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Previous Month"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                        <div className="text-base font-semibold text-gray-900 min-w-[120px] text-center">
                            {months[currentDate.getMonth()]}  {currentDate.getFullYear()}
                        </div>

                        <button
                            type='button'
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Next Month"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>

                        <button
                            type='button'
                            onClick={handleNextYear}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Next Year"
                        >
                            <ChevronsRight className="w-5 h-5 text-gray-600" />
                        </button>
                        </div>

                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                <div key={`${day}-${idx}`} className="text-center text-sm font-semibold text-gray-700 p-2">
                                {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                        </div>
                    </div>
                )
            }
        </div>
    );
}