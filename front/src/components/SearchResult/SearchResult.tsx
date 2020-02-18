import React, { FunctionComponent, useMemo } from 'react'
import CalendarInfo from './CalendarInfo'
import useSchedule from '../../hooks/useSchedule'
import useUser from '../../hooks/useUser'
import useWindowSize from '../../hooks/useWindowSize'
import NoResultForm from '../Error/NoResultForm'

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
    { SearchMainScheduleResults.length !== 0 ? SearchMainScheduleResults.map((schedule, index) => {
      // onSetTargetUserInfo(schedule.id)
      return (
        <div
              key={schedule.id}
              // widthSize: 'XL' >= 1200 > 'LG' >= 992 > 'MD' >= 768 > 'SM' >= 576 > 'XS'
              className="card-single"
              style={{ width: `${width >= 800 ? 100 / 4 : (width >= 400 ? 100 / 2.2 : 100)}vw`,
              border :`${index == 0 ? 'ridge #FFD700 10px' : (index == 1 ? 'ridge #A6A6A6 7px' : (index == 2 ? 'ridge #DA8A67 5px' : 'black'))}` }}
            >
              <CalendarInfo
                mainSchedule={schedule}
              />
            </div>
      )
      })
      :
      <NoResultForm />
    }
    </div>
  )
}

export default SearchResult