import {
  Client,
  ApiResponse,
} from '@elastic/elasticsearch'
import 'dotenv/config'

export const client: Client = new Client({
  node: process.env.ES_CLOUD_NODE || '',
  auth: { 
    username: process.env.ES_CLOUD_USERNAME || '',
    password: process.env.ES_CLOUD_PASSWORD || ''
  }
})