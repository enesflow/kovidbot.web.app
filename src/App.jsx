import React, { Component } from "react";
import axios from "axios";
import Tablo from "./Tablo";
import Grafik from "./Grafik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import Chart from "react-apexcharts";
import { Quicklink } from "react-quicklink";

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [{ Yükleniyor: "Lütfen bekleyin" }],
            options: null,
            showLoader: true,
            button: "Yenile",
            buttonStyle: { margin: "auto" },
        };
        this.names = {
            tarih: "Tarih",
            gunluk_vaka: "Günlük vaka",
            gunluk_hasta: "Günlük hasta",
            gunluk_vefat: "Günlük vefat",
            gunluk_test: "Günlük test",
            gunluk_iyilesen: "Günlük iyileşen",
            toplam_test: "Toplam test",
            toplam_hasta: "Toplam hasta",
            toplam_vefat: "Toplam vefat",
            toplam_iyilesen: "Toplam iyileşen",
            toplam_yogun_bakim: "Toplam yoğun bakım",
            toplam_entube: "Toplam entübe",
            hastalarda_zaturre_oran: "Hastalarda zatürre oranı",
            agir_hasta_sayisi: "Ağır hasta sayısı",
            yatak_doluluk_orani: "Yatak doluluk oranı",
            eriskin_yogun_bakim_doluluk_orani:
                "Erişkin yoğun bakım doluluk oranı",
            ventilator_doluluk_orani: "Ventilator doluluk oranı",
            ortalama_filyasyon_suresi: "Ortalama filyasyon süresi",
            ortalama_temasli_tespit_suresi: "Ortalama temaslı tespit süresi",
            filyasyon_orani: "Filyasyon oranı",
        };
        this.datatoget = localStorage.getItem("datatoget")
            ? localStorage
                  .getItem("datatoget")
                  .split(" ")
                  .reduce(function (a, b) {
                      if (a.indexOf(b) < 0) a.push(b);
                      return a;
                  }, [])
            : [];
        this.changeData = async () => {
            const options = {
                stroke: {
                    curve: "smooth",
                    width: 3,
                },
                theme: {
                    palette: "palette1",
                },

                dataLabels: { enabled: false },
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
                        type="area"
                    ></Chart>
                ),
            });
        };
        this.getFullData = async () => {
            this.setState({ showLoader: true });
            const data = await axios.get(
                "https://kovidbot.herokuapp.com/fulldatakoved/",
            );
            const res = data["data"].reverse();
            this.setState({ data: res });
            this.changeData();
            this.setState({ showLoader: false });
            console.log(res.slice().reverse()[0]);
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
            await this.changeData();
        };
    }
    render() {
        return (
            <div>
                <h1 className="title has-text-centered">
                    <Quicklink
                        rel="noreferrer"
                        target="_blank"
                        style={{ marginRight: "10px" }}
                        to="https://t.me/kovidbot"
                        title="@kovidbot"
                        alt="@kovidbot"
                    >
                        @kovidbot
                    </Quicklink>
                    Türkiye Kovid19 Verileri
                </h1>
                <div className="container">
                    <button
                        style={this.state.buttonStyle}
                        className={
                            "button is-info" +
                            (this.state.showLoader ? " is-loading" : "")
                        }
                        onClick={async () => {
                            this.setState({
                                buttonStyle: {
                                    pointerEvents: "none",
                                    margin: "auto",
                                },
                            });
                            await this.getFullData();
                            this.setState({
                                buttonStyle: {
                                    pointerEvents: "all",
                                    margin: "auto",
                                },
                            });
                        }}
                    >
                        <span>
                            <FontAwesomeIcon icon={faSyncAlt} />
                        </span>
                        <span style={{ margin: "auto 5px" }}></span>
                        <span>{this.state.button}</span>
                    </button>
                </div>
                {this.props.grafik ? (
                    <Grafik
                        showLoader={this.state.showLoader}
                        getFullData={this.getFullData}
                        handleChange={this.handleChange}
                        Chart={this.state.chart}
                        datatoget={this.datatoget}
                        names={this.names}
                    />
                ) : (
                    <span></span>
                )}
                {this.props.tablo ? (
                    <Tablo
                        getFullData={this.getFullData}
                        data={this.state.data}
                        names={this.names}
                    />
                ) : (
                    <span></span>
                )}
            </div>
        );
    }
    async componentDidMount() {
        await this.getFullData();
    }
}

export default App;
