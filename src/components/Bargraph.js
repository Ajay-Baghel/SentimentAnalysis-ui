import React, { useState, useEffect, useRef } from "react";
import "./Bargraph.css";
import Papa from "papaparse";
import { Chart } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

function Bargraph() {
    const chartRefBar = useRef(null);
    const chartRefPie = useRef(null);
    const [sentimentData, setsentimentData] = useState([]);
    const [positiveData, setpositiveData] = useState([]);
    const [negativeData, setnegativeData] = useState([]);
    const [neutralData, setneutralData] = useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [res, setRes] = useState();

    const data = {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
            {
                label: "",
                data: [],
                backgroundColor: [
                    "rgba(255, 26, 104, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    // "rgba(75, 192, 192, 0.2)",
                    // "rgba(153, 102, 255, 0.2)",
                    // "rgba(255, 159, 64, 0.2)",
                    // "rgba(0, 0, 0, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 26, 104, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    // "rgba(75, 192, 192, 1)",
                    // "rgba(153, 102, 255, 1)",
                    // "rgba(255, 159, 64, 1)",
                    // "rgba(0, 0, 0, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    function updateChart() {
        var positive = positiveData.length,
            negative = negativeData.length,
            neutral = neutralData.length;
        var array = [];
        // for (let i = 0; i < positiveData.length; i++) {
        //   if (positiveData[i] == 1) positive++;
        //   if (negativeData[i] == 1) negative++;
        //   if (neutralData[i] == 1) neutral++;
        // }
        console.log(positive);
        console.log(negative);
        console.log(neutral);
        array.push(positive);
        array.push(negative);
        array.push(neutral);
        let barChart = chartRefBar.current;
        let pieChart = chartRefPie.current;
        //barChart.data.datasets[0].label = "Reviews";
        barChart.data.datasets[0].data = array;
        pieChart.data.datasets[0].data = array;
        barChart.update();
        pieChart.update();
    }
    const loadData = () => {
        if (!isFilePicked) {
            alert("Please select a file first");
        } else {
            Papa.parse(
                "https://storagetextanalysis.blob.core.windows.net/output-container//home/output/TueJun2107-25-06GMT2022OutputFile.csv",
                {
                    download: true,
                    complete: function (results) {
                        console.log("results is : ", results);
                        const sentimentdata = [];
                        const positivedata = [];
                        const negativedata = [];
                        const neutraldata = [];
                        const res = [[], [], []];
                        results.data.map((ele) => {
                            sentimentdata.push(ele.sentiment);
                            if (ele.sentiment === "positive") {
                                positivedata.push(ele.positive);
                                res[0].push(ele.assessment + " " + ele.target);
                            }
                            if (ele.sentiment === "negative") {
                                negativedata.push(ele.negative);
                                res[1].push(ele.assessment + " " + ele.target);
                            }
                            if (ele.sentiment === "mixed") {
                                neutraldata.push(ele.neutral);
                                res[2].push(ele.assessment + " " + ele.target);
                            }
                        });
                        console.log("sentiment data : ", sentimentdata);
                        setRes(res);
                        setsentimentData(sentimentdata);
                        setpositiveData(positivedata);
                        setnegativeData(negativedata);
                        setneutralData(neutraldata);
                    },
                }
            );
        }
    };
    return (
        <>
            <div className="container">
                <div className="chart-container">
                    <Chart
                        ref={chartRefBar}
                        type="bar"
                        data={data}
                        height="600px"
                        width="800px"
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    callbacks: {
                                        afterBody: function (context) {
                                            return res[context[0].dataIndex];
                                        },
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
            </div >
        </>
    )
}

export default Bargraph