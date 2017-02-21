import React, { PropTypes, Component } from 'react'
import { Button } from 'antd';
import styles from '../index.less'

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 400,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
  width: 100,
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
  width: 200,
}, {
  title: 'Operations',
  dataIndex: 'operation',
  key: 'x',
  width: 150,
}];
const data = [{
  classify: 'a',
  children: [{
    id: 11,
    name: 'aa',
    age: 33,
    address: 'I am aa',
  }]
},{
  classify: 'b',
  children: [{
    id: 22,
    name: 'bb',
    age: 33,
    address: 'I am aa',
  },{  id: 33,
    name: 'cc',
    age: 33,
    address: 'I am aa',
  }]
}];
// const data= [{
//   id: 22,
//   name: 'bb',
//   age: 33,
//   address: 'I am aa',
// },{
//   id: 33,
//   name: 'aa',
//   age: 34,
//   address: 'I am bb',
// }]
class ListTable extends Component {
  constructor(){
    super()
  }
  render(){
    const {isGroup} = this.props
    const theads = columns.map( (item) => {
      return (
        <th key={item.key}>
          {item.title}
        </th>
      )
    } )
    theads.unshift(<th key="checkAll"><input type="checkbox" /></th>)
    let tbodyCon = [];
    if(isGroup){
      data.forEach( (item, index) => {
        const keys = Object.keys(item.children[0]);
        // 这里每次都会执行 其实需要提出去
        const tds = keys.map((key) => {
          return (
            <td key={key}>{item.children[index][key]}</td>
          )
        })
        const childtrs = item.children.map( (childItem,index) => {
          const trKey = 'td' + index
          const tdKey = 'td' + index
          return (
              <tr key={trKey}>
                <td key={tdKey}><input type="checkbox" /></td>
                {tds}
              </tr>
          )
        } )
        childtrs.unshift(<tr className={styles.trGroup} key={index}><td colSpan={keys.length + 1}><span className={styles.expandIcon}>+</span>{item.classify}</td></tr>)
        tbodyCon.push(childtrs)

      } )

    }else{

      tbodyCon = data.map( (item, index) => {
        const keys = Object.keys(item);

        // 列是不固定的 需要抽取出来
        const tds = keys.map((key) => {

          return (
            <td key={key}>{item[key]}</td>
          )
        })
        return (
          <tr key={item.id}>
            <td key={index}><input type="checkbox" /></td>
            {tds}
          </tr>
        )
      })

    }


    return(
      <div>
        <table className={styles.listTable}>
          <thead>
            <tr>
              {theads}
            </tr>
          </thead>
          <tbody>
            {tbodyCon}
          </tbody>
        </table>
        <Button className={styles.loadMore}>显示更多</Button>
      </div>
    )
  }
}

export default ListTable
