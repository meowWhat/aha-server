import * as mqtt from 'mqtt'
import { configHelper } from 'src/helper/configHelper'

class MqttDriver {
  public clinet: mqtt.MqttClient
  connect() {
    const config = configHelper.readConfig(configHelper.MqttConfigPath)
    const url = config.url
    delete config.url

    this.clinet = mqtt.connect(url, config)

    this.clinet.on('connect', () => {
      console.log('成功连接至 mq 服务器...'.green)
      this.clinet.subscribe('test', () => {
        this.clinet.on('message', (topic, message) => {
          console.log(topic, message.toString())
        })
      })
    })

    this.clinet.on('error', (error) => {
      console.log('mq 服务器连接失败...'.red)
      console.log(error)
    })
  }
}

const mq = new MqttDriver()

export { mq }

// A => B 