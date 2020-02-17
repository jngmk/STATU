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
import plus_black from '../../img/plus_black.png'
import plus_white from '../../img/plus_white.png'
import { history } from '../../configureStore'

dotenv.config({ path: path.join(__dirname, '.env') })
const SERVER_IP = process.env.REACT_APP_TEST_SERVER
const SERVER_IMG_IP = process.env.REACT_APP_TEST_SERVER_IMG


interface Interface {
  userName: string
}

const MyPlan: FunctionComponent<Interface> = (props: Interface) => {
  console.log('myplan')

  const {
    userName,
  } = props

  const { onGetUserInfo } = useUser()
  const { onGetUserId, onSetUserId } = usePlanPage()
  const { onPostMainSchedule, onGetSubSchedule, getMainSchedules, getSubSchedules, getDaySchedules } = useSchedule()
  const userId = onGetUserId
  const renderMainSchedule = onGetUserInfo ?
    (onGetUserInfo.id === userId ?
      getMainSchedules.filter(schedule => userId === schedule.userId)
      : getMainSchedules.filter(schedule => userId === schedule.userId).filter(schedule => schedule.pb === true))
    : []

  console.log('mymain', renderMainSchedule)
  console.log('main', getMainSchedules)
  console.log('sub', getSubSchedules)
  // console.log('day', daySchedule)
  // console.log('getUserInfo', onGetUserInfo)
  // console.log('userId', userId)

  useEffect(() => {
    getUserId()
  }, [])

  // 유저 아이디 가져오기
  async function getUserId() {
    try {
      const response = await axios.get(SERVER_IP + '/user/name/' + userName)
      onSetUserId(response.data.id)

    }
    catch (e) {
      console.log(e)
      history.push('/error')
    }
  }

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

  // 캘린더 추가 버튼 
  const handleAddCalendar = () => {
    onPostMainSchedule(initialMainSchedule)
    console.log('subschedules', getSubSchedules)
  }

  // 화면에 렌더링할 컴포넌트 생성
  const AddButton = useMemo(() =>
    <>
      <img onClick={handleAddCalendar} className="addCalendar" src={plus_white} alt="plus" style={{ height: "30px" }} />
      <div className="fakeDiv"> </div>
    </>
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
            importId={0}
            calendarUserId={schedule.userId}
            defaultTitle={schedule.title}
            subSchedule={getSubSchedules.filter(subItem => schedule.id === subItem.calendarId)}
            daySchedule={getDaySchedules.filter(dayItem => schedule.id === dayItem.calendarId)}
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
            importId={0}
            calendarUserId={schedule.userId}
            defaultTitle={schedule.title}
            subSchedule={getSubSchedules.filter(subItem => schedule.id === subItem.calendarId)}
            daySchedule={getDaySchedules.filter(dayItem => schedule.id === dayItem.calendarId)}
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
    <div>
      {(onGetUserInfo && onGetUserInfo.id === userId) && AddButton}
      {(onGetUserInfo && onGetUserInfo.id === userId) && NullCalendar}
      <div className="headerOp" >
          <img className='userImg' src={`${SERVER_IMG_IP}/${onGetUserInfo?.img}`} />
          <section className="userInfo">
            <div className="userName">
            {onGetUserInfo?.name}
            </div>
            <div className="userEmail">
            {onGetUserInfo?.email}
            </div>
            <div className="userCategory1">
            {onGetUserInfo?.category1}
            </div>
            <div className="userCategory2">
            {onGetUserInfo?.category2}
            </div>
          </section>
          <hr/>
      </div>
      <div className={`RepresentCalendar`}>
        {RepresentCalendar}
      </div>
      <div className={`CalendarList`}>
        {CalendarList}
      </div>

    </div>
  )
}

export default MyPlan