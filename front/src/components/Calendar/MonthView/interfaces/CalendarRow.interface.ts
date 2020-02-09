import { SubSchedule, DaySchedule } from '../../../../store/schdule'

export default interface Component {
  title?: string
  calendarId: number
  week: string[]
  targetMonth: string
  targetDateString: string
  handleState: (targetDateString: string) => void
  dayComponent?: object
  subSchedule: SubSchedule[]
  daySchedule: DaySchedule[]
  colorPastDates?: string
  colorActiveDate?: string
  isAscending: boolean;
}