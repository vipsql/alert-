import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import AlertQueryManage from '../components/alertQuery'

function alertQuery(dispatch){
  return (
    <div>
      <AlertQueryManage />
    </div>
  )
}
alertQuery.propTypes = {
  dispatch: PropTypes.func
}
export default connect(({alertQuery}) => ({alertQuery}))(alertQuery)
