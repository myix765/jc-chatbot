import { useEffect, useState } from 'react';
import './App.css'
import MessageList from './components/MessageList';
import { createTables, getPairs, createQuery, deleteAll } from './api/query-wrapper'

function App() {
  const [query, setQuery] = useState("");
  const [queryArr, setQueryArr] = useState([]);
  const [responseArr, setReponseArr] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (query != "") {    // handle case when query is only whitespace and message height is 0
      setQueryArr([...queryArr, query]);
      const res = await createQuery(query);
      setReponseArr([...responseArr, res.responseRes.rows[0].response]);
      // console.log("res response:", res.responseRes.rows[0].response);
      setQuery("");
    }
  }

  const onClear = async () => {
    setQueryArr([]);
    setReponseArr([]);
    await deleteAll();
  }

  useEffect(() => {
    // console.log("useEffect");

    const init = async () => {
      await createTables();
      const assignmentsArr = await getPairs();
      assignmentsArr.map(assignmentsObj => {
        setQueryArr(q => [...q, assignmentsObj.query]);
        setReponseArr(r => [...r, assignmentsObj.response]);
      })
    };

    init();
  }, []);

  return (
    <>
      <div className='flex flex-col items-center w-full h-screen justify-between'>
        <div className='w-full px-3 pt-4 pb-10 overflow-scroll'>
          <MessageList
            queryArr={queryArr}
            responseArr={responseArr}
          />
        </div>
        <div className='h-[15%] fixed bottom-10 w-full bg-gradient-to-t from-offblack via-offblack to-transparent'></div>
        <div className='w-[96%] h-28 px-2 pb-8 pt-4 font-inconsolata z-20'>
          <form className='bottom-0 flex gap-3' onSubmit={onSubmit}>
            <input
              type='text'
              id='query-input'
              value={query}
              placeholder='ask a question'
              className='border-2 rounded-lg w-full border-greenlight outline-none py-3 px-4 min-h-12 text-lg text-white bg-offblack'
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button
              className='bg-greenlight rounded-lg py-3 px-8 text-offblack text-lg'
            >
              Submit
            </button>
            <button
              onClick={onClear}
              className='bg-offblack text-white border-greenlight border-2 rounded-lg py-3 px-8 text-lg'
            >
              Clear
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
