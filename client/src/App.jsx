import { useEffect, useState } from 'react';
import './App.css'
import MessageList from './components/MessageList';
import { createQuery } from './modules/query-model'

function App() {
  const [query, setQuery] = useState("");
  const [queryArr, setQueryArr] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (query != "") {    // handle case when query is only whitespace and message height is 0
      createQuery(query);
      setQuery("");
    }
  }

  const getQueries = async () => {
    try {
      const res = await fetch("http://localhost:4000/queries");
      const jsonData = await res.json();

      setQueryArr(jsonData.rows);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    console.log("useEffect");
    getQueries();

    // const queryData = getQueries();
    // console.log("querydata", queryData)
    // setQueryArr(queryData);
  }, []);

  return (
    <>
      <div>
        <div className='w-full p-2'>
          <MessageList
            messageArr={queryArr}
          />
        </div>
        <div className='fixed bottom-0 w-full px-2 pb-3 pt-2 bg-slate-300'>
          <form className='w-full bottom-0 flex gap-2' onSubmit={onSubmit}>
            <input
              type='text'
              id='query-input'
              value={query}
              placeholder='ask a question'
              className='border-2 rounded-lg border-black w-full outline-none p-1'
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button
              className='bg-slate-600 rounded-lg py-1 px-3'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
