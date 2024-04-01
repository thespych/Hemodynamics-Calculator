import React, { useEffect, useState } from "react";
import DeleteModal from "./deleteModal";


const ArchiveRecord = (props) => (
    <tr>
        {console.log(props.record)}
        <td>{props.record.initials}</td>
        <td>{props.record.dob}</td>
        <td>{props.record.sex}</td>
        <td>
            <button className="btn btn-link"
                onClick={() => {
                    props.restoreRecord(props.record);
                    // //CHANGE LATER, because deleteRecord is async, must reload the page after a record is deleted, currently waits 500 ms and then reloads the page
                    sleep(500).then(() => { window.location.reload(); });
                }}
            >
                Restore
            </button> |
            <DeleteModal
                id={props.record._id} />
        </td>
    </tr>
);


function Archive() {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/record/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            setRecords(records);
        }
        getRecords();
        return;
    }, [records.length]);



    /**
        * Maps out the records into a list of Record components.
        * @returns {JSX.Element[]} An array of JSX elements representing the records.
        */
    function getArchivedRecords() {
        const archived = records.filter((record) => record.archived === true);
        return archived.map((record) => {
            return (
                <ArchiveRecord
                    record={record}
                    restoreRecord={restoreRecord}
                />
            );
        });
    }

    function restoreRecord(record) {
        const restoredPerson = {
            ...record,
            archived: false
        };

        fetch(`http://localhost:5000/update/${record._id}`, {
            method: "POST",
            body: JSON.stringify(restoredPerson),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }



    return (
        <div>
            <h3>Archived Patients</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>Initials</th>
                        <th>Date of Birth</th>
                        <th>Sex</th>
                    </tr>
                </thead>
                <tbody>{getArchivedRecords()}</tbody>
            </table>
            <div className="modal fade" id="">

            </div>
        </div>
    )
}

/**
   * Waits an amount of time
   * @param {int} ms - Time in milliseconds
   * @returns
   */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default Archive