import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import * as XLSX from "xlsx";
import { parseCookies } from "nookies";

const ExcelDownloadButton = ({ startdate, enddate, fileName }) => {
    const TIME_LOG_API = import.meta.env.VITE_BASE_URL_STAFF;
    const { token } = parseCookies();
    const id = fileName?.value;
    const fileNameRef = useRef(fileName);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.post(
                `${TIME_LOG_API}get-time-log/${id}`,
                {
                    start_date: startdate || "",
                    end_date: enddate || "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const fetched = response.data.data || [];
            setData(fetched);
            return fetched;
        } catch (error) {
            console.error("Error fetching specific log:", error);
            return [];
        }
    };

    const fetchAllData = async () => {
        try {
            const response = await axios.post(
                `${TIME_LOG_API}get-all-time-log`,
                {
                    start_date: startdate || "",
                    end_date: enddate || "",
                    response: "Download",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const fetched = response.data.logs || [];
            setData(fetched);
            return fetched;
        } catch (error) {
            console.error("Error fetching all logs:", error);
            return [];
        }
    };

    useEffect(() => {
        if (fileName && fileName !== fileNameRef.current) {
            fetchData();
            fileNameRef.current = fileName;
        } else if (!fileName) {
            fetchAllData();
        }
    }, [fileName, startdate, enddate]);
    const handleDownload = async () => {
        let fetchedData = data;
        if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
            fetchedData = fileName ? await fetchData() : await fetchAllData();
        }
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
            const formattedData = fetchedData.map(item => ({
                "Staff Name": item.staff_name,
                Date: item.date,
                "Check In": item.check_in,
                "Check Out": item.check_out,
                "Punches": item.formatted_punches,
                "Total Hours": item.total_hours,
                "Break Hours": item.break_hours,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, `${fileName?.label || "TimeLogStaff"}.xlsx`);
        } else {
            console.warn("No data found to export!");
        }
    };
    return (
        <Button variant="outline-secondary" size="sm" onClick={handleDownload}>
            <FontAwesomeIcon icon={faFileExport} className="me-1" />
            Export Logs
        </Button>
    );
};

export default ExcelDownloadButton;