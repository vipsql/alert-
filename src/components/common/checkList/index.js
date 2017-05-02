import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';


class checkList extends Component {

    constructor(props) {
      super(props);
      this.state = {
        tagGroupState: props.itemList !== undefined && props.itemList.length > 0 ? props.itemList.map( (item) => { return {height: '35px', isSpresd: false} }) : []
      }

      this.spreadTagsGroup = this.spreadTagsGroup.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState)  {
      if (nextProps.itemList.length > 0 && nextProps.itemList.length !== this.props.itemList.length) {
        this.setState({
          tagGroupState: nextProps.itemList.map( (item) => { return {height: '35px', isSpresd: false} })
        })
      }
    }

    spreadTagsGroup(targetHeight, targetIndex) {
      let newArr = this.state.tagGroupState.map( (item, itemIndex) => {
        if (itemIndex === targetIndex) {
          item['height'] = targetHeight;
          item['isSpresd'] = !item['isSpresd']
        }
        return item;
      })
      this.setState({
        tagGroupState: newArr
      })
    }

    render() {

      const {itemList, checkedNum, isSpreadTags, checkHandler, origin} = this.props;
      const formatMessages = defineMessages({
          text:{
            id: 'alertManage.dashbord.selectedText',
            defaultMessage: '已选择 {num} 个关注',
            values: {
              num: <span className={styles.textNum} >{checkedNum}</span>
            }
          }
      })

      const setClass = classnames(
        'iconfont',
        'icon-wancheng'
      )

      const tags = itemList.length > 0 ? itemList.map((item, index) => {
        const muenClass = this.state.tagGroupState[index]['isSpresd'] ? 'icon-xialasanjiao-copy' : 'icon-xialasanjiao';
        const arrClass = classnames(
          'switchMenu',
          'iconfont',
          muenClass
        )
        const tagsDetail = item.values.map((tag, itemIndex) => {
          let data_id = origin === 'main' ? tag.id : JSON.stringify({field: item.name, name: tag.name});
          return (
            <span className={tag.selected ? classnames(styles.wapper, styles.tagsSelected) : styles.wapper} key={ itemIndex } data-id={data_id} onClick={ (e) => {checkHandler(e)} }>
              <span title={tag.name} className={styles.content} data-id={data_id}>{tag.name}</span>
              {
                tag.selected ? <i className={setClass} data-id={data_id}></i> : undefined
              }
            </span>
          )
        })
        return (
          <li key={index}>
            <div className={styles.tagsName}>{item.name}:</div>
            <div ref={`wapper_${index}`} className={styles.wapper} style={{ height: this.state.tagGroupState[index]['height'] }}>
              <div ref={`inner_${index}`} className={styles.inner}>
                {tagsDetail}
                {
                  item.values.length > 4 ?
                  <i className={classnames(arrClass, styles.arrow)} onClick={ (e) => {
                    e.stopPropagation();
                    let targetHeight = this.refs[`inner_${index}`].offsetHeight;
                    if (!this.state.tagGroupState[index]['isSpresd']) {
                      this.spreadTagsGroup(targetHeight, index)
                    } else {
                      this.spreadTagsGroup('35px', index)
                    }
                  }}></i>
                  :
                  undefined
                }
              </div>
            </div>
          </li>
        )
      }) : []

      return (
          <div className={styles.ckeckModalMain}>
              { typeof checkedNum !== 'undefined'
                  ? <p className={styles.checkedText}><FormattedMessage {...formatMessages['text']} /></p>
                  : undefined }
              <ul>
                  {tags}
              </ul>
          </div>
      )
    }
}

checkList.defaultProps = {
    itemList: [],
    checkedNum: undefined,
    isSpreadTags: true,
    checkHandler: () => {}
}

checkList.propTypes = {
    itemList: React.PropTypes.array.isRequired,
    checkedNum: React.PropTypes.number,
    isSpreadTags: React.PropTypes.bool.isRequired,
    checkHandler: React.PropTypes.func.isRequired,
    origin: React.PropTypes.string
}

export default checkList;
