import React, { Component } from "react";
import css from "./CourseCard.module.scss";
import { storyblokEditable } from "@storyblok/react";
import { RichTextToHTML } from "../../../functions/storyBlokRichTextRenderer";

export default class CourseCard extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				<div {...storyblokEditable(this.props.blok)} className={css["item"]}>
					<div className={css["header"]}>
						<span className={css["title"]}>{this.props.blok.title}</span>
					</div>
					<div className={css["shortdescription"]}>
						{this.props.blok.tagline}
					</div>
				</div>
				{this.props.blok.bottombloks && this.props.blok.bottombloks.map((nestedBlok) => (
						<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
					))}
			</>
		);
	}
}