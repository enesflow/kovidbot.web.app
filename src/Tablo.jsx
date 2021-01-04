import React, { Component } from "react";
import "./Tablo.css";
import "./All.css";
import "react-bulma-components/dist/react-bulma-components.min.css";

export class Tablo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const dailyData = [
            "Yükleniyor",
            "tarih",
            "gunluk_test",
            "gunluk_vaka",
            "gunluk_hasta",
            "gunluk_vefat",
            "gunluk_iyilesen",
        ];

        const totalData = [
            "Yükleniyor",
            "toplam_test",
            "toplam_vaka",
            "toplam_hasta",
            "toplam_vefat",
            "toplam_iyilesen",
            "agir_hasta_sayisi",
        ];
        return (
            <div>
                <br />
                <h1 className="title has-text-centered">Günlük Tablo</h1>
                <div className="table-parent">
                    <table className="table is-fullwidth is-bordered is-hoverable">
                        <tbody>
                            {Object.keys(
                                this.props.data.slice().reverse()[0],
                            ).map((key) => {
                                if (dailyData.includes(key)) {
                                    return (
                                        <tr key={key}>
                                            <th>
                                                {this.props.names[key] ||
                                                    "Yükleniyor"}
                                            </th>
                                            <td>
                                                {
                                                    this.props.data
                                                        .slice()
                                                        .reverse()[0][key]
                                                }
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
                <br />
                <h1 className="title has-text-centered">Toplam Tablo</h1>
                <div className="table-parent">
                    <table className="table is-fullwidth is-bordered is-hoverable">
                        <tbody>
                            {Object.keys(
                                this.props.data.slice().reverse()[0],
                            ).map((key) => {
                                if (totalData.includes(key)) {
                                    return (
                                        <tr key={key}>
                                            <th>
                                                {this.props.names[key] ||
                                                    "Yükleniyor"}
                                            </th>
                                            <td>
                                                {
                                                    this.props.data
                                                        .slice()
                                                        .reverse()[0][key]
                                                }
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Tablo;
