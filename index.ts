import { searchAfter } from "./src/functions/searchAfter";
import { searchScroll } from "./src/functions/searchScroll";
import { QueryResults } from "./src/types";

const main = async () => {
  const res: QueryResults = await searchAfter(process.env.ES_INDEX_PATTERN);
  console.log([res[res.length - 1]], res.length);
  console.log('✅ loaded done !')
}

main();