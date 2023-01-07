import { searchScroll } from "./src/functions/searchScroll";
import { QueryResults } from "./src/types";

const main = async () => {
  const res: QueryResults = await searchScroll(process.env.ES_INDEX_PATTERN);
  console.log([res[0]], res.length);
}

main();