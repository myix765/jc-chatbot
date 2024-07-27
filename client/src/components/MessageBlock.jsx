import PropTypes from 'prop-types'

const MessageBlock = ({ message, isQuery }) => {
    let styleModifier;
    if (isQuery) {
        styleModifier = "self-end border-black"
    } else {
        styleModifier = "border-green-300"
    }

    return (
        <div className={`border-2 rounded-lg p-1 w-[70%] ${styleModifier}`}>
            <p>{message}</p>
        </div>
    )
}

MessageBlock.propTypes = {
    message: PropTypes.string.isRequired,
    isQuery: PropTypes.bool.isRequired
}

export default MessageBlock;