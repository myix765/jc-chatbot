import PropTypes from 'prop-types';
import jc_icon from '../assets/jc_green_black.webp';
import jc_devil_icon from '../assets/jc_devil_white.webp';

const MessageBlock = ({ message, isQuery }) => {
    let styleModifier;
    if (isQuery) {
        styleModifier = "justify-end border-greenlight"
    } else {
        styleModifier = "border-white"
    }

    return (
        <div className={`flex items-center gap-4 ${isQuery ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="inline-block overflow-hidden h-16 aspect-square rounded-xl">
                <img
                    src={isQuery ? jc_icon : jc_devil_icon}
                    alt={isQuery ? "JC icon" : "JC devil icon"}
                    className="transform scale-110"
                />
            </div>
            <div className={`align-middle border-2 rounded-lg min-h-12 py-3 px-4 w-[54%] ${styleModifier}`}>
                <p className={`font-inconsolata text-lg text-white flex-grow`}>{message}</p>
            </div>
        </div>
    )
}

MessageBlock.propTypes = {
    message: PropTypes.string.isRequired,
    isQuery: PropTypes.bool.isRequired
}

export default MessageBlock;