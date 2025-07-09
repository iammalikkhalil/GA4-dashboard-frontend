import React, { useState, useEffect, useCallback } from 'react';
import './AnalyticsForm.css';
import AnalyticsTable from './AnalyticsTable';
import AnalyticsChart from './AnalyticsChart';
import config from './config';

function AnalyticsForm() {
    const [formData, setFormData] = useState({
        startDate: '2025-06-01',
        endDate: '2025-07-01',
        string1: 'App_Lang_Screen',
        string2: 'ASE_N_Imp_AppLanguage_scr',
        range: '1.6.1',
    });

    const [appVersions, setAppVersions] = useState([]);
    const [versionsLoading, setVersionsLoading] = useState(true);
    const [responseData, setResponseData] = useState(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [chartData, setChartData] = useState(null);


    // Fetch App Versions
    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const response = await fetch(`${config.baseUrl}/analytics/appversions`);
                const data = await response.json();
                setAppVersions(data);
            } catch (error) {
                console.error('Error fetching versions:', error);
            } finally {
                setVersionsLoading(false);
            }
        };

        fetchVersions();
    }, []);

    const fetchAnalyticsData = useCallback(async () => {
        const { string1, string2, startDate, endDate, range } = formData;

        if (!string1 || !string2 || !startDate || !endDate || !range) {
            alert("Please fill in all fields");
            return;
        }

        const url = `${config.baseUrl}/analytics/${string1}/${string2}/${startDate}/${endDate}/${range}`;

        try {
            setDataLoading(true);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data = await res.json();
            setResponseData(data);
            console.log("API response:", data);

            const refined = refineAnalyticsData(data);
            setChartData(refined);

        } catch (err) {
            console.error("Request failed:", err);
            setResponseData({ error: 'Request failed' });
        } finally {
            setDataLoading(false);
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchAnalyticsData();
    };

    // Fetch Analytics Data on Initial Load
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchAnalyticsData();
        };
        fetchInitialData();
    }, [fetchAnalyticsData]);



    const refineAnalyticsData = (data) => {
        if (!data?.rows || data.rows.length < 2) return null;

        const rows = data.rows.map((row) => ({
            eventName: row.dimensionValues[0].value,
            eventCount: parseInt(row.metricValues[0].value, 10),
            totalUsers: parseInt(row.metricValues[1].value, 10),
        }));

        const event1 = rows.find(r => r.eventName === 'App_Lang_Screen');
        const event2 = rows.find(r => r.eventName === 'ASE_N_Imp_AppLanguage_scr');

        if (!event1 || !event2) return null;

        return {
            eventCountPercent: ((event2.eventCount / event1.eventCount) * 100).toFixed(2),
            totalUsersPercent: ((event2.totalUsers / event1.totalUsers) * 100).toFixed(2),
        };
    };



    return (
        <div className="form-container">
            <h2>Analytics Filter</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Event Name 1:</label>
                    <input
                        type="text"
                        name="string1"
                        placeholder="e.g. App_Lang_Screen"
                        value={formData.string1}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Event Name 2:</label>
                    <input
                        type="text"
                        name="string2"
                        placeholder="e.g. ASE_N_Imp_AppLanguage_scr"
                        value={formData.string2}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>App Version (Range):</label>
                    {versionsLoading ? (
                        <p>Loading versions...</p>
                    ) : (
                        <select name="range" value={formData.range} onChange={handleChange}>
                            <option value="">Select Version</option>
                            {appVersions.map((version, idx) => (
                                <option key={idx} value={version}>
                                    {version}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <button type="submit" disabled={dataLoading}>
                    {dataLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>

            {dataLoading && <p>Loading analytics data...</p>}

            {!dataLoading && responseData && (
                <div className="response-box">
                    <h3>Response:</h3>
                    <AnalyticsTable data={responseData} />
                </div>
            )}
            {!dataLoading && responseData && (
                <div className="response-box">
                    <AnalyticsChart data={chartData} />
                </div>
            )}

        </div>
    );
}

export default AnalyticsForm;