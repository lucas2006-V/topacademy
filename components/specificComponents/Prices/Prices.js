import React from "react";
import {
  storyblokEditable,
  renderRichText,
  StoryblokComponent,
} from "@storyblok/react";

import css from "./Prices.module.scss";
import Headermenu from "../../genericComponents/Headermenu/Headermenu";

const LOCATION_BASE_PATH = "/locations/"; // pas aan indien jouw URL-structuur anders is

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

  const toLabelFromString = (value) =>
    String(value)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const toHrefFromString = (value) => {
    const v = String(value);
    if (v.startsWith("/")) return v;
    return `${LOCATION_BASE_PATH}${v}`;
  };

  // ✅ werkt voor multi-options als strings OF objects (datasource/object mode)
  const normalizeLocation = (loc) => {
    if (!loc) return null;

    // string: "kontich"
    if (typeof loc === "string") {
      return {
        key: loc,
        label: toLabelFromString(loc),
        href: toHrefFromString(loc),
      };
    }

    // object: { name: "Kontich", value: "kontich" } of varianten
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

  // ✅ Multi-options (géén references)
  const locations = Array.isArray(blok?.locations) ? blok.locations : [];

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

          {/* ✅ ONDERAAN + GECENTREERD: locations (multi-options) */}
          {locations.length > 0 && (
            <section className={css.locationsBottom}>
              <h2 className={css.locationsTitle}>Locations</h2>

              <ul className={css.locationsList}>
                {locations
                  .map(normalizeLocation)
                  .filter(Boolean)
                  .map((loc) => (
                    <li key={loc.key} className={css.locationsItem}>
                      <a className={css.locationsLink} href={loc.href}>
                        {loc.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Prices;
