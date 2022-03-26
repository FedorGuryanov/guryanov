import {Essay} from '../store/essay/types';
import * as H from 'history';

export const statusNavigate = (essay: Essay | null, history: H.History) => {
    if (essay && essay._id) {
        switch (essay.status) {
            case 'open':
                history.push('/' + essay._id);
                break;
            case 'ready':
                history.push('/check/' + essay._id);
                break;
            case 'checked':
                history.push('/check/' + essay._id);
                break;
            case 'closed':
                history.push('/check/' + essay._id);
                break;
        }
    }
};
