import React, { PropTypes, Component } from 'react'
import { Tabs, Select,  Checkbox } from 'antd'
import { connect } from 'dva'
import { Popover } from 'antd'
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
const slideSettings = {
    infinite: true,
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
          groupList,
          showIncidentGroup,
          tags,
          isShowFouth,
          tagsLevel,
          resList
      } = this.props
     
      const groupListComponent =  groupList.map((item, index) => {
            const tagsList = item.values.map( (childItem, childIndex) => {
                return (
                    <div className={styles.tagsGroup} key={childIndex} data-gr2Val={item.tagValue} data-gr3Val={childItem.tagValue}>
                        <div className={styles.tagsRingTwo} style={{background: severityToColor[childItem['severity']]}}></div>
                        <div className={styles.tagsRingOne} style={{background: severityToColor[childItem['severity']]}}></div>
                        <div className={styles.tagsName}>{childItem.value}</div>
                    </div>
                )
            })
            return (
                 <li key={index}>
                    <div className={styles.listHead}>
                    {item.tagValue}
                    <span className={!item.isExpand ? styles.triangleDown : styles.triangleTop} data-index={0} data-expand={0} onClick={(e) => {handleExpand(e)}}></span>
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

      const resComponent = resList.map( (item,index) => {
          const resList = item.resources.map( (childItem, childIndex) => {
                return (
                    <li>
                        <div className={styles.tagsRingTwo} style={{background: severityToColor[childItem['severity']]}}></div>
                        <div className={styles.tagsRingOne} style={{background: severityToColor[childItem['severity']]}}></div>
                        <div className={styles.tagsName}>{childItem.resName}</div>
                    </li>
                )
            })
          return (
               <li className={styles.visualAlertGroupLi}>
                    <div className={styles.alertGroupName}><span>{item.tagValue}</span></div>
                    <ul  className={styles.alertList}>
                        {resList}
                    </ul>
               </li>
                        
          )
      })

      const tagsComponent = tags.map( (item,index) =>{
        return (
            <Select.Option key={index} value={item}>{item}</Select.Option>
        )
      })
      return(
        <div className={styles.visualBg}>
            <div className={styles.visualHead}>
                <Checkbox className={styles.showGroup} onChange={showIncidentGroup}  defaultChecked>只显示有故障的分组</Checkbox>
                分组：<Select defaultValue="lucy" onChange={gr2Change} className={styles.visualGroup}  >
                        {tagsComponent}
                    </Select>
                    <span className={styles.levelArrow} onChange={gr3Change}>></span>
                    <Select defaultValue="lucy" className={styles.visualGroup}  >
                        {tagsComponent}
                    </Select>
                    {
                     isShowFouth &&    
                        <div className={styles.visualFilter}>
                            >
                            <div className={styles.tagsFilter}>
                            <p>文一路路口</p>
                            <i className={tagsFilter}></i>
                            </div>
                            <Select defaultValue="lucy" className={styles.visualGroup}  >
                                {tagsComponent}
                            </Select>
                        </div>
                    }
                    
                </div>
                {!isShowFouth ? 
                <ul className={styles.visualList}>
                    {groupListComponent}
                </ul>
                :
                <div className={styles.visualAlert}>
                    <div className={styles.visualInfo}>
                        <div className={styles.visualImg}></div>
                        <ul className={styles.visualMsg}>
                        <li>
                            <span>站点名称</span>site1
                        </li>
                        <li>
                            <span>站点名称</span>site1
                        </li>
                        <li>
                            <span>站点名称</span>site1
                        </li>
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
     