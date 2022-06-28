import React, { useState, useEffect, useRef } from "react";
import "./Bargraph.css";
import "./Bubblechart.css";
import { Bubble } from "react-chartjs-2";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import { Chart as ChartJS, registerables } from "chart.js";
import Button from "./Buttons/Button";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useScreenSize from "use-screen-size";

ChartJS.register(ChartDataLabels);
ChartJS.register(...registerables);

const Bubblecharts = ({ datapos, dataneg }) => {
    const [option, setOption] = useState('1');
    const size = useScreenSize();
    return (
        <>
            <div className="content-wrap">
                {option === '1' && <div className="container">
                    <div className="chart-containerb">
                        <BubbleChart
                            graph={{
                                zoom: 0.9,
                            }}
                            // ref={Bubbleref}
                            width={800}
                            height={800}
                            padding={5} // optional value, number that set the padding between bubbles
                            showLegend={false} // optional value, pass false to disable the legend.
                            data={datapos}
                            overflow={false}
                        />
                    </div>
                    <h2>positives</h2>

                </div >}
                {option === '2' && <div className="container">
                    <div className="chart-container">
                        Hello
                    </div>
                    <h2>Negatives</h2>
                </div >}
            </div>
            <div className="option-wrap">
                <div className='button-wrap'><Button buttonStyle={`${option === '1' ? 'btn--primary--solid' : 'btn--primary--outline'}`} onClick={(e) => setOption('1')}>Show Positives</Button></div>
                <div className='button-wrap'><Button buttonStyle={`${option === '2' ? 'btn--primary--outline' : 'btn--primary--solid'}`} onClick={(e) => setOption('2')}>Show Negatives</Button></div>
            </div>
        </>
    )
}

export default Bubblecharts