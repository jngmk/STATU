import React, { FunctionComponent, useMemo } from 'react'
import ScheduleOverview from '../ScheduleViews/ScheduleOverview'
import useUser from '../../hooks/useUser'
import { MainSchedule, SubSchedule, DaySchedule } from '../../store/schedule'

import './style/Board.scss'

interface Interface {
  getMainSchedules: MainSchedule[]
  getSubSchedules: SubSchedule[]
  getDaySchedules: DaySchedule[]
}

const Board: FunctionComponent<Interface> = (props: Interface) => {
  const { getMainSchedules, getSubSchedules, getDaySchedules } = props
  const { onGetUserInfo, onSetTargetUserInfo } = useUser()

  const hotSchedule = useMemo(() => getMainSchedules.sort(function (a, b) {
    if (a.view > b.view) return -1 
    else if (a.view === b.view && a.recommend >= b.recommend) return -1
    else return 1
  }).slice(0, 3)
  ,[getMainSchedules]) 

  const recommendSchedule = useMemo(() => onGetUserInfo && getMainSchedules.filter(schedule => 
    onGetUserInfo.category2.map(categoryName => schedule.category2.includes(categoryName)).includes(true))  // 카테고리가 하나라도 일치하면 true
    .sort(function (a, b) {
      if (a.view > b.view) return -1
      else if (a.view === b.view && a.recommend >= b.recommend) return -1
      else return 1
    }).slice(0, 3)
  ,[getMainSchedules]) 

  const hotScheduleList = useMemo(() => onGetUserInfo && hotSchedule.map(schedule => {
    onSetTargetUserInfo(schedule.id)
    return <ScheduleOverview
      key={schedule.id}
      mainSchedule={schedule}
      subSchedules={getSubSchedules}
      daySchedules={getDaySchedules}
    />
  })
  ,[hotSchedule])

  return (
    <div>
      <div className="board">
        <p className="boardTitle">추천 계획표</p>
        {hotScheduleList}
      </div>

      <div className="board">
        <p className="boardTitle">인기 계획표</p>
        <br />
        <p className="contentTitle">게시글1</p>
        <br />
        <p className="contentTitle">게시글2</p>
        <br />
      </div>
    </div>
  )
}

export default Board