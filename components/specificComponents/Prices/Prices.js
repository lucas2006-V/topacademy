import React from "react";
import {
  storyblokEditable,
  renderRichText,
  StoryblokComponent,
} from "@storyblok/react";

import css from "./Prices.module.scss";
import Headermenu from "../../genericComponents/Headermenu/Headermenu"; // pas aan indien nodig

const Prices = ({ blok, menu }) => {
  /* ---------- helpers ---------- */

  const renderRich = (rich) => {
    if (!rich) return null;
    return (
      <div
        className={css.paragraph}
        dangerouslySetInnerHTML={{
          __html: renderRichText(rich),
        }}
      />
    );
  };

  const tableToMatrix = (table) => {
    const tbody = table?.tbody;
    if (!Array.isArray(tbody)) return [];

    if (Array.isArray(tbody[0])) return tbody;

    if (tbody[0] && Array.isArray(tbody[0].body)) {
      return tbody.map((r) => (Array.isArray(r.body) ? r.body : []));
    }

    if (tbody[0] && Array.isArray(tbody[0].cells)) {
      return tbody.map((r) => (Array.isArray(r.cells) ? r.cells : []));
    }

    return [];
  };

  const renderWordTable = (table) => {
    const matrix = tableToMatrix(table);
    if (!matrix.length) return null;

    return (
      <div className={css.tableCard}>
        <table className={css.table}>
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                {(row || []).map((cell, cIdx) => (
                  <td key={`${rIdx}-${cIdx}`}>
                    {typeof cell === "object" && cell !== null ? (
                      "value" in cell ? (
                        typeof cell.value === "object"
                          ? renderRich(cell.value)
                          : String(cell.value ?? "")
                      ) : cell.type === "doc" ? (
                        renderRich(cell)
                      ) : (
                        ""
                      )
                    ) : (
                      String(cell ?? "")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  /* ---------- data ---------- */

  const sections = Array.isArray(blok?.sections) ? blok.sections : [];
  const bottomblocks = Array.isArray(blok?.bottomblocks)
    ? blok.bottomblocks
    : [];

  /* ---------- render ---------- */

  return (
    <div {...storyblokEditable(blok)} className={css.prices}>
      <Headermenu blok={menu?.content} />

      <main>
        <div className={css.container}>
          {blok?.title && <h1 className={css.title}>{blok.title}</h1>}
          {blok?.intro_text && <p className={css.intro}>{blok.intro_text}</p>}

          {sections.map((section) => {
            const comp = section?.component;

            if (comp === "paragraph") {
              const rich = section.text || section.paragraph;
              return (
                <div
                  key={section._uid}
                  {...storyblokEditable(section)}
                  className={css.section}
                >
                  {renderRich(rich)}
                </div>
              );
            }

            if (comp === "table") {
              const tbl = section.table || section.raster;
              return (
                <div
                  key={section._uid}
                  {...storyblokEditable(section)}
                  className={css.section}
                >
                  {renderWordTable(tbl)}
                </div>
              );
            }

            return null;
          })}

          {bottomblocks.length > 0 && (
            <div className={css.bottom}>
              {bottomblocks.map((nestedBlok) => (
                <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Prices;

