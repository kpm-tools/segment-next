# Segment-Next.js

After integrating Next.js applications with [Segment](https://segment.com) I've ran into a few pitfalls that their library doesn't provide. Here's a few things that this library can do for you out of the box.

-   Guaranteed `analytics.page` event fire on initial page load, regardless of it being client-side or server-side.
-   A `handlePageEvent` callback to tie your application to be able to run a consistent `analytics.page` event for better downstream reporting.
-   A fully typed API to pull use so that you know you're passing in the right parameters to your events.
-   An event helper, `analyticsEvent`, that guarantees delivery of an event client-side and server-side.
-   The `useWaitForSegmentScript` hook that you can tie into so your application is aware of when the Segment script is ready in your application.

## Usage

In your `_app.js` file, add in the `SegmentScript` component:

```
    import { SegmentScrip, analyticsEvent } from 'segment-next.js'
    const App = () => {

        const callbackFunction = (pathname: string) => {
            // Optionally can add any variables here
            analyticsEvent.page()
        }

        return (
            <>
                <Component {...pageProps}>
                <SegmentScript
                    apiKey={YOUR_API_KEY} // Required
                    handlePageEvent={callbackFunction} // Used to let your app know of initial server-side load and other route changes
                />
            </>
        )
    }
```

With the `analyticsEvent` helper you can confidently call any of segment's methods in your app, here's an example:

```
    <button onClick={() => analyticsEvent.track('Button Click', { user: 'Dwayne Johnson'})}>
        Click Me!
    </button>
```

## Documentation

### SegmentScript

```
    <SegmentScript
        apiKey={YOUR_API_KEY} // Required - string
        handlePageEvent={callbackFunction} // Optional (but recommended) - Function - returns "pathname" value
        host={URL_FOR_YOUR_HOST} // Optional - string - Domain for where your analytics.js script is hosted
        scriptPath={PATH_FOR_YOUR_SCRIPT} // Optional - string  - To override the default analytics.js locaiton

    />
```

### analyticsEvent

These map directly to the analytics events in [Segment's Docs](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/). All of these functions are all fully typed as well. All events return a success or failed boolean and the type of event that was fired.

```
analyticsEvent.track(
    event: Event = null,
    properties: Properties = {},
    options: Options = {},
    callback: Callback = null
)
```

```
analyticsEvent.identify(
    userId?: UserId,
    traits?: Traits,
    options: Options = {},
    callback: Callback = null)
)

```

```
analyticsEvent.page(
    category?: Category,
    name?: Name,
    properties: Properties = {},
    options: Options = {},
    callback: Callback = null
)
```

```
analyticsEvent.group(
    groupId: GroupId,
    traits?: Traits,
    options?: Options,
    callback?: Callback
)
```

```
analyticsEvent.alias(
    userId: UserId,
    previousId?: PreviousId,
    options: Options = {},
    callback: Callback = null
)
```

### Types

Here are the types that are used for the values you can pass into `analyticsEvent`

```
export type UserId = string | null;
export type Category = string | null;
export type Name = string | null;
export type Options = object | null;
export type Callback = Function | null;
export type Event = string | null;
export type GroupId = string | null;
export type PreviousId = string | null;

export enum EventType {
    Track = 'track',
    Identify = 'identify',
    Page = 'page',
    Group = 'group',
    Alias = 'alias',
}

export interface Traits {
    address?: {
        city?: string;
        country?: string;
        postalCode?: number;
        state?: string;
        street?: string;
    };
    age?: number;
    avatar?: string;
    birthday?: Date;
    company?: {
        name?: string;
        id: string | number;
        industry?: string;
        employee_count?: number;
        plan?: string;
    };
    createdAt?: Date;
    description?: string;
    email?: string;
    firstName?: string;
    gender?: string;
    id?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    title?: string;
    username?: string;
    website?: string;
}

export interface Properties {
    name?: string;
    path?: string;
    referrer?: string;
    search?: string;
    title?: string;
    url?: string;
    keywords?: string[];
    [property: string]: any;
}


```
