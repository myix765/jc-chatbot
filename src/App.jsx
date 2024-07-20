import './App.css'
import MessageList from './components/MessageList';

function App() {
  const messages = ["Hello world", "how's the weather"];

  return (
    <>
      <div className='p-2'>
        <MessageList
          messageArr={messages}
        />
      </div>
    </>
  )
}

export default App
