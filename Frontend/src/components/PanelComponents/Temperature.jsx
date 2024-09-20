import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import DragComp from '../../assets/DragComp.png'
import Delete from '../../assets/Delete.png';

const Temperature = ({ cursorChoice }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const cursorStyles = {
        default: 'default',
        Delete: `url(${Delete}), auto`,
        DragComp: `url(${DragComp}), auto`,
    };

      const option = {
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
              color: '#FFAB91'
            },
            progress: {
              show: true,
              width: 30
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 30
              }
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              distance: -20,
              color: '#999',
              fontSize: 20
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 30,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit'
            },
            data: [
              {
                value: 20
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            itemStyle: {
              color: '#FD7347'
            },
            progress: {
              show: true,
              width: 8
            },
            pointer: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            },
            data: [
              {
                value: 20
              }
            ]
          }
        ]
      };

      myChart.setOption(option);

      const intervalId = setInterval(() => {
        const random = +(Math.random() * 60).toFixed(2);
        myChart.setOption({
          series: [
            {
              data: [
                {
                  value: random
                }
              ]
            },
            {
              data: [
                {
                  value: random
                }
              ]
            }
          ]
        });
      }, 2000);

      const canvas = chartRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.cursor = cursorStyles[cursorChoice] || 'default';
      }

      return () => {
        clearInterval(intervalId);
        myChart.dispose();
      };
    }
  }, [cursorChoice]);

  return <div ref={chartRef} className="w-64 h-64" />;
};

export default Temperature;
