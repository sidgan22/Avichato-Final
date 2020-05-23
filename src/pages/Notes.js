import React, { Component } from 'react';
import { db, auth } from "../services/firebase";
import '../notes.css';


export class Notes extends Component {
  constructor() {
    super();
    this.state = {
        title: '',
        note: '',
        priority:"1",
        notes:[]

    }

    this.createNote = this.createNote.bind(this);

}

onChangeHandler(evt, key) {
    this.setState({
        [key]: evt.target.value
    });
}





createNote() {
    if (this.state.title !== '' && this.state.note !== '') {
        var userid = auth().currentUser.uid;

        db.ref('users/' + userid + '/notes').push({
            title: this.state.title,
            note: this.state.note,
            priority: this.state.priority.toString()
        });
    }
}


  removeNote (id) {
    var userid = auth().currentUser.uid;
    db.ref('users/'+userid+'/notes').child(id).remove();
    window.location.reload();
  }

  render() {
    return (
      <div>
        <div id="myDIV" className="header">
  <h2 >My To Do List</h2>
  <form>
  <input type="text" id="title" placeholder="Title." onChange={(evt) => this.onChangeHandler(evt, 'title')}/>

  <input type="text" id="content" placeholder="Note..." onChange={(evt) => this.onChangeHandler(evt, 'note')} />

  <input type="text" id="priority" placeholder="Priority..." onChange={(evt) => this.onChangeHandler(evt, 'priority')} />

  </form>
    </div>
    <center><button type="button" class="btn btn-warning" onClick={this.createNote} className="addBtn" >Add</button></center>
    <br></br>
    <h2>Notes Created:</h2>
    <br></br>
    <ul id="myUL">{this.props.notes.map(note => (
    <li  key={note.id}><h3>{note.title}: {note.note}  Priority: {note.priority} <span className="removenotes" onClick={()=>this.removeNote(note.id)}> X</span></h3></li>))}
    </ul>

      </div>

    )
  }
}

export default Notes;
 /* <h3>Notes</h3> */
        /* <div className="notes wrapper"> */

        /* </div> */
      /* <ul>{this.props.notes.map(note => ( */
            /* <div  key={note.id}> */
              /* <div className="notee">
                <div><h4>{note.title}: {note.note}  Priority: {note.priority}
                <button className="remove" onClick={() => this.removeNote(note.id)}>x</button></h4></div>

              </div>
              <br></br>

            </div>
          ))}
      </ul> */
