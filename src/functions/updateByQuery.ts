import { ApiResponse } from "@elastic/elasticsearch";
import { client } from "../elasticserch";

export const updateByQuery = async (index: string, source: string, query: object): Promise<number> => {
  try {
    // new definitions
    const response: ApiResponse = await client.updateByQuery({
      index,
      // refresh: true,
      body: {
        script: {
          lang: 'painless',
          source
        },
        query
      }
    })
    const total: number = response?.body?.total;
    return total
  } catch (error: unknown) {
    // (error as AxiosError).message
    console.log(error);
    throw error;
  }
}