import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";

const sampleData = [
    { name: "T1", revenue: 120 },
    { name: "T2", revenue: 200 },
    { name: "T3", revenue: 150 },
    { name: "T4", revenue: 300 },
    { name: "T5", revenue: 400 },
    { name: "T6", revenue: 250 }
];

const RevenueChartDemo = () => {
    return (
        <div className="container mt-4">
            <h5 className="text-primary fw-bold mb-3">Demo Biểu đồ Doanh thu</h5>

            <div className="bg-white shadow-sm p-3 rounded mb-4">
                <h6 className="fw-semibold text-secondary">Biểu đồ cột</h6>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="revenue" fill="#007bff"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-sm p-3 rounded mb-4">
                <h6 className="fw-semibold text-secondary">Biểu đồ đường</h6>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sampleData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="revenue" stroke="#dc3545" strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChartDemo;
