import React, { PropTypes, Component } from 'react'
import { Tabs, Select,  Checkbox, Tooltip,Popover } from 'antd'
import { connect } from 'dva'

import styles from '../index.less'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { classnames } from '../../../utils'
import Slider from 'react-slick'




const severityToColor = {
    '-1': '#3978bb', // 无故障
    '0': '#a5f664', // 正常
    '1': '#fadc23', // 提醒
    '2': '#ff9524', // 警告
    '3': "#eb5a30" // 紧急
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
    componentDidMount(){
      
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
          tags,
          resInfo,
          isShowFouth,
          tagsLevel,
          alertList,
          tasgFitler,
          detailClick,
          incidentGroup,
          resList
      } = this.props

      const content = alertList.length > 0 ?
      alertList.map((item, index) => {
        return (
            <div key={index}>
                <a  data-id={item.id} onClick={(e) => {detailClick(e)}}><span className="visualAlert" style={{background: severityToColor[item['severity']]}}></span>{item.name}</a>
            </div>
        )
      }) :
      (<div>暂无数据</div>)
  
      let isShowImg = false //是否显示图片
      const groupListComponent =  groupList.length > 0 && groupList.map((item, index) => {
          
            const tagsList = item.values.map( (childItem, childIndex) => {
                return (
                        <div className={styles.tagsGroup} key={childIndex} data-gr2Val={item.tagValue} data-gr3Val={childItem.value}  onClick={(e)=>{showResList(e)}}>
                            
                                <div className={styles.tagsRingTwo} style={{background: severityToColor[childItem['severity']]}}></div>
                                {childItem['severity'] > 0 && <div className={styles.tagsRingOne} style={{background: severityToColor[childItem['severity']]}}></div>}
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
                    <li key={childIndex} data-id={childItem.resId}  onClick={(e)=>{showAlertList(e)}}>
                        <Popover   content={content} trigger="click">
                            <div className={styles.tagsRingTwo} style={{background: severityToColor[childItem['severity']]}}></div>
                            {childItem['severity'] > 0 && <div className={styles.tagsRingOne} style={{background: severityToColor[childItem['severity']]}}></div>}
                            <div className={styles.tagsName}>{childItem.resName}</div>
                        </Popover>
                    </li>
                )
            })
          return (
               <li key={index} className={styles.visualAlertGroupLi}>
                    <div className={styles.alertGroupName}><span>{item.tagValue}</span></div>
                    <ul  className={styles.alertList}>
                        {resList}
                    </ul>
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
                {!isShowFouth && <Checkbox className={styles.showGroup} onChange={showIncidentGroup} checked={incidentGroup} >只显示有故障的分组</Checkbox>}
                分组：<Select disabled = {isShowFouth ? true : false } defaultValue={tags[0]} onChange={gr2Change} className={styles.visualGroup}  >
                        {tagsComponent}
                    </Select>
                    <span className={styles.levelArrow} >></span>
                    <Select disabled = {isShowFouth ? true : false } defaultValue={tags[1]} onChange={gr3Change} className={styles.visualGroup}  >
                        {tagsComponent}
                    </Select>
                    {
                     isShowFouth &&    
                        <div className={styles.visualFilter}>
                            >
                            <div className={styles.tagsFilter} onClick={redirectTagsList}>
                                <p>{tasgFitler}</p>
                                <i className={tagsFilter}></i>
                            </div>
                            <Select defaultValue={tags[0]} onChange={gr4Change} className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }
                    
                </div>
                {!isShowFouth ? 
                (groupList.length > 0 ? 
                <ul className={styles.visualList}>
                    {groupListComponent}
                </ul> 
                : <div className={styles.visualNoData}>暂无数据，请重新选择条件</div>
                )
                
                :
                <div className={styles.visualAlert}>
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
                    <ul className={styles.visualAlertGroup}>
                        {resComponent}
                    </ul>
                </div>
                }
            </div>
      )
    }
}
export default VisualAnalyze
     