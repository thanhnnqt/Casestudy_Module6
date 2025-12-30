import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RevenueChart.css";



const RevenueBarEnhanced = ({data}) => {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart
                data={data}
                margin={{top: 20, right: 10, left: 10, bottom: 5}}
            >
                {/* Gradient */}
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#005eff" stopOpacity={0.95}/>
                        <stop offset="100%" stopColor="#7ab3ff" stopOpacity={0.8}/>
                    </linearGradient>
                </defs>

                {/* Background Guideline */}
                <CartesianGrid strokeDasharray="4 4" opacity={0.2}/>

                {/* Axis */}
                <XAxis dataKey="month" fontSize={12} fontWeight={600}/>
                <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} fontSize={12}/>

                {/* Tooltip với format VND */}
                <Tooltip
                    wrapperStyle={{outline: "none"}}
                    contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        fontSize: 12
                    }}
                    labelStyle={{
                        color: "#0040ff",
                        fontWeight: 600,
                        marginBottom: 4
                    }}
                    formatter={(v) => v.toLocaleString() + " ₫"}
                />


                {/* Bars */}
                <Bar
                    dataKey="revenue"
                    fill="url(#revenueGradient)"
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default RevenueBarEnhanced;
