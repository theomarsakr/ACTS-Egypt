/* Renders one or more JSON-LD graphs.
 *
 * `application/ld+json` is data, not an executable script, so the site's CSP
 * (`script-src 'self' 'unsafe-inline'`, see next.config.js) does not apply to
 * it — the same reasoning already documented for the Organization block in
 * app/[lang]/layout.tsx.
 *
 * Every value passed here is authored in lib/* by us, never user input, so the
 * only escaping hazard is a literal "</script>" inside a string; `<` is
 * escaped below so a future product description containing markup cannot break
 * out of the block.
 */

type Props = { schema: object | object[] };

export default function JsonLd({ schema }: Props) {
  const graphs = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {graphs.map((graph, i) => (
        <script
          // Order is stable (each page builds its graphs in a fixed order), so
          // the index is a legitimate key here.
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
