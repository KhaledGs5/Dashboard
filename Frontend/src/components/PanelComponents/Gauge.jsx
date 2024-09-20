import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import DragComp from '../../assets/DragComp.png'
import Delete from '../../assets/Delete.png';


const Gauge = ({ cursorChoice , value}) => {
  const chartRef = useRef(null);

  const cursorStyles = {
    default: 'default',
    Delete: `url(${Delete}), auto`,
    DragComp: `url(${DragComp}), auto`,
};

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: 'Pressure',
            type: 'gauge',
            detail: {
              formatter: '{value}'
            },
            data: [
              {
                value: value,
                name: 'SCORE'
              }
            ]
          }
        ]
      };

      myChart.setOption(option);
      const canvas = chartRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.cursor = cursorStyles[cursorChoice] || 'default';
      }

      return () => {
        myChart.dispose();
      };
    }
  }, [cursorChoice,value]);

  return (
    <div ref={chartRef} className="w-64 h-64"></div>
  );
};

export default Gauge;
