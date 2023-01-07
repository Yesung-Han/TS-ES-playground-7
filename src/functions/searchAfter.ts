import { ApiResponse } from "@elastic/elasticsearch"
import { client } from "../elasticserch"
import { ESDocument, QueryResults, SearchParam } from "../types"

async function * afterSearch (params: SearchParam) {
  let response: ApiResponse = await client.search(params)

  while (true) {
    const sourceHits: QueryResults = response.body.hits.hits
    if (sourceHits.length === 0) {
      break
    }
    const lastHit = sourceHits[sourceHits.length - 1];
    for (const hit of sourceHits) {
      yield hit
    }

    params.body['search_after'] = lastHit.sort;
    console.log('⏳ loading...');
    response = await client.search(params);
  }
}

export const searchAfter = async (index: string): Promise<QueryResults> => {
  try {
    // new definitions
    const params = {
      index,
      size: 10000, // max 10000
      body: {
        query: {
          match_all: {}
        },
        sort: {
          "timestamp": "asc",
          "_id": "asc",
        }
      }
    }
    
    let results: ESDocument[] = [];
    for await (const hit of afterSearch(params)) {
      results.push(hit);
    }

    return results;
  } catch (error: unknown) {
    // (error as AxiosError).message
    throw error;
  }
}
