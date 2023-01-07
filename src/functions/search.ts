import { ApiResponse } from "@elastic/elasticsearch";
import { client } from "../elasticserch";
import { QueryResults } from "../types";

export const runSearch = async (index: string): Promise<QueryResults> => {
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