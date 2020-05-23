import React, { Component } from 'react'
import "react-bootstrap";
export default class TodoItem extends Component {
    render() {
        return (
            <li className="list-group-item text-capitalize d-flex justify-content-between my-2">
                <div className="col">
                    <h7>Assigned by: </h7>
                    <h7>Assigned on: </h7>
                    <h7>Deadline: </h7>
                    <h7>Content: </h7>
                </div>

                <button className="btn-link btn">Delete</button>

            </li>
        )
    }
}
