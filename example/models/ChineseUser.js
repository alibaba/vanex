import {
    extendModel
} from '../../lib';
import User from './User';

export default extendModel(User, {
    name: 'ChineseUser',
    data: {
        chinese: {
            zodiac: 'dragon',
        },
    },
    effects: {
        // overide User.fetchUserInfo
        async fetchUserInfo() {
            await User.effects.fetchUserInfo.apply(this, arguments);
        },
    },
});
