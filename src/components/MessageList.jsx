import React from 'react';
import MessageBlock from "./MessageBlock";
import PropTypes from 'prop-types';

const MessageList = ({ queryArr, responseArr }) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <MessageBlock
                message={"Hello! I'm your helpful AI assistant, the devil on your shoulder! How can I help you?"}
                isQuery={false}
            />
            {queryArr.map((query, id) => (
                <React.Fragment key={id}>
                    <MessageBlock
                        message={query}
                        isQuery={true}
                    />
                    {responseArr[id] && <MessageBlock
                        message={responseArr[id]}
                        isQuery={false}
                    />}
                </React.Fragment>
            ))}
        </div>
    )
}

MessageList.propTypes = {
    queryArr: PropTypes.arrayOf(PropTypes.object).isRequired,
    responseArr: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MessageList;