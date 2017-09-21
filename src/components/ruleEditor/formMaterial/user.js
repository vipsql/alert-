import React from 'react';
import { Form, Select, Tooltip, message } from 'antd';
import {
  getUsers
} from '../../../services/app.js'
import { getUUID } from '../../../utils/index'
import limitField from './limitField.js'
import _ from 'lodash'
import styles from '../customField.less'

const FormItem = Form.Item;
const Option = Select.Option;

class CTMUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userList: [] // 列表
    }
    this.userSearch = this.userSearch.bind(this)
  }


  userSearch(value = '') {
    getUsers({
      realName: value
    }).then((data) => {
      if (data.result) {
        this.setState({
          userList: data.data || []
        })
      } else {
        message.error(data.message, 3)
      }
    })
  }

  componentDidMount() {
    this.userSearch()
  }

  changeUsers(value) {
      const select = _.cloneDeep(this.props.prop.initialValue);
      const users = this.state.userList;
      let empty = [];
      let arr = [].concat(select);
      if (arr.length > value.length) {
        // 删除的情况
        arr.forEach((item) => {
          for (let i = value.length; i >= 0; i -= 1) {
              if (value[i] && value[i]['key'] === item.userId ) {
                  empty.push({
                      userId: item.userId,
                      realName: item.realName,
                      mobile: item.mobile,
                      email: item.email
                  });
              }
          }
        });
      } else {
        // 新增的情况
        empty = [].concat(arr)
        users.forEach((item) => {
          if (value[value.length - 1] && value[value.length - 1]['key'] === item.userId ) {
              empty.push({
                  userId: item.userId,
                  realName: item.realName,
                  mobile: item.mobile,
                  email: item.email
              });
          }
        })
      }
      this.props.changeUsers(empty)
  }

  render() {
    const { item, getFieldDecorator, prop, formItemLayout, disabled } = this.props;
    let initialValue = prop.initialValue.map(item => ({key: item.userId, label: item.realName}))
    return (
      <div className={styles.wrapper}>
        <FormItem {...formItemLayout}>
          {
            getFieldDecorator(`${limitField.PREFIX_USERTYPE}${item.code}`, _.merge(
              {
                ...prop,
                initialValue
              }
            ))(
              <Select
                  style={{ width: 250 }}
                  disabled={disabled}
                  mode="multiple"
                  labelInValue
                  filterOption={false}
                  placeholder={ window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj'] }
                  onChange={this.changeUsers.bind(this)}
                  getPopupContainer={() => {
                    return document.getElementById('content') || document.body
                  }}
                  onSearch={
                    _.debounce( (value) => {
                      this.userSearch(value)
                    }, 500)
                  }
              >
                  {
                      this.state.userList.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                  }
              </Select>
            )
          }
        </FormItem>
      </div>

    )
  }
}



export default class Wrapper extends React.Component {

  constructor(props) {
    super(props)
    this.changeUsers = this.changeUsers.bind(this)
    this.state = {
      select: []
    }
  }

  changeUsers(empty) {
    this.setState({
      select: empty
    })
  }

  render() {
    let init = this.props.prop && this.props.prop.initialValue ? this.props.prop.initialValue : []
    if (this.state.select.length) {
      init = _.cloneDeep(this.state.select)
    }
    let props = {
      ...this.props,
      prop: {
        ...this.props.prop,
        initialValue: init
      },
      changeUsers: this.changeUsers
    }
    return (
      <CTMUser {...props}/>
    )
  }
}

// export default React.createClass({
//   mixins: [StateMixin.connect(UserStore)],

//   getInitialState() {
//     return {
//       user:[],
//     };
//   },

//   handleChange(inputValue, option) {
//     option = option.props.children.props.children.props.children.props.children;
//     if (option.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
//       return true
//     }
//   },

//   handle(i,e) {
//     e.preventDefault();
//     UserAction.getUserById(i).then((data)=>{
//       this.setState({
//         user:data
//       });
//     })
//   },

//   render() {
//     const { item, getFieldProps, prop, formItemLayout, disabled } = this.props;
//     const {userList} = this.state;
//     const userInf = this.state.user;
//     const {userName,userEmail,mobile} = userInf;

//     let init = prop
//                 ? prop.initialValue && prop.initialValue.length
//                   ? prop
//                   : item.currUser
//                     ? {initialValue: [`${USER_INFO.userId}`]}
//                     : null
//                 : item.currUser
//                   ? {initialValue: [`${USER_INFO.userId}`]}
//                   : null

//     //initialValue有可能会出现    [""]   这样的脏数据， 当出现时就为null
//     init && init.initialValue && !_.isEmpty(init.initialValue) && _.forEach(init.initialValue , item => {
//       if (item.length === 0) {
//         init = null;
//         return false
//       }
//     })

//     const GetFieldProps = getFieldProps(item.code, _.merge(
//       {
//         rules: [
//           {
//             required: item.isRequired === 1 ? true : false,
//             message:$.translate("ticket","create","select") + item.name
//           }
//         ],
//         onChange: ()=>{}//不要删除onChange，单选和下拉多选会偶发出现onChange报错
//       },
//       init
//     ))

//     // ！userList 用户列表，当用户过多是会出现问题，徐进行判断，只能放在外层
//     return (
//       userList && !_.isEmpty(userList) ?
//         <FormItem {...formItemLayout} label={ item.name }>
//           <Select
//             multiple
//             showSearch
//             disabled={ disabled }
//             optionFilterProp="children"
//             notFoundContent={$.translate("SLA" , "not_find")}
//             getPopupContainer={() => document.getElementById('ticketForm')}
//             filterOption = {this.handleChange}
//             {...GetFieldProps}
//           >
//             {

//               _.map(userList, (user) => {
//                 return (
//                   <Option key={user.userId} value={`${user.userId}` ? `${user.userId}` : ''}>
//                     <div
//                       onMouseOver={this.handle.bind(this,user.userId)}
//                     >
//                       <Tooltip title={
//                         <div key={"" + user.userId}>
//                           <span>{userName}</span>
//                           {mobile ? <span style={{marginRight:'20px'}}>{mobile}</span> : ''}
//                           <span>{userEmail}</span>
//                         </div>
//                       }>
//                         <span>{user.userName}</span>
//                       </Tooltip>
//                      </div>
//                   </Option>
//                 )
//               })
//           }
//           </Select>
//         </FormItem>
//       : null
//     )
//   }
// })
