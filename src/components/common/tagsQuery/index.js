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
        const { form, tagsKeyList } = this.props;

        const removeClass = classnames(
            'icon',
            'iconfont',
            'icon-anonymous-iconfont'
        )

        const itemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
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
                                                                {child}
                                                                <i className={classnames(removeClass, styles.tags_remove)} data-id={JSON.stringify({field: tagGroup.key, name: child})} onClick={() => {}}></i>
                                                            </span>
                                                        </li>
                                                    )
                                                }) : []
                                            }
                                            <li>
                                                <div className={styles.tags_input}>
                                                    <input placeholder={`请选择${tagGroup.keyName}`}/>
                                                </div>
                                            </li>
                                        </ul>
                                        {
                                            tagGroup.tagSpread ?
                                            <ul className={styles.tags_query_content}>
                                                <li className={styles.tags_query_item}>
                                                    站点1
                                                </li>
                                                <li className={styles.tags_query_item}>
                                                    站点2
                                                </li>
                                                <li className={styles.tags_query_item}>
                                                    站点3
                                                </li>
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