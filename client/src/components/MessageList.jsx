import MessageBlock from "./MessageBlock";
import PropTypes from 'prop-types'

const MessageList = ({ messageArr }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {messageArr.map((messageObj) => {
                return <MessageBlock
                    key={messageObj.id}
                    message={messageObj.query}
                />
            })}
        </div>
    )
}

MessageList.propTypes = {
    messageArr: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MessageList;