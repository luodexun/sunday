// eslint-disable-next-line standard/object-curly-even-spacing
import { ipcMain} from 'electron'
import Store from 'electron-store'
import mysql from 'mysql'
import log from 'electron-log'
log.transports.console.level = false
log.transports.file.fileName = 'sunday.log'
// 日志格式，默认：[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
// 日志大小，默认：1048576（1M），达到最大上限后，备份文件并重命名为：main.old.log，有且仅有一个备份文件
log.transports.file.maxSize = 1048576
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

  ipcMain.on('getColumns', (event) => {
    event.returnValue = store.get('columns')
  })
  ipcMain.on('setColumns', (event, columns) => {
    store.set('columns', columns)
  })
  ipcMain.on('select', (event, params) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        event.returnValue = {code: 1, msg: '数据库链接失败！'}
        return
      }
      let {condition, pagination: {currentPage, pageSize}, order} = params
      if (condition) {
        if (/^(\d+)[~/-](\d+)$/.test(condition.value)) {
          condition = `WHERE ${condition.field} BETWEEN ${RegExp.$1} AND ${RegExp.$2}`
        } else {
          if (condition.isBlur) {
            condition = `WHERE ${condition.field} LIKE '%${condition.value}%'`
          } else {
            condition = `WHERE ${condition.field} = '${condition.value}'`
          }
        }
      } else {
        condition = ''
      }
      order = order.length !== 0 ? `ORDER BY ${order.join(',')}` : ''
      const sql = `SELECT COUNT(sellerRoleid) as total FROM cbg_role_info ${condition}; SELECT * FROM cbg_role_info ${condition} ${order} LIMIT ${(currentPage - 1) * pageSize},${pageSize};`
      log.info(sql)
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
