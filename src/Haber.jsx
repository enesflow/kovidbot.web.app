import React, { Component } from "react";
import "./Haber.css";
import "./All.css";
//import { Quicklink } from "react-quicklink";

export class Haber extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="haber">
                <h1 className="title has-text-centered">En Yeni Haberler</h1>
                <div className="news-parent">
                    {this.props.news.map((i) => {
                        return (
                            <a
                                className="card"
                                href={i["siteurl"]}
                                target="_blank"
                                data-tooltip={
                                    "Haberin tamamını okumak için habere tıklayın"
                                }
                            >
                                <div className="card-image">
                                    <figure className="image ">
                                        <img
                                            className=""
                                            src={i["thumb_url"]}
                                            alt={i["siteurl"]}
                                        />
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-content">
                                            <p className="title is-4">
                                                {i["title"]}
                                            </p>
                                            <p className='subtitle is-6"'>
                                                {i["description"]}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="content">
                                        {i["content"]}
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Haber;
