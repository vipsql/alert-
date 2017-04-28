import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import Chart from '../components/alertManage/alertDashbord'
import AlertSet from '../components/alertManage/alertSet'
import AlertManageHead from '../components/alertManage/alertManageHead'
import AlertTagsSet from '../components/alertManage/alertTagsSet'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';


function AlertManage({dispatch, alertManage, isFold}){

  const {
    isSetAlert,
    levels ,
    hideAlertSetTip,
    modalVisible,
    tagsNum,
    tagsList,
    isLoading,
    currentDashbordData,
    selectedStatus
  } = alertManage

  const alertSetProps = {
    hideAlertSetTip,

    onOk(){
      dispatch({
        type: 'app/showMask',
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
        type: 'alertTagsSet/openFocusModal',
      })
    },

    queryByTime(time){
      dispatch({
        type: 'alertManage/queryAlertDashbord',
        payload: {
          selectedTime: time
        }
      })
    },
    queryByStatus(status){
      dispatch({
        type: 'alertManage/queryAlertDashbord',
        payload: {
          selectedStatus: status
        }
      })
    }

  }

  const chartProps = {
    selectedStatus,
    isFold,
    currentDashbordData,
    isLoading,
    requestFresh(){
      dispatch({
        type: 'alertManage/queryAlertDashbord'
      })
    }
  }

  return (

    <div>
      <AlertTagsSet  />
      <AlertManageHead {...alertManageHeadProps} />
      {isSetAlert ?
        <Chart {...chartProps} /> :
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
export default connect((state) => {
  return {
    alertManage: state.alertManage,
    isFold: state.app.isFold
  }
})(AlertManage)
