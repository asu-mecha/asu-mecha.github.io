import algoliasearch from "algoliasearch";
import "./search.css";
import { useEffect, useState } from "react";

const APP_ID = "E77TDAP2ZW";
const SEARCH_KEY = "8761a5cbc3b094847852417488c43f3b";

const searchClient = algoliasearch(APP_ID, SEARCH_KEY);

const index = searchClient.initIndex("asu-mecha");

export default function Search() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    index.search(query).then(({ hits }) => {
      setResults(hits);
    });
  }, [query]);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
      />
      {query.length > 0 && (
        <ul>
          {results.map(
            (hit: {
              objectID: string;
              _highlightResult: { Title: { value: string } };
            }) => (
              <li
                className="search-result"
                key={hit.objectID}
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.Title.value,
                }}
              ></li>
            )
          )}
        </ul>
      )}
    </>
  );
}
