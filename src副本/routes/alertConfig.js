import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'

function alertConfig(dispatch){
  return (
    <div></div>
  )
}
alertConfig.propTypes = {
  dispatch: PropTypes.func
}
export default connect()(alertConfig)
