import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { Modal, Button, Form, Select, Row, Col, Input, Table, Popover, Radio} from 'antd';
import { classnames } from '../../../utils'

const Item = Form.Item;
class TagsQuery extends Component{

    constructor(props) {
        super(props)
    }

    render() {

        const { 
            form, 
            origin, 
            tagsKeyList, 
            selectList, 
            closeOneItem, 
            closeAllItem, 
            mouseLeave, 
            deleteItemByKeyboard, 
            queryTagValues, 
            addItem
        } = this.props;

        let timer = null;
        const removeClass = classnames(
            'icon',
            'iconfont',
            'icon-anonymous-iconfont'
        )

        const itemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        }

        const renderName = (key, name) => {
            if (key == 'severity' || key == 'status') {
                return window[`_${key}`][name]
            } else {
                return name
            }
        }
        
        return (
            <div className={styles.tags_container}>
                <Form>
                    {
                        tagsKeyList.length > 0 ? tagsKeyList.map( (tagGroup, index) => {
                            return (
                                <Item 
                                    {...itemLayout}
                                    key={index}
                                    label={tagGroup.keyName}
                                >
                                    <div className={styles.tags_query_container}>
                                        <ul className={styles.tags_data_content}>
                                            {
                                                tagGroup.selectedChildren.length > 0 ? tagGroup.selectedChildren.map( (child, itemIndex) => {
                                                    return (
                                                        <li key={itemIndex}>
                                                            <span className={styles.tags_tag}>
                                                                {renderName(tagGroup.key, child.name)}
                                                                <i 
                                                                    className={classnames(removeClass, styles.tags_remove)} 
                                                                    data-id={origin === 'set' ? JSON.stringify({field: tagGroup.key, id: child.id}) : JSON.stringify({field: tagGroup.key, name: child.name})} 
                                                                    onClick={(e) => { closeOneItem(e) }}>
                                                                </i>
                                                            </span>
                                                        </li>
                                                    )
                                                }) : []
                                            }
                                            <li>
                                                <div className={styles.tags_input}>
                                                    <input type={'text'} placeholder={`请选择${tagGroup.keyName}`} onChange={ (e) => {
                                                        e.persist();
                                                        clearTimeout(timer)
                                                        
                                                        timer = setTimeout( () => {
                                                            queryTagValues(tagGroup.key, e.target.value)
                                                        }, 500)
                                                    }} onKeyDown={ (e) => {
                                                        if (e.keyCode === 8 && e.target.value == '') {
                                                            deleteItemByKeyboard(JSON.stringify({field: tagGroup.key}))
                                                        }
                                                    }} onFocus={ () => { queryTagValues(tagGroup.key, '') }}/>
                                                    
                                                </div>
                                            </li>
                                            {
                                                tagGroup.selectedChildren.length > 0 ?
                                                <i 
                                                    className={classnames(removeClass, styles.tags_removeAll)} 
                                                    data-id={JSON.stringify({field: tagGroup.key})} 
                                                    onClick={(e) => { closeAllItem(e) }}></i>
                                                :
                                                undefined
                                            }
                                        </ul>
                                        {
                                            tagGroup.tagSpread ?
                                            <ul className={styles.tags_query_content} onMouseLeave={ () => {mouseLeave(JSON.stringify({field: tagGroup.key}))}}>
                                                {
                                                    selectList.length > 0 ? selectList.map( (item, itemIndex) => {
                                                        return (
                                                            <li key={itemIndex} className={styles.tags_query_item} data-id={JSON.stringify({field: tagGroup.key, item: item})} onClick={ (e) => {
                                                                addItem(e)
                                                            }}>
                                                                {renderName(item.key, item.value)}
                                                            </li>
                                                        )
                                                    }): <li className={styles.tags_query_item}>Not Found</li>
                                                }
                                            </ul>
                                            :
                                            undefined
                                        }    
                                    </div>
                                </Item>
                            )
                        }) : []
                    }
                </Form>
            </div>
        )

    }
}

TagsQuery.defaultProps = {
    
}

TagsQuery.propTypes = {

}

export default Form.create()(TagsQuery);