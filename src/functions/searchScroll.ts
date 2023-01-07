import { ApiResponse } from "@elastic/elasticsearch"
import { client } from "../elasticserch"
import { ESDocument, QueryResults, SearchParam } from "../types"

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

export const searchScroll = async (index: string): Promise<QueryResults> => {
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
