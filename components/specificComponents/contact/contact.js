import React, { Component } from "react";
import css from "./contact.module.scss";
import Headermenu from "../../genericComponents/Headermenu/Headermenu";
import Hero from "../../genericComponents/Hero/Hero";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react";
import { RichTextToHTML } from "../../../functions/storyBlokRichTextRenderer";

export default class Contact extends Component {
  render() {
    const blok = this.props.blok;

    return (
      <div {...storyblokEditable(blok)} className={css["contact-page"]}>
        
        {/* Menu en logo */}
        <Headermenu blok={this.props.menu.content} />

        <main>
          {/* Hero banner */}
          <Hero blok={this.props.blok} contentTypeTag="contact" />

          {/* Tekst links, foto rechts */}
          <div className={css["contact-page__main-content"]}>
            
            {/* Tekst */}
            <div className={css["contact-page__text"]}>
              {blok.name && <h1>{blok.name}</h1>}
              {blok.experience && (
                <p>{blok.experience}</p>
              )}
              {blok.email && <p><strong>Email:</strong> {blok.email}</p>}
              {blok.phone_number && <p><strong>Phone:</strong> {blok.phone_number}</p>}
            </div>

            {/* Foto */}
            {blok.image && (
              <div className={css["contact-page__image"]}>
                <img src={blok.image.filename} alt={blok.name} />
              </div>
            )}
          </div>

          {/* Bottomblocks / Justawk integratie */}
          {blok.bottomblocks && blok.bottomblocks.map((nestedBlok) => (
            <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </main>

      </div>
    );
  }
}