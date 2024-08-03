import MessageBlock from "./MessageBlock";
import PropTypes from 'prop-types'

const MessageList = ({ messageArr }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {messageArr.map((messageObj, id) => {
                console.log("messageObj:", messageObj);
                return (
                    <>
                        <MessageBlock
                            // key={id}
                            message={messageObj.query}
                            isQuery={true}
                        />
                        <MessageBlock
                            // key={id}
                            message={messageObj.response}
                            isQuery={false}
                        />
                    </>
                )
            })}
        </div>
    )
}

MessageList.propTypes = {
    messageArr: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MessageList;