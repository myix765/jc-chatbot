import PropTypes from 'prop-types'

const MessageBlock = ({ message }) => {
    return (
        <div className="border-2 rounded-lg border-black p-1">
            <p>{message}</p>
        </div>
    )
}

MessageBlock.propTypes = {
    message: PropTypes.string.isRequired,
}

export default MessageBlock;