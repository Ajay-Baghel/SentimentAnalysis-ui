import React, { useState, useEffect, useRef } from "react";
import "./Bargraph.css";
import "./Bubblechart.css";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import Button from "./Buttons/Button";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ChartDataLabels);
ChartJS.register(...registerables);

const Bubblecharts = ({ datapos, dataneg }) => {
    const [option, setOption] = useState('1');
    const [positiveAssessmentArray, setPositiveAssessmentArray] = useState([]);
    const [negativeAssessmentArray, setNegativeAssessmentArray] = useState([]);
    const [mixedAssessmentArray, setMixedAssessmentArray] = useState([]);
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
    return (
        <>
            <div className="chart-container ">
                <div className="content-wrap">
                    {option === '1' && <div className="container">
                        <div className="chart-container">
                            <Bubble
                                data={datapos}
                                options={optionsBubble}
                            />
                        </div>
                        <h2>positives</h2>

                    </div >}
                    {option === '2' && <div className="container">
                        <div className="chart-container">
                            <Bubble
                                data={dataneg}
                                options={optionsBubble}
                            />
                        </div>
                        <h2>Negatives</h2>
                    </div >}
                </div>
            </div>
            <div className="option-wrap">
                <div className='button-wrap'><Button buttonStyle={`${option === '1' ? 'btn--primary--solid' : 'btn--primary--outline'}`} onClick={(e) => setOption('1')}>Show Positives</Button></div>
                <div className='button-wrap'><Button buttonStyle={`${option === '2' ? 'btn--primary--outline' : 'btn--primary--solid'}`} onClick={(e) => setOption('2')}>Show Negatives</Button></div>
            </div>
        </>
    )
}

export default Bubblecharts