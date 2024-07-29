import PropTypes from 'prop-types'

const MessageBlock = ({ message, isQuery }) => {
    let styleModifier;
    if (isQuery) {
        styleModifier = "self-end border-white"
    } else {
        styleModifier = "border-greenlight"
    }

    return (
        <p className={`border-2 rounded-lg p-1 w-[70%] text-white ${styleModifier}`}>{message}</p>
    )
}

MessageBlock.propTypes = {
    message: PropTypes.string.isRequired,
    isQuery: PropTypes.bool.isRequired
}

export default MessageBlock;