import { Component } from "react";
import "./Grafik.css";
import "./All.css";

export class Grafik extends Component {
    constructor(props) {
        super(props);
        this.checkboxes = [
            "gunluk_vaka",
            "gunluk_hasta",
            "gunluk_vefat",
            "gunluk_test",
            "gunluk_iyilesen",
        ];
    }
    render() {
        return (
            <div id="grafik">
                <h1 className="title has-text-centered">Grafik</h1>
                <div className="columns ">
                    <div className="checkboxes">
                        {this.checkboxes.map((i) => {
                            return (
                                <span className="checkbox" key={i}>
                                    <input
                                        type="checkbox"
                                        className="switch is-info is-rounded"
                                        id={i}
                                        onChange={(e) => {
                                            this.props.handleChange(
                                                i,
                                                e.target.checked,
                                            );
                                        }}
                                    />
                                    <label htmlFor={i}>
                                        {this.props.names[i]}
                                    </label>
                                </span>
                            );
                        })}
                    </div>
                </div>
                {this.props.Chart}
            </div>
        );
    }
    async componentDidMount() {
        for (const i of this.props.datatoget) {
            document.querySelector("#" + i).checked = true;
        }
    }
}

export default Grafik;
