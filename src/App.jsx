import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import "mini.css/dist/mini-default.min.css";
import Chart from "react-apexcharts";
import { css } from "@emotion/react";
import Loader from "react-spinners/PuffLoader";

const override = css`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export class App extends Component {
    constructor(props) {
        super(props);
        this.names = {
            gunluk_vaka: "Günlük vaka",
            gunluk_hasta: "Günlük hasta",
            gunluk_vefat: "Günlük vefat",
            gunluk_test: "Günlük test",
            gunluk_iyilesen: "Günlük iyileşen",
        };
        this.checkboxes = [
            "gunluk_vaka",
            "gunluk_hasta",
            "gunluk_vefat",
            "gunluk_test",
            "gunluk_iyilesen",
        ];

        this.datatoget = localStorage.getItem("datatoget")
            ? localStorage
                  .getItem("datatoget")
                  .split(" ")
                  .reduce(function (a, b) {
                      if (a.indexOf(b) < 0) a.push(b);
                      return a;
                  }, [])
            : [];

        this.state = {
            button: "Grafiği yenile",
            data: [],
            buttonStyle: {},
            options: null,
            showLoader: true,
        };
        this.changeData = async () => {
            const options = {
                stroke: {
                    curve: "smooth",
                    width: 3,
                },
                xaxis: {
                    categories: this.state.data.map((i) => i["tarih"]),
                },
            };
            const series = [];
            for (const j of this.datatoget) {
                series.push({
                    name: this.names[j],
                    data: this.state.data.map(
                        (i) => parseInt(i[j].split(".").join("")) || 0,
                    ),
                });
            }

            await this.setState({
                chart: (
                    <Chart
                        className="chart"
                        options={options}
                        series={series}
                        type="line"
                    ></Chart>
                ),
            });
        };
        this.getFullData = async () => {
            this.setState({ showLoader: true });
            const data = await axios.get(
                "https://kovidbot.herokuapp.com/fulldatakoved/",
            );
            console.log(data["data"]);
            const res = data["data"].reverse();
            this.setState({ data: res });
            this.changeData();
            this.setState({ showLoader: false });
            return res;
        };
        this.handleChange = async (i, checked) => {
            if (checked) {
                this.datatoget = this.datatoget.concat(i);
            } else {
                const temp = this.datatoget;
                temp.splice(temp.indexOf(i), 1);
                this.datatoget = temp;
            }
            await localStorage.clear();
            localStorage.setItem("datatoget", this.datatoget.join(" "));
            console.log(
                localStorage.getItem("datatoget"),
                this.datatoget.join(" "),
            );
            await this.changeData();
        };
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="header col-sm">
                        <a
                            rel="noreferrer"
                            target="_blank"
                            href="https://t.me/kovidbot"
                            className="col-sm"
                        >
                            @kovidbot
                        </a>
                        Türkiye Kovid19 Grafiği
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <button
                            style={this.state.buttonStyle}
                            className="primary large"
                            onClick={async () => {
                                this.setState({
                                    buttonStyle: {
                                        pointerEvents: "none",
                                    },
                                });
                                await this.getFullData();
                                this.setState({
                                    buttonStyle: { pointerEvents: "all" },
                                });
                            }}
                        >
                            {this.state.button}
                        </button>
                    </div>
                    <div className="row">
                        <div className="checkboxes" style={{ margin: "auto" }}>
                            {this.checkboxes.map((i) => {
                                return (
                                    <span className="checkbox" key={i}>
                                        <input
                                            type="checkbox"
                                            id={i}
                                            onChange={(e) => {
                                                this.handleChange(
                                                    i,
                                                    e.target.checked,
                                                );
                                            }}
                                        />
                                        <label htmlFor={i}>
                                            {this.names[i]}
                                        </label>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <br />
                {this.state.chart}
                <Loader
                    className="loading"
                    css={override}
                    loading={this.state.showLoader}
                    color="#008FFB"
                    size={150}
                ></Loader>
            </div>
        );
    }
    async componentDidMount() {
        for (const i of this.datatoget) {
            document.querySelector("#" + i).checked = true;
            console.log(i);
        }
        this.getFullData();
    }
}

export default App;
