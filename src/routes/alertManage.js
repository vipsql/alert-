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
  } = alertManage

  const alertSetProps = {
    hideAlertSetTip,

    onOk(){
      dispatch({
        type: 'app/focusSet'
      })
      dispatch({
        type: 'alertManage/hideAlertSetTip'
      })
    }
  }

  const alertManageHeadProps = {
    isSetAlert,
    levels,

    showTagsModal(){
      dispatch({
        type:'alertTagsSet/showTagsModal',
        modalVisible: true
      })

    }

  }
  const alertTagsSetProps = {
    modalVisible,
    tagsNum,
    tagsList,
    changSelectTag(){
      dispatch({
        type:'alertManage/changSelectTag',
      })

    },
    closeTagsModal(){
      dispatch({
        type:'alertManage/closeTagsModal',
        modalVisible: false
      })

    },
  }

  return (

    <div>
      <AlertTagsSet  />
      <AlertManageHead {...alertManageHeadProps} />
      {isSetAlert ?
        <Chart /> :
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
