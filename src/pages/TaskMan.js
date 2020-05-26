import React, { Component } from "react";
import Header from "../components/Header";
import { db, auth } from "../services/firebase";
import "../taskman.css";
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
            listoft: [],
            listofc: [],
            listtask: [],
            isAdmin: false,
            loadingNotes: true,
            formattedTasks: []

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
            console.log("Craet");
            db.ref('channels/' + this.state.assto + '/tasks').push({
                note: this.state.note,
                assby: auth().currentUser.displayName,
                deadline: this.state.datecomp,
                creDate: this.state.dateass
            });
        }
    }


    removeNote(id) {
        var userid = auth().currentUser.uid;
        db.ref('users/' + userid + '/notes').child(id).remove();
        window.location.reload();
    }



    componentDidMount() {
        this.checkadmin();

        const d = Date.now().toString();
        this.setState({ dateass: d.toString() });

    }
    checkadmin() {

        const userC = db.ref().child('admin/aid/')
        var y = false;
        userC.transaction(function (current_value) {
            console.log("Check admin " + current_value);
            var x = current_value || "";
            if (x.includes(auth().currentUser.uid))
                y = true;
            return current_value;
        });
        if (y) {
            this.setState({ isAdmin: true });

            console.log("admin");
            this.createNotes();
        }
        else {

            console.log("Not admin");
            this.createNotes();
        }


    }

    async createNotes() {

        var uidadmin = auth().currentUser.uid;
        var str = "";
        this.setState({ loadingNotes: true });
        try {
            db.ref('users/' + uidadmin + "/cid").on("value", snapshot => {
                str += snapshot.val();
                console.log("Str is : " + str);
                this.state.listofc.splice(0, this.state.listofc.length);
                this.state.listofc.push(str.split(" "));
                // listofcs=str;
                console.log(this.state.listofc);
            });
            // this.setState({ listofc });

        }
        catch (error) {
            console.log(error);
        }
        try {

            db.ref('channels').on("value", snapshot => {

                let listtaskss = [];

                let x = "";
                snapshot.forEach((snap) => {


                    x = snap.key;
                    console.log("Chn List " + this.state.listofc);
                    var listdummy = this.state.listofc;
                    console.log("Key is" + x);
                    console.log("Dummy " + listdummy);
                    if (listdummy.length !== 0) {
                        if (listdummy[0].indexOf(x) !== -1) {

                            console.log("Includes");
                            listtaskss.push(snap.val());


                            console.log(listtaskss);
                        }
                    }

                    // console.log(snap.val());
                });

                this.state.listtask = listtaskss;

                console.log(this.state.listtask);
                var aa = this.state.listtask;
                var xx = aa[0]['tasks'];
                console.log(xx);

                const tasks = Object.values(xx);

                tasks.forEach(task =>
                    Object.entries(task).forEach(([key, value]) =>
                        this.state.formattedTasks.push(value),
                    )
                );
                console.log(this.state.formattedTasks[2]);
                var assby = this.state.formattedTasks[0];

                this.setState({ assby });
                var dateass = Date(this.state.formattedTasks[1]).toString().substring(0,17);
                this.setState({dateass});

                var datecomp = this.state.formattedTasks[2].toString();

                this.setState({ datecomp });
                var note = this.state.formattedTasks[3];
                this.setState({ note });
                console.log("Ass by: " + this.state.assby);
                console.log("Deadline: " + this.state.datecomp);
                console.log("Date ass: " + this.state.dateass);
                console.log("Note: " + this.state.note);

            });

            this.setState({ loadingNotes: false });
            this.renderChatss();

        } catch (error) {
            this.setState({ loadingNotes: false });
        }
        this.renderChatss();

    }

    async renderChatss() {
        console.log("Render CHats ");
        for (var i = 0; i < this.state.listtask.length; i++) {
            var cchannelid = this.state.listtask[i];//this.state.assto == null ? "1" : this.state.assto.toString();
            try {
                console.log(cchannelid);
                this.setState({ loadingNotes: true });

                db.ref("channels/" + cchannelid + "/tasks").on("value", snapshot => {
                    let listoft = [];

                    snapshot.forEach((snap) => {
                        listoft.push(snap.val());
                    });
                    listoft.sort(function (a, b) { return a.timestamp - b.timestamp })
                    this.setState({ listoft });
                    this.setState({ loadingNotes: false });
                });
                console.log("Rebderd");
            }
            catch (error) {


                console.log("list" + this.state.listoft);
            }

        }

    }


    render() {
        return (
            <div className="App">
                <Header />
                <br></br>
                <br></br>
                <br></br>

                <br></br>
                {!this.state.isAdmin ? <div> <h3 className="text-capitalize text-center">Task Manager</h3>
                    <div className="card card-body my-3">
                        <form>
                            <input className="form-control form-control-lg" id="" type="text" onChange={(evt) => this.onChangeHandler(evt, 'note')} value={this.state.note} placeholder="Task..." />
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
                <div className="card card-body my- overflow-scroll">
                    <ul className="list-group my-5">
                        <li className="list-group-item text-capitalize d-flex justify-content-between my-4">
                            <div className="col">
                                <p>
                                    Content: {this.state.note}<br></br>
                                Assigned by: {this.state.assby}<br></br>
                                Assigned on: {this.state.dateass}<br></br>
                                Deadline:   {this.state.datecomp}<br></br>
                                </p>
                            </div>

                            <button className="btn-link btn">Delete</button>

                        </li>
                    </ul>
                </div>
                {/*                 
                <main>
                </main> */}
            </div>
        );
    }
}

export default TaskMan;