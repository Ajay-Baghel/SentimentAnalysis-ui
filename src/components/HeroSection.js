import React, { useState, useEffect, useRef } from "react";
import './HeroSection.css'
import Bubblecharts from './Bubblecharts'
import Button from './Buttons/Button'
import "./Bargraph.css";
import { faker } from "@faker-js/faker";
import Papa from "papaparse";
import { Bar, Bubble } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
ChartJS.register(ChartDataLabels);

const HeroSection = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };
    const [option, setOption] = useState('1');

    // refrences for charts
    const chartRefBar = useRef(null);
    const chartRefBubblePos = useRef(null);
    const chartRefBubbleNeg = useRef(null);

    // states for bar chart    
    const [positiveData, setpositiveData] = useState([]);
    const [negativeData, setnegativeData] = useState([]);
    const [neutralData, setneutralData] = useState([]);

    // states for bubble chart
    const [positiveHashMap, setPositiveHashMap] = useState(new Map());
    const [negativeHashMap, setNegativeHashMap] = useState(new Map());
    const [mixedHashMap, setMixedHashMap] = useState(new Map());
    const [outputUrl, setOutputUrl] = useState("");
    const [positiveArray, setPositiveArray] = useState([]);
    const [negativeArray, setNegativeArray] = useState([]);
    const [sentimentData, setsentimentData] = useState([]);
    const [positiveAssessmentArray, setPositiveAssessmentArray] = useState([]);
    const [negativeAssessmentArray, setNegativeAssessmentArray] = useState([]);
    const [mixedAssessmentArray, setMixedAssessmentArray] = useState([]);
    const [targetBubble, setTargetBubble] = useState([]);
    const [mixedArray, setMixedArray] = useState([]);

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
    const optionsBubble = {
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            datalabels: {
                font: {
                    size: "10px",
                    weight: "600",
                },
                formatter: (value, context) => {
                    const textArray = value.company.replace(" ", "\n");
                    return textArray.toString();
                },
                color: "black",
            },
            tooltip: {
                callbacks: {
                    afterBody: function (context) {
                        //
                        if (context[0].label === "Positive")
                            return positiveAssessmentArray[context[0].dataIndex];
                        else if (context[0].label === "Negative")
                            return negativeAssessmentArray[context[0].dataIndex];
                        else return mixedAssessmentArray[context[0].dataIndex];
                    },
                },
            },
        },
    };
    const dataBubblePos = {
        datasets: [
            {
                label: "Positive",
                data: Array.from({ length: positiveArray.length }, (value, key) => ({
                    x: faker.datatype.number({ min: 0, max: 300 }),
                    y: faker.datatype.number({ min: 0, max: 300 }),
                    r: positiveArray[key] * 30,
                    company: positiveAssessmentArray[key],
                })),
                backgroundColor: "rgba(68, 235, 27, 0.5)",
            },
        ],
    };
    const dataBubbleNeg = {
        datasets: [
            {
                label: "Negative",
                data: Array.from({ length: negativeArray.length }, (value, key) => ({
                    x: faker.datatype.number({ min: 0, max: 500 }),
                    y: faker.datatype.number({ min: 0, max: 500 }),
                    r: negativeArray[key] * 25,
                    company: negativeAssessmentArray[key],
                })),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
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
        if (!isFilePicked) {
            alert("Please select a file first");
        } else {
            const extension = selectedFile.type;
            if (extension.toLowerCase() !== "text/csv") {
                alert("Only csv files are allowed.");
            } else {
                Papa.parse("https://raw.githubusercontent.com/Ajay-Baghel/assets/main/WedJun2211-40-01GMT2022OutputFile.CSV", {
                    download: true,
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) {
                        const sentimentdata = [];
                        const positivedata = [];
                        const negativedata = [];
                        const neutraldata = [];
                        const res = [[], [], []];
                        const targetbubble = [];
                        const positivehashmap = new Map();
                        const negativehashmap = new Map();
                        const mixedhashmap = new Map();
                        results.data.map((ele) => {
                            sentimentdata.push(ele.sentiment);
                            targetbubble.push(ele.target);
                            if (ele.sentiment == "positive") {
                                res[0].push(ele.assessment + " " + ele.target);
                                positivedata.push(ele.positive);
                                positivehashmap.has(ele.target)
                                    ? positivehashmap.set(
                                        ele.target,
                                        positivehashmap.get(ele.target) + 1
                                    )
                                    : positivehashmap.set(ele.target, 1);
                            } else if (ele.sentiment == "negative") {
                                res[1].push(ele.assessment + " " + ele.target);
                                negativedata.push(ele.negative);
                                negativehashmap.has(ele.target)
                                    ? negativehashmap.set(
                                        ele.target,
                                        negativehashmap.get(ele.target) + 1
                                    )
                                    : negativehashmap.set(ele.target, 1);
                            } else if (ele.sentiment == "mixed") {
                                res[2].push(ele.assessment + " " + ele.target);
                                neutraldata.push(ele.neutral);
                                mixedhashmap.has(ele.target)
                                    ? mixedhashmap.set(
                                        ele.target,
                                        mixedhashmap.get(ele.target) + 1
                                    )
                                    : mixedhashmap.set(ele.target, 1);
                            }
                        });
                        const positivearray = Array.from(positivehashmap.values());
                        const negativearray = Array.from(negativehashmap.values());
                        const mixedarray = Array.from(mixedhashmap.values());
                        const positiveassesementarray = Array.from(positivehashmap.keys());
                        const negativeassesementarray = Array.from(negativehashmap.keys());
                        const mixedassessmentarray = Array.from(mixedhashmap.keys());
                        setTargetBubble(targetbubble);
                        setPositiveArray(positivearray);
                        setNegativeArray(negativearray);
                        setMixedArray(mixedarray);
                        setPositiveAssessmentArray(positiveassesementarray);
                        setNegativeAssessmentArray(negativeassesementarray);
                        setMixedAssessmentArray(mixedassessmentarray);
                        setRes(res);
                        setPositiveHashMap(positivehashmap);
                        setNegativeHashMap(negativehashmap);
                        setMixedHashMap(mixedhashmap);
                        setsentimentData(sentimentdata);
                        setpositiveData(positivedata);
                        setnegativeData(negativedata);
                        setneutralData(neutraldata);
                    },
                });
            }
        }
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
            </div>
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

            {/* Bubble chart starts here */}
            {/* <div className="content-wrap">
                {option === '1' && <div className="container">
                    <div className="chart-container">
                        <Bubble
                            ref={chartRefBubblePos}
                            data={dataBubblePos}
                            width="60px"
                            height="60px"
                            options={optionsBubble}
                        />
                    </div>
                    <h2>positives</h2>

                </div >}
                {option === '2' && <div className="container">
                    <div className="chart-container">
                        <Bubble
                            ref={chartRefBubbleNeg}
                            data={dataBubbleNeg}
                            width="60px"
                            height="60px"
                            options={optionsBubble}
                        />
                    </div>
                    <h2>Negatives</h2>
                </div >}
            </div>
            <div className="option-wrap">
                <div className='button-wrap'><Button buttonStyle={`${option === '1' ? 'btn--primary--solid' : 'btn--primary--outline'}`} onClick={(e) => setOption('1')}>Show Positives</Button></div>
                <div className='button-wrap'><Button buttonStyle={`${option === '2' ? 'btn--primary--outline' : 'btn--primary--solid'}`} onClick={(e) => setOption('2')}>Show Negatives</Button></div>
            </div> */}
            <Bubblecharts dataneg={dataBubbleNeg} datapos={dataBubblePos} />

            {/* Bubble chart ends here */}



        </div>
    )
}

export default HeroSection