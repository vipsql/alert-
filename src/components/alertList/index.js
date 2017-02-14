import React, { PropTypes } from 'react'
import ListTable from './listTable'
import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import { connect } from 'dva'

function alertLsit({
  loading,
  dataSource,
  pagination,
  onPageChange
}){

  return (
    <div>
      <AlertTagsFilter />
      <AlertBar/>
      <ListTable isGroup={true} />
    </div>
  )
}

alertLsit.propTypes = {
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.any,
  pagination: PropTypes.any
}

export default connect((state) => {
  return {
    alertTagsSet: state.alertTagsSet,
    alertList: state.alertList
  }
})(alertLsit)
