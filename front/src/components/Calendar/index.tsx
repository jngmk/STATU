import React, { useState, ChangeEvent, FunctionComponent, MouseEvent } from 'react';
import { useStore } from 'react-redux'
import useModal from '../../hooks/modal/useModal'
import dayjs from 'dayjs'
import localeDe from "dayjs/locale/ko"
import MonthViewCalendar from './MonthView/MonthViewCalendar'
import WeekViewCalendar from './WeekView/WeekViewCalendar'
import CalendarNavi from './CalendarNavi/CalendarNavi'
import { daySchedule } from './dataSet/dataSet'
// import { DaySchedule } from './dataSet/DataSet.interface'
import Modal from '../Modal/Modal'
// import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '.env') })

const Calendar: FunctionComponent<{}> = () => {
  const store = useStore()
  console.log(store.getState())
  const targetDate: dayjs.Dayjs = dayjs().locale(localeDe)
  const [targetDateString, setTargetDateString] = useState<string>(targetDate.format('YYYY-MM-DD'))
  const [targetMonth, setTargetMonth] = useState<string>(targetDate.format('YYYY-MM-DD'))
  const [targetDay, setTargetDay] = useState<number>(targetDate.date())
  const [title, setTitle] = useState<string>('My Custom Schedule')
  const [showMonth, setShowMonth] = useState<boolean>(true)

  const { modalState, onCloseModal } = useModal()
  const targetMonthString: string = dayjs(targetMonth).format('MMMM YYYY')

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date: string = dayjs(e.target.value).startOf('M').format('YYYY-MM-DD')
    setTargetMonth(date)
  }

  const handleState = (targetDay: number, targetDateString: string) => {
    setTargetDay(targetDay)
    setTargetDateString(targetDateString)
    console.log('modalState', modalState)
  }

  const handleMovePrevMonth = (now: string) => {
    const prevMonth = dayjs(now).add(-1, 'month').format('YYYY-MM-DD')

    setTargetMonth(prevMonth)
  }

  const handleMoveNextMonth = (now: string) => {
    const nextMonth = dayjs(now).add(1, 'month').format('YYYY-MM-DD')

    setTargetMonth(nextMonth)
  }

  const handleShowMonth = (e: MouseEvent<HTMLDivElement>) => {
    setShowMonth(!showMonth)
  }

  const handleCloseModal = () => {
    onCloseModal()
  }

  return (
    <div 
      // 모달을 제외한 화면을 클릭했을 때 모달이 종료되도록 조정 필요
      className="containerDiv container-fluid">

      {/* 달력 헤더 */}
      <div className="headerContainer">
        <header className="header">
          <h1 className="mainHeader">I LIKE STUDYING!</h1>
          {/* <p className="caption">
              (for statefull use, uncomment and pick a day to see the
              differance)
            </p> */}

          <div
            data-test="calendarTitle"
            className={`calendarTitle ${'exampleTitleContainerClass' || ''}`}
          >
            {title}
          </div>

          {/* 달력 제공 타입에 따른 헤더 전환 */}
          {showMonth ?
            <div
              data-test="monthTitle"
              className={`monthTitle ${'exampleMonthTitleClass' || ''}`}
            >
              {targetMonthString}
            </div>
            :
            <div
              data-test="weekTitle"
              className={`weekTitle ${'exampleWeekTitleClass' || ''}`}
            >
              {/* {targetMonthString} */}
              '몇 주차 입니다.'
            </div>
          }
        </header>
      </div>

      {/* 달력 저번달 다음달 전환 버튼 */}
      <CalendarNavi targetMonth={targetMonth} onMovePrevMonth={handleMovePrevMonth} onMoveNextMonth={handleMoveNextMonth} />

      {/* 달력 제공 타입 전환 버튼 */}
      <div
        onClick={handleShowMonth}
      >
        {showMonth ? 'Weekly' : 'Monthly'}
      </div>

      {/* showMonth 타입에 따른 렌더링 될 달력 선택 */}
      {showMonth ?
        <MonthViewCalendar
          targetDay={targetDay}
          targetMonth={targetMonth}
          targetDateString={targetDateString}
          daySchedule={daySchedule}
          handleState={handleState}
          width="92%"
          containerClassName="exampleClassContainer"
          rowContainerClassName="exampleClassRow"
          dayContainerClassName="exampleClassDay"
          dayDataListClass="exampleDayDataListClass"
          dayDataListItemClass="exampleDayDataListItemClass"
          daysHeaderContainerClass="exampleDaysHeaderContainerClass"
          daysTitleContainerClass="exampleDaysTitleContainerClass"
          colorActiveDate="palegoldenrod"
          colorPastDates="#f1f1f1"
        />
        :
        <WeekViewCalendar />
      }

      {/* 선택된 날짜에 대한 정보 제공 */}
      <div className="stateStatsContainer">
        <div className="stateStats">
          <p className="caption">targetDay: {targetDay}</p>
          <p className="caption">
            targetDateString: {dayjs(targetDateString).format('DD/MM/YYYY')}
          </p>
          <div>
            <label className="inputLabel caption">Pick a Month</label>
            <input
              style={{ marginTop: '20px', marginBottom: '20px' }}
              type="date"
              value={targetMonth}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </div>

      {/* 풋터 */}
      <div className="footerDiv">
        &copy; Created By Stevorated (Shirel Garber)
      </div>

      {/* 모달 */}
      {modalState ?
        <Modal />
        :
        ''
      }
      
    </div>
  )
}

export default Calendar