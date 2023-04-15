import { AppProps } from 'next/app';
import { SegmentScript, analyticsEvent } from '../../dist';

const App = ({ Component, pageProps }: AppProps) => {
    const callbackFunction = (pathname: string) => {
        analyticsEvent.page(pathname);
    };

    return (
        <>
            <Component {...pageProps} />
            <SegmentScript
                apiKey={process.env.NEXT_PUBLIC_SEGMENT_KEY || ''} // Required
                handlePageEvent={callbackFunction} // Used to let your app know of initial server-side load and other route changes
            />
        </>
    );
};

export default App;
