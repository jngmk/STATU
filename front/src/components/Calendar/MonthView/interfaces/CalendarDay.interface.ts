import DataObj from './DataObj.interface'

export default interface Component {
  date: string;
  targetMonth: string;
  targetDay: number;
  targetDateString: string;
  handleState: (targetDay: number, targetDateString: string) => void;
  dayComponent?: object;
  data: DataObj[]
  // for css 
  dayContainerClassName?: string;
  dayDataListClass?: string;
  dayDataListItemClass?: string;
  daysHeaderContainer?: string;
  colorPastDates?: string;
  colorActiveDate?: string;
  isAscending: boolean;
}
