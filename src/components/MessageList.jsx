import MessageBlock from "./MessageBlock";
import PropTypes from 'prop-types'

const MessageList = ({ messageArr }) => {
    return (
        <>
            <div className="flex flex-col gap-2">
                {messageArr.map((message, id) => {
                    return <MessageBlock
                        key={id}
                        message={message}
                    />
                })}
            </div>
        </>
    )
}

MessageList.propTypes = {
    messageArr: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default MessageList;