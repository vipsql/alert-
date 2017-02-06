import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'

function alertQuery(dispatch){
  return (
    <div></div>
  )
}
alertQuery.propTypes = {
  dispatch: PropTypes.func
}
export default connect()(alertQuery)
