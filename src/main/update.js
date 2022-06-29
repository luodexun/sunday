import { autoUpdater } from 'electron-updater'
import { ipcMain } from 'electron'
import log from 'electron-log'
log.transports.console.level = false
log.transports.file.fileName = 'xiyou.log'
// 日志格式，默认：[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
// 日志大小，默认：1048576（1M），达到最大上限后，备份文件并重命名为：main.old.log，有且仅有一个备份文件
log.transports.file.maxSize = 1048576
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
// 负责向渲染进程发送信息
function Message (mainWindow, type, data) {
  const senddata = {
    state: type,
    msg: data || ''
  }
  mainWindow.webContents.send('UpdateMsg', senddata)
}
// 更新应用的方法
export default (mainWindow) => {
  let index = 0
  // 在下载之前将autoUpdater的autoDownload属性设置成false，通过渲染进程触发主进程事件来实现这一设置(将自动更新设置成false)
  autoUpdater.autoDownload = false

  // 设置版本更新地址，即将打包后的latest.yml文件和exe文件同时放在
  // http://xxxx/test/version/对应的服务器目录下,该地址和package.json的publish中的url保持一致
  // https://sm2.35dinghuo.com/download/
  // autoUpdater.setFeedURL('https://sm2.35dinghuo.com/download/')
  // 当更新发生错误的时候触发。
  autoUpdater.on('error', (err) => {
    log.info('当更新发生错误的时候触发', err)
    if (err.message.includes('sha512 checksum mismatch')) {
      Message(mainWindow, -1, 'sha512校验失败')
    }
  })
  // 当开始检查更新的时候触发
  autoUpdater.on('checking-for-update', (event, arg) => {
    log.info('当开始检查更新的时候触发')
    Message(mainWindow, 0)
  })
  // 发现可更新数据时
  autoUpdater.on('update-available', (event, arg) => {
    log.info('发现可更新数据时')
    Message(mainWindow, 1)
  })
  // 没有可更新数据时
  autoUpdater.on('update-not-available', (event, arg) => {
    log.info('没有可更新数据时')
    Message(mainWindow, 2)
  })
  // 下载监听
  autoUpdater.on('download-progress', (progressObj) => {
    log.info('下载监听', progressObj)
    Message(mainWindow, 3, progressObj)
  })
  // 下载完成
  autoUpdater.on('update-downloaded', () => {
    log.info('下载完成')
    Message(mainWindow, 4)
  })
  // 执行更新检查
  ipcMain.on('check-update', () => {
    log.info('执行更新检查')
    autoUpdater.checkForUpdates().catch(err => {
      log.debug('网络连接问题', err)
      if (index < 3) {
        index++
        log.debug(`尝试第${index}次重连`)
        Message(mainWindow, 5)
      } else {
        log.error('连接失败请检查网络环境')
      }
    })
  })
  // 退出并安装
  ipcMain.on('confirm-update', () => {
    log.info('退出并安装')
    autoUpdater.quitAndInstall()
  })

  // 手动下载更新文件
  ipcMain.on('confirm-downloadUpdate', () => {
    log.info('手动下载更新文件')
    autoUpdater.downloadUpdate()
  })
}
