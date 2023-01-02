import {
  Client,
  ApiResponse,
} from '@elastic/elasticsearch'
import 'dotenv/config'

const client: Client = new Client({
  cloud: { id: process.env.ES_CLOUD_NODE || '' },
  auth: { 
    username: process.env.ES_CLOUD_USERNAME || '',
    password: process.env.ES_CLOUD_PASSWORD || ''
  }
})

const runQuery = async (index: string) => {
  try {
    // new definitions
    const response: ApiResponse = await client.search({
      index: 'test',
      body: {
      query: {
          match: { foo: '123' }
        }
      }
    })

    console.log(response.body);
  } catch (error: unknown) {
    // (error as AxiosError).message
    console.log(error);
  }
}

runQuery(process.env.ES_INDEX_PATTERN || '').catch(console.log);