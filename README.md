# minimal-nx-nextjs-emotion-mui

This is a minimal example of how to get the combination of the following libraries running together:

- [NX](https://nx.dev)
- [Next.js](https://nextjs.org)
- [MUI (Material UI)](https://mui.com)
- [Emotion](https://emotion.sh)

This example is using the [Next.js App Router](https://nextjs.org/docs/app), which itself is switching to React 18
Server Components to do server-side rendering, among other things.

The main pain point is getting Emotion to play nicely with React Server Components. At the core of Emotion is a
Provider with a React Context that collects the CSS-in-JS styles, to enable a subsequent render pass to inject
them as `<style />` tags.

Using `createContext` is not allowed in Server Components, as they cannot contain a modifiable state that can differ
from server to client. However, Emotion's JSX constructor injects the code that contains a `createContext`.

Note that when using the legacy [Pages Router of Next.js](https://nextjs.org/docs/pages), you will not have this issue.

## How to get it to work

If your goal is to get MUI and Emotion to work at all in your Next.js application and you want to use the `app/`
Router, here is what you have to keep in mind:

### Use the emotion option in `next.config.js`

In your `next.config.js`, use the following lines:

```javascript
  compiler: {
    emotion: true,
  },
```

You can also supply more options here, but the `emotion` option must be set. This causes Next.js to enable
the Babel or `swc` plugin for emotion. This, in turn, will enable JSX transpilation with the Emotion context,
otherwise, the `css` marker wouldn't work.

### Prefix any React Server Component with a pragma

Because the default for all files using `JSX` code is now emotion, we have to tell the transpiler that for React
Server Component, we want to use the Vanilla React JSX constructor. This is achieved by using the following line
on the top of _every React Server Component_:

```javascript
/* @jsxImportSource react */
```

If any of your RSC miss this pragma at the top, you will get a cryptic error message that won't tell you where
the issue lies.

### Mark all components that use Styled Components as Client Components

Finally, all other components have to be marked with the usual `"use client";` at the top. That includes all
components that use `styled`. If you want to use styles in your page, I recommend separating the
[`page.tsx`](/apps/app/app/page.tsx) RSC and the actual content in a
[separate component](/apps/app/components/HomePage.tsx), to preserve the ability to load data from the database
or other things you can only do in a server component.

### Use the emotion case provider supplied by `@mui`

The `@mui/material-nextjs` package provides a provider for setting up the emotion cache:

```javascript
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
```

This can be used in your [`layout.tsx`](/apps/app/app/layout.tsx), as it marks itself as a client component.

## Disadvantages

This will enable you to use `emotion` and `mui` in Next.js' `app/` router. However, you might not want to.

At the core of the Emotion engine is a cache that collects all usages of the CSS-in-JS helpers during render,
to enable then, once the render is done, an injection of the collected CSS into a `<style />` tag at the `<head />`,
or somewhere else.

This means, however, that with `emotion`, you can only know the CSS of your page _after it has been rendered_. The
advantages are great flexibility, a nice developer experience and the guarantee of only delivering the CSS that
the page actually uses.

For disadvantages, this approach is inherently not optimisable. With [React 18](https://react.dev/blog/2022/03/29/react-v18),
features like streaming and concurrent rendering were added. Streaming especially reduces the response time
of your server - but it requires that you send the page content while it's rendering. Since with Emotion
you cannot know the CSS of your page until _after_ rendering is completed, you cannot use this feature.

Second, since the cache is a client component and at the top of your `layout.tsx`, you lose all the advantages
that server components would bring, like pre-rendered DOM, less hydration and smaller bundle size. And
mentioning bundle size, in order to achieve the flexibility that Emotion brings, it has to be part of the
runtime bundle sent to the client.

If you are using `@mui` for your application and want to migrate to the `app/` router for the advantages of
Next.js 14 and React 18, you might want to [wait for MUI to migrate](https://github.com/mui/material-ui/issues/38137)
to a solution that will incorporate a static CSS approach. With that, your CSS is generated at build time.
This means less overhead at rendering, smaller bundle sizes and the ability to optimise the rendering.
Disadvantages are less flexibility with dynamic CSS (though that's what the `style` attribute is for), and
larger `.css` files that might contain more styles than strictly necessary.

If you're on a new project and are unsure if `@mui` is for you, you can look at [Tailwind CSS](https://tailwindcss.com)
together with [daisyUI](https://daisyui.com/) for a framework agnostic solution, or look into using the
[Chakra UI](https://chakra-ui.com/) component collection, which uses [Panda CSS](https://panda-css.com/) under
the hood.

(Rant over)
