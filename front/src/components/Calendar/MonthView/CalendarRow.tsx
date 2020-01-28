import React, { FunctionComponent } from 'react'
import uuid from 'uuid'

import Interface from './interfaces/CalendarRow.interface'
import { DaySchedule } from '../dataSet/DataSet.interface'

import CalendarDay from './CalendarDay'

import './styles/CalendarRow.scss'

interface Props {
  week: string[];
  targetMonth: string;
  targetDay: number;
  targetDateString: string;
  handleState: (targetDay: number, targetDateString: string) => void;
  dayComponent?: object;
  daySchedule: DaySchedule[];
  rowContainerClassName?: string;
  dayContainerClassName?: string;
  dayDataListClass?: string;
  dayDataListItemClass?: string;
  colorPastDates?: string;
  colorActiveDate?: string;
}


const CalendarRow: FunctionComponent<Interface> = (props: Props) => {
  const {
    week,
    targetMonth,
    targetDay,
    targetDateString,
    handleState,
    dayComponent,
    daySchedule,
    rowContainerClassName,
    dayContainerClassName,
    dayDataListClass,
    dayDataListItemClass,
    colorPastDates,
    colorActiveDate,
  } = props

  const renderRows = (week: string[]) => {
    // console.log(week)
    return week.map(day => {
      return (
        <CalendarDay
          data-test="calendarDay"
          dayContainerClassName={dayContainerClassName}
          dayDataListClass={dayDataListClass}
          dayDataListItemClass={dayDataListItemClass}
          key={`day-${day || uuid()}`}
          date={day}
          targetMonth={targetMonth}
          targetDay={targetDay}
          targetDateString={targetDateString}
          handleState={handleState}
          dayComponent={dayComponent}
          daySchedule={daySchedule}
          colorPastDates={colorPastDates}
          colorActiveDate={colorActiveDate}
        />
      )
    })
  }
  return (
    <div
      data-test="calendarRowContainer"
      className={`calendarRow ${rowContainerClassName}`}
    >
      {renderRows(week)}
    </div>
  )
}

export default CalendarRow