import React, { Component } from "react";
import Header from "../components/Header";
import { db, auth } from "../services/firebase";
import "../taskman.css";
import moment from 'moment'
// import TodoItem from "../components/TodoItem";
class TaskMan extends Component {
    constructor() {
        super();
        this.state = {
            note: '',
            dateass: '',
            datecomp: '',
            assby: '',
            assto: '',
            notes: [],
            loadingChan: true,
            isAdmin: false,

        }

        this.createNote = this.createNote.bind(this);



    }
    onChangeHandler(evt, key) {
        this.setState({
            [key]: evt.target.value
        });
    }






    async createNote() {
        if (this.state.note !== '') {
            // var x = await this.formatTime();
            console.log("CreateNote");
            var time = moment(Date.now()).format("YYYY-MM-DD");
            // const d = Date.now().toString();
            // this.setState({ dateass: d.toString() });
            console.log(this.state.note + this.state.datecomp);
            db.ref('tasks').push({

                note: this.state.note,
                assby: auth().currentUser.displayName,
                deadline: this.state.datecomp,
                creDate: time.toString(),
                assto:this.state.assto
            });
            console.log("Note created");
        }
    }



    componentDidMount() {
        this.checkadmin();
        // var moment = require('moment'); // require
        // moment().format(); 

    }
    async checkadmin() {

        const userC = db.ref().child('admin/aid/')
        var y = false;
        await userC.transaction(function (current_value) {
            console.log("Check admin " + current_value);
            var x = current_value || "";
            if (x.includes(auth().currentUser.uid))
                y = true;
            return current_value;
        });
        if (y) {
            this.setState({ isAdmin: y });

            console.log("admin");
            // this.createNotes();
            this.readNotes();
            // this.channellistget();
        }
        else {

            this.setState({ isAdmin: y });
            console.log("Not admin");
            // this.createNotes();
            this.readNotes();
            // this.channellistget();
        }


    }
    async readNotes() {
        db.ref('tasks').on('value', (snapshot) => {
            let notes = snapshot.val();
            let newState = [];
            for (let note in notes) {
                newState.push({
                    id: note,
                    note: notes[note].note,
                    assby: notes[note].assby,
                    deadline: notes[note].deadline,
                    creDate: notes[note].creDate,
                    assto:notes[note].assto,
                    status:0
                });
            }
            this.setState({
                notes: newState
            });
            console.log("notes: " + notes.note);
        });

    }
    
    render() {
        return (
            <div className="App">
                <Header />
                <br></br>
                <br></br>
                <br></br>

                <br></br>
                {this.state.isAdmin ? <div> <h3 className="text-capitalize text-center">Task Manager</h3>
                    <div className="card card-body my-3">
                        <form>
                            <input className="form-control form-control-lg" type="text" onChange={(evt) => this.onChangeHandler(evt, 'note')} value={this.state.note} placeholder="Task..." />
                            <input className="form-control form-control-lg mt-2" type="text" onChange={(evt) => this.onChangeHandler(evt, 'assto')} value={this.state.assto} placeholder="Assign to.." />
                            <input type="date" placeholder="Deadline" onChange={(evt) => this.onChangeHandler(evt, 'datecomp')} value={this.state.datecomp} />


                            <button type="submit" onClick={this.createNote} className="btn btn-block btn-primary mt-3">
                                Add task
                        </button>

                        </form>
                    </div></div> : null}
                <br></br>

                <div className="sticky-top">

                    <h3 className="text-capitalize text-center">Tasks Assigned</h3>

                </div>
                    {this.state.notes.map((note)=>{
                        return(
                        <div className = "card card-body my- overflow-scroll" >
                                <ul className="list-group my-1">
                                    <li className="list-group-item text-capitalize d-flex justify-content-between my-4">
                                        <div className="col">
                                            <p>
                                                Content: {note.note}<br></br>
                                Assigned by: {note.assby}<br></br>
                                Assigned on: {note.creDate}<br></br>
                                Deadline:   {note.deadline}<br></br>
                                Assigned for: {note.assto}<br></br>
                                            </p>
                                        </div>

                                        <button id={note.id} onClick={this.state.isAdmin?this.adminrem:this.memcomp} className="btn-link btn">Delete</button>

                                    </li>
                                </ul>
                        </div>
                        )
                    })}
    
            </div >
        );
    }
}

export default TaskMan;