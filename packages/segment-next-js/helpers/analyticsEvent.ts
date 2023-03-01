import { Status, STATUS } from '../types/global';
import {
    UserId,
    PreviousId,
    Event,
    Category,
    Name,
    Traits,
    Options,
    Callback,
    Properties,
    EventType,
    GroupId,
} from '../types/analyticsEvents';

declare global {
    interface Window {
        analytics: any;
    }
}

interface WaitForSegmentScript {
    segmentScriptStatus: Status;
}

interface HandleAsyncEventResponse {
    success: boolean;
    type: EventType;
}

export const segmentScriptObserver = async (): Promise<WaitForSegmentScript> => {
    return new Promise((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const timeout = 500;

        if (typeof window !== 'undefined' && window?.analytics) return resolve({ segmentScriptStatus: STATUS.LOADED });

        const observer = new MutationObserver(() => {
            if (typeof window !== 'undefined' && window?.analytics) {
                observer.disconnect();
                if (timer !== null) clearTimeout(timer);
                return resolve({ segmentScriptStatus: STATUS.LOADED });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        timer = setTimeout(() => {
            observer.disconnect();
            reject({ segmentScriptStatus: STATUS.ERROR });
        }, timeout);
    });
};

const handleAsyncEvent = async (event: Function, type: EventType): Promise<HandleAsyncEventResponse> => {
    if (event) {
        const { segmentScriptStatus } = await segmentScriptObserver();
        if (segmentScriptStatus === STATUS.LOADED) {
            event();
            return { success: true, type };
        }

        try {
            const { segmentScriptStatus } = await segmentScriptObserver();

            if (segmentScriptStatus === STATUS.LOADED) {
                event();
                return { success: true, type };
            }
        } catch ({ segmentScriptStatus }) {
            if (segmentScriptStatus === STATUS.ERROR) {
                return { success: false, type };
            }
        }

        return { success: false, type };
    }

    return { success: false, type };
};

export const analyticsEvent = {
    track: async (
        event: Event = null,
        properties: Properties = {},
        options: Options = {},
        callback: Callback = null
    ): Promise<HandleAsyncEventResponse> => {
        return await handleAsyncEvent(
            () => window.analytics.track(event, properties, options, callback),
            'track' as EventType.Track
        );
    },
    identify: async (userId?: UserId, traits?: Traits, options: Options = {}, callback: Callback = null) => {
        return await handleAsyncEvent(
            () => window.analytics.identify(userId, traits, options, callback),
            'identify' as EventType.Identify
        );
    },
    page: async (
        category?: Category,
        name?: Name,
        properties: Properties = {},
        options: Options = {},
        callback: Callback = null
    ): Promise<HandleAsyncEventResponse> => {
        return await handleAsyncEvent(
            () => window.analytics.page(category, name, properties, options, callback),
            'page' as EventType.Page
        );
    },
    group: async (groupId: GroupId, traits?: Traits, options?: Options, callback?: Callback) => {
        return await handleAsyncEvent(
            () => window.analytics.group(groupId, traits, options, callback),
            'group' as EventType.Group
        );
    },
    alias: async (userId: UserId, previousId?: PreviousId, options: Options = {}, callback: Callback = null) => {
        return await handleAsyncEvent(
            () => window.analytics.alias(userId, previousId, options, callback),
            'alias' as EventType.Group
        );
    },
};
