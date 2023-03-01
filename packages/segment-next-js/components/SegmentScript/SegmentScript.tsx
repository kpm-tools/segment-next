import React, { useEffect } from 'react';
import Script from 'next/script';

import usePathname from '../../hooks/usePathname';

type Pathname = string;

interface SegmentScriptProps {
    apiKey: string;
    host?: string;
    scriptPath?: string;
    handlePageEvent?: (pathname: Pathname) => void;
}

const SegmentScript: React.FC<SegmentScriptProps> = (props: SegmentScriptProps): React.ReactElement => {
    const { apiKey, host, scriptPath, handlePageEvent } = props;

    const options = {
        apiKey,
        host: host || 'cdn.segment.com',
        scriptPath: scriptPath || `/analytics.js/v1/${apiKey}/analytics.min.js`,
    };

    const { pathname } = usePathname();

    useEffect(() => {
        if (pathname && handlePageEvent) {
            handlePageEvent(pathname);
        }
    }, [pathname, handlePageEvent]);

    return (
        <Script
            id="segment-production"
            dangerouslySetInnerHTML={{
                __html: `
    var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://${options.host}${options.scriptPath}";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
    analytics.load("${options.apiKey}");;}
    `,
            }}
            strategy="afterInteractive"
        />
    );
};

export default SegmentScript;
