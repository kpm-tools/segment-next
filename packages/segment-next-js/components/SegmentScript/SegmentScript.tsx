import React from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

type Pathname = string;

interface SegmentScriptProps {
    apiKey: string;
    host?: string;
    scriptPath?: string;
    handlePageEvent?: (pathname: Pathname) => void;
}

const SegmentScript = (props: SegmentScriptProps) => {
    const { apiKey, host, scriptPath, handlePageEvent } = props;

    const options = {
        apiKey,
        host: host || 'cdn.segment.com',
        scriptPath: scriptPath || `/analytics.js/v1/${apiKey}/analytics.min.js`,
    };

    const router = useRouter();

    // Initial Page Load
    React.useEffect(() => {
        if (handlePageEvent) {
            handlePageEvent(router.pathname);
        }
    }, [handlePageEvent]);

    // Any Page Load After
    React.useEffect(() => {
        if (handlePageEvent) {
            router.events.on('routeChangeComplete', handlePageEvent);

            return () => {
                router.events.off('routeChangeComplete', handlePageEvent);
            };
        }
    }, [router, handlePageEvent]);

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
