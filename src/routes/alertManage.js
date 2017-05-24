import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
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
    isFullScreen,
    isFixed,
    currentDashbordData,
    selectedStatus,
    selectedTime
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
    isFixed,
    isFullScreen,
    showTagsModal(){
      dispatch({
        type: 'alertTagsSet/openSetModal',
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
    },
    setFullScreen(){
      dispatch({
        type: 'alertManage/setFullScreen',
        payload: !isFullScreen 
      })
    },
    setLayout(e){
      const target = e.target.tagName.toLocaleLowerCase() == 'i' ?  e.target.parentNode : e.target
      const  isFixed = target.getAttribute('data-isFixed')
      dispatch({
        type: 'alertManage/setLayout',
        payload: isFixed
      })
    }

  }

  const chartProps = {
    selectedStatus,
    selectedTime,
    isFold,
    currentDashbordData,
    isLoading,
    isFullScreen,
    setFullScreen(){
      dispatch({
        type: 'alertManage/setFullScreen'
      })
    },
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
