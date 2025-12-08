import React, { Component } from "react";
import { storyblokEditable } from "@storyblok/react";

export default class contact extends Component {

    render() {
        const blok = this.props.blok;

        return (
            <div {...storyblokEditable(blok)} className="contact-page">

                {/* Naam of titel */}
                {blok.name && (
                    <h1>{blok.name}</h1>
                )}

                {/* Beschrijving (experience veld dat jij al hebt) */}
                {blok.experience && (
                    <p>{blok.experience}</p>
                )}

                {/* Email */}
                {blok.email && (
                    <p><strong>Email:</strong> {blok.email}</p>
                )}

                {/* Telefoon */}
                {blok.phone_number && (
                    <p><strong>Phone:</strong> {blok.phone_number}</p>
                )}

            </div>
        );
    }
}
