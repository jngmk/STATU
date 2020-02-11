import React, { useState, FunctionComponent, ChangeEvent, MouseEvent, useCallback, useMemo, useRef, useEffect } from 'react';
import Modal from '../Modal/Modal'
import useModal from '../../hooks/useModal'
import useDrag from '../../hooks/useDrag'
import useUser from '../../hooks/useUser'
import useWindowSize from '../../hooks/useWindowSize'
import useSchedule from '../../hooks/useSchedule'
import MonthViewCalendar from './MonthView/MonthViewCalendar'
import CalendarNavi from './CalendarNavi/CalendarNavi'
import { SubSchedule, DaySchedule, postMainSchedule } from '../../store/schdule'

import dayjs from 'dayjs'
import localeDe from "dayjs/locale/ko"
import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'
import './styles/Calendar.scss'

import pencil from '../../img/pencil.png'
import trash from '../../img/trash-can.png'
import lock from '../../img/lock.png'
import unlock from '../../img/lock_shared.png'
import share3 from '../../img/share3.png'

dotenv.config({ path: path.join(__dirname, '.env') })
const SERVER_IP = process.env.REACT_APP_TEST_SERVER

interface Interface {
  calendarId: number
  calendarUserId: number
  defaultTitle: string
  subSchedule: SubSchedule[]
  daySchedule: DaySchedule[]
  represent: boolean
  tags: string[]
  onPage: string
}


const Calendar: FunctionComponent<Interface> = (props: Interface) => {
  const {
    calendarId,
    calendarUserId,
    defaultTitle,
    subSchedule,
    daySchedule,
    represent,
    tags,
    onPage,
  } = props

  console.log(calendarId, onPage, 'Calendar View')
  const titleElement = useRef<HTMLDivElement>(null)
  const headerElement = useRef<HTMLDivElement>(null)
  // console.log(headerElement)
  // console.log(titleElement)
  const { width } = useWindowSize()
  const { onGetUserInfo } = useUser()
  const { startDate, tempDate } = useDrag()
  const targetDate: dayjs.Dayjs = dayjs().locale(localeDe)
  const [targetDateString, setTargetDateString] = useState<string>(targetDate.format('YYYY-MM-DD'))
  const [targetMonth, setTargetMonth] = useState<string>(targetDate.format('YYYY-MM-DD'))
  const [title, setTitle] = useState<string>(defaultTitle)
  const [hashTagName, setHashTagName] = useState<string>('')
  const [showMonth, setShowMonth] = useState<boolean>(represent)
  const [editMode, setEditMode] = useState<boolean>(false)
  const [titleWidth, setTitleWidth] = useState<number>(0)
  const [titleHeight, setTitleHeight] = useState<number>(0)
  const [headerWidth, setheaderWidth] = useState<number>(0)
  const [windowWidth, setWindowWidth] = useState<number>(width)

  const { modalState } = useModal()

  useEffect(() => {
    if (titleElement.current === null || headerElement.current === null) return
    setTitleWidth(titleElement.current.clientWidth)
    setTitleHeight(titleElement.current.clientHeight)
    setheaderWidth(headerElement.current.clientWidth)
    setWindowWidth(width)
  }, [titleElement])

  // 마우스 호버 변수
  const [hoverState, setHoverState] = useState<boolean>(false)
  const [hoverItemId, setHoverItemId] = useState<number>(0)

  // 이번달 시작날짜, 끝날짜 계산
  const daysInMonth = dayjs(targetMonth).daysInMonth()
  const startDayInMonth = dayjs(targetMonth).date(1)
  const endDayInMonth = dayjs(targetMonth).date(daysInMonth)

  const targetMonthStartDay = startDayInMonth.day() + 1
  const targetMonthEndDay = endDayInMonth.day() + 1

  // 시작날짜, 끝날짜를 이용해 이번 달에 렌더링할 캘린더 데이터 필터링
  const startDay = startDayInMonth.add(-(targetMonthStartDay - 1), 'day')
  const endDay = endDayInMonth.add((7 - targetMonthEndDay), 'day')

  // 일일 스케줄 데이터 필터링
  const daySchedules = daySchedule.filter(schedule => dayjs(schedule.date) >= startDay && dayjs(schedule.date) <= endDay)

  // 소목표 데이터 필터링
  const subSchedules = subSchedule
    .filter(schedule => !(dayjs(schedule.endDate) < startDay || dayjs(schedule.startDate) > endDay) || schedule.startDate === '9999-99-99')  // 이번 달에 있는 일정
    .sort(function (a, b) {
      if (sortDate(a.startDate, b.startDate) === 0) {
        return sortDate(b.endDate, a.endDate)
      } else {
        return sortDate(a.startDate, b.startDate)
      }
    })

  // 해시태그 리스트
  const hashTagList = tags.filter(tag => tag !== '')

  // 사용함수
  const { getMainSchedules, getSubSchedules, getDaySchedules, onPostMainSchedule, onPostSubSchedule, onPostDaySchedule,
    onPutMainSchedule, onDeleteMainSchedule, onMakeRepresentSchedule, onMakePublicSchedule } = useSchedule()
  const initialMainCalendar = getMainSchedules.filter(schedule => schedule.id === calendarId)[0]
  let mainPutResponse: string | null = null; let mainPutLoading: boolean = false; let mainPutError: Error | null = null

  function sortDate(first: string, second: string) {
    const [firstYear, firstMonth, firstDay] = first.split('-').map(string => parseInt(string))
    const [secondYear, secondMonth, secondDay] = second.split('-').map(string => parseInt(string))

    if (firstYear < secondYear) {
      return -1
    } else if (firstYear > secondYear) {
      return 1
    } else {
      if (firstMonth < secondMonth) {
        return -1
      } else if (firstMonth > secondMonth) {
        return 1
      } else {
        if (firstDay < secondDay) {
          return -1
        } else if (firstDay > secondDay) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  const handleState = (targetDateString: string) => {
    setTargetDateString(targetDateString)
  }

  const handleMovePrevMonth = (now: string) => {
    const prevMonth = dayjs(now).add(-1, 'month').format('YYYY-MM-DD')
    setTargetMonth(prevMonth)
  }

  const handleMoveNextMonth = (now: string) => {
    const nextMonth = dayjs(now).add(1, 'month').format('YYYY-MM-DD')
    setTargetMonth(nextMonth)
  }

  const handleShowMonth = () => {
    if (represent !== true) {
      setShowMonth(!showMonth)
    }
  }

  // 캘린더 헤더 쪽에 있는 버튼 함수
  const handleMouseEnter = (id: number) => {
    setHoverState(true)
    setHoverItemId(id)
    // console.log('mouseEnter', hoverState, hoverItemId)
  }

  const handleMouseLeave = () => {
    setHoverState(false)
    setHoverItemId(0)
    // console.log('mouseLeave', hoverState, hoverItemId)
  }

  const handleHashTag = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setHashTagName(e.target.value)
  }, [])

  const handleAddHashtag = async (e: MouseEvent) => {
    e.stopPropagation()
    hashTagList.push(hashTagName)
    const editedSchedule = { ...initialMainCalendar, tags: hashTagList }

    onPutMainSchedule(editedSchedule)
    try {
      await axios.put(SERVER_IP + '/calendar', editedSchedule)
    }
    catch (e) {
      console.error(e)
    }
    setHashTagName('')
  }

  const handleDeleteHashtag = async (e: MouseEvent, id: number) => {
    e.stopPropagation()
    hashTagList.splice(id, 1)
    const editedSchedule = { ...initialMainCalendar, tags: hashTagList }

    onPutMainSchedule(editedSchedule)
    try {
      await axios.put(SERVER_IP + '/calendar', editedSchedule)
    }
    catch (e) {
      console.error(e)
    }
    console.log('deleteHashTag')
  }

  const handleDeleteCalendar = async (e: MouseEvent) => {
    e.stopPropagation()
    onDeleteMainSchedule(calendarId)
    try {
      const response =
        await axios.delete(SERVER_IP + '/calendar/' + calendarId)
      mainPutResponse = response.data
      mainPutLoading = true
      // console.log('success', mainPutResponse)
    }
    catch (e) {
      // mainPutError = e
      // console.error(mainPutError)
      console.error(e)
    }
  }

  const handleMakeRepresent = async (e: MouseEvent) => {
    e.stopPropagation()
    onMakeRepresentSchedule(calendarId)
    try {
      await axios.put(SERVER_IP + '/representset/' + calendarId)
    }
    catch (e) {
      console.error(e)
    }
  }

  const handlePublicToggle = async (e: MouseEvent) => {
    e.stopPropagation()
    onMakePublicSchedule(calendarId)
    try {
      await axios.put(SERVER_IP + '/pbtoggle/' + calendarId)
      console.log('locked')
    }
    catch (e) {
      console.error(e)
    }
  }

  const handleRecommend = async () => {
    const editedSchedule = { ...initialMainCalendar, recommend: initialMainCalendar.recommend + 1 }
    console.log('recommend', editedSchedule)

    onPutMainSchedule(editedSchedule)
    try {
      const response = await axios.put(SERVER_IP + '/calendar', editedSchedule)
      console.log(response.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleScrap = async () => {
    if (!onGetUserInfo) return

    const scrapInfo = {
      "calendarId": calendarId,
      "userId": onGetUserInfo.id
    }
    try {
      const response = await axios.post(SERVER_IP + '/calendartemp', scrapInfo)
      console.log(response.data)
    }
    catch (e) {
      console.log(e)
    }
  }

  const handleSave = async () => {
    if (!onGetUserInfo) return
    let editedSchedule = { ...initialMainCalendar, id: 0, userId: onGetUserInfo.id, represent: false, pb: false }
    let postMainScheduleId: number = 0
    try {
      const response = await axios.post(SERVER_IP + '/calendar', editedSchedule)
      console.log('success', response.data)
      postMainScheduleId = response.data.id

      editedSchedule = { ...editedSchedule, id: postMainScheduleId }
      console.log('editedSchedule', editedSchedule)
      onPostMainSchedule(editedSchedule)
    }
    catch (e) {
      console.log(e)
    }
    if (postMainScheduleId === 0) return

    console.log(getSubSchedules)
    const filteredSubNewId: number[] = [getSubSchedules.filter(schedule => schedule.calendarId === postMainScheduleId)[0].id]
    const filteredSubOriginId: number[] = []
    const initialStartDate = dayjs(dayjs(initialMainCalendar.startDate))
    const initialStartDay = initialStartDate.day()
    const todayDay = targetDate.day()

    const dayFromInitialStartDate = targetDate.diff(initialStartDate, 'day')
    const tuneDayWithOrigin = (initialStartDay - todayDay) >= 0 ? (initialStartDay - todayDay) : (initialStartDay - todayDay) + 7
    const addDays = dayFromInitialStartDate + tuneDayWithOrigin
    console.log('요일', initialStartDay, todayDay, tuneDayWithOrigin)

    let postSubSchduleId: number = 0
    getSubSchedules.map(async(schedule) => {
      if (schedule.calendarId === calendarId) {
        filteredSubOriginId.push(schedule.id)
        if (schedule.startDate === '9999-99-99') return
        let editedSchedule = { ...schedule, id: 0, calendarId: postMainScheduleId, startDate: `${dayjs(schedule.startDate).add(addDays, 'day').format('YYYY-MM-DD')}`, endDate: `${dayjs(schedule.endDate).add(addDays, 'day').format('YYYY-MM-DD')}` }
        try {
          const response = await axios.post(SERVER_IP + '/subtitle', editedSchedule)
          postSubSchduleId = response.data
          console.log('success post sub', postSubSchduleId)

          editedSchedule = { ...editedSchedule, id: postSubSchduleId}
          onPostSubSchedule(editedSchedule)
          filteredSubNewId.push(postSubSchduleId)
        }
        catch (e) {
          console.log(e)
        }
      }
    })

    let postDayScheduleId: number = 0
    getDaySchedules.map(async(schedule) => {
      if (schedule.calendarId === calendarId) {
        let editedSchedule = { ...schedule, id: 0, calendarId: postMainScheduleId, date: `${dayjs(schedule.date).add(addDays, 'day').format('YYYY-MM-DD')}` }
        filteredSubOriginId.map((originId, idx) => {
          if (originId === schedule.subTitleId) {
            editedSchedule = { ...editedSchedule, subTitleId: filteredSubNewId[idx]}
          }
        })
        try {
          const response = await axios.post(SERVER_IP + '/todo', editedSchedule)
          postDayScheduleId = response.data
          console.log('success post sub', postDayScheduleId)

          editedSchedule = { ...editedSchedule, id: postDayScheduleId}
          onPostDaySchedule(editedSchedule)
        }
        catch (e) {
          console.log(e)
        }
      }
    })
  }

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleInputClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  const handleEditTitle = (e: MouseEvent) => {
    e.stopPropagation()
    const editedSchedule = { ...initialMainCalendar, title: title }
    onPutMainSchedule(editedSchedule)
    setEditMode(false)
  }

  const handleEditMode = (e: MouseEvent) => {
    e.stopPropagation()
    setEditMode(true)
  }

  // TODO : 커스텀 hook으로 변경할 것
  // store.getState().drag.tempDate 로 tempDate가져오면 느림!(계속 변하기 때문인듯)
  const getSelectedDate = tempDate
  const dragStart = dateToNumber(startDate) // startDate는 변하지 않음
  const dragOver = dateToNumber(getSelectedDate)
  // 소목표를 앞으로 설정하는지 뒤로 설정하는지에 대한 조건 - CalendarDay 컴포넌트까지 내려보냄
  const isAscending: boolean = dragOver - dragStart + 1 > 0 ? true : false

  function dateToNumber(strDate: string): number {
    var result = strDate.replace(/\-/g, '')
    return parseInt(result)
  }

  // 사용자와 상호작용을 보여주기 위한 변수
  const headerBorder = showMonth ? '' : 'headerBorder'
  const canEdit = onGetUserInfo !== null && (onGetUserInfo.id === calendarUserId ? '' : 'pointerNone')

  const MyCalendarOption = useMemo(() => {
    return (
      <div
        className={`calendarOption`}
        style={{ minWidth: `${(windowWidth - titleWidth) / windowWidth * 100}%`, height: `${titleHeight}px` }}
      >
        <div
          className={`calendarHeader alingLeft`}
        >
          <div
            className={`calendarHeader calendarHeaderButton`}
            onClick={handleEditMode}
          >
            수정
                </div>
          <div className={`calendarHeader hashTagBox ${canEdit}`}>
            <div
              className={`calendarHeader ${canEdit}`}
            >
              <div
                className={`calendarHeader`}
                onClick={handleInputClick}
              >
                <input
                  type="text"
                  placeholder="태그입력"
                  value={hashTagName}
                  onChange={handleHashTag}
                />
              </div>
              <div
                className={`calendarHeader xsButton`}
                onClick={handleAddHashtag}
              >
                +
              </div>
            </div>
          </div>
        </div>
        <div
          className={`calendarHeader alignRight`}
        >
          <div
            className={`calendarHeader calendarHeaderButton`}
            onClick={handleDeleteCalendar}
          >
            삭제
          </div>
          <div
            className={`calendarHeader calendarHeaderButton`}
            onClick={handleMakeRepresent}
          >
            대표
          </div>
          <div
            className={`calendarHeader calendarHeaderButton`}
            onClick={handlePublicToggle}
          >
            공유
          </div>
        </div>
      </div>
    )
  }, [titleWidth])

  const ImportedCalendarOption = useMemo(() => {
    return (
      <div
        className={`calendarOption`}
        style={{ minWidth: `${(headerWidth - titleWidth) / windowWidth * 100}%`, height: `${titleHeight}px` }}
      >
        <div className={`calendarHeader alignRight`}>
          <div
            className={`calendarHeader calendarHeaderButton`}
            onClick={handleRecommend}
          >
            추천
          </div>
          {onPage === 'MyPlan' ?
            <div
              className={`calendarHeader calendarHeaderButton`}
              onClick={handleScrap}
            >
              가져오기
              </div>
            :
            <div
              className={`calendarHeader calendarHeaderButton`}
              onClick={handleSave}
            >
              저장하기
                </div>
          }
        </div>
      </div>
    )
  }, [titleWidth])

  return (
    <div
      // 모달을 제외한 화면을 클릭했을 때 모달이 종료되도록 조정 필요
      className={`calendarContainer`}>

      {/* 달력 헤더 */}
      <br />
      <div
        className="headerContainer"
        onClick={handleShowMonth}
      >
        <header
          ref={headerElement}
          className={`header ${headerBorder}`}
        >
          <div
            ref={titleElement}
            className={`calendarTitle ${canEdit}`}
          >
            {!editMode ?
              title
              :
              // 캘린더제목 수정모드일 때
              <>
                <div
                  className="calendarHeader"
                  onClick={handleInputClick}
                >
                  <input
                    className="inputTag"
                    type="text"
                    value={title}
                    onChange={handleTitle}
                  />
                </div>
                <div
                  className={`calendarHeader`}
                  onClick={handleEditTitle}
                >
                  확인
                </div>
              </>
            }
          </div>
          {!canEdit ?
            MyCalendarOption
            :
            ImportedCalendarOption
          }
          <div>
            <div
              className={`calendarHeader hashTagList`}>
              {/* {hashTagComponents} */}
              {
                hashTagList.map((hashTag, idx) =>
                  <div
                    key={idx}
                    className={`calendarHeader hashTagItem`}
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    {hashTag}
                    {hoverState && idx === hoverItemId ?
                      <div
                        className={`calendarHeader xsButton`}
                        onClick={(e) => handleDeleteHashtag(e, idx)}
                      >
                        ❌
                  </div>
                      :
                      ''
                    }
                  </div>)
              }
            </div>
          </div>
        </header>
      </div>
      <div
        className={`calendarBody ${canEdit}`}
      >
        {showMonth ?
          <>
            {/* 달력 저번달 다음달 전환 버튼 */}
            <CalendarNavi targetMonth={targetMonth} onMovePrevMonth={handleMovePrevMonth} onMoveNextMonth={handleMoveNextMonth} />

            {/* showMonth 타입에 따른 렌더링 될 달력 선택 */}
            <MonthViewCalendar
              calendarId={calendarId}
              targetMonth={targetMonth}
              targetDateString={targetDateString}
              mainSchedule={initialMainCalendar}
              subSchedule={subSchedules}
              daySchedule={daySchedules}
              handleState={handleState}
              colorActiveDate="palegoldenrod"
              colorPastDates="#f1f1f1"
              isAscending={isAscending}
            />

            {/* 모달 */}
            {modalState ?
              <Modal />
              :
              ''
            }
          </>
          :
          ''
        }
      </div>
    </div>
  )
}

export default Calendar