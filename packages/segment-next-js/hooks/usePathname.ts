import React from 'react';
import useWaitForSegmentScript from './useWaitForSegmentScript';
import { STATUS } from '../types/global';

export const usePathname = () => {
    const { status } = useWaitForSegmentScript();

    const [pathname, setPathname] = React.useState('');
    const [previousPathname, setPreviousPathname] = React.useState('');

    // Set initial pathname
    React.useEffect(() => {
        if (status === STATUS.LOADED) {
            setPathname(window.location.pathname);
        }
    }, [status]);

    // Listen for pathname updates
    React.useEffect(() => {
        const asyncWindowObserver = async () => {
            const observer = new MutationObserver(() => {
                if (typeof window !== 'undefined' && window?.location?.pathname) {
                    if (window.location.pathname !== previousPathname && pathname) {
                        setPreviousPathname(pathname);
                        setPathname(window.location.pathname);
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        };

        asyncWindowObserver();
    }, [pathname]);

    return { pathname };
};

export default usePathname;
