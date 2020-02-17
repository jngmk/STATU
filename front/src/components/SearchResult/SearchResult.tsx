import React, { FunctionComponent, useMemo } from 'react'
import CalendarInfo from './CalendarInfo'
import useSchedule from '../../hooks/useSchedule'
import useUser from '../../hooks/useUser'
import useWindowSize from '../../hooks/useWindowSize'

interface Interface {
  query: string
}

const SearchResult: FunctionComponent<Interface> = (props: Interface) => {
  console.log('SearchResult')
  const { query } = props
  const { getMainSchedules } = useSchedule()
  const { onSetTargetUserInfo } = useUser()
  const { width } = useWindowSize()

  const SearchMainScheduleResults = useMemo(() => {
    console.log('filter', getMainSchedules)
    return getMainSchedules.filter(schedule => 
      schedule.pb && (schedule.title.includes(query) 
      || schedule.tags.map(tag => tag.includes(query)).includes(true)
      || schedule.category1?.map(category => category.includes(query)).includes(true)
      || schedule.category2?.map(category => category.includes(query)).includes(true)
    ))
  }, [getMainSchedules])
  
  return (
    <div className={`SearchResult`}>
    { SearchMainScheduleResults && SearchMainScheduleResults.map(schedule => {
      onSetTargetUserInfo(schedule.id)
      return (
        <div
          key={schedule.id}
          // widthSize: 'XL' >= 1200 > 'LG' >= 992 > 'MD' >= 768 > 'SM' >= 576 > 'XS'
          className={`SearchResult`}
          style={{width: `${width >= 992 ? 100/3 : (width >= 768 ? 100/2 : 100)}vw`}}
        >
           <CalendarInfo
            mainSchedule={schedule}
          />
        </div>
      )
    })}
    </div>
  )
}

export default SearchResult