import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import Helmet from 'react-helmet';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { I18nProvider } from '@deity/falcon-i18n';
import HtmlHead from '../../components/HtmlHead';

/**
 * Server Side Rendering middleware.
 * @param {{App: React.Component}} App - React Component to render
 * @return {function(ctx: object, next: function): Promise<void>} Koa middleware
 */

export default ({ App, loadableStats }) => async (ctx, next) => {
  const { client, serverTiming } = ctx.state;
  const { i18next } = ctx;
  const context = {};
  const extractor = new ChunkExtractor({ stats: loadableStats, entrypoints: ['client'] });

  const markup = (
    <ApolloProvider client={client}>
      <ChunkExtractorManager extractor={extractor}>
        <I18nProvider i18n={i18next}>
          <StaticRouter context={context} location={ctx.url}>
            <React.Fragment>
              <HtmlHead htmlLang={i18next.language} />
              <App />
            </React.Fragment>
          </StaticRouter>
        </I18nProvider>
      </ChunkExtractorManager>
    </ApolloProvider>
  );

  await serverTiming.profile(async () => getDataFromTree(markup), 'getDataFromTree()');

  ctx.state.AppMarkup = markup;
  // loadable components provides prefetch links, style and script tags and waits on the client for all script tags before rendering
  // https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/
  ctx.state.prefetchLinkElements = extractor.getLinkElements();
  ctx.state.scriptElements = extractor.getScriptElements();
  ctx.state.styleElements = extractor.getStyleElements();

  ctx.state.helmetContext = Helmet.renderStatic();

  return context.url ? ctx.redirect(context.url) : next();
};
