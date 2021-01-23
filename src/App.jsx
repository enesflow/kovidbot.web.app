import React, { Component } from "react";
import axios from "axios";
import Loader from "react-spinners/PuffLoader";
import Tablo from "./Tablo";
import Grafik from "./Grafik";
import Haber from "./Haber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import "react-bulma-components/dist/react-bulma-components.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import "bulma-tooltip/dist/css/bulma-tooltip.min.css";
import Chart from "react-apexcharts";
//import { Quicklink } from "react-quicklink";
import { css } from "@emotion/react";

export class App extends Component {
    constructor(props) {
        super(props);
        const url = "http://localhost:8001" ?? "https://kovidbot.herokuapp.com";

        this.totalTasks = 2;

        this.state = {
            data: [{ Yükleniyor: "Lütfen bekleyin" }],
            options: null,
            tasks: 0,
            button: "Yenile",
            buttonStyle: { margin: "auto" },
            news: [],
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
            await console.log("Full data ");
            const data = await axios.get(url + "/fulldatakoved/");
            const res = data["data"].reverse();
            this.setState({ data: res });
            this.changeData();
            this.setState({ tasks: this.state.tasks + 1 });
        };
        this.getNews = async () => {
            await console.log("News ");
            const data = await axios.get(url + "/getnewskoved/");
            this.setState({ news: data["data"] });
            this.setState({ tasks: this.state.tasks + 1 });
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
        this.refresh = async () => {
            this.setState({ tasks: 0 });
            this.getFullData();
            this.getNews();
        };
    }
    render() {
        const override = css`
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        return (
            <div>
                <nav
                    class="navbar is-fixed-top"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div class="navbar-brand">
                        <a class="navbar-item" href={window.location.href}>
                            <img
                                src="https://raw.githubusercontent.com/EnxGitHub/kovidbot/main/kovidbot.svg"
                                width="64"
                            />
                            <strong>Kovidbot</strong>
                        </a>

                        <a
                            role="button"
                            class="navbar-burger"
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample"
                        >
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu">
                        <div class="navbar-start">
                            <a class="navbar-item" href="#grafik">
                                Grafik
                            </a>
                            <a class="navbar-item" href="#tablo">
                                Tablo
                            </a>
                            <a class="navbar-item" href="#haber">
                                En yeni haberler
                            </a>
                        </div>

                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-primary" href="#about">
                                        Daha fazla bilgi
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <h1
                    style={{ marginTop: "10vh" }}
                    className="title has-text-centered"
                >
                    <a
                        rel="noreferrer"
                        target="_blank"
                        style={{ marginRight: "10px" }}
                        href="https://t.me/kovidbot"
                        title="@kovidbot"
                        alt="@kovidbot"
                    >
                        @kovidbot
                    </a>
                    Türkiye Kovid19 Verileri
                </h1>
                <div className="container">
                    <button
                        style={this.state.buttonStyle}
                        className={
                            "button is-info" +
                            (this.state.tasks !== this.totalTasks
                                ? " is-loading"
                                : "")
                        }
                        onClick={async () => {
                            this.setState({
                                buttonStyle: {
                                    pointerEvents: "none",
                                    margin: "auto",
                                },
                            });
                            await this.refresh();
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
                <br />
                {this.props.grafik ? (
                    <Grafik
                        id="grafik"
                        showLoader={this.state.tasks !== this.totalTasks}
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
                <Haber news={this.state.news} />
                <Loader
                    className="loading"
                    css={override}
                    loading={this.state.tasks !== this.totalTasks}
                    color="#008FFB"
                    size={150}
                ></Loader>
                <div id="about"></div>
                <footer>
                    <p>&copy; Copyright {new Date().getFullYear()}</p>
                </footer>
            </div>
        );
    }
    async componentDidMount() {
        this.refresh();
    }
}

export default App;
