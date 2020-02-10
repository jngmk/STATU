import React, { FunctionComponent, useMemo } from 'react'
import useStopWatch from '../../hooks/useStopWatch'
import useSchedule from '../../hooks/useSchedule'
import { DaySchedule } from '../../store/schdule'

import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, '.env') })
const SERVER_IP = process.env.REACT_APP_TEST_SERVER

interface Interface {
  color: string
  daySchedule: DaySchedule
}

const DayStudyInfo: FunctionComponent<Interface> = (props: Interface) => {
  const { color, daySchedule } = props
  const { isRunning, timeElapsed, targetId, onToggleIsRunning, onSetTimeElapsed, onSetTargetDaySchedule } = useStopWatch()
  const { onPutDaySchedule } = useSchedule()
  let startTime = Date.now()

  console.log('dayStudyInfo', daySchedule.todo)

  const handleStopWatchClick = () => {
    onToggleIsRunning()
    startStopToggle()
    if (!isRunning) {
      onSetTargetDaySchedule(daySchedule.id)
    } else {
      onSetTargetDaySchedule(0)
    }
    console.log(isRunning, timeElapsed)
  }
  console.log(isRunning, timeElapsed)

  const handleSetTimeElapsed = async (elapsedTime: number) => {
    startTime = Date.now()
    onSetTimeElapsed(elapsedTime)
    daySchedule.achieve = daySchedule.achieve + elapsedTime
    onPutDaySchedule(daySchedule)
    try {
      const response = await axios.put(SERVER_IP + '/todo', daySchedule)
      console.log('success', response.data)
    }
    catch (e) {
      console.log(e)
    }
    console.log(isRunning, timeElapsed)
  }

  const startStopToggle = () => {
    startTime = Date.now()
    const timer = () => setInterval(() => handleSetTimeElapsed(Math.floor((Date.now() - startTime)/60000)), 60000)
    if (!isRunning) {
      timer()
      console.log(isRunning, timeElapsed)
    } else {
      clearInterval(timer())
      handleSetTimeElapsed(Date.now() - startTime)
      console.log(daySchedule)
    }
  }

  const handleClick = () => {
    handleStopWatchClick()
  }

  const stopWatchBtn = useMemo(() => {
    return (
      <div
        className='stopWatch'
        onClick={handleClick}
      >
        {(isRunning && daySchedule.id === targetId) ? '중지' : '시작'}
      </div>
    )
  }, [isRunning])

  const progressBar = useMemo(() => {
    return (
      daySchedule.goal !== 0 &&
      <div>
        <div
          className={`progressBar`}
        >
          <div
            className={`progressBar`}
            style={{ backgroundColor: color, width: `${Math.min(daySchedule.achieve / daySchedule.goal, 1) * 100}%` }}
          />
        </div>
      </div>
    )
  }, [daySchedule.achieve])

  return (
    <div
      className={`dayDataItem`}
    >
      <div
        className='dayListCircle'
        style={{ backgroundColor: color }}
      />
      {daySchedule.todo}
      {stopWatchBtn}
      {progressBar}
      {daySchedule.achieve} - {daySchedule.goal}
    </div>
  )
}

export default DayStudyInfo