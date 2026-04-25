import { parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/config/constants";

export const workflowsParams = {

  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({ clearOnDefault: true }),

  pageSize: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE_SIZE).withOptions({ clearOnDefault: true }),

  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};

// parseAsInteger → converts URL value → number
// parseAsString → converts URL value → string



// page: parseAsInteger
//   .withDefault(PAGINATION.DEFAULT_PAGE)
//   .withOptions({ clearOnDefault: true }),

// page comes from URL → ?page=2
// Convert it to number
// If not present → use default (like 1)
// If value = default → remove it from URL


// | URL       | Result                         |
// | --------- | ------------------------------ |
// | `/`       | page = 1                       |
// | `?page=2` | page = 2                       |
// | `?page=1` | ❌ removed from URL (clean URL) |


//NOTE => SAME AS FOR PAGE SIZE 

// search: parseAsString
//   .withDefault("")

// ?search=hello → "hello"
// No search → "" (empty string)

// .withOptions({ clearOnDefault: true }) If value = default → remove it

// page = 1 (default) 