import {
  Client,
  ApiResponse,
} from '@elastic/elasticsearch'
import 'dotenv/config'

const INDEX: string = process.env.ES_INDEX_PATTERN || '';
console.log(INDEX)

type ESDocument = {
  _index: string
  _type: string
  _id: string
  _score: number,
  _source: object
}
type QueryResults = ESDocument[] | [];
type SearchParam = {
  index: string,
  size?: number,
  body: object | string
  scroll?: string
}

const client: Client = new Client({
  node: process.env.ES_CLOUD_NODE || '',
  auth: { 
    username: process.env.ES_CLOUD_USERNAME || '',
    password: process.env.ES_CLOUD_PASSWORD || ''
  }
})

const runSearch = async (index: string): Promise<QueryResults> => {
  try {
    // new definitions
    const response: ApiResponse = await client.search({
      index,
      size: 10000, // max 10000
      body: {
        query: {
            match_all: {}
          }
      }
    })
    const documents: QueryResults = response?.body?.hits?.hits || [];
    return documents;
  } catch (error: unknown) {
    // (error as AxiosError).message
    console.log(error);
    throw error;
  }
}

async function * scrollSearch (params: SearchParam) {
  let response: ApiResponse = await client.search(params)

  while (true) {
    const sourceHits: QueryResults = response.body.hits.hits

    if (sourceHits.length === 0) {
      break
    }

    for (const hit of sourceHits) {
      yield hit
    }

    if (!response.body._scroll_id) {
      break
    }

    console.log(response);

    response = await client.scroll({
      scroll_id: response.body._scroll_id,
      scroll: params.scroll
    })
  }
}

const runScroll = async (index: string): Promise<QueryResults> => {
  try {
    // new definitions
    const params = {
      index,
      scroll: '30s', // 
      size: 10000, // max 10000
      body: {
        query: {
          match_all: {}
        }
      }
    }
    
    let results: ESDocument[] = [];
    for await (const hit of scrollSearch(params)) {
      results.push(hit);
    }

    return results;
  } catch (error: unknown) {
    // (error as AxiosError).message
    throw error;
  }
}

const main = async () => {
  const res: QueryResults = await runScroll(INDEX);
  console.log([res[0]], res.length);
}

main();