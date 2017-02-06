import React, { PropTypes } from 'react'
import ListTable from './listTable'

function alertLsit({
  loading,
  dataSource,
  pagination,
  onPageChange
}){

  return (
    <ListTable isGroup={true} />
  )
}

alertLsit.propTypes = {
  onPageChange: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.any,
  pagination: PropTypes.any
}
export default alertLsit
