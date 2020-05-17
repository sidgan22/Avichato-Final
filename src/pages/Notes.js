import React, { Component } from 'react';
import { db, auth } from "../services/firebase";



export class Notes extends Component {
  constructor() {
    super();

    this.state = {
        notes: []
    }
}
 

  removeNote (id) {
    var userid = auth().currentUser.uid;
    db.ref('users/'+userid+'/notes').child(id).remove();
    window.location.reload();
  }

  render() {
    return (
      <section >
        <h3>Notes</h3>
        {/* <div className="notes wrapper"> */}
          
        {/* </div> */}
      <ul>{this.props.notes.map(note => (
            <div  key={note.id}>
              <div className="notee">
                <div><h4>{note.title}: {note.note}  Priority: {note.priority}  
                <button className="remove" onClick={() => this.removeNote(note.id)}>x</button></h4></div>
                
              </div>
              <br></br>
              
            </div>
          ))}
      </ul>
      
     </section>
    )
  }
}

export default Notes;