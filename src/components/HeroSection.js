import React, { useState, useEffect, useRef } from "react";
import './HeroSection.css'
import Bubblecharts from './Bubblecharts'
import Button from './Buttons/Button'
import "./Bargraph.css";
import Papa from "papaparse";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);


const HeroSection = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };
    const chartRefBar = useRef(null);
    const [sentimentData, setsentimentData] = useState([]);
    const [positiveData, setpositiveData] = useState([]);
    const [negativeData, setnegativeData] = useState([]);
    const [neutralData, setneutralData] = useState([]);
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
                ],
                borderColor: [
                    "rgba(255, 26, 104, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    function updateChart() {
        console.log("updatechart() called")
        var positive = positiveData.length,
            negative = negativeData.length,
            neutral = neutralData.length;
        var array = [];
        array.push(positive);
        array.push(negative);
        array.push(neutral);
        let barChart = chartRefBar.current;
        barChart.data.datasets[0].data = array;
        barChart.update();
        console.log(barChart)
    }
    const loadData = () => {
        Papa.parse("https://raw.githubusercontent.com/Ajay-Baghel/assets/main/WedJun2211-40-01GMT2022OutputFile.CSV",
            {
                download: true,
                header: true,
                skipEmptyLines: true,
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
                    let positive = positiveData.length,
                        negative = negativeData.length,
                        neutral = neutralData.length;
                    let array = [];
                    console.log(array);
                    array.push(positive);
                    array.push(negative);
                    array.push(neutral);
                    let barChart = chartRefBar.current;
                    barChart.data.datasets[0].data = array;
                    barChart.update();
                    console.log(barChart)
                },
            }
        )

    };

    return (
        <div className="hero-container">
            <h1>Sentiment Analysis</h1>
            <p>Get detailed insights about what your customers say about your product.</p>
            <p>Upload a .csv or .txt file with the reviews to get started.</p>
            <div className='upload-container'>
                <input
                    type="file"
                    className='upload-box'
                    id="uploadfile"
                    accept=".csv"
                    onChange={changeHandler}
                    onClick={loadData}
                />
                <div className='hero-btn'>
                    <Button onClick={() => { updateChart() }}>Visualize</Button>
                </div>
                <h2>Overall Sentiment of reviews</h2>

                {/* Bar chart starts here */}
                <div className="container">
                    <div className="chart-container">
                        <Bar
                            data={data}
                            ref={chartRefBar}
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
                {/* Bar chart ends here */}
                <h2>Sentiment wise assessment of targets</h2>
                <Bubblecharts />
            </div>


        </div>
    )
}

export default HeroSection