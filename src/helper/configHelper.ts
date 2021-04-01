import * as path from 'path'
import * as fs from 'fs'

class ConfigHelper {
  public MqttConfigPath = './config/.mq_config'
  public MysqlConfigPath = './config/.db_config'

  readConfig(relativePath: string) {
    const config: { [key: string]: string } = {}

    fs.readFileSync(path.join(process.cwd(), relativePath))
      .toString()
      .split('\n')
      .forEach((item) => {
        const splits = item.split(':')
        const key = splits[0]
        const value = splits.slice(1, splits.length).join(':')
        config[key] = value
      })

    return config
  }
}

export const configHelper = new ConfigHelper()
