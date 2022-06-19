// eslint-disable-next-line standard/object-curly-even-spacing
import { ipcMain} from 'electron'
import Store from 'electron-store'
import mysql from 'mysql'
const store = new Store()
let pool
const start = () => {
  if (store.get('config')) {
    pool = mysql.createPool({
      connectionLimit: 10,
      multipleStatements: true,
      ...store.get('config')
    })
  }
  ipcMain.on('ping', (event, config) => {
    const connection = mysql.createConnection(config)
    connection.ping(function (err) {
      if (err) {
        event.returnValue = {code: 1, msg: err.sqlMessage}
      } else {
        event.returnValue = {code: 0, msg: '链接成功！'}
      }
    })
  })
  ipcMain.on('save', (event, config) => {
    if (JSON.stringify(config) === JSON.stringify(store.get('config'))) {
      event.returnValue = {code: 0, msg: '保存成功！'}
      return
    }
    store.delete('config')
    store.set('config', config)
    if (pool) {
      pool.end(function () {
        pool = mysql.createPool({
          connectionLimit: 10,
          multipleStatements: true,
          ...config
        })
      })
    } else {
      pool = mysql.createPool({
        connectionLimit: 10,
        multipleStatements: true,
        ...config
      })
    }
    event.returnValue = {code: 0, msg: '保存成功！'}
  })
  ipcMain.on('config', (event) => {
    event.returnValue = store.get('config')
  })
  ipcMain.on('select', (event, params) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        event.returnValue = {code: 1, msg: '数据库链接失败！'}
        return
      }
      let {condition, pagination: {currentPage, pageSize}, order} = params
      if (condition) {
        if (condition.isBlur) {
          condition = `WHERE ${condition.field} LIKE '%${condition.value}%'`
        } else {
          condition = `WHERE ${condition.field} = '${condition.value}'`
        }
      } else {
        condition = ''
      }
      const sql = `SELECT COUNT(id) as total FROM cs_goods ${condition}; SELECT * FROM cs_goods ${condition}  ORDER BY ${order.join(',')} LIMIT ${(currentPage - 1) * pageSize},${currentPage * pageSize};`
      connection.query(sql, function (error, results) {
        connection.release()
        if (error) {
          event.returnValue = {code: 1, msg: '查询失败！'}
          return
        }
        event.returnValue = {code: 0, msg: '查询成功', data: results[1], total: results[0][0].total}
      })
    })
  })
}

export default start
