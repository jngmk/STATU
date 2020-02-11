import React, { FunctionComponent, useMemo, useEffect } from 'react'
import Calendar from '../Calendar'
import useSchedule from '../../hooks/useSchedule'
import useUser from '../../hooks/useUser'
import usePlanPage from '../../hooks/usePlanPage'

import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'

import './styles/MyPlan.scss'
import plus from '../../img/plus.png'

dotenv.config({ path: path.join(__dirname, '.env') })
const SERVER_IP = process.env.REACT_APP_TEST_SERVER

interface Interface {
  userName: string
}

const MyPlan: FunctionComponent<Interface> = (props: Interface) => {
  console.log('myplan')

  const {
    userName,
  } = props

  useEffect(() => {
    getUserId()
  }, [])


  const { onGetUserInfo } = useUser()
  const { onGetUserId, onSetUserId } = usePlanPage()
  const { onPostMainSchedule, mainSchedule, subSchedule, daySchedule } = useSchedule()
  const userId = onGetUserId
  const renderMainSchedule = onGetUserInfo ?
    (onGetUserInfo.id === userId ?
      mainSchedule.filter(schedule => userId === schedule.userId)
      : mainSchedule.filter(schedule => userId === schedule.userId).filter(schedule => schedule.pb === true))
    : []

  let mainPostResponse: number | null = null; let mainPostLoading: boolean = false; let mainPostError: Error | null = null

  console.log('mymain', renderMainSchedule)
  console.log('main', mainSchedule)
  // console.log('sub', subSchedule)
  // console.log('day', daySchedule)
  // console.log('getUserInfo', onGetUserInfo)
  // console.log('userId', userId)


  // 유저 아이디 가져오기
  async function getUserId() {
    try {
      const response = await axios.get(SERVER_IP + '/user/name/' + userName)
      onSetUserId(response.data.id)

    }
    catch (e) {
      console.log(e)
    }
  }

  // 캘린더 추가 버튼 
  const handleAddCalendar = () => {
    postMainScheduleData()
    // console.log('postMainSchedule')
  }


  // 캘린더 추가 버튼을 눌렀을 때 캘린더 DB와 redux에 추가
  async function postMainScheduleData() {
    if (!userId) return 'null'

    const initialMainSchedule = {
      'id': 0,
      'userId': userId,
      'title': '새 계획표',
      'startDate': '',
      'endDate': '',
      'pb': false,
      'tags': [''],
      'view': 0,
      'recommend': 0,
      'represent': false,
      'category1': [''],
      'category2': ['']
    }

    try {
      const response = await axios.post(SERVER_IP + '/calendar', initialMainSchedule)
      // console.log('response', response)
      mainPostResponse = response.data.id
      mainPostLoading = true
      console.log('success', mainPostResponse)
    }
    catch (e) {
      mainPostError = e
      console.error(mainPostError)
    }
    mainPostLoading = false
    // console.log('post', mainPostResponse)
    if (!mainPostResponse) return 'null'
    // console.log('initial', initialMainSchedule)
    onPostMainSchedule({ ...initialMainSchedule, id: mainPostResponse })
  }

  // 화면에 렌더링할 컴포넌트 생성
  const AddButton = useMemo(() =>
  // 시간표추가 <+> 이미지 삽입
     <div
        className="addCalendar"
        onClick={handleAddCalendar}
      >
        <img src={plus} alt="plus" style={{ maxWidth: "100%" }}/>
      </div>
    , [userId])

  const NullCalendar = useMemo(() => {
    if (renderMainSchedule.length === 0) {
      return (
      <div className="requestCalendar">
        시간표를 추가해주세요.
        </div>
      )
    } else {
      return <div></div>
    }
  }, [renderMainSchedule])

  const RepresentCalendar = useMemo(() =>
    renderMainSchedule && renderMainSchedule.map(schedule => {
      if (schedule.represent === true) {
        return (
          <Calendar
            key={schedule.id}
            calendarId={schedule.id}
            calendarUserId={schedule.userId}
            defaultTitle={schedule.title}
            subSchedule={subSchedule.filter(subItem => schedule.id === subItem.calendarId)}
            daySchedule={daySchedule.filter(dayItem => schedule.id === dayItem.calendarId)}
            represent={true}
            tags={schedule.tags}
            onPage='MyPlan'
          />
        )
      } else {
        return null
      }
    }
    ), [renderMainSchedule])

  const CalendarList = useMemo(() =>
    renderMainSchedule && renderMainSchedule.reverse().map(schedule => {
      if (schedule.represent !== true) {
        return (
          <Calendar
            key={schedule.id}
            calendarId={schedule.id}
            calendarUserId={schedule.userId}
            defaultTitle={schedule.title}
            subSchedule={subSchedule.filter(subItem => schedule.id === subItem.calendarId)}
            daySchedule={daySchedule.filter(dayItem => schedule.id === dayItem.calendarId)}
            represent={false}
            tags={schedule.tags}
            onPage='MyPlan'
          />
        )
      } else {
        return null
      }
    }
    ), [renderMainSchedule])


  return (
    <>
      {(onGetUserInfo && onGetUserInfo.id === userId) && AddButton}
      {(onGetUserInfo && onGetUserInfo.id === userId) && NullCalendar}
      <div className={`RepresentCalendar`}>
        {RepresentCalendar}
      </div>
      <div className={`CalendarList`}>
        {CalendarList}
      </div>

    </>
  )
}

export default MyPlan