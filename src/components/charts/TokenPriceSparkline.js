'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function TokenPriceSparkline({ prices = [], color = '#FFC21A' }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !prices || prices.length === 0) return;

        // Initialize chart
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const priceValues = prices.map(p => p.price);
        const isPositive = prices.length >= 2 && prices[prices.length - 1].price >= prices[0].price;
        const lineColor = isPositive ? '#6EDC5F' : '#FF3A3A';

        const option = {
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
            xAxis: {
                type: 'category',
                show: false,
                data: prices.map((_, i) => i),
            },
            yAxis: {
                type: 'value',
                show: false,
            },
            series: [
                {
                    data: priceValues,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    lineStyle: {
                        color: lineColor,
                        width: 2,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: lineColor + '40' },
                            { offset: 1, color: lineColor + '00' },
                        ]),
                    },
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
    }, [prices, color]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    if (!prices || prices.length === 0) {
        return null;
    }

    return <div ref={chartRef} className="w-full h-12" />;
}
