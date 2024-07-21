import './App.css'
import MessageList from './components/MessageList';

function App() {
  const messages = ["Hello world", "how's the weather"];

  return (
    <>
      <div>
        <div className='w-full p-2'>
          <MessageList
            messageArr={messages}
          />
        </div>
        <div className='fixed bottom-0 w-full px-2 pb-3 pt-2 bg-slate-300'>
          <form className='w-full bottom-0 flex gap-2' >
            <input
              type='text'
              id='query-input'
              name='query-input'
              placeholder='ask a question'
              className='border-2 rounded-lg border-black w-full outline-none p-1'
            />
            <input
              type='submit'
              className='bg-slate-600 rounded-lg py-1 px-3'
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default App
