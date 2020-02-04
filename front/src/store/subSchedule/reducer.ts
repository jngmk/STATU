import { SubSchedulesState, SubScheduleActions } from './types'
import { createReducer } from 'typesafe-actions'
import { GET_SUBSCHEDULE, POST_SUBSCHEDULE, PUT_SUBSCHEDULE, DELETE_SUBSCHEDULE } from './actions'
import { subScheduleData } from '../../components/Calendar/dataSet/dataSet'

// const testData = subScheduleData
const initialData = [
  {
    id: 0,
    calenderId: 0,
    subTitle: '',
    color: '',
    startDate: '',
    endDate: '',
  },
]

const initialDaySchedulesState: SubSchedulesState = initialData

const subSchedule = createReducer<SubSchedulesState, SubScheduleActions>(initialDaySchedulesState, {
  [GET_SUBSCHEDULE]: (state, { payload: subSchedules }) => subSchedules,
  [POST_SUBSCHEDULE]: (state, { payload: subSchedule }) => state.concat(subSchedule),
  [PUT_SUBSCHEDULE]: (state, { payload: subSchedule }) => state.map(schedule => schedule.id === subSchedule.id ? subSchedule : schedule),
  [DELETE_SUBSCHEDULE]: (state, { payload: id }) => state.filter(schedule => schedule.id !== id)
})

export default subSchedule