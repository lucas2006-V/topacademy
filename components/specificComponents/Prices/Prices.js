import React from "react";
import {
  storyblokEditable,
  renderRichText,
  StoryblokComponent,
} from "@storyblok/react";

import css from "./Prices.module.scss";
import Headermenu from "../../genericComponents/Headermenu/Headermenu";

const LOCATION_BASE_PATH = "/locations/";

const Prices = ({ blok, menu }) => {
  /* ---------- helpers ---------- */

  const renderRich = (rich) => {
    if (!rich) return null;
    return (
      <div
        className={css.paragraph}
        dangerouslySetInnerHTML={{ __html: renderRichText(rich) }}
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

 
  const toCssColor = (cc) => {
    switch (cc) {
      case "blue":
        return "#0b3bff";
      case "red":
        return "#ff2b2b";
      case "green":
        return "#16a34a";
      case "black":
        return "#111827";
      case "purple":
        return "#7c3aed";
      default:
        return "#0b3bff";
    }
  };


  const toLabelFromString = (value) =>
    String(value)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const toHrefFromString = (value) => {
    const v = String(value);
    if (v.startsWith("/")) return v;
    return `${LOCATION_BASE_PATH}${v}`;
  };

  const normalizeLocation = (loc) => {
    if (!loc) return null;

   
    if (typeof loc === "string") {
      return {
        key: loc,
        label: toLabelFromString(loc),
        href: toHrefFromString(loc),
      };
    }

  
    if (typeof loc === "object") {
      const value =
        loc.value ??
        loc.slug ??
        loc.full_slug ??
        loc.uuid ??
        loc.id ??
        loc.name;

      const label =
        loc.name ?? loc.label ?? (value ? toLabelFromString(value) : "Location");

     
      const href = loc.full_slug
        ? `/${String(loc.full_slug).replace(/^\/+/, "")}`
        : value
        ? toHrefFromString(value)
        : "#";

      const key = loc.uuid ?? loc.id ?? value ?? label;

      return { key, label, href };
    }

    return null;
  };

  /* ---------- data ---------- */

  const sections = Array.isArray(blok?.sections) ? blok.sections : [];
  const bottomblocks = Array.isArray(blok?.bottomblocks)
    ? blok.bottomblocks
    : [];

  const locations = Array.isArray(blok?.locations) ? blok.locations : [];
  const accent = toCssColor(blok?.colorcode);

  /* ---------- render ---------- */

  return (
    <div
      {...storyblokEditable(blok)}
      className={css.prices}
      style={{ "--accent": accent }}
    >
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

          {locations.length > 0 && (
            <section className={css.locationsConnected}>
              <h2 className={css.locationsHeading}>LOCATIONS</h2>

              <div className={css.locationsItems}>
                {locations
                  .map(normalizeLocation)
                  .filter(Boolean)
                  .map((l) => (
                    <a
                      key={l.key}
                      href={l.href}
                      className={css.locationLink}
                      aria-label={`Go to ${l.label}`}
                    >
                      {l.label}
                    </a>
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Prices;


