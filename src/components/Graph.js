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
import Table from 'react-bootstrap/Table';

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
}

export default function Graph({ result, images }) {
  console.log([result, images])
  return (
    <div className="mt-4" style={{
      maxWidth: "800px",
    }}>
      {result.length === 0 || result.length !== images.length ? null :
        <>
          <Line data={{
            labels: result[0][0],
            datasets: result.map((r, i) => {
              return {
                type: 'line',
                label: images[i].name,
                //borderColor: `hsl(${i * 360 / images.length}, 50%, 50%)`,
                borderColor: `hsl(0, 100%, ${i * 100 / images.length}%)`,
                data: r[1],
                pointRadius: 4,
              }
            })
          }}
            options={options}
          />
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
        </>
      }
    </div>
  );
}
