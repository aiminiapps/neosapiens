'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { chartTheme } from '@/styles/charts';

export default function IntentTrendChart({ history = [] }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Initialize chart
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current, chartTheme);
        }

        // Prepare data
        const timestamps = history.map(h => {
            const date = new Date(h.timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        const averageScores = history.map(h => h.average);
        const highestScores = history.map(h => h.highest);
        const lowestScores = history.map(h => h.lowest);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#141414',
                borderColor: '#2A2A2A',
                textStyle: { color: '#F2F2F2' },
            },
            legend: {
                data: ['Average', 'Highest', 'Lowest'],
                textStyle: { color: '#A1A1A1' },
                bottom: 0,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '10%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: timestamps,
                axisLine: { lineStyle: { color: '#2A2A2A' } },
                axisLabel: { color: '#A1A1A1', rotate: 45 },
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 10,
                axisLine: { show: false },
                axisLabel: { color: '#A1A1A1' },
                splitLine: { lineStyle: { color: '#1F1F1F' } },
            },
            series: [
                {
                    name: 'Average',
                    type: 'line',
                    data: averageScores,
                    smooth: true,
                    lineStyle: { color: '#FFC21A', width: 3 },
                    itemStyle: { color: '#FFC21A' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 194, 26, 0.3)' },
                            { offset: 1, color: 'rgba(255, 194, 26, 0.05)' },
                        ]),
                    },
                },
                {
                    name: 'Highest',
                    type: 'line',
                    data: highestScores,
                    smooth: true,
                    lineStyle: { color: '#FF3A3A', width: 2, type: 'dashed' },
                    itemStyle: { color: '#FF3A3A' },
                    symbol: 'none',
                },
                {
                    name: 'Lowest',
                    type: 'line',
                    data: lowestScores,
                    smooth: true,
                    lineStyle: { color: '#6EDC5F', width: 2, type: 'dashed' },
                    itemStyle: { color: '#6EDC5F' },
                    symbol: 'none',
                },
            ],
        };

        chartInstance.current.setOption(option);

        // Resize handler
        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [history]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    if (history.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                No historical data available yet
            </div>
        );
    }

    return <div ref={chartRef} className="w-full h-64" />;
}
