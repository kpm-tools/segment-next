import React from 'react';
import { Status, STATUS } from '../types/global';
import { segmentScriptObserver } from '../helpers/analyticsEvent';

const useWaitForSegmentScript = () => {
    const [status, setStatus] = React.useState(STATUS.LOADING as Status);

    React.useEffect(() => {
        const asyncSegmentScriptObserver = async () => {
            await segmentScriptObserver()
                .then(({ segmentScriptStatus }) => setStatus(segmentScriptStatus))
                .catch(({ segmentScriptStatus }) => setStatus(segmentScriptStatus));
        };

        asyncSegmentScriptObserver();
    }, []);

    return { status };
};

export default useWaitForSegmentScript;
