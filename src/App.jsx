import { useEffect, useState } from 'react';
import './App.css'
import MessageList from './components/MessageList';
import { createTables, getAllQueries, createQuery, deleteAll } from './api/query-wrapper'

function App() {
  const [query, setQuery] = useState("");
  const [queryArr, setQueryArr] = useState([]);
  const [responseArr, setReponseArr] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (query != "") {
      const queryTemp = query;
      setQuery("");
      setQueryArr([...queryArr, queryTemp]);
      const res = await createQuery(queryTemp);
      setReponseArr([...responseArr, res.rows[0].response]);
    }
  }

  const onClear = async () => {
    setQueryArr([]);
    setReponseArr([]);
    await deleteAll();
  }

  useEffect(() => {
    const init = async () => {
      await createTables();
      const messagesArr = await getAllQueries();
      messagesArr.map(messagesObj => {
        setQueryArr(q => [...q, messagesObj.query]);
        setReponseArr(r => [...r, messagesObj.response]);
      })
    };

    init();
  }, []);

  return (
    <>
      <div className='flex flex-col items-center w-full'>
        <div className='w-full px-3 pt-4 pb-14 h-[calc(100vh-7rem)] overflow-scroll'>
          <MessageList
            queryArr={queryArr}
            responseArr={responseArr}
          />
        </div>
        <div className='h-[18%] fixed bottom-10 w-full bg-gradient-to-t from-offblack via-offblack to-transparent'></div>
        <div className='w-[96%] fixed bottom-0 h-28 px-2 pb-8 pt-4 font-inconsolata z-20'>
          <form className='bottom-0 flex gap-3' onSubmit={onSubmit} autoComplete='off'>
            <input
              type='text'
              id='query-input'
              value={query}
              placeholder='ask a question'
              className='border-2 rounded-lg w-full border-greenlight outline-none py-2 px-4 min-h-12 text-lg text-white bg-offblack'
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button
              className='bg-greenlight rounded-lg py-2 px-8 text-offblack text-lg'
            >
              Submit
            </button>
            <button
              onClick={onClear}
              className='bg-offblack text-white border-greenlight border-2 rounded-lg py-2 px-8 text-lg'
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
