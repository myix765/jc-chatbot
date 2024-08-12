import React from 'react';
import MessageBlock from "./MessageBlock";
import PropTypes from 'prop-types';

const MessageList = ({ queryArr, responseArr }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {queryArr.map((query, id) => {
                console.log("query:", query);
                return (
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
                )
            })}
        </div>
    )
}

MessageList.propTypes = {
    queryArr: PropTypes.arrayOf(PropTypes.object).isRequired,
    responseArr: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MessageList;