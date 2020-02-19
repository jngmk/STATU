import React, { FunctionComponent } from 'react'

import { Dayjs } from 'dayjs'
import './styles/StudyLog.scss'

interface InterFace {
  dailyLog: number[]
  startDate: Dayjs
}

const DailyStudyLog: FunctionComponent<InterFace> = (props: InterFace) => {
  const { dailyLog } = props
  const [achieve, goal] = dailyLog
  const progress = (achieve / goal) * 100

  return <div
    className='dailyStudyLog third-color'
    style={{ opacity: `${progress >= 100 ? 100 : (progress >= 60 ? 80 : (progress >= 30 ? 60 : (progress >= 1 ? 40 : 12)))}%` }}
  />
}

export default DailyStudyLog