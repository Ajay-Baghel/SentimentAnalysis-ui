import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";
import Bubblecharts from "./Bubblecharts";
import Button from "./Buttons/Button";
import "./Bargraph.css";
import { faker } from "@faker-js/faker";
import Papa from "papaparse";
import BubbleChart from "@weknow/react-bubble-chart-d3";
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
  const [option, setOption] = useState("1");

  // refrences for charts
  const chartRefBar = useRef(null);
  const chartRefBubblePos = useRef(null);
  const chartRefBubbleNeg = useRef(null);
  const Bubbleref = useRef(null);
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
  const [bubbleData, setBubbleData] = useState([]);

  // states for response of fetch
  const [resString, setResString] = useState("");
  const [parsedCsv, setParsedCsv] = useState({});

  const [res, setRes] = useState();

  const colors = [
    "rgba(255, 26, 104, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(114, 187, 222, 0.8)",
    "rgba(181, 134, 217, 0.8)",
    "rgba(242, 129, 59, 0.8)",
    "rgba(237, 46, 76, 0.8)",
  ];

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          "rgba(255, 26, 104, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
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
        backgroundColor: "rgba(255, 26, 104, 0.7)",
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
    console.log("updatechart() called");
    var positive = positiveData.length,
      negative = negativeData.length,
      neutral = neutralData.length;
    console.log("pos len ", positive);
    var array = [];
    array.push(positive);
    array.push(negative);
    array.push(neutral);
    let barChart = chartRefBar.current;
    barChart.data.datasets[0].data = array;
    barChart.update();
    console.log(barChart);
    let bubbleChart = Bubbleref.current;
    console.log(bubbleChart);
    bubbleChart.props.data.map((obj, index) => ({
      ...obj,
      label: positiveArray[index],
      value: positiveArray[index],
      color: "#bc9172",
    }));
    console.log("bubble again ", bubbleChart.props.data);
    //bubbleChart.update();
  }
  const loadData = () => {
    if (!isFilePicked) {
      alert("Please select a file first");
    } else {
      const extension = selectedFile.type;
      if (extension.toLowerCase() !== "text/csv") {
        alert("Only csv files are allowed.");
      } else {
        console.log("parsing");
        Papa.parse(document.getElementById("uploadfile").files[0], {
          header: true,
          complete: function (result) {
            console.log("result is ", result);
            const sentimentdata = [];
            const positivedata = [];
            const negativedata = [];
            const neutraldata = [];
            const res = [[], [], []];
            const targetbubble = [];
            const positivehashmap = new Map();
            const negativehashmap = new Map();
            const mixedhashmap = new Map();
            const bubbledata = [];
            result.data.map((ele) => {
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
            positivearray.map((value, index) => {
              bubbledata.push({
                label: positiveassesementarray[index],
                value: value,
                color: colors[Math.floor((Math.random() * 7) + 0)],
              });
            });
            setBubbleData(bubbledata);
          },
        });
      }
    }
  };
  //   const PlotGraph = async function () {
  //     if (!isFilePicked) {
  //       alert("No file is picked!");
  //     } else {
  //       const extension = selectedFile.type;
  //       var url;
  //       if (extension === "text/plain") {
  //         url =
  //           "https://omms-interns-sa.azurewebsites.net/fileHandle/sendFile/txt";
  //       } else if (extension === "text/csv") {
  //         url =
  //           "https://omms-interns-sa.azurewebsites.net/fileHandle/sendFile/csv";
  //       } else {
  //         throw alert("File type is not valid");
  //       }
  //       const formData = new FormData();
  //       formData.append("file", selectedFile);
  //       const response = await fetch(url, {
  //         method: "POST",
  //         body: formData,
  //         // mode: "no-cors",
  //       });
  //       console.log("reached here");
  //       const reader = response.body.getReader();
  //       const response1 = new ReadableStream({
  //         start(controller) {
  //           return pump();
  //           function pump() {
  //             return reader.read().then(({ done, value }) => {
  //               // When no more data needs to be consumed, close the stream
  //               if (done) {
  //                 controller.close();
  //                 return;
  //               }
  //               // Enqueue the next data chunk into our target stream
  //               controller.enqueue(value);
  //               return pump();
  //             });
  //           }
  //         },
  //       });
  //       const stream = await Response(response1);
  //       const response2 = await stream.text();
  //       const response3 = () => {
  //         var csvString = Papa.parse(response2);
  //         return csvString;
  //       };
  //       setResString(response3);
  //     }
  //   };
  const handleSubmission = () => {
    if (!isFilePicked) {
      alert("No file is picked!");
    } else {
      const extension = selectedFile.type;
      var url;
      if (extension === "text/plain") {
        url =
          "https://omms-interns-sa.azurewebsites.net/fileHandle/sendFile/txt";
      } else if (extension === "text/csv") {
        url =
          "https://omms-interns-sa.azurewebsites.net/fileHandle/sendFile/csv";
      } else {
        throw alert("File type is not valid");
      }
      const formData = new FormData();
      formData.append("file", selectedFile);
      fetch(url, {
        method: "POST",
        body: formData,
        // mode: "no-cors",
      })
        .then((response) => {
          const reader = response.body.getReader();
          return new ReadableStream({
            start(controller) {
              return pump();
              function pump() {
                return reader.read().then(({ done, value }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            },
          });
        })
        .then((stream) => new Response(stream))
        // Create an object URL for the response
        .then((response) => response.text())
        .then((response) => {
          console.log("res is ", response);
          return response;
        })
        .then((response) => {
          setResString(response);
          return response;
        })
        .then((response) => {
          console.log("res is, ", response);
          // var newres = response.substring(0, response.length - 1);
          var CsvString = Papa.parse(response, { header: true });
          setParsedCsv(CsvString);
          console.log("CsvString is ", CsvString);
          return CsvString;
        })
        .then((CsvString) => {
          const sentimentdata = [];
          const positivedata = [];
          const negativedata = [];
          const neutraldata = [];
          const res = [[], [], []];
          const targetbubble = [];
          const positivehashmap = new Map();
          const negativehashmap = new Map();
          const mixedhashmap = new Map();
          const bubbledata = [];
          CsvString.data.map((ele) => {
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
                ? mixedhashmap.set(ele.target, mixedhashmap.get(ele.target) + 1)
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
          positivearray.map((value, index) => {
            bubbledata.push({
              label: positiveassesementarray[index],
              value: value,
              color: colors[0],
            });
          });
          setBubbleData(bubbledata);
        })
        // .then((blob) => URL.createObjectURL(blob))
        // // Update image
        // .then((url) => console.log("url is ,", url))
        .catch((err) => console.error(err));
    }
  };
  return (
    <div className="hero-container">
      <h1>Sentiment Analysis</h1>
      {resString === "" ? null : resString}
      <p>
        Get detailed insights about what your customers say about your product.
      </p>
      <p>Upload a .csv or .txt file with the reviews to get started.</p>
      <div className="upload-container">
        <input
          type="file"
          className="upload-box"
          id="uploadfile"
          //accept=".csv"
          onChange={changeHandler}
        //onClick={loadData}
        />
        <div className="hero-btn">
          <Button onClick={loadData}>Submit</Button>
          <Button onClick={updateChart}>Visualize</Button>
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
                datalabels: false,
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
      </div>
      {/* Bar chart ends here */}
      <h2>Sentiment wise assessment of targets</h2>

      {/* Bubble chart starts here */}

      <Bubblecharts dataneg={dataBubbleNeg} datapos={bubbleData} />
      {/* <BubbleChart
        graph={{
          zoom: 1,
        }}
        ref={Bubbleref}
        width={800}
        height={1300}
        padding={5} // optional value, number that set the padding between bubbles
        showLegend={false} // optional value, pass false to disable the legend.
        //Custom bubble/legend click functions such as searching using the label, redirecting to other page
        // bubbleClickFunc={bubbleClick()}
        //legendClickFun={legendClick()}
        // data={[
        //   { label: "Kidney beans", value: 62.14, color: "#853238" },
        //   { label: "Ground beef", value: 57.49, color: "#bc9172" },
        //   { label: "Rice", value: 56.46, color: "#d9d2c5" },
        //   { label: "Capsicum", value: 44.48, color: "#aa5315" },
        //   { label: "Cream", value: 40.0, color: "#d7dbe2" },
        //   { label: "Olive oil", value: 38.49, color: "#dad95e" },
        //   { label: "Tomato paste", value: 33.02, color: "#b52323" },
        //   { label: "Tomato puree", value: 32.71, color: "#952a21" },
        //   { label: "Onion paste", value: 31.41, color: "#d9cda4" },
        //   { label: "Soy sauce", value: 31.07, color: "#1c1412" },
        //   { label: "Glucose", value: 20.8, color: "#e2dfe1" },
        //   { label: "Nutritional yeast", value: 19.57, color: "#c5b56d" },
        //   { label: "Lemon juice", value: 19.04, color: "#dad4bd" },
        //   { label: "Salt", value: 17.1, color: "#e5e6e5" },
        //   { label: "Shallots", value: 16.26, color: "#efcbbe" },
        //   { label: "Coriander leaves", value: 12.81, color: "#379218" },
        //   { label: "Cumin", value: 12.81, color: "#ba8f4e" },
        //   { label: "Coriander seed", value: 12.6, color: "#ad8e67" },
        //   { label: "Garlic powder", value: 12.39, color: "#d9c3a6" },
        //   { label: "Paprika", value: 12.16, color: "#c03123" },
        //   { label: "Fresh garlic", value: 11.93, color: "#e6e1bc" },
        //   { label: "Chili powder", value: 10.32, color: "#b12e2f" },
        //   { label: "Pepper", value: 8.14, color: "#72523f" },
        //   { label: "Celery seed", value: 8.09, color: "#a18d4c" },
        //   { label: "Cinnamon", value: 7.83, color: "#a85b2f" },
        //   { label: "Marjoram", value: 7.72, color: "#6e6e51" },
        // ]}
        data={bubbleData}
      /> */}
      {/* Bubble chart ends here */}
    </div >
  );
};

export default HeroSection;
