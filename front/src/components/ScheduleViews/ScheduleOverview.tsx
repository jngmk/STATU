import React, { FunctionComponent, useMemo } from 'react'
import Calendar from '../Calendar'
import useUser from '../../hooks/useUser'
import { MainSchedule, SubSchedule, DaySchedule } from '../../store/schedule'

const SERVER_IMG_IP = process.env.REACT_APP_TEST_SERVER_IMG

interface InterFace {
  mainSchedule: MainSchedule
  subSchedules: SubSchedule[]
  daySchedules: DaySchedule[]
}

const ScheduleOverview: FunctionComponent<InterFace> = (props: InterFace) => {
  const { mainSchedule, subSchedules, daySchedules } = props
  const { onGetTargetUserInfo } = useUser()
  const targetUserInfo = onGetTargetUserInfo.filter(userInfo => userInfo.id === mainSchedule.userId)[0]

  const calendar = useMemo(() => 
    mainSchedule && <Calendar
    calendarId={mainSchedule.id}
    importId={0}
    calendarUserId={mainSchedule.userId}
    defaultTitle={mainSchedule.title}
    subSchedule={subSchedules.filter(subItem => mainSchedule.id === subItem.calendarId)}
    daySchedule={daySchedules.filter(dayItem => mainSchedule.id === dayItem.calendarId)}
    represent={true}
    tags={mainSchedule.tags}
    onPage='Overview'
  />
  ,[mainSchedule])

  const userInfo = useMemo(() => {
    return targetUserInfo && 
      <div className='board-userinfo'>
        <img className='board-userinfo-profile' src={`${SERVER_IMG_IP}/${targetUserInfo.img}`} />
        <div className='board-userinfo-name'>{targetUserInfo.name}</div>
      </div>
  }    
  ,[targetUserInfo])

  return (
    <div>
      {userInfo}
      {calendar}
    </div>
  )
}

export default ScheduleOverview