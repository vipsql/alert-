import React, { PropTypes, Component } from 'react'
import { Tabs, Select,  Checkbox, Tooltip,Popover } from 'antd'
import { connect } from 'dva'

import styles from '../index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../../utils'
import Slider from 'react-slick'




const severityToColor = {
    '-1': '#6dcd7c', // 无故障
    '0': '#4fdfbf', // 正常
    '1': '#f6cb03', // 提醒
    '2': '#fa8c16', // 警告
    '3': "#ec5437" // 紧急
}
const tagsFilter = classnames(
    'iconfont',
    'icon-anonymous-iconfont'
)
const rightArr = classnames(
    'iconfont',
    'icon-cebianlanzhankai',
    styles['next']
)
const leftArr = classnames(
    'iconfont',
    'icon-cebianlanshouqi',
    styles['prev']
)
const slideSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6
}
const slideSettings2 = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
}

class VisualAnalyze extends Component {
    constructor(props){
        super(props)
        const gr1key = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")).map(item => {
            return item.key
        })
        let gr2State, gr3State, gr4State
        if(localStorage.getItem(gr1key.join())){
            const userStore = JSON.parse(localStorage.getItem(gr1key))
            gr2State = userStore.gr2key
            gr3State = userStore.gr3key
            gr4State = userStore.gr4key
        }
        //gr4State =  localStorage.getItem('__alert_visualAnalyze_gr4')     
        this.state = {
            gr2State: gr2State ? gr2State : '',
            gr3State: gr3State ? gr3State : '',
            gr4State: gr4State ? gr4State : ''
        }
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps){

        if(nextProps !== this.props){
            return true
        }
    }

    render(){
      const {
          handleExpand,
          gr2Change,
          gr3Change,
          gr4Change,
          showResList,
          groupList,
          showIncidentGroup,
          showAlertList,
          redirectTagsList,
          cancelShowAlertList,
          tags,
          resInfo,
          isShowFouth,
          tagsLevel,
          lessLevel,
          alertList,
          tasgFitler,
          detailClick,
          incidentGroup,
          resList
      } = this.props
      const { gr2State, gr3State, gr4State } = this.state

        //重载方法（主要是select change）

      const gr2ChangeOverride = (val) =>{
          this.setState({
              gr2State: val
          })
          gr2Change(val)
      }

      const gr3ChangeOverride = (val) =>{
          this.setState({
              gr3State: val
          })
          gr3Change(val)
      }

      const gr4ChangeOverride = (val) =>{
          this.setState({
              gr4State: val
          })
          gr4Change(val)
      }


      const formatMessages = defineMessages({
          groupBy:{
            id: 'visualAnalyze.groupBy',
            defaultMessage: '分组',
          },
          title: {
            id: 'visualAnalyze.title',
            defaultMessage: '可视化分析',
          },
          incidentGroup: {
            id: 'visualAnalyze.incidentGroup',
            defaultMessage: '只显示有故障的分组',
          },
          noData: {
            id: 'visualAnalyze.noData',
            defaultMessage: '暂无数据',
          },
          tip: {
            id: 'visualAnalyze.tip',
            defaultMessage: '小提示：<可视化分析>利用CMDB展现关联CI的告警状态 (以最高等级为准)，其中也包含历史发生的未关闭的告警，辅助运维人员通过CI相关性定位故障根源。'
          }
      })

      let AlertListContent = (
          <div>Loading...</div>
      )
      if(Array.isArray(alertList)){
        AlertListContent =  alertList.length > 0 ?
        alertList.map((item, index) => {
            return (
                <div key={index}>
                    <a  data-id={item.id} data-isLoaded={false} data-list={alertList}  onClick={(e) => {detailClick(e)}}><span className="visualAlert" style={{background: severityToColor[item['severity']]}}></span>{item.name}</a>
                </div>
            )
        }) :
        (<div><FormattedMessage {...formatMessages['noData']}/></div>)
      }

      let isShowImg = false //是否显示图片
      const groupListComponent =  groupList.length > 0 && groupList.map((item, index) => {

            const tagsList = item.values.length > 0 && item.values.map( (childItem, childIndex) => {
                return (
                        <div className={styles.tagsGroup} key={childIndex} data-gr2Val={item.tagValue} data-gr3Val={childItem.value}  onClick={(e)=>{showResList(e)}}>

                                <div className={childItem['severity'] > -1 ? styles.tagsRingTwo : styles.tagsRingTwo2} style={{background: severityToColor[childItem['severity']]}}></div>
                                {childItem['severity'] > -1 && <div className={styles.tagsRingOne} style={{background: severityToColor[childItem['severity']]}}></div>}
                                <div className={styles.tagsName}>{childItem.value}</div>

                        </div>

                )
            })
            return (
                 <li key={index}>
                    <div className={styles.listHead}>
                    {item.tagValue}
                    <span className={!item.isExpand ? styles.triangleDown : styles.triangleTop} data-index={index} data-expand={item.isExpand} onClick={(e) => {handleExpand(e)}}></span>
                    </div>
                    {item.isExpand &&
                        <div className={styles.listBody}>
                        <Slider {...slideSettings}>
                            {tagsList}
                        </Slider>
                        </div>
                    }
                </li>
            )
      })

      const resComponent = resList.length > 0 && resList.map( (item,index) => {
          const resList = item.resources.map( (childItem, childIndex) => {
                return (
                    <Popover key={childIndex}  content={AlertListContent} >
                        <li key={childIndex} data-id={childItem.resId} onMouseLeave={cancelShowAlertList}  onMouseEnter={(e)=>{showAlertList(e)}}>

                                <div className={childItem['severity'] > -1 ? styles.tagsRingTwo : styles.tagsRingTwo2} style={{background: severityToColor[childItem['severity']]}}></div>
                                {childItem['severity'] > -1 && <div className={styles.tagsRingOne} style={{marginTop:'-20px', background: severityToColor[childItem['severity']]}}></div>}
                                <div className={styles.tagsName}>{childItem.resName}</div>

                        </li>
                    </Popover>
                )
            })
          return (
               <li key={index}>
                     {/*这里用来显示元素*/}
                    <div className={styles.alertShowGroupName}>{item.tagValue}</div>
                    <div className={styles.visualAlertGroupLi}>
                        <ul  className={styles.alertList}>
                            {resList}
                        </ul>
                    </div>
               </li>

          )
      })

      const tagsComponent = tags.length > 0 && tags.map( (item,index) =>{
        return (
            <Select.Option key={index} value={item}>{item}</Select.Option>
        )
      })

      let ImgEle
      const resInfoListComponent = resInfo.length > 0 && resInfo.map( (item,index) =>{
        if(item.type != 'image') {
            return (
                <li key={index}>
                    <span>{item.name}</span><Tooltip title={item.values[0]}><span>{item.values[0]}</span></Tooltip>
                </li>
            )

        }else{
            isShowImg = true
            ImgEle = item
            return
        }


      })
      const resInfoImgComponent = ImgEle && ImgEle.values.length > 0 && ImgEle.values.map( (item,index) =>{
          return (
                <div className={styles.imgInfo} key={index}><img src={item} alt="" /></div>
            )
      })

      return(

        <div className={styles.visualBg}>
            <div className={styles.visualHead}>
                {(!isShowFouth && lessLevel > 2) && <Checkbox className={styles.showGroup} onChange={showIncidentGroup} checked={incidentGroup} ><FormattedMessage {...formatMessages['incidentGroup']} /></Checkbox>}

                    {
                     lessLevel > 0 &&
                        <div style={{display: 'inline-block'}}>
                            <FormattedMessage {...formatMessages['groupBy']} />：<Select getPopupContainer={() =>document.getElementById("content")}  disabled = {isShowFouth ? true : false } defaultValue={gr2State != '' ? gr2State : tags[0]} onChange={gr2ChangeOverride} className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }


                    {
                     lessLevel > 1 &&
                        <div style={{display: 'inline-block'}} id="visualGr2">
                            <span className={styles.levelArrow} >></span>
                            <Select getPopupContainer={() =>document.getElementById("content")} disabled = {isShowFouth ? true : false } defaultValue={gr3State != '' ? gr3State : tags[1]} onChange={gr3ChangeOverride} className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }

                    <div className={styles.visualFilter}   style={{opacity: isShowFouth ? 1 : 0 }}>
                        >
                        <div className={styles.tagsFilter} onClick={redirectTagsList}>
                            <p>{tasgFitler}</p>
                            <i className={tagsFilter}></i>
                        </div>
                        {tags.length > 0 && <Select getPopupContainer={() =>document.getElementById("content")}  disabled={!isShowFouth ? true : false}  defaultValue={gr4State != '' ? gr4State : tags[0]} onChange={gr4ChangeOverride} className={styles.visualGroup}  >
                            {tagsComponent}
                        </Select>}
                    </div>

                    <div className={styles.tip}><FormattedMessage {...formatMessages['tip']} /></div>
                </div>


                {(lessLevel < 3)  ?
                /* 表示层级小于4层时，直接请求设备故障列表*/
                <div className={styles.visualAlert} style={{opacity: !isShowFouth ? 1 : 0}}>
                    {resInfo.length > 0 &&
                        <div className={styles.visualInfo}>
                        { isShowImg &&
                            <div className={styles.visualImg}>
                                <Slider {...slideSettings2}>
                                {resInfoImgComponent}
                                </Slider>
                            </div>
                        }

                            <ul className={styles.visualMsg}>
                            {resInfoListComponent}
                            </ul>
                        </div>


                    }
                    { resList.length > 0 ?
                    <ul className={styles.visualAlertGroup} style={{marginRight: lessLevel < 3 ? '0' : '276px' }}>
                        {resComponent}
                    </ul>
                    : <div className={styles.visualNoData}><FormattedMessage {...formatMessages['noData']} /></div>
                    }
                </div>
                /* 表示层级大于或等于4层时，按照正常流程*/
                : (!isShowFouth ?

                (groupList.length > 0 ?
                <ul className={styles.visualList} style={{opacity: !isShowFouth ? 1 : 0}}>
                    {groupListComponent}
                </ul>
                : <div className={styles.visualNoData}><FormattedMessage {...formatMessages['noData']} /></div>
                )

                :

                <div className={styles.visualAlert}>
                     { resInfo.length > 0 &&
                        <div className={styles.visualInfo}>
                        { isShowImg &&
                            <div className={styles.visualImg}>
                                <Slider {...slideSettings2}>
                                {resInfoImgComponent}
                                </Slider>
                            </div>
                        }
                            <ul className={styles.visualMsg}>
                            {resInfoListComponent}
                            </ul>
                        </div>
                     }
                    <ul className={styles.visualAlertGroup} style={{marginRight: resInfo.length>0 ? '276px' : '0' }}>
                        {resComponent}
                    </ul>
                </div>


                )
            }

            </div>
      )
    }
}
export default VisualAnalyze
