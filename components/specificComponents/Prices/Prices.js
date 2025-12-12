import React from "react";
import {
  storyblokEditable,
  renderRichText,
  StoryblokComponent,
} from "@storyblok/react";

import Headermenu from "../../genericComponents/Headermenu/Headermenu"; // pas aan als je pad anders is

const Prices = ({ blok, menu }) => {
  /* ---------- helpers ---------- */

  const renderRich = (rich) => {
    if (!rich) return null;
    return (
      <div
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
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                {(row || []).map((cell, cIdx) => (
                  <td
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      border: "1px solid #000",
                      minHeight: "34px",
                      padding: "6px 10px",
                      verticalAlign: "top",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
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
    <div {...storyblokEditable(blok)}>
      {/* ✅ Headermenu zoals bij Contact */}
      <Headermenu blok={menu?.content} />

      <main>
        {/* Word-achtige pagina container */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {/* Titel + intro */}
          {blok?.title && (
            <h1 style={{ marginBottom: "12px" }}>{blok.title}</h1>
          )}
          {blok?.intro_text && (
            <p style={{ marginBottom: "16px" }}>{blok.intro_text}</p>
          )}

          {/* Sections */}
          {sections.map((section) => {
            const comp = section?.component;

            if (comp === "paragraph") {
              const rich = section.text || section.paragraph;
              return (
                <div
                  key={section._uid}
                  {...storyblokEditable(section)}
                  style={{ margin: "18px 0" }}
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
                  style={{ margin: "24px 0" }}
                >
                  {renderWordTable(tbl)}
                </div>
              );
            }

            return null;
          })}

          {/* Bottomblocks onder alles */}
          {bottomblocks.length > 0 && (
            <div style={{ marginTop: "40px" }}>
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
