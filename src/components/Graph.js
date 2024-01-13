import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import FormSelect from 'react-bootstrap/FormSelect';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  general: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '< threshold',
          color: '#000',
          font: {
            size: 20,
          }
        },
        ticks: {
          callback: function (val, index) {
            return index % 2 === 0 ? this.getLabelForValue(val) : '';
          },
          color: '#000',
          font: {
            size: 16
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'fractal dimension',
          color: '#000',
          font: {
            size: 20,
          }
        },
        ticks: {
          //stepSize: 0.2,
          color: '#000',
          font: {
            size: 16
          }
        }
      }
    }
  },
  single: {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'image',
          color: '#000',
          font: {
            size: 20,
          }
        },
        ticks: {
          color: '#000',
          font: {
            size: 16
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'fractal dimension',
          color: '#000',
          font: {
            size: 20,
          }
        },
        ticks: {
          //stepSize: 0.2,
          color: '#000',
          font: {
            size: 16
          }
        }
      }
    }
  }
}


function lineDatasets({ images, r, i }) {
  return {
    type: 'line',
    label: images[i].name,
    //borderColor: `hsl(${i * 360 / images.length}, 50%, 50%)`,
    borderColor: `hsl(0, 100%, ${i * 100 / images.length}%)`,
    data: r[1],
    pointRadius: 4,
  }
}


function singleDatasets({ result, threshold }) {
  return [{
    type: 'line',
    label: `threshold = ${threshold}`,
    borderColor: `#000000`,
    data: result.map(r => r[1][r[0].indexOf(+threshold)]),
    pointRadius: 4,
  }]
}


function DataAccordion({ result, images }) {
  return (
    <Accordion className="mt-4">
      {
        result.map((r, i) => {
          return (
            <Accordion.Item eventKey={i} key={`acc-${i}`}>
              <Accordion.Header>{images[i].name}</Accordion.Header>
              <Accordion.Body>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>threshold</th>
                      <th>fractal dimension</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      r[0].map((t, j) => {
                        return (
                          <tr key={`tr-${j}`}>
                            <td>{t}</td>
                            <td>{"" + (Math.round(r[1][j] * 100) / 100)}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          )
        })
      }
    </Accordion>
  )
}


function DownloadCSV({ result, images }) {
  const csv = result.map((r, i) => {
    return r[0].map((t, j) => {
      return `${images[i].name} ${i} ${t} ${r[1][j]}`;
    }).join("\n");
  }).join("\n\n") + "\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  return (
    <Button
      className="mt-4"
      href={url}
      download="fractal-dimension.csv"
    >Download CSV</Button>
  )
}


export default function Graph({ result, images }) {
  const [threshold, setThreshold] = useState(128);
  return (
    <div className="mt-4" style={{
      maxWidth: "800px",
    }}>
      {result.length === 0 || result.length !== images.length ? null :
        <>
          <Line data={{
            labels: result[0][0],
            datasets: result.map((r, i) => lineDatasets({ images, r, i }))
          }}
            options={options.general}
          />

          <InputGroup className="mb-3" style={{ maxWidth: "500px" }}>
            <InputGroup.Text>threshold</InputGroup.Text>
            <FormSelect
              defaultValue={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            >
              {
                result[0][0].map((t, i) => {
                  return (
                    <option key={`option-${i}`} value={t}>{t}</option>
                  )
                })
              }
            </FormSelect>
          </InputGroup>

          <Line data={{
            labels: images.map(f => `${f.name}`),
            datasets: singleDatasets({ result, threshold })
          }}
            options={options.single}
          />

          <DownloadCSV result={result} images={images} />
          <DataAccordion result={result} images={images} />
        </>
      }
    </div>
  );
}
