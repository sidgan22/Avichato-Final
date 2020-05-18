import React, { Component } from "react";
import Header from "../components/Header";
import { db, auth } from "../services/firebase";


import Notes from './Notes';
import '../notes.css';

class Task extends Component {
    constructor() {
        super();

        this.state = {
            notes: []
        }
    }

    componentDidMount() {

        this.listenForChange();
    }
    // sortData(){
    //     db.ref('users/'+auth().currentUser.uid+"/notes").orderByChild("priority").on('value', snapshot => {
    //         let note = {
    //             id: snapshot.key,
    //             title: snapshot.val().title,
    //             note: snapshot.val().note
    //         }
    
    //         let notes = this.state.notes;
    //         notes.push(note);
    
    //         this.setState({
    //             notes: notes
    //         });
    //     });
    //   }
    listenForChange() {
        db.ref('users/'+auth().currentUser.uid+"/notes").orderByValue().on('child_added', snapshot => {
            let note = {
                id: snapshot.key,
                title: snapshot.val().title,
                note: snapshot.val().note,
                priority: snapshot.val().priority
            }

            let notes = this.state.notes;
            notes.push(note);

            this.setState({
                notes: notes
            });
        });

        db.ref('notes').on('child_removed', snapshot => {
            let notes = this.state.notes;
            notes = notes.filter(note => note.id !== snapshot.key);

            this.setState({
                notes: notes
            });
        });
    }

    render() {
        return (
            <div className="App">
                <Header />

                <div className="sticky">
                    
                    </div>
                    <br></br>
                <main>
                    <Notes notes={this.state.notes} />
                </main>
            </div>
        );
    }
}

export default Task;