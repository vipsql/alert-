import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import Chart from '../components/alertManage/alertDashbord'
import AlertSet from '../components/alertManage/alertSet'
import AlertManageHead from '../components/alertManage/AlertManageHead'
import AlertTagsSet from '../components/alertManage/alertTagsSet'



function AlertManage({dispatch, alertManage}){

  const {
    isSetAlert,
    levels ,
    hideAlertSetTip,
    modalVisible,
    tagsNum,
    tagsList,
    currentDashbordData,
  } = alertManage

  const alertDashbord = {
    currentDashbordData
  }

  const alertSetProps = {
    hideAlertSetTip,

    onOk(){
      dispatch({
        type: 'app/showAlertManage',
        payload: false
      })
      dispatch({
        type: 'alertManage/toggleAlertSetTip',
        payload: true
      })
    }
  }

  const alertManageHeadProps = {
    isSetAlert,
    levels,

    showTagsModal(){
      dispatch({
        type: 'alertTagsSet/tagsContentView',
        payload: {}
      })

      dispatch({
        type: 'alertTagsSet/toggleTagsModal',
        payload: true
      })
    }

  }

  return (

    <div>
      <AlertTagsSet  />
      <AlertManageHead {...alertManageHeadProps} />
      {isSetAlert ?
        <Chart {...alertDashbord}/> :
        <AlertSet {...alertSetProps}/>
      }
    </div>
  )
}
AlertManage.propTypes = {
  dispatch: PropTypes.func
}
// function mapStateToProps ({ alertManage }) {
//   return { alertManage }
// }
export default connect(({alertManage}) => ({alertManage}))(AlertManage)
