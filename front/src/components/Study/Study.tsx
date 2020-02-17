import React, { FunctionComponent, useMemo } from 'react'
import StudyInfo from './StudyInfo'
import StudyLog from '../StudyLog'
import useUser from '../../hooks/useUser'
import { SubSchedule, DaySchedule, MainSchedule } from '../../store/schedule'
import dayjs from 'dayjs'
import './style/Study.scss'

interface Interface {
  getMainSchedules: MainSchedule[]
  getSubSchedules: SubSchedule[]
  getDaySchedules: DaySchedule[]
}

const Study: FunctionComponent<Interface> = (props: Interface) => {
  const { getMainSchedules, getSubSchedules, getDaySchedules } = props
  const { onGetUserInfo } = useUser()

  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().add(-1, 'day').format('YYYY-MM-DD')

  const myRepresentMainSchedule = onGetUserInfo ?
  getMainSchedules.filter(schedule => schedule.userId === onGetUserInfo.id && schedule.represent === true)
    : []
  const mySubSchedule = myRepresentMainSchedule.length ?
  getSubSchedules.filter(schedule => schedule.calendarId === myRepresentMainSchedule[0].id)
    : []

  const title = useMemo(() => 
  myRepresentMainSchedule.length !== 0 && 
  <div className="studyBoxTitle">
    {myRepresentMainSchedule[0].title}
  </div>
  , [myRepresentMainSchedule])

  const yesterdayDaySchedules: DaySchedule[] = []
  const todayDaySchedules: DaySchedule[] = []
  getDaySchedulesData()

  const yesterdaySubSchdulesProps: SubSchedule[] = []
  const todaySubSchdulesProps: SubSchedule[] = []
  let yesterdayDaySchedulesProps: DaySchedule[] = []
  let todayDaySchedulesProps: DaySchedule[] = []
  let yesterdayColors: string[] = []
  let todayColors: string[] = []
  getPropsDatas()

  function getDaySchedulesData() {
    getDaySchedules.map(schedule => {
      if (schedule.date === today) {
        todayDaySchedules.push(schedule)
      } else if (schedule.date === yesterday) {
        yesterdayDaySchedules.push(schedule)
      }
    })
  }

  function getPropsDatas() {
    const yesterdayEtc: DaySchedule[] = []
    const todayEtc: DaySchedule[] = []
    const yesterdayEtcColor: string[] = []
    const todayEtcColor: string[] = []

    mySubSchedule.length && mySubSchedule.map(schedule => {
      if (schedule.startDate !== '9999-99-99') {
        // 어제 날짜에 해당하는 소목표 추가
        if ((dayjs(schedule.startDate).isBefore(dayjs(yesterday)) || dayjs(schedule.startDate).isSame(dayjs(yesterday)))
          && ((dayjs(schedule.endDate).isAfter(dayjs(yesterday)) || dayjs(schedule.endDate).isSame(dayjs(yesterday))))) {
          yesterdaySubSchdulesProps.push(schedule)
        }
        // 오늘 날짜에 해당하는 소목표 추가
        if ((dayjs(schedule.startDate).isBefore(dayjs(today)) || dayjs(schedule.startDate).isSame(dayjs(today)))
          && ((dayjs(schedule.endDate).isAfter(dayjs(today)) || dayjs(schedule.endDate).isSame(dayjs(today))))) {
          todaySubSchdulesProps.push(schedule)
        }
        // 어제 날짜에 해당하는 일일목표 소목표 추가 순서대로 추가
        yesterdayDaySchedules && yesterdayDaySchedules.map(dayschedule => {
          if (dayschedule.subTitleId === schedule.id) {
            yesterdayDaySchedulesProps.push(dayschedule)
            yesterdayColors.push(schedule.color)
          }
        })
        // 오늘 날짜에 해당하는 일일목표 소목표 추가 순서대로 추가
        todayDaySchedules && todayDaySchedules.map(dayschedule => {
          if (dayschedule.subTitleId === schedule.id) {
            todayDaySchedulesProps.push(dayschedule)
            todayColors.push(schedule.color)
          }
        })
        // 기타에 해당하는 일일목표는 따로 추가
      } else {
        yesterdayDaySchedules && yesterdayDaySchedules.map(dayschedule => {
          if (dayschedule.subTitleId === schedule.id) {
            yesterdayEtc.push(dayschedule)
            yesterdayEtcColor.push(schedule.color)
          }
        })
        todayDaySchedules && todayDaySchedules.map(dayschedule => {
          if (dayschedule.subTitleId === schedule.id) {
            todayEtc.push(dayschedule)
            todayEtcColor.push(schedule.color)
          }
        })
      }
    })
    // 기타에 해당하는 항목들의 순서를 뒤로 보내기 위해 병합
    yesterdayDaySchedulesProps = yesterdayDaySchedulesProps.concat(yesterdayEtc)
    todayDaySchedulesProps = todayDaySchedulesProps.concat(todayEtc)
    yesterdayColors = yesterdayColors.concat(yesterdayEtcColor)
    todayColors = todayColors.concat(todayEtcColor)
  }


  return (
    <>
      {title}
      <div className="study">
        <br />
        <div className="leftStudyBox">
          <div>어제 한 공부</div>
          <StudyInfo
            colors={yesterdayColors}
            subSchedules={yesterdaySubSchdulesProps}
            daySchedules={yesterdayDaySchedulesProps}
          />
        </div>
        <div className="rightStudybox">
          <div>오늘 할 공부</div>
          <StudyInfo
            colors={todayColors}
            subSchedules={todaySubSchdulesProps}
            daySchedules={todayDaySchedulesProps}
          />
        </div>
      </div>
      <StudyLog />
    </>
  )
}

export default Study
