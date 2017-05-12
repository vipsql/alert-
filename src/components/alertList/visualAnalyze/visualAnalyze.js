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
          }
      })

      const content = alertList.length > 0 ?
      alertList.map((item, index) => {
        return (
            <div key={index}>
                <a  data-id={item.id} onClick={(e) => {detailClick(e)}}><span className="visualAlert" style={{background: severityToColor[item['severity']]}}></span>{item.name}</a>
            </div>
        )
      }) :
      (<div><FormattedMessage {...formatMessages['noData']}/></div>)
  
      let isShowImg = false //是否显示图片
      const groupListComponent =  groupList.length > 0 && groupList.map((item, index) => {
          
            const tagsList = item.values.length > 0 && item.values.map( (childItem, childIndex) => {
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
                    <Popover key={childIndex}  content={content} >
                        <li key={childIndex} data-id={childItem.resId}  onClick={(e)=>{showAlertList(e)}}>
                            
                                <div className={styles.tagsRingTwo} style={{background: severityToColor[childItem['severity']]}}></div>
                                {childItem['severity'] > 0 && <div className={styles.tagsRingOne} style={{marginTop:'-20px', background: severityToColor[childItem['severity']]}}></div>}
                                <div className={styles.tagsName}>{childItem.resName}</div>
                            
                        </li>
                    </Popover>
                )
            })
          return (
               <li key={index} style={{marginLeft:'-50px'}}>
                     {/*这里用来显示元素*/}
                    <div className={styles.alertShowGroupName}>{item.tagValue}</div>
                    <div className={styles.visualAlertGroupLi}>
                        {/*这里用来撑开父元素*/}
                        <div className={styles.alertGroupName}>{item.tagValue}</div>
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
                {(!isShowFouth && tagsLevel > 3) && <Checkbox className={styles.showGroup} onChange={showIncidentGroup} checked={incidentGroup} ><FormattedMessage {...formatMessages['incidentGroup']} /></Checkbox>}
                    
                    {
                     tagsLevel > 1 &&    
                        <div style={{display: 'inline-block'}}>
                            <FormattedMessage {...formatMessages['groupBy']} />：<Select disabled = {isShowFouth ? true : false } defaultValue={tags[0]} onChange={gr2Change} className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }
                
                    
                    { 
                     tagsLevel > 2 &&    
                        <div style={{display: 'inline-block'}} id="visualGr2">
                            <span className={styles.levelArrow} >></span>
                            <Select disabled = {isShowFouth ? true : false } defaultValue={tags[1]} onChange={gr3Change} className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }
                    
                    <div className={styles.visualFilter}  style={{opacity: isShowFouth ? 1 : 0}}>
                        >
                        <div className={styles.tagsFilter} onClick={redirectTagsList}>
                            <p>{tasgFitler}</p>
                            <i className={tagsFilter}></i>
                        </div>
                        <Select defaultValue={tags[0]} onChange={gr4Change} className={styles.visualGroup}  >
                            {tagsComponent}
                        </Select>
                    </div>
                    
                </div>
                
                {(tagsLevel < 4)  ?
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
                    <ul className={styles.visualAlertGroup} style={{marginRight: tagsLevel<4 ? '0' : '276px' }}>
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
     