import React, { Component, PropTypes } from 'react'
import { Popover, Input } from 'antd'
import { classnames, formatDate } from '../../../utils'
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import TimeSlider from './timeSlider'
import styles from './index.less'

class DatePeriodPicker extends Component {
  constructor(props) {
    super(props);
    const { placeholdMessage } = this.props;
    this.state = { dayTimeString: '', placeholdMessage, timeStart: { hours: 0, mins: 0 }, timeEnd: { hours: 0, mins: 0 } };
  }
  componentWillReceiveProps(newProps) {
    if (!newProps.value && newProps.value != this.props.value) {
      this.setState({ dayTimeString: '', timeStart: { hours: 0, mins: 0 }, timeEnd: { hours: 0, mins: 0 } })
    }
  }
  onChangeDate(newDate) {
    const [startDate, endDate] = newDate;
    const { timeStart, timeEnd } = this.state;

    if (startDate && endDate) {
      const startHours = timeStart.hours < 10 ? '0' + timeStart.hours : timeStart.hours;
      const startMins = timeStart.hours < 10 ? '0' + timeStart.mins : timeStart.mins;
      const endHours = timeEnd.hours < 10 ? '0' + timeEnd.hours : timeEnd.hours;
      const endMins = timeEnd.hours < 10 ? '0' + timeEnd.mins : timeEnd.mins;
      this.setState({ startDate, endDate, dayTimeString: startDate.format("YYYY-MM-DD") + " " + startHours + ":" + startMins + '~' + endDate.format("YYYY-MM-DD") + " " + endHours + ":" + endMins })

      const { onChange } = this.props;
      const newStartDate = startDate.hours(startHours).minutes(startMins).seconds(0);
      const newEndDate = endDate.hours(endHours).minutes(endMins).seconds(0);
      onChange([newStartDate.toDate().getTime(), newEndDate.toDate().getTime()]);
    }
  }
  onChangeTime([timeStart, timeEnd]) {
    const { startDate, endDate } = this.state;
    this.setState({ timeStart, timeEnd })
    if (startDate && endDate) {
      const startHours = timeStart.hours < 10 ? '0' + timeStart.hours : timeStart.hours;
      const startMins = timeStart.mins < 10 ? '0' + timeStart.mins : timeStart.mins;
      const endHours = timeEnd.hours < 10 ? '0' + timeEnd.hours : timeEnd.hours;
      const endMins = timeEnd.mins < 10 ? '0' + timeEnd.mins : timeEnd.mins;
      this.setState({ startDate, endDate, dayTimeString: startDate.format("YYYY-MM-DD") + " " + startHours + ":" + startMins + '~' + endDate.format("YYYY-MM-DD") + " " + endHours + ":" + endMins })

      const { onChange } = this.props;
      const newStartDate = startDate.hours(startHours).minutes(startMins).seconds(0);
      const newEndDate = endDate.hours(endHours).minutes(endMins).seconds(0);
      onChange([newStartDate.toDate().getTime(), newEndDate.toDate().getTime()]);
    }
  }
  clear() {
    const { onChange } = this.props;
    this.setState({ timeStart: { hours: 0, mins: 0 }, timeEnd: { hours: 0, mins: 0 }, dayTimeString: '' })
    onChange([undefined, undefined]);
  }
  render() {
    const { dayTimeString, timeStart, timeEnd } = this.state;
    const { placeholder, value } = this.props;
    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux',
      styles.shanchux
    )

    return (
      <div className={ styles.timeCycle }>
      <Popover
        placement="bottomLeft"
        overlayClassName="pickTime"
        content={(
          <div className={styles.timeCycle}>
            <RangeCalendar
              showToday={false}
              // defaultSelectedValue={[moment(time.dayStart), moment(time.dayEnd)]}
              onChange={this.onChangeDate.bind(this)} renderFooter={() => {
                return (
                  <div className={styles.timeCycleBd}>
                    <TimeSlider target={0} timeStart={timeStart} timeEnd={timeEnd} changeTime={([timeStart, timeEnd]) => this.onChangeTime([timeStart, timeEnd])} />
                  </div>
                );
              }} />
          </div>
        )}
      >
        <Input placeholder={placeholder} readOnly value={dayTimeString} style={{ width: '100%' }} className={styles.selectTime} addonAfter={<i onClick={() => this.clear()} className={ shanchuClass }/>} />
      </Popover>
      </div>
    )
  }
}

export default DatePeriodPicker